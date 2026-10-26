# Lighthouse — reconstrução comercial local

**Data:** 2026-10-26
**Alvo:** servidor local `http://127.0.0.1:4173` servido a partir de `app/web`
**Preset:** desktop
**Categorias:** performance, accessibility, best-practices, seo
**Comando:** `npx --no-install lighthouse <URL> --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=<arquivo> --chrome-flags="--headless --no-sandbox" --quiet`

## Resultado

| Rota | Performance | Acessibilidade | Best Practices | SEO |
|---|---:|---:|---:|---:|
| `/` | 100 | 100 | 100 | 100 |
| `/sobre/` | 100 | 100 | 100 | 100 |
| `/servicos/` | 100 | 100 | 100 | 100 |
| `/pentest/` | 100 | 100 | 100 | 100 |
| `/red-team/` | 100 | 100 | 100 | 100 |
| `/security-review/` | 100 | 100 | 100 | 100 |

## Evidência

Os JSONs completos foram gerados em armazenamento temporário local aprovado:

`C:\Users\CaioA\AppData\Local\Temp\opencode\abreu-brum-lighthouse-reconstruction-20261026`

O diretório não é artefato público nem contém credenciais. O relatório resume somente os scores reproduzíveis; o comando acima permite regenerar os JSONs.
