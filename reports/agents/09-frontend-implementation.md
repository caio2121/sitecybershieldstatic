# Agente 9 — engenharia frontend

**Status:** implementação delimitada

## Base aprovada

- `tokens.css` concentra fontes e tokens globais.
- `premium.css` concentra a camada editorial premium sem reescrever a base legado.
- HTML premium usa componentes `.p-*`, CSP sem inline style e scripts locais.

## Escopo desta rodada

1. Fazer seletores de família funcionarem em rotas filhas por prefixo de `data-site-area`.
2. Substituir o token inexistente do título do blog pelo token display aprovado.
3. Criar a rota filha `/pentest/api/` com o sistema premium já consolidado.

## Fora de escopo

- redesign de proposal, blog inteiro, checklist ou páginas utilitárias;
- alteração de analytics, consentimento, WhatsApp, CSP ou integrações;
- claims, certificações, métricas ou fornecedor white label;
- merge, push ou deploy.
