/**
 * Endpoint de captura do checklist CNJ.
 * Comentários em PT-BR por diretriz do projeto.
 */
var CONFIG = {
  spreadsheetId: "PUT_YOUR_SPREADSHEET_ID_HERE",
  submissionsSheet: "checklist_submissions",
  auditSheet: "checklist_audit",
  allowedOrigins: [
    "https://niltondev.github.io",
    "https://cybershieldgroup.com.br",
    "https://www.cybershieldgroup.com.br"
  ]
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
