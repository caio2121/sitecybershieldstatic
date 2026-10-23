# Blog ABREU & BRUM

Conteúdo B2B sobre segurança web, evidências para contratos, PenTest manual e conformidade.

**Domínio:** https://abreuebrum.com.br/blog/

## Estrutura

```
blog/
├── index.html
├── pentest-teste-de-invasao-empresas.html
├── vulnerabilidades-web-aplicacoes-api.html
├── ataques-supply-chain-fornecedores.html
├── provimento-213-cnj-cartorios-seguranca-informacao.html
├── zero-trust.html              # stub: redirect para index (noindex)
├── supply-chain.html            # stub: redirect para ataques-supply-chain (noindex)
├── css/style.css
├── js/main.js
└── README.md
```

## Posts ativos

| Arquivo | Tema | CTA principal |
|---------|------|---------------|
| `pentest-teste-de-invasao-empresas.html` | PenTest manual | Solicitar escopo de PenTest |
| `vulnerabilidades-web-aplicacoes-api.html` | Exposição web | Solicitar avaliação (AB Scan) |
| `ataques-supply-chain-fornecedores.html` | Fornecedores | Solicitar avaliação |
| `provimento-213-cnj-cartorios-seguranca-informacao.html` | CNJ / cartórios | Solicitar avaliação |

## Capas (og:image)

PNG 16:9 em `../images/blog/`, compostos sobre o template oficial em `../images/brand/templates/abreu_brum_template_16x9.png`.

Gerar novamente:

```bash
python ops/scripts/compose_blog_covers.py
```

## Shell do blog

Header, footer, skip-link e floating CTA seguem o padrão de `../index.html` (AB Scan como entrada comercial).

## SEO

- Sitemap: `../sitemap.xml`
- Stubs `zero-trust.html` e `supply-chain.html`: `noindex` + redirect
- Canonical e OG em `abreuebrum.com.br`

**Última atualização:** Julho 2026
