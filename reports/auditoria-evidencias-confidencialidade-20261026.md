# Auditoria de evidências, confidencialidade e claims comerciais

**Data:** 26/10/2026  
**Release de referência:** `84aea5c`  
**Escopo:** artefato white-label, 16 qualificações divulgadas e carta de atestado.  
**Regra:** nenhuma alteração visual, de rota, funcionalidade, integração ou motor de produto.

## 1. Confidencialidade white-label

### Evidências verificáveis

- `reports/portfolio-source-excerpt-20261026.md` existe apenas no worktree local e está coberto por `.gitignore`.
- `git ls-files --error-unmatch reports/portfolio-source-excerpt-20261026.md` falha com `pathspec ... did not match`: o arquivo não é versionado.
- `git log --all -- reports/portfolio-source-excerpt-20261026.md` não retorna histórico.
- `git rev-list --all --objects | Select-String 'portfolio-source-excerpt|origem-white-label'` não retorna objetos históricos; o identificador da origem foi deliberadamente redigido.
- O workflow `.github/workflows/deploy-pages.yml` copia somente `app/web` para `_site`, remove arquivos `.md` e publica exclusivamente `_site`.
- `https://abreuebrum.com.br/reports/portfolio-source-excerpt-20261026.md` retorna HTTP 404.
- `https://abreuebrum.com.br/portfolio-source-excerpt-20261026.md` retorna HTTP 404.
- `https://abreuebrum.com.br/reports/matriz-certificacoes.md` e `https://abreuebrum.com.br/reports/matriz-copy-comercial-20261026.md` também retornam HTTP 404; relatórios internos não são publicados.

### Classificação

**Resultado: não acessível publicamente e sem histórico Git identificado.** O recorte local contém origem white-label identificável e permanece material privado. O `.gitignore` impede inclusão acidental futura; não foi reproduzido neste relatório.

## 2. Certificações

As 16 siglas permanecem divulgadas somente como qualificações profissionais autorizadas, sem titular, número, validade, selo ou certificação corporativa.

| Sigla | Titularidade | Validade | Autorização de divulgação | Estado |
|---|---|---|---|---|
| OSCP | Não comprovada | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| OSWE | Não comprovada | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| OSEP | Não comprovada | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| OSCE | Não comprovada; denominação/emissor a confirmar | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| GPEN | Não comprovada | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| CEH | Não comprovada | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| PNPT | Não comprovada | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| CRTP | Não comprovada; emissor a confirmar | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| CRTA | Não comprovada; emissor a confirmar | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| eWPTX | Não comprovada | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| PenTest+ | Não comprovada | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| CPENT | Não comprovada | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| eMAPT | Não comprovada | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| LPT Master | Não comprovada | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| DCPT | Não comprovada; denominação/emissor a confirmar | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |
| ADPENX | Não comprovada; denominação/emissor a confirmar | Não comprovada | Declarada pelo proprietário; documento não anexado | Pendente |

**Evidência-base:** `reports/matriz-certificacoes.md`, linhas 8–31. A autorização registrada é uma declaração de uso comercial, não prova nominal de titularidade, validade ou vínculo profissional.

## 3. Carta de atestado

Não foi localizado contrato, proposta, modelo aprovado ou evidência operacional que confirme a carta de atestado como entregável aplicável. A menção foi removida das três páginas demonstrativas e da descrição pública dos entregáveis. O item permanece **pendente de confirmação contratual**.

## 4. Correções realizadas

- Removida somente a menção pública a carta de atestado em Pentest, Red Team e Security Review.
- Atualizada a matriz comercial para classificar o item como pendente.
- Adicionado bloqueio no `.gitignore` para recortes locais `reports/portfolio-source-excerpt-*.md`.
- Nenhum JavaScript, CSS visual, rota, preço, pagamento, API, Analytics, CSP, consentimento, AB Scan ou guard CNJ foi alterado.

## 5. Pendências para comprovação

Para cada sigla, anexar em área privada: titular, certificado ou verificador oficial, validade, vínculo profissional, autorização de uso da sigla/marca e escopo. Para a carta de atestado, anexar cláusula contratual ou modelo autorizado antes de voltar a mencioná-la publicamente.
