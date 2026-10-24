# GA4 — Configuração de Key Events (Conversões)

Após existir um fluxo autorizado que confirme o lead, configure os eventos de negócio no painel do Google Analytics 4. Abrir WhatsApp ou preparar uma mensagem não confirma envio.

## Pré-requisitos

- Domínio de produção: `https://abreuebrum.com.br`
- Measurement ID de produção: `G-K46VQ6H8MS`
- Eventos chegando em **Admin > DebugView** ou **Relatórios em tempo real**

## Key Events obrigatórios

No GA4: **Admin > Exibição de dados > Eventos > Criar evento** (se necessário) e marcar como **Key event**.

| Evento | Marcar como Key Event | Observação |
|--------|----------------------|------------|
| `generate_lead` | **Sim, somente após confirmação** | Não é emitido pelo formulário estático; exige backend/CRM ou confirmação operacional |
| `qualify_lead` | **Sim** | Enviado via Measurement Protocol (planilha/CRM) |
| `close_convert_lead` | **Sim** | Enviado via Measurement Protocol |

## Key Event opcional

| Evento | Marcar como Key Event | Quando usar |
|--------|----------------------|-------------|
| `working_lead` | Opcional | Se quiser medir início de atendimento comercial |

## Não marcar como Key Event

- `disqualify_lead`
- `close_unconvert_lead`
- `whatsapp_message_prepared`, `contact_channel_opened`, `cta_click`, `form_start`, `service_interest`

## API Secret para Measurement Protocol (eventos offline) — futuro

Não executar nesta release: a captura CNJ e os eventos offline do Apps Script
estão desativados. Não criar nem copiar API Secret, nem republicar o endpoint,
até existir backend autenticado e revisão independente aprovada.

## Parâmetros customizados (opcional, fase 2)

Registrar em **Definições personalizadas > Parâmetros personalizados**:

- `lead_channel`
- `lead_type`
- `service_name`
- `cta_location`
- `form_id`

## Relatório de aquisição de leads

Após 24–48h com `generate_lead` ativo:

**Relatórios > Aquisição de leads** — validar preenchimento por canal (`lead_channel`).
