/**
 * Endpoint de captura do checklist CNJ.
 * Comentários em PT-BR por diretriz do projeto.
 */
var CONFIG = {
  spreadsheetId: "PUT_YOUR_SPREADSHEET_ID_HERE",
  submissionsSheet: "checklist_submissions",
  auditSheet: "checklist_audit",
  commercialPipelineSheet: "commercial_pipeline",
  ga4MeasurementId: "G-XXXXXXXXXX",
  ga4ApiSecret: "PUT_YOUR_GA4_API_SECRET_HERE",
  allowedOrigins: [
    "https://niltondev.github.io",
    "https://cybershieldgroup.com.br",
    "https://www.cybershieldgroup.com.br"
  ]
};

var COMMERCIAL_STATUS_TO_GA4 = {
  em_atendimento: "working_lead",
  qualificado: "qualify_lead",
  desqualificado: "disqualify_lead",
  ganho: "close_convert_lead",
  perdido: "close_unconvert_lead"
};

function doPost(e) {
  var origin = getOrigin_(e);
  var nowIso = new Date().toISOString();

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return writeAuditAndRespond_(origin, nowIso, "missing_body", null, 400, {
        message: "Corpo da requisição ausente."
      });
    }

    var payload = JSON.parse(e.postData.contents);
    var validation = validatePayload_(payload);
    if (!validation.ok) {
      return writeAuditAndRespond_(origin, nowIso, "validation_error", payload, 422, {
        message: "Payload inválido.",
        details: validation.errors
      });
    }

    var upsertInfo = upsertSubmission_(payload, nowIso, origin);
    if (payload.status === "started") {
      upsertCommercialPipelineFromChecklist_(payload, nowIso, origin);
    }

    return jsonResponse_(
      origin,
      upsertInfo.created ? 201 : 200,
      {
        ok: true,
        action: upsertInfo.created ? "created" : "updated",
        status: payload.status,
        message: upsertInfo.created ? "Registro criado com sucesso." : "Registro atualizado com sucesso."
      }
    );
  } catch (error) {
    return writeAuditAndRespond_(origin, nowIso, "server_error", safeParse_(e), 500, {
      message: "Falha inesperada ao processar envio.",
      error: String(error && error.message ? error.message : error)
    });
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: "checklist-cnj-capture" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function upsertSubmission_(payload, receivedAt, origin) {
  var sheet = getOrCreateSheet_(CONFIG.submissionsSheet, submissionHeaders_());
  var existingRow = findRowBySubmissionKey_(sheet, payload.submissionKey);
  var existing = existingRow ? sheet.getRange(existingRow, 1, 1, submissionHeaders_().length).getValues()[0] : null;
  var status = normalizeStatus_(payload.status);
  var startedAt = firstNonEmpty_(
    existing && existing[7],
    payload.metadata && payload.metadata.startedAt,
    payload.metadata && payload.metadata.timestamp,
    receivedAt
  );
  var lastActivityAt = firstNonEmpty_(
    payload.metadata && payload.metadata.timestamp,
    receivedAt
  );
  var completedAt = status === "completed"
    ? lastActivityAt
    : firstNonEmpty_(existing && existing[9], "");

  var row = [
    receivedAt,
    origin,
    payload.submissionKey,
    payload.lead.name,
    payload.lead.email,
    payload.lead.whatsapp,
    payload.lead.consentGivenAt,
    startedAt,
    lastActivityAt,
    completedAt,
    status,
    safeNumber_(payload.stats && payload.stats.sim),
    safeNumber_(payload.stats && payload.stats.nao),
    safeNumber_(payload.stats && payload.stats.naoSei),
    safeNumber_(payload.stats && payload.stats.answered),
    safeNumber_(payload.xp),
    safeNumber_(payload.conformity),
    payload.metadata && payload.metadata.pageUrl ? payload.metadata.pageUrl : "",
    payload.metadata && payload.metadata.userAgent ? payload.metadata.userAgent : "",
    JSON.stringify(payload.answers || {})
  ];

  if (existingRow) {
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
    return { created: false, row: existingRow };
  }

  sheet.appendRow(row);
  return { created: true, row: sheet.getLastRow() };
}

function findRowBySubmissionKey_(sheet, submissionKey) {
  if (!submissionKey) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  var keys = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
  for (var i = 0; i < keys.length; i++) {
    if (String(keys[i][0] || "") === String(submissionKey)) {
      return i + 2;
    }
  }
  return 0;
}

function validatePayload_(payload) {
  var errors = [];
  if (!payload || typeof payload !== "object") {
    return { ok: false, errors: ["Payload deve ser um objeto JSON."] };
  }

  if (!payload.submissionKey || String(payload.submissionKey).length < 10) {
    errors.push("submissionKey inválido.");
  }
  var status = normalizeStatus_(payload.status);
  if (!status) {
    errors.push("status inválido. Use: started, in_progress ou completed.");
  }

  if (!payload.lead || typeof payload.lead !== "object") {
    errors.push("Objeto lead é obrigatório.");
  } else {
    if (!payload.lead.name || String(payload.lead.name).trim().length < 2) {
      errors.push("Nome inválido.");
    }
    if (!/.+@.+\..+/.test(String(payload.lead.email || ""))) {
      errors.push("E-mail inválido.");
    }
    var whatsapp = String(payload.lead.whatsapp || "").replace(/\D/g, "");
    if (whatsapp.length < 10 || whatsapp.length > 11) {
      errors.push("WhatsApp inválido.");
    }
    if (!payload.lead.consentGivenAt) {
      errors.push("consentGivenAt é obrigatório.");
    }
  }

  if (payload.answers && typeof payload.answers !== "object") {
    errors.push("answers deve ser um objeto.");
  }
  if (payload.stats && typeof payload.stats !== "object") {
    errors.push("stats deve ser um objeto.");
  }
  if (!payload.metadata || typeof payload.metadata !== "object") {
    errors.push("metadata deve ser um objeto.");
  } else if (!payload.metadata.pageUrl || !payload.metadata.timestamp) {
    errors.push("metadata.pageUrl é obrigatório.");
  }
  if (status === "completed") {
    if (!payload.stats || typeof payload.stats.answered !== "number") {
      errors.push("stats.answered é obrigatório em status completed.");
    }
    if (typeof payload.xp !== "number") {
      errors.push("xp deve ser numérico em status completed.");
    }
    if (typeof payload.conformity !== "number") {
      errors.push("conformity deve ser numérico em status completed.");
    }
    if (!payload.answers || typeof payload.answers !== "object") {
      errors.push("answers é obrigatório em status completed.");
    }
  }

  return { ok: errors.length === 0, errors: errors };
}

function getOrCreateSheet_(sheetName, headers) {
  var spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function submissionHeaders_() {
  return [
    "updated_at",
    "origin",
    "submission_key",
    "lead_name",
    "lead_email",
    "lead_whatsapp",
    "consent_given_at",
    "started_at",
    "last_activity_at",
    "completed_at",
    "status",
    "stats_sim",
    "stats_nao",
    "stats_nao_sei",
    "stats_answered",
    "xp",
    "conformity",
    "page_url",
    "user_agent",
    "answers_json"
  ];
}

function auditHeaders_() {
  return [
    "received_at",
    "origin",
    "event_type",
    "http_status",
    "details_json",
    "payload_json"
  ];
}

function writeAuditAndRespond_(origin, nowIso, eventType, payload, httpStatus, responseBody) {
  var sheet = getOrCreateSheet_(CONFIG.auditSheet, auditHeaders_());
  sheet.appendRow([
    nowIso,
    origin,
    eventType,
    httpStatus,
    JSON.stringify(responseBody || {}),
    JSON.stringify(payload || {})
  ]);
  return jsonResponse_(origin, httpStatus, responseBody);
}

function jsonResponse_(origin, httpStatus, body) {
  var output = ContentService.createTextOutput(JSON.stringify(body || {}));
  output.setMimeType(ContentService.MimeType.JSON);

  // Apps Script Web App não permite setar status HTTP customizado via ContentService.
  // Incluímos o status no corpo para rastreabilidade no cliente.
  var payload = JSON.parse(output.getContent());
  payload.status = httpStatus;
  output.setContent(JSON.stringify(payload));
  return output;
}

function getOrigin_(e) {
  var postData = safeParse_(e);
  var originFromPayload = postData && postData.metadata && postData.metadata.pageUrl
    ? extractOrigin_(postData.metadata.pageUrl)
    : "";
  if (!originFromPayload) return "unknown";
  if (CONFIG.allowedOrigins.indexOf(originFromPayload) === -1) return "untrusted:" + originFromPayload;
  return originFromPayload;
}

function normalizeStatus_(status) {
  var value = String(status || "").toLowerCase();
  if (value === "started" || value === "in_progress" || value === "completed") return value;
  return "";
}

function safeNumber_(value) {
  return typeof value === "number" && !isNaN(value) ? value : 0;
}

function firstNonEmpty_() {
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i] !== null && arguments[i] !== undefined && String(arguments[i]) !== "") {
      return arguments[i];
    }
  }
  return "";
}

function extractOrigin_(url) {
  try {
    var match = String(url || "").match(/^(https?:\/\/[^\/?#]+)/i);
    return match && match[1] ? match[1].toLowerCase() : "";
  } catch (error) {
    return "";
  }
}

function safeParse_(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return null;
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return null;
  }
}

function commercialPipelineHeaders_() {
  return [
    "lead_id",
    "created_at",
    "updated_at",
    "lead_source",
    "lead_channel",
    "service_name",
    "ga_client_id",
    "submission_key",
    "commercial_status",
    "qualification_type",
    "disqualification_reason",
    "loss_reason",
    "conversion_type",
    "value",
    "currency",
    "ga4_last_event",
    "ga4_event_sent",
    "ga4_sent_at"
  ];
}

function upsertCommercialPipelineFromChecklist_(payload, receivedAt, origin) {
  var sheet = getOrCreateSheet_(CONFIG.commercialPipelineSheet, commercialPipelineHeaders_());
  var submissionKey = String(payload.submissionKey || "");
  if (!submissionKey) return;

  var existingRow = findCommercialPipelineRowBySubmissionKey_(sheet, submissionKey);
  var gaClientId = payload.metadata && payload.metadata.gaClientId
    ? String(payload.metadata.gaClientId)
    : "";
  var leadId = existingRow ? sheet.getRange(existingRow, 1).getValue() : Utilities.getUuid();

  var row = [
    leadId,
    existingRow ? sheet.getRange(existingRow, 2).getValue() : receivedAt,
    receivedAt,
    "website",
    "form",
    "general",
    gaClientId,
    submissionKey,
    existingRow ? sheet.getRange(existingRow, 9).getValue() || "novo" : "novo",
    existingRow ? sheet.getRange(existingRow, 10).getValue() : "",
    existingRow ? sheet.getRange(existingRow, 11).getValue() : "",
    existingRow ? sheet.getRange(existingRow, 12).getValue() : "",
    existingRow ? sheet.getRange(existingRow, 13).getValue() : "",
    existingRow ? sheet.getRange(existingRow, 14).getValue() : 0,
    existingRow ? sheet.getRange(existingRow, 15).getValue() || "BRL" : "BRL",
    existingRow ? sheet.getRange(existingRow, 16).getValue() : "",
    existingRow ? sheet.getRange(existingRow, 17).getValue() || "no" : "no",
    existingRow ? sheet.getRange(existingRow, 18).getValue() : ""
  ];

  if (existingRow) {
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
    return;
  }

  sheet.appendRow(row);
}

function findCommercialPipelineRowBySubmissionKey_(sheet, submissionKey) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  var keys = sheet.getRange(2, 8, lastRow - 1, 1).getValues();
  for (var i = 0; i < keys.length; i++) {
    if (String(keys[i][0] || "") === String(submissionKey)) {
      return i + 2;
    }
  }
  return 0;
}

/**
 * Instalar gatilho onEdit para a aba commercial_pipeline:
 * no editor Apps Script, execute installCommercialPipelineTrigger() uma vez.
 */
function installCommercialPipelineTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "onCommercialPipelineEdit") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger("onCommercialPipelineEdit")
    .forSpreadsheet(CONFIG.spreadsheetId)
    .onEdit()
    .create();
}

function onCommercialPipelineEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (!sheet || sheet.getName() !== CONFIG.commercialPipelineSheet) return;
  if (e.range.getRow() < 2) return;

  var statusColumn = commercialPipelineHeaders_().indexOf("commercial_status") + 1;
  if (e.range.getColumn() !== statusColumn && e.range.getLastColumn() < statusColumn) {
    return;
  }

  processCommercialPipelineRow_(e.range.getRow());
}

function processCommercialPipelineRow_(rowIndex) {
  var sheet = getOrCreateSheet_(CONFIG.commercialPipelineSheet, commercialPipelineHeaders_());
  var headers = commercialPipelineHeaders_();
  var values = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
  var row = {};
  for (var i = 0; i < headers.length; i++) {
    row[headers[i]] = values[i];
  }

  var commercialStatus = String(row.commercial_status || "").toLowerCase().trim();
  var ga4Event = COMMERCIAL_STATUS_TO_GA4[commercialStatus];
  if (!ga4Event) return;
  if (String(row.ga4_last_event || "") === ga4Event && String(row.ga4_event_sent || "") === "yes") {
    return;
  }

  var clientId = String(row.ga_client_id || "").trim();
  if (!clientId) {
    clientId = Utilities.getUuid();
  }

  var params = buildOfflineLeadParams_(row, ga4Event, commercialStatus);
  var sent = sendGa4MeasurementEvent_(clientId, ga4Event, params);
  if (!sent.ok) {
    writePipelineAudit_(rowIndex, ga4Event, sent);
    return;
  }

  var sentAt = new Date().toISOString();
  sheet.getRange(rowIndex, headers.indexOf("ga4_last_event") + 1).setValue(ga4Event);
  sheet.getRange(rowIndex, headers.indexOf("ga4_event_sent") + 1).setValue("yes");
  sheet.getRange(rowIndex, headers.indexOf("ga4_sent_at") + 1).setValue(sentAt);
  sheet.getRange(rowIndex, headers.indexOf("updated_at") + 1).setValue(sentAt);
  writePipelineAudit_(rowIndex, ga4Event, sent);
}

function buildOfflineLeadParams_(row, eventName, commercialStatus) {
  var params = {
    lead_source: "website",
    lead_id: String(row.lead_id || ""),
    service_name: String(row.service_name || "general")
  };

  if (eventName === "working_lead") {
    params.lead_channel = String(row.lead_channel || "manual");
    params.lead_status = "working";
  } else if (eventName === "qualify_lead") {
    params.lead_status = "qualified";
    params.qualification_type = String(row.qualification_type || "company_fit");
  } else if (eventName === "disqualify_lead") {
    params.lead_status = "disqualified";
    params.disqualification_reason = String(row.disqualification_reason || "other");
  } else if (eventName === "close_convert_lead") {
    params.lead_status = "converted";
    params.conversion_type = String(row.conversion_type || "contract_signed");
    params.value = safeNumber_(row.value);
    params.currency = String(row.currency || "BRL");
  } else if (eventName === "close_unconvert_lead") {
    params.lead_status = "not_converted";
    params.loss_reason = String(row.loss_reason || "other");
  }

  params.commercial_status = commercialStatus;
  return params;
}

function sendGa4MeasurementEvent_(clientId, eventName, params) {
  if (!CONFIG.ga4MeasurementId || CONFIG.ga4MeasurementId.indexOf("G-") !== 0) {
    return { ok: false, reason: "measurement_id_not_configured" };
  }
  if (!CONFIG.ga4ApiSecret || CONFIG.ga4ApiSecret.indexOf("PUT_YOUR") === 0) {
    return { ok: false, reason: "api_secret_not_configured" };
  }

  var url = "https://www.google-analytics.com/mp/collect?measurement_id="
    + encodeURIComponent(CONFIG.ga4MeasurementId)
    + "&api_secret="
    + encodeURIComponent(CONFIG.ga4ApiSecret);

  var payload = {
    client_id: clientId,
    events: [{
      name: eventName,
      params: params || {}
    }]
  };

  try {
    var response = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    var code = response.getResponseCode();
    return {
      ok: code >= 200 && code < 300,
      status: code,
      body: response.getContentText()
    };
  } catch (error) {
    return {
      ok: false,
      reason: "request_failed",
      error: String(error && error.message ? error.message : error)
    };
  }
}

function writePipelineAudit_(rowIndex, eventName, result) {
  var sheet = getOrCreateSheet_(CONFIG.auditSheet, auditHeaders_());
  sheet.appendRow([
    new Date().toISOString(),
    "commercial_pipeline",
    "ga4_mp_" + eventName,
    result && result.status ? result.status : 0,
    JSON.stringify(result || {}),
    JSON.stringify({ row: rowIndex, event: eventName })
  ]);
}
