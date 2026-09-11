# GA4 — Configuração de Key Events (Conversões)

Após o deploy do código com `generate_lead`, configure no painel do Google Analytics 4.

## Pré-requisitos

- Measurement ID de produção (ex.: `G-XXXXXXXXXX`)
- Eventos chegando em **Admin > DebugView** ou **Relatórios em tempo real**

## Key Events obrigatórios

No GA4: **Admin > Exibição de dados > Eventos > Criar evento** (se necessário) e marcar como **Key event**.

| Evento | Marcar como Key Event | Observação |
|--------|----------------------|------------|
| `generate_lead` | **Sim** | Conversão primária online |
| `qualify_lead` | **Sim** | Enviado via Measurement Protocol (planilha/CRM) |
| `close_convert_lead` | **Sim** | Enviado via Measurement Protocol |

## Key Event opcional

| Evento | Marcar como Key Event | Quando usar |
|--------|----------------------|-------------|
| `working_lead` | Opcional | Se quiser medir início de atendimento comercial |

## Não marcar como Key Event

- `disqualify_lead`
- `close_unconvert_lead`
- `cta_click`, `form_start`, `service_interest`

## API Secret para Measurement Protocol (eventos offline)

1. GA4 **Admin > Coleta e modificação de dados > Fluxo de dados**
2. Selecione o fluxo Web
3. **Measurement Protocol API secrets** > Criar
4. Copie o secret para `CONFIG.ga4ApiSecret` em `ops/checklists/checklist-cnj-capture.gs`

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
