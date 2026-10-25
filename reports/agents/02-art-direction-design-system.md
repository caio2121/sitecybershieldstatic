# Agente 2 — direção de arte e design system

**Status:** consolidado antes da implementação  
**Fonte:** `app/web/css/tokens.css`, `app/web/css/style.css`, `app/web/css/premium.css`, HTML premium e auditorias locais

## Princípio de marca

ABREU & BRUM deve parecer uma operação técnica madura, não uma interface genérica de hacking. A marca aparece no logotipo, no contraste navy/dourado e na composição editorial. Neon, glows e textura decorativa só entram quando reforçam a diferença entre famílias.

## Tipografia

| Token | Família | Uso permitido |
|---|---|---|
| `--font-family-logo` | Ethnocentric | identidade/logotipo e ativos legados que dependam do wordmark |
| `--font-family-display` | Manrope 600–800 | H1, H2, H3, hero, cards e chamadas editoriais |
| `--font-family-base` | Inter 400–700 | corpo, navegação, formulários, tabelas e CTAs |
| `--font-family-mono` | IBM Plex Mono 400/600 | códigos, labels técnicos, estados e índices |

Regra: Ethnocentric não deve ser usada como fonte de conteúdo.

## Tokens e composição

- Fundo editorial: papel claro `--p-paper`; superfície branca para evidência.
- Contraste de autoridade: `--p-ink`/`--p-ink-soft` em hero, blocos de decisão e CTA.
- Acentos: dourado para Pentest; vermelho queimado para Red Team; azul ciano para Security Review.
- Grid: container fluido com máximo de 1260px, gutter responsivo e `min-width: 0` nos filhos de grid.
- Ritmo: seções amplas, listas com divisores, timeline e blocos de evidência; evitar sequência de cards idênticos.
- CTA: ação primária preenchida, ação secundária contornada; linguagem orientada à decisão, não à ferramenta.
- Textura: attack path no Pentest, diagonais/campanha no Red Team, grid/postura no Security Review.

## Componentes aprovados

`.p-hero`, `.p-page-hero`, `.p-heading`, `.p-practice`, `.p-timeline`, `.p-evidence`, `.p-report`, `.p-credibility-grid`, `.p-list`, `.p-cta` e `.p-footer` formam a camada premium atual.

## Gate de implementação

- Não adicionar certificações, clientes, métricas ou cases sem evidência e autorização.
- Não alterar a jornada WhatsApp sem endpoint autorizado.
- Não usar inline style: CSP atual proíbe `style-src-attr`.
- Rotas filhas devem herdar a família por prefixo do `data-site-area`.
