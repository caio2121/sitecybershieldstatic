# Agente 10 — QA, performance e acessibilidade

**Status:** baseline concluída; revalidação após patch pendente

## Baseline disponível

Segundo `reports/visual-audit-premium.md` e os JSONs em `reports/lighthouse/`:

| Rota | Performance | Acessibilidade | Best Practices | SEO |
|---|---:|---:|---:|---:|
| Home | 91 | 96 | 100 | 100 |
| Sobre | 92 | 96 | 100 | 100 |
| Pentest | 94 | 96 | 100 | 100 |
| Red Team | 92 | 96 | 100 | 100 |
| Security Review | 93 | 96 | 100 | 100 |
| Solicitar proposta | 98 | 96 | 100 | 100 |

## Checks reais executados nesta rodada

- Playwright em produção nas cinco resoluções requeridas, nas páginas prioritárias e rotas filhas.
- Overflow horizontal: zero nas combinações observadas.
- Tipografia computada: H1 Manrope e body Inter nas páginas premium.
- Console: zero erros/warnings na navegação executada.

## Gates pós-patch

- `node --check` em todos os JavaScript.
- `node tests/release/cnj-capture-disabled.mjs`.
- validação local de fontes, tokens e seletores.
- Playwright novamente nas cinco resoluções.
- Lighthouse local já existente deve permanecer sem regressão conhecida; smoke externo não será executado sem deploy.
