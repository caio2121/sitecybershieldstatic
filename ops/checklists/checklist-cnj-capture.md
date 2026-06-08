# Captura de dados do checklist CNJ (GitHub Pages + GAS)

## 1) Preparar Google Sheets

- Crie uma planilha para receber os envios.
- Copie o ID da planilha (trecho entre `/d/` e `/edit` na URL).

## 2) Publicar Apps Script como Web App

- Crie um projeto Apps Script.
- Cole o conteúdo de `ops/checklists/checklist-cnj-capture.gs`.
- Atualize `CONFIG.spreadsheetId` com o ID da planilha.
- Faça deploy como **Web App**:
  - Execute as: `Me`
  - Who has access: `Anyone`
- Copie a URL final do Web App.

## 3) Configurar o endpoint no checklist

No arquivo `app/web/assets/checklists/checklist-cnj-interativo.html`, ajuste:

```html
<script>
  window.CHECKLIST_CONFIG = window.CHECKLIST_CONFIG || {
    captureEndpoint: "https://script.google.com/macros/s/SEU_DEPLOY_ID/exec",
    requestTimeoutMs: 12000
  };
</script>
```

## 4) O que é enviado

O front envia:

- `status`: `started`, `in_progress` ou `completed`
- `lead`: nome, e-mail, whatsapp, consentimento (`consentGivenAt`)
- `answers`: respostas por pergunta (`sim`, `nao`, `nao_sei`)
- `stats`: totais do diagnóstico
- `xp` e `conformity`
- `metadata`: timestamp, URL e user-agent
- `submissionKey`: chave de idempotência por sessão

## 5) Idempotência e falha de rede

- O backend faz upsert por `submissionKey` na mesma linha (`started` -> `in_progress` -> `completed`).
- Se houver falha de rede, o usuário pode clicar em "Tentar envio novamente" no relatório final.

## 6) Pipeline comercial e eventos GA4 offline

O Apps Script também mantém a aba `commercial_pipeline` e envia eventos via **Measurement Protocol** quando o status comercial muda.

### Configuração

1. Em `checklist-cnj-capture.gs`, atualize:
   - `CONFIG.ga4MeasurementId` (ex.: `G-XXXXXXXXXX`)
   - `CONFIG.ga4ApiSecret` (criado no GA4 > Fluxo de dados Web)
2. Faça novo deploy do Web App.
3. No editor Apps Script, execute `installCommercialPipelineTrigger()` **uma vez**.

### Colunas principais (`commercial_pipeline`)

- `lead_id`, `ga_client_id`, `submission_key`
- `commercial_status`: `novo`, `em_atendimento`, `qualificado`, `desqualificado`, `ganho`, `perdido`
- `qualification_type`, `disqualification_reason`, `loss_reason`, `conversion_type`
- `value`, `currency`
- `ga4_last_event`, `ga4_event_sent`, `ga4_sent_at`

### Mapeamento status → evento GA4

| commercial_status | Evento |
|-------------------|--------|
| `em_atendimento` | `working_lead` |
| `qualificado` | `qualify_lead` |
| `desqualificado` | `disqualify_lead` |
| `ganho` | `close_convert_lead` |
| `perdido` | `close_unconvert_lead` |

O `generate_lead` continua sendo disparado **apenas no site**; a planilha não reenvia esse evento.

### client_id

O checklist envia `metadata.gaClientId` (cookie `_ga`) no payload. Use esse valor para conciliar eventos offline com a sessão online.
