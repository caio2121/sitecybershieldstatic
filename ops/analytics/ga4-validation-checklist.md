# GA4 — Checklist de validação (ABREU & BRUM)

Domínio canônico de produção: `https://abreuebrum.com.br`

## No site (pré-deploy / pós-deploy)

- [ ] Site publicado em `https://abreuebrum.com.br` (hostname correto no GA4 Realtime)
- [ ] `js/lead-tracking.js` carregado antes de `main.js` ou `analytics.js`
- [ ] `index.html` com `data-site-area="main_site"`
- [ ] Aceitar cookies no banner → `analytics_storage: granted`
- [ ] Console sem erros de `gtag` ou `ABLeadTracking`
- [ ] CTA `#contato` dispara apenas `cta_click`, **não** evento de lead
- [ ] `#submitBtn` dispara `whatsapp_message_prepared` com `service_name` correto
- [ ] Clique WhatsApp/e-mail/telefone dispara `contact_channel_opened`
- [ ] Checklist CNJ: lead gate dispara `diagnostic_started`
- [ ] Checklist CNJ: WA hero/final dispara `contact_channel_opened`
- [ ] Nenhum evento web é tratado como envio confirmado; confirmação depende do canal externo
- [ ] Nenhum parâmetro contém nome, e-mail, telefone ou mensagem
- [ ] Form submit não duplica evento com clique WA (janela anti-duplicação 2s)

## No GA4

- [ ] Fluxo de dados Web com URL `https://abreuebrum.com.br`
- [ ] **DebugView**: `whatsapp_message_prepared`/`contact_channel_opened` com parâmetros `lead_channel`, `lead_type`
- [ ] **Realtime**: evento aparece após interação
- [ ] **Eventos**: eventos de intenção listados separadamente de leads confirmados
- [ ] Key Events: somente após pipeline confirmar o lead (ver `ga4-key-events-setup.md`)
- [ ] UTMs preservadas na sessão de origem

## Eventos offline (Measurement Protocol) — desativados nesta release

- [ ] Não executar: captura CNJ e Measurement Protocol offline estão desativados.
- [ ] Confirmar que deployments antigos do Apps Script foram suspensos/removidos.
- [ ] Reabrir somente em tarefa independente com backend autenticado, requisitos LGPD e revisão de segurança.

## Status comerciais válidos na planilha

| commercial_status | Evento GA4 |
|-------------------|------------|
| `em_atendimento` | `working_lead` |
| `qualificado` | `qualify_lead` |
| `desqualificado` | `disqualify_lead` |
| `ganho` | `close_convert_lead` |
| `perdido` | `close_unconvert_lead` |
