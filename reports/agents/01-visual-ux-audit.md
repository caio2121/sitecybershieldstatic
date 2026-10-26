# Agente 1 — auditoria visual e UX

**Status:** concluída, somente leitura  
**Ambiente:** produção pública e artefatos locais de comparação  
**Páginas prioritárias:** Home, Sobre, Pentest, Red Team e Security Review; rotas filhas verificadas adicionalmente  
**Resoluções:** 1920×1080, 1440×900, 768×1024, 390×844 e 360×800

## Evidências

- Capturas comparativas versionadas em `reports/visual-audit/before/` e `reports/visual-audit/after/`.
- Capturas reais desta rodada executadas via Playwright na produção para todas as páginas prioritárias e rotas filhas.
- Em todas as combinações verificadas, `document.documentElement.scrollWidth === innerWidth`.
- H1 computado como Manrope e corpo computado como Inter nas páginas premium.
- Console do navegador sem erros ou warnings na navegação da produção auditada.

## Achados da base anterior

| Prioridade | Achado | Evidência | Tratamento |
|---|---|---|---|
| Alta | Ethnocentric aparecia na hierarquia editorial, confundindo marca e conteúdo | `reports/visual-audit/before/` e `reports/diagnostico-tipografico.md` | Manrope em títulos; Ethnocentric restrita à identidade |
| Alta | Pentest, Red Team e Security Review compartilhavam gesto visual e editorial | capturas `before/` | acento, textura, vocabulário e jornada distintos |
| Média | Sobre expunha linguagem de governança interna | `reports/relatorio-copywriting.md` | narrativa comercial orientada a método, capacidade e decisão |
| Média | Autoridade técnica dependia de claims não autorizados | `reports/matriz-certificacoes.md` | seção de capacidade baseada em método e evidência; credenciais sob consulta |
| Média | Mobile tinha densidade e títulos difíceis de ler | capturas `before/` | escala Manrope, largura controlada, grids empilhados e CTAs preservados |

## Parecer visual

### Resultado positivo

- A primeira dobra comunica serviço, valor, processo e ação sem depender de números ou clientes.
- A marca mantém navy, dourado e logotipo; a identidade deixou de ser aplicada como fonte de texto.
- As famílias são distinguíveis: exploração/evidência no Pentest, campanha/detecção no Red Team, postura/relações no Security Review.
- A composição mobile mantém hierarquia, CTA e legibilidade sem overflow.

### Resíduos observados e estado pós-correção

1. Rotas filhas usam `data-site-area` com sufixos (`pentest-web`, `red-team-exercise`, `security-review-cloud`); a herança de acento/textura foi corrigida por seletores de prefixo em `premium.css`.
2. O blog legado não participa integralmente da camada premium, mas o título agora usa o token display existente; a referência a `--font-family-brand` foi removida.
3. A proposta e páginas utilitárias seguem o sistema base. Não foram redesenhadas nesta rodada por não haver decisão consolidada para uma migração completa dessas superfícies.

## Prioridade para implementação — estado atual

1. Herança das famílias por prefixo em `app/web/css/premium.css`: concluída.
2. Título do blog consumindo o token display existente: concluído.
3. Migração visual de utilitários permanece como tarefa separada, sem alterar o fluxo WhatsApp ou inventar endpoint.
