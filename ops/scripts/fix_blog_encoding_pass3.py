#!/usr/bin/env python3
"""Fix mixed mojibake using ftfy and targeted replacements."""
from __future__ import annotations

import re
from pathlib import Path

import ftfy

ROOT = Path(__file__).resolve().parents[2]
BLOG = ROOT / "app/web/blog"

MOJIBAKE_MARKERS = ("Ã", "â€", "Â", "ðŸ")


def fix_text(text: str) -> str:
    if not any(m in text for m in MOJIBAKE_MARKERS):
        return text

    fixed = ftfy.fix_text(text)
    replacements = {
        " ,": ",",
        "nÂº": "nº",
        "Âº": "º",
        "â€”": ",",
        "â€“": ",",
        "Proteção de Dados ,": "Proteção de Dados,",
    }
    for old, new in replacements.items():
        fixed = fixed.replace(old, new)
    return fixed


def rewrite_readme() -> None:
    readme = BLOG / "README.md"
    readme.write_text(
        """# Blog ABREU & BRUM

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
""",
        encoding="utf-8",
    )


def main() -> None:
    targets = [
        *BLOG.glob("*.html"),
        BLOG / "js/main.js",
        BLOG / "js/checklist-cnj-interativo.js",
        BLOG / "css/style.css",
    ]
    for path in targets:
        if not path.exists():
            continue
        original = path.read_text(encoding="utf-8")
        fixed = fix_text(original)
        if path.name == "index.html":
            fixed = fixed.replace(
                'content="blog cibersegurança, LGPD, pentest, vulnerabilidades web, ISO 27001, segurança digital, PMEs, consultoria segurança"',
                'content="blog cibersegurança, AB Scan, pentest, vulnerabilidades web, evidências de segurança, supply chain, CNJ, consultoria segurança"',
            )
        if fixed != original:
            path.write_text(fixed, encoding="utf-8")
            print(f"fixed {path}")

    rewrite_readme()
    print(f"rewrote {BLOG / 'README.md'}")


if __name__ == "__main__":
    main()
