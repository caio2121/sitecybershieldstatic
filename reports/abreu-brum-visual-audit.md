# Auditoria visual final — ABREU & BRUM

**Ambiente:** homologação local (`http://127.0.0.1:8765/`)
**Branch:** `feat/premium-b2b-rebuild`
**Base da auditoria:** `8385dea`
**Data:** 25/10/2026
**Escopo:** 11 rotas prioritárias e institucionais, em 1440×1100 e 390×844 — 22 screenshots.

## Parecer executivo

A versão mantém a direção premium B2B aprovada: navy profundo, dourado como acento, superfícies editoriais claras, tipografia display da marca e linguagem técnica monoespaciada. A hierarquia conduz de contexto para evidência, escopo e CTA, sem publicar certificações, clientes, métricas, cases ou credenciais não autorizadas.

O refinamento final removeu quebras intrapalavra, transformou ofertas prioritárias em links diretos, fez a faixa legal ocupar o grid completo e adicionou privacidade persistente aos seis footers individuais. A auditoria DOM encontrou **0 quebras intrapalavra** e **0 overflow horizontal** nas 22 combinações.

## Auditoria dos screenshots

| Rota | Desktop | Mobile | Parecer visual |
|---|---:|---:|---|
| Home `/` | PASS | PASS | Command center claro; hero, prova, famílias e CTA têm sequência comercial legível. |
| Sobre `/sobre/` | PASS | PASS | Autoridade baseada em método e limites; sem claims não comprovados. |
| Pentest `/pentest/` | PASS | PASS | Identidade de exploração e evidência; modalidades distinguíveis e CTA visível. |
| Red Team `/red-team/` | PASS | PASS | Linguagem de campanha, objetivo e debrief; identidade adversarial separada. |
| Security Review `/security-review/` | PASS | PASS | Postura, camadas e relações; identidade de revisão separada. |
| Pentest Web `/pentest/web/` | PASS | PASS | Escopo acionável, sequência de execução, finding sintético sinalizado e CTA. |
| Pentest API `/pentest/api/` | PASS | PASS | Autorização, identidade e negócio explicados sem promessas absolutas. |
| Pentest Externo/Interno `/pentest/externo/` | PASS | PASS | Perímetro, posição interna e coordenação apresentados em etapas. |
| Red Team Exercise `/red-team/exercise/` | PASS | PASS | Objetivo, regras, campanha, sinais e debrief bem encadeados. |
| Cloud Security Review `/security-review/cloud/` | PASS | PASS | Arquitetura, IAM, exposição e remediação com leitura comercial clara. |
| Active Directory Security Review `/security-review/active-directory/` | PASS | PASS | Privilégio, relações e caminhos de administração sem alegações externas. |

### Critérios comparativos

A comparação foi feita por critérios observáveis em referências públicas de consultorias B2B de offensive security, não por cópia de layout ou material: distinção explícita entre Pentest e Red Team, catálogo por superfície/objetivo, CTA de início de escopo, prova por método e leitura de risco acionável. Referências consultadas: [Bishop Fox — Red Teaming](https://bishopfox.com/services/red-teaming), [Bishop Fox — Get Started](https://bishopfox.com/get-started), [NCC Group — Pen Test, Red Team, or Bug Bounty?](https://www.nccgroup.com/research/pentesting-v-red-teaming-v-bug-bounty). A implementação ABREU & BRUM usa estrutura, textos e identidade próprios.

## Correções aplicadas

- Redução responsiva dos headings display que excediam colunas estreitas; `overflow-wrap: break-word` permanece apenas como fallback.
- Links diretos no catálogo para Red Team Exercise, Cloud Security Review e Active Directory Security Review.
- `.p-footer-bottom` passou a ocupar `grid-column: 1 / -1`.
- Link persistente `Privacidade` adicionado aos seis footers de páginas prioritárias.
- Recaptura dos 22 screenshots finais após os ajustes.

## Evidência visual

- **Antes:** `abreu-brum-final-<rota>-<desktop|mobile>.png` no diretório raiz do worktree.
- **Depois:** `abreu-brum-final-audit-<rota>-<desktop|mobile>.png` no diretório raiz do worktree.
- Artefatos PNG são locais de homologação e permanecem fora do versionamento para não aumentar o artefato publicável.

## Lighthouse

Runner: Lighthouse `13.5.0`, Chrome headless, servidor local, categorias Performance/Accessibility/Best Practices/SEO.

| Página | Performance | Accessibility | Best Practices | SEO | FCP (ms) | LCP (ms) | CLS | TBT (ms) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Pentest Web | 96 | 100 | 100 | 100 | 1508 | 2558 | 0.058 | 0 |
| Pentest API | 97 | 100 | 100 | 100 | 1509 | 2559 | 0.037 | 0 |
| Pentest Externo/Interno | 96 | 100 | 100 | 100 | 1507 | 2557 | 0.058 | 0 |
| Red Team Exercise | 97 | 100 | 100 | 100 | 1515 | 2415 | 0.037 | 0 |
| Cloud Security Review | 97 | 100 | 100 | 100 | 1519 | 2569 | 0.037 | 0 |
| Active Directory Security Review | 97 | 100 | 100 | 100 | 1508 | 2558 | 0.037 | 0 |

Relatórios JSON brutos: `C:\Users\CaioA\AppData\Local\Temp\opencode\abreu-brum-lighthouse\`.

## Regressão

| Verificação | Resultado |
|---|---|
| JavaScript `node --check` | PASS — todos os `.js` em `app/web/js/`. |
| Guard CNJ | PASS — frontend local e Apps Script desativados. |
| Links e fragments locais | PASS — 28 HTML, 0 quebrados. |
| Catálogo prioritário | PASS — 6/6 destinos diretos. |
| Privacidade persistente | PASS — 6/6 páginas prioritárias. |
| CSP | PASS — políticas prioritárias sem falhas nos diretivos exigidos. |
| SEO básico | PASS — title e description presentes nas páginas indexáveis. |
| Sitemap | PASS — 6/6 rotas prioritárias presentes. |
| Responsividade/console | PASS — 22/22, sem overflow e sem erros de console. |
| Consentimento | PASS — banner inicial, recusa persistida e aceite persistido. |
| Formulário WhatsApp | PASS — privacidade bloqueia; com aceite prepara `wa.me` sem envio externo. |

## Posicionamento e segurança comercial

- Home e Sobre comunicam método, escopo e responsabilidade, sem alegações não evidenciadas.
- Pentest, Red Team e Security Review têm narrativas, acentos e estruturas distintas.
- As seis páginas prioritárias têm escopo, sequência de execução, entregáveis, perguntas e CTA.
- Findings e relatórios estão marcados como amostras sintéticas/demonstrativas.
- Não há certificações apresentadas como próprias sem autorização.
- O parceiro white label não é identificado publicamente.
- AB Scan continua legado em `/ab-scan/` com `noindex`.
- CNJ permanece desativado.

## Checklist de publicação

- [x] Branch de homologação: `feat/premium-b2b-rebuild`.
- [x] Sem merge ou deploy em produção nesta tarefa.
- [x] Links diretos, privacidade, rodapé e tipografia revisados.
- [x] Lighthouse executado nas seis páginas prioritárias.
- [x] Regressão estática, browser e formulário executada.
- [ ] Aprovação humana de conteúdo e artefatos visuais.
- [ ] Decisão explícita de publicação.
- [ ] Deploy separado, com smoke test externo, somente após aprovação.

## Plano de rollback

1. Não executar merge/deploy automaticamente.
2. Se a homologação for rejeitada, manter a produção no commit conhecido `b5cd27f35b1fc53cf69a8c299537fe95ee023d9b`.
3. Se esta branch for publicada posteriormente e houver regressão, reverter para esse commit, limpar cache/CDN se aplicável e repetir smoke test das seis rotas prioritárias, formulário e privacidade.
4. Registrar o incidente, a rota afetada e a evidência antes de qualquer nova tentativa.

## Parecer independente

Revisão independente round 1: **PASS_WITH_OBSERVATIONS**. Não foram encontrados blockers ou achados high. Observações residuais: os PNGs e JSONs de Lighthouse permanecem artefatos locais fora do versionamento, e o relatório aponta esses caminhos em vez de incorporar os binários.
