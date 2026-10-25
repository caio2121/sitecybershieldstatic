# Auditoria visual e comercial — ABREU & BRUM

**Ambiente inicial:** produção `https://abreuebrum.com.br/`  
**Resoluções auditadas:** 1920×1080, 1440×900, 768×1024, 390×844 e 360×800  
**Páginas:** Home, Sobre, Pentest, Red Team e Security Review  
**Data:** 25/10/2026

## Achados da versão publicada

| Severidade | Achado | Evidência |
|---|---|---|
| Alta | Ethnocentric domina títulos e headings, confundindo tipografia de conteúdo com identidade do logotipo | `reports/visual-audit/before/home-1920x1080.png`, `home-390x844.png` |
| Alta | Home e páginas de serviço usam o mesmo gesto editorial em quase todas as seções; a diferenciação é principalmente cromática | screenshots de Pentest, Red Team e Security Review em `reports/visual-audit/before/` |
| Média | Página Sobre expõe vocabulário de governança interna no bloco de qualificações | `before/sobre-1440x900.png` |
| Média | Prova comercial é concentrada em processo e amostra sintética, sem um bloco de capacidade técnica pronto para credenciais autorizadas | Home e Sobre em produção |
| Média | Mobile exige esforço de leitura pela combinação de títulos comprimidos, blocos longos e repetição de cards | `before/home-390x844.png`, `before/security-review-390x844.png` |
| Baixa | Alguns labels técnicos em inglês aparecem sem uma função comercial explícita | hero e cards das famílias |

## Critério de refinamento

Preservar a marca do logotipo, substituir o display por Manrope, reservar IBM Plex Mono para sinais técnicos, manter Inter para leitura e criar uma camada de autoridade por capacidades verificáveis. A distinção das famílias combina narrativa, acento, textura e vocabulário: exploração/evidência no Pentest, campanha/detecção no Red Team e relações/controles no Security Review.

## Resultado depois

| Verificação visual | Resultado |
|---|---|
| Screenshots antes/depois | 25 antes + 25 depois |
| Resoluções | 1920×1080, 1440×900, 768×1024, 390×844 e 360×800 |
| Páginas prioritárias | Home, Sobre, Pentest, Red Team e Security Review |
| Overflow horizontal | 0 ocorrências nas 50 combinações capturadas |
| Console do navegador | 0 erros e 0 warnings nas rotas prioritárias e institucionais locais |
| Tipografia editorial | H1 da Home computado como Manrope; corpo computado como Inter |
| Estado comercial | CTAs preservados; nenhum preço ou condição alterado |

### Parecer comparativo

O antes mostra uma identidade forte, porém repetitiva: a fonte do logotipo ocupava quase toda a hierarquia e as famílias compartilhavam o mesmo ritmo visual. O depois mantém navy, dourado e a marca original, mas devolve contraste editorial ao texto, cria uma seção de especialização técnica e usa texturas distintas para ataque, campanha e postura. Em mobile, os títulos permanecem legíveis sem overflow e os CTAs continuam visíveis após a primeira dobra.

### Lighthouse local

Runner Lighthouse 13.5.0, servidor local, sem consentimento de analytics:

| Rota | Performance | Acessibilidade | Best Practices | SEO |
|---|---:|---:|---:|---:|
| Home | 91 | 96 | 100 | 100 |
| Sobre | 92 | 96 | 100 | 100 |
| Pentest | 94 | 96 | 100 | 100 |
| Red Team | 92 | 96 | 100 | 100 |
| Security Review | 93 | 96 | 100 | 100 |
| Solicitar proposta | 98 | 96 | 100 | 100 |

JSONs brutos: `reports/lighthouse/`.

## Verificações técnicas executadas

- `node --check`: 9 arquivos JavaScript — PASS.
- `node tests/release/cnj-capture-disabled.mjs`: PASS.
- Links e assets relativos: 28 HTML — PASS.
- SEO, JSON-LD e sitemap: 24 páginas indexáveis, 21 páginas com JSON-LD e 24 URLs no sitemap — PASS.
- Acessibilidade estrutural: imagens sem `alt`, controles sem label, botões sem nome e IDs duplicados — 0 ocorrências.
- CSP: políticas preservadas, 0 estilos inline, analytics carregado somente após consentimento.
- Consentimento: banner inicial, recusa persistente e aceite persistente — PASS.
- Formulário: validação, aceite de privacidade e preparação de WhatsApp sem envio automático — PASS.

### Validação complementar — Pentest API

- Rota: `/pentest/api/` servida localmente em `127.0.0.1:8790`.
- Resoluções: 1920×1080, 1440×900, 768×1024, 390×844 e 360×800.
- Overflow horizontal: 0 ocorrências nas cinco resoluções.
- H1, 21 links internos e carregamento da rota: PASS.
- Console do navegador: 0 erros.

## Revisão independente

**Round 1:** `PASS_WITH_OBSERVATIONS` — sem blockers ou achados high.

Observações residuais:

- rotas filhas de Pentest, Red Team e Security Review não herdam todas as texturas/accentos definidos para as páginas de família;
- o blog legado ainda referencia `--font-family-brand`, token removido do novo sistema;
- códigos e nota do bloco de credibilidade têm contraste abaixo do ideal em Lighthouse;
- screenshots e JSONs de Lighthouse permanecem artefatos locais de homologação, fora do conjunto publicável.

Esses itens não impedem a avaliação visual da branch, mas devem ser tratados antes de uma publicação final se a aprovação humana exigir consistência total também no blog e nas rotas filhas.

## Pendências para publicação

- aprovação visual e comercial do proprietário;
- decisão sobre quais credenciais individuais possuem vínculo, evidência documental e autorização de uso;
- eventual correção das observações da revisão independente;
- smoke test externo após eventual deploy — não executado nesta missão.

**Merge e deploy:** não executados.

## Artefatos

- Antes: `reports/visual-audit/before/<pagina>-<largura>x<altura>.png`.
- Depois: `reports/visual-audit/after/<pagina>-<largura>x<altura>.png`.
- A comparação final deve ser lida junto com `reports/matriz-certificacoes.md`, `reports/diagnostico-tipografico.md` e `reports/relatorio-copywriting.md`.
