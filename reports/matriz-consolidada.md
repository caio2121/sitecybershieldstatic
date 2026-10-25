# Matriz consolidada — evolução premium

**Branch:** `feat/premium-b2b-rebuild`  
**Base:** `8385dea`  
**Data:** 25/10/2026

## Escopo validado

| Frente | Evidência | Estado |
|---|---|---|
| Design system | Manrope para display, Inter para leitura, IBM Plex Mono para sinais técnicos; prefixos premium herdados nas rotas filhas | PASS |
| Pentest API | `/pentest/api/` com CTA parametrizado, escopo, sequência, amostra sintética e FAQ | PASS |
| CRO | CTA preservado, `servico=pentest` + `modalidade=api`, WhatsApp e consentimento sem alteração | PASS |
| SEO | canonical, metadados, JSON-LD e sitemap da nova rota | PASS |
| Segurança | CSP local preservada; guard CNJ aprovado; nenhum fornecedor white-label exposto | PASS |
| Responsividade | 1920×1080, 1440×900, 768×1024, 390×844 e 360×800 sem overflow horizontal | PASS |

## Alterações delimitadas

- `app/web/css/premium.css`: herança visual por prefixo e contraste dos códigos.
- `app/web/blog/css/style.css`: token tipográfico aprovado.
- `app/web/red-team/index.html`: modalidades sem rota própria apontam para solicitação de escopo.
- `app/web/pentest/api/index.html`: nova rota filha premium.

## Fora de escopo e riscos residuais

- Âncoras antigas no catálogo geral, card combinado de Entra ID/M365/Pipeline e páginas utilitárias legadas permanecem para tarefa editorial própria.
- Headers HTTP externos e acessibilidade do modal CNJ exigem validação fora do servidor local.
- Merge, push, deploy e smoke test externo não foram executados.
