# GA4 — Checklist de validação (ABREU & BRUM)

Domínio canônico de produção: `https://abreuebrum.com.br`

## No site (pré-deploy / pós-deploy)

- [ ] Site publicado em `https://abreuebrum.com.br` (hostname correto no GA4 Realtime)
- [ ] `js/lead-tracking.js` carregado antes de `main.js` ou `analytics.js`
- [ ] `index.html` com `data-site-area="main_site"`
- [ ] Aceitar cookies no banner → `analytics_storage: granted`
- [ ] Console sem erros de `gtag` ou `ABLeadTracking`
- [ ] CTA `#contato` dispara apenas `cta_click`, **não** `generate_lead`
- [ ] `#submitBtn` dispara `generate_lead` com `service_name` correto
- [ ] Clique WhatsApp/e-mail/telefone em `#contato` dispara `generate_lead`
- [ ] Checklist CNJ: lead gate dispara `generate_lead`
- [ ] Checklist CNJ: WA hero/final dispara `generate_lead`
- [ ] Nenhum parâmetro contém nome, e-mail, telefone ou mensagem
- [ ] Form submit não duplica evento com clique WA (janela anti-duplicação 2s)

## No GA4

- [ ] Fluxo de dados Web com URL `https://abreuebrum.com.br`
- [ ] **DebugView**: `generate_lead` com parâmetros `lead_channel`, `lead_type`
- [ ] **Realtime**: evento aparece após interação
- [ ] **Eventos**: `generate_lead` listado como evento recomendado
- [ ] Key Events: `generate_lead`, `qualify_lead`, `close_convert_lead` (ver `ga4-key-events-setup.md`)
- [ ] UTMs preservadas na sessão de origem

## Eventos offline (Measurement Protocol)

- [ ] `CONFIG.ga4MeasurementId` e `CONFIG.ga4ApiSecret` configurados no Apps Script
- [ ] `allowedOrigins` no Apps Script inclui `https://abreuebrum.com.br` (ver `checklist-cnj-capture.gs`)
- [ ] Web App republicado após alterar a whitelist de origem
- [ ] Aba `commercial_pipeline` criada na planilha
- [ ] `installCommercialPipelineTrigger()` executado uma vez
- [ ] Alterar `commercial_status` para `qualificado` → `qualify_lead` na auditoria
- [ ] Coluna `ga4_event_sent` = `yes` após envio
- [ ] `ga_client_id` preenchido quando lead veio do site com consentimento

## Status comerciais válidos na planilha

| commercial_status | Evento GA4 |
|-------------------|------------|
| `em_atendimento` | `working_lead` |
| `qualificado` | `qualify_lead` |
| `desqualificado` | `disqualify_lead` |
| `ganho` | `close_convert_lead` |
| `perdido` | `close_unconvert_lead` |
