/**
 * Endpoint histórico do checklist CNJ — desativado.
 *
 * Não há captura, autenticação, persistência ou envio de Analytics neste
 * arquivo. Uma futura implementação precisa ser criada em tarefa independente
 * e aprovada antes de qualquer transmissão de dados.
 */

function disabledResponse_() {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: false,
      disabled: true,
      status: 410,
      message: "Captura CNJ desativada até nova implementação aprovada."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return disabledResponse_();
}

function doPost() {
  return disabledResponse_();
}
