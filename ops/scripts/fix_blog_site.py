#!/usr/bin/env python3
"""Fix blog encoding, shell alignment, copy, and stubs."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BLOG = ROOT / "app/web"

HEADER = """    <a href="#main-content" class="skip-link">Pular para o conteúdo</a>

    <header class="header">
        <div class="container">
            <a href="../index.html" class="logo" aria-label="ABREU & BRUM">
                <img src="../images/logo-abreu-brum.svg" alt="ABREU & BRUM" class="logo-img">
            </a>
            <nav class="nav" aria-label="Navegação principal">
                <a href="../index.html#ab-scan">AB Scan</a>
                <a href="../index.html#relatorio-exemplo">Relatório exemplo</a>
                <a href="../index.html#fluxo">Como funciona</a>
                <a href="../index.html#pentest-manual">PenTest manual</a>
                <a href="../index.html#contato" class="nav-cta">Contato</a>
            </nav>
            <button class="mobile-menu" type="button" aria-label="Abrir menu" aria-expanded="false">
                <i class="fas fa-bars" aria-hidden="true"></i>
            </button>
        </div>
    </header>

    <div class="floating-cta">
        <a href="../index.html#contato" class="btn btn-primary">
            <i class="fas fa-magnifying-glass-chart" aria-hidden="true"></i>
            Solicitar avaliação
        </a>
    </div>"""

FOOTER = """    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <a href="../index.html" class="logo" aria-label="ABREU & BRUM">
                        <img src="../images/logo-abreu-brum-branca.svg" alt="ABREU & BRUM" class="logo-img">
                    </a>
                    <p>Cybersecurity | PenTest | Consultoria</p>
                    <p><small>CNPJ: <span data-company="cnpj">61.952.290/0001-68</span></small></p>
                    <p><small>São Paulo, SP, Brasil</small></p>
                </div>
                <div class="footer-links">
                    <h4>Navegação</h4>
                    <a href="../index.html#ab-scan">AB Scan</a>
                    <a href="../index.html#relatorio-exemplo">Relatório exemplo</a>
                    <a href="../index.html#fluxo">Como funciona</a>
                    <a href="index.html">Blog</a>
                    <a href="../index.html#contato">Contato</a>
                </div>
                <div class="footer-services">
                    <h4>Soluções</h4>
                    <a href="../index.html#ab-scan">AB Scan</a>
                    <a href="../index.html#pentest-manual">PenTest manual</a>
                    <a href="../servicos/">Serviços complementares</a>
                </div>
                <div class="footer-social">
                    <h4>Contato</h4>
                    <a href="mailto:contato@abreuebrum.com.br" data-contact="email" data-email-type="primary">contato@abreuebrum.com.br</a>
                    <a href="tel:+5521920137715" data-contact="phone">(21) 92013-7715</a>
                    <a href="../politica-privacidade.html">Política de Privacidade</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 ABREU &amp; BRUM. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>

    <script src="../js/config.js"></script>
    <script src="../js/lead-tracking.js"></script>
    <script src="../js/analytics.js"></script>
    <script src="js/main.js"></script>"""

BLOG_INDEX_HEADER = HEADER
BLOG_INDEX_FLOATING = """    <div class="floating-cta">
        <a href="../index.html#contato" class="btn btn-primary">
            <i class="fas fa-magnifying-glass-chart" aria-hidden="true"></i>
            Solicitar avaliação
        </a>
    </div>"""

BLOG_INDEX_FOOTER = FOOTER

STUB_REDIRECT = {
    "zero-trust.html": "index.html",
    "supply-chain.html": "ataques-supply-chain-fornecedores.html",
}

META_UPDATES = {
    "index.html": {
        "title": "Blog ABREU & BRUM | Segurança web, evidências e PenTest",
        "description": "Conteúdo para empresas que precisam comprovar segurança web, responder exigências e decidir quando avançar para PenTest manual.",
        "og_title": "Blog ABREU & BRUM | Segurança web, evidências e PenTest",
        "hero_h1": "Blog ABREU & BRUM",
        "hero_sub": "Insights sobre segurança web, evidências para contratos e o caminho entre AB Scan e PenTest manual.",
    },
    "pentest-teste-de-invasao-empresas.html": {
        "title": "PenTest manual: quando sua empresa precisa ir além do AB Scan | Blog ABREU & BRUM",
        "description": "Entenda quando contratar PenTest manual, o que esperar do relatório e como o AB Scan ajuda no diagnóstico inicial.",
        "og_title": "PenTest manual: quando sua empresa precisa ir além do AB Scan",
    },
    "vulnerabilidades-web-aplicacoes-api.html": {
        "title": "Vulnerabilidades web em sites, sistemas e APIs | Blog ABREU & BRUM",
        "description": "Principais riscos em aplicações web e como uma avaliação do domínio com AB Scan ajuda a priorizar correções.",
        "og_title": "Vulnerabilidades web em sites, sistemas e APIs",
    },
    "ataques-supply-chain-fornecedores.html": {
        "title": "Ataques de supply chain e homologação de fornecedores | Blog ABREU & BRUM",
        "description": "Como reduzir riscos na cadeia de fornecedores e responder exigências com relatório profissional de segurança.",
        "og_title": "Ataques de supply chain e homologação de fornecedores",
    },
    "provimento-213-cnj-cartorios-seguranca-informacao.html": {
        "title": "Provimento 213 do CNJ: segurança para cartórios | Blog ABREU & BRUM",
        "description": "O que muda para serventias extrajudiciais e como organizar evidências de segurança para correição e auditoria.",
        "og_title": "Provimento 213 do CNJ: segurança para cartórios",
    },
}


def fix_mojibake(text: str) -> str:
    for _ in range(2):
        try:
            text = text.encode("latin-1").decode("utf-8")
        except (UnicodeDecodeError, UnicodeEncodeError):
            break
    replacements = {
        "â€”": ",",
        "â€“": ",",
        "â€˜": "'",
        "â€™": "'",
        "â€œ": '"',
        "â€": '"',
        "nÂº": "nº",
        "Âº": "º",
        "Ã—": "×",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def set_meta(content: str, name: str, value: str, attr: str = "name") -> str:
    pattern = rf'(<meta\s+{attr}="{re.escape(name)}"\s+content=")([^"]*)(")'
    return re.sub(pattern, rf"\1{value}\3", content, count=1)


def set_title(content: str, value: str) -> str:
    return re.sub(r"<title>[^<]*</title>", f"<title>{value}</title>", content, count=1)


def replace_header_footer(content: str, is_index: bool = False) -> str:
    header = BLOG_INDEX_HEADER if is_index else HEADER
    footer = BLOG_INDEX_FOOTER if is_index else FOOTER

    content = re.sub(
        r"<!-- Header -->.*?</header>\s*",
        header + "\n\n",
        content,
        count=1,
        flags=re.S,
    )
    content = re.sub(
        r"<header class=\"header\">.*?</header>\s*",
        header + "\n\n",
        content,
        count=1,
        flags=re.S,
    )

    if is_index:
        if "floating-cta" not in content:
            content = content.replace(
                "</header>\n\n    <main",
                "</header>\n\n" + BLOG_INDEX_FLOATING + "\n\n    <main",
            )

    content = re.sub(
        r"<!-- Footer -->.*?</footer>\s*",
        footer + "\n",
        content,
        count=1,
        flags=re.S,
    )
    content = re.sub(
        r"<footer class=\"footer\">.*?</footer>\s*",
        footer + "\n",
        content,
        count=1,
        flags=re.S,
    )

    content = re.sub(
        r"\s*<script src=\"\.\./js/lead-tracking\.js\"></script>\s*"
        r"<script src=\"\.\./js/analytics\.js\"></script>\s*"
        r"<script src=\"js/main\.js\"></script>\s*</body>",
        "\n</body>",
        content,
        count=1,
    )
    return content


def apply_copy_patches(content: str, filename: str) -> str:
    patches = [
        ("Fale com nossos especialistas", "Solicitar escopo de PenTest"),
        ("Falar com especialista", "Solicitar escopo de PenTest"),
        ("Falar com especialistas", "Solicitar avaliação"),
        ("SeguranÃ§a digital que inspira confianÃ§a", "Cybersecurity | PenTest | Consultoria"),
        ("Segurança digital que inspira confiança", "Cybersecurity | PenTest | Consultoria"),
        ("Relatorio exemplo", "Relatório exemplo"),
        ("ServiÃ§os", "Serviços"),
        ("Serviços complementares", "Serviços complementares"),
        ("CiberseguranÃ§a para PMEs", "Segurança web para empresas"),
        ("Blog especializado em ciberseguranÃ§a para PMEs", "Conteúdo para empresas que precisam comprovar segurança web"),
        ("Inscrever-se na Newsletter", "Solicitar avaliação"),
        ("Pentest & Vulnerabilidades", "Pentest e vulnerabilidades"),
        (
            "Provimento 213 do CNJ: o que muda para cartÃ³rios",
            "Provimento 213 do CNJ: o que muda para cartórios",
        ),
        (
            '<a href="index.html" class="post-category">Pentest &amp; Vulnerabilidades</a>',
            '<a href="index.html" class="post-category">PenTest e vulnerabilidades</a>',
        ),
        (
            '<a href="index.html" class="post-category">Pentest &amp; Vulnerabilidades</a>',
            '<a href="index.html" class="post-category">Regulatório e cartórios</a>',
            "provimento-213-cnj-cartorios-seguranca-informacao.html",
        ),
    ]

    for item in patches:
        if len(item) == 3:
            old, new, only = item
            if filename != only:
                continue
            content = content.replace(old, new)
        else:
            old, new = item
            content = content.replace(old, new)

    if filename == "pentest-teste-de-invasao-empresas.html":
        insert = (
            "<p>Antes de um PenTest completo, o <strong>AB Scan</strong> ajuda sua empresa a "
            "avaliar o domínio autorizado, organizar evidências iniciais e decidir se a "
            "validação manual faz sentido.</p>\n\n            "
        )
        marker = "<h2>O que é pentest?</h2>"
        if insert not in content and marker in content:
            content = content.replace(marker, insert + marker)

    if filename == "vulnerabilidades-web-aplicacoes-api.html":
        content = re.sub(
            r"<div class=\"cta-box\">.*?</div>",
            """<div class="cta-box">
                <h3>Comece com uma avaliação do domínio</h3>
                <p>O AB Scan ajuda sua empresa a identificar riscos em sites e APIs expostas com relatório profissional para priorizar correções.</p>
                <a href="../index.html#contato" class="btn btn-secondary">
                    <i class="fas fa-shield-alt"></i>
                    Solicitar avaliação
                </a>
            </div>""",
            content,
            count=1,
            flags=re.S,
        )

    if filename == "ataques-supply-chain-fornecedores.html":
        content = re.sub(
            r"<div class=\"cta-box\">.*?</div>",
            """<div class="cta-box">
                <h3>Responda exigências com relatório profissional</h3>
                <p>Use o AB Scan para organizar evidências de segurança web e apoiar homologação de fornecedores e contratos.</p>
                <a href="../index.html#contato" class="btn btn-secondary">
                    <i class="fas fa-shield-alt"></i>
                    Solicitar avaliação
                </a>
            </div>""",
            content,
            count=1,
            flags=re.S,
        )

    if filename == "provimento-213-cnj-cartorios-seguranca-informacao.html":
        content = re.sub(
            r"<div class=\"cta-box\">.*?</div>",
            """<div class="cta-box">
                <h3>Organize evidências para correição e auditoria</h3>
                <p>A ABREU & BRUM apoia cartórios na avaliação de segurança web e na preparação de evidências técnicas exigidas pelo Provimento 213.</p>
                <a href="../index.html#contato" class="btn btn-secondary">
                    <i class="fas fa-shield-alt"></i>
                    Solicitar avaliação
                </a>
            </div>""",
            content,
            count=1,
            flags=re.S,
        )

    if filename == "index.html":
        content = re.sub(
            r"<section class=\"newsletter\">.*?</section>\s*",
            """<section class="newsletter">
        <div class="container">
            <div class="newsletter-content">
                <h2>Precisa comprovar segurança para um cliente ou contrato?</h2>
                <p>Fale com a ABREU & BRUM e veja se o AB Scan atende sua necessidade ou se o próximo passo é um PenTest manual.</p>
                <a href="../index.html#contato" class="btn btn-primary">Solicitar avaliação</a>
            </div>
        </div>
    </section>
    """,
            content,
            count=1,
            flags=re.S,
        )
        content = content.replace(
            "<h1>Blog ABREU & BRUM</h1>",
            "<h1>Blog ABREU & BRUM</h1>",
        )
        content = re.sub(
            r"<p class=\"blog-hero-subtitle\">.*?</p>",
            '<p class="blog-hero-subtitle">Insights sobre segurança web, evidências para contratos e o caminho entre AB Scan e PenTest manual.</p>',
            content,
            count=1,
        )

    content = content.replace("zero-trust.html", "index.html")
    content = content.replace("supply-chain.html", "ataques-supply-chain-fornecedores.html")

    return content


def write_stub(path: Path, target: str) -> None:
    path.write_text(
        f"""<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url={target}">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="https://abreuebrum.com.br/blog/{target}">
    <title>Redirecionando | Blog ABREU & BRUM</title>
    <script>window.location.replace("{target}");</script>
</head>
<body>
    <p>Redirecionando para <a href="{target}">{target}</a>.</p>
</body>
</html>
""",
        encoding="utf-8",
    )


def process_html(path: Path) -> None:
    name = path.name
    if name in STUB_REDIRECT:
        write_stub(path, STUB_REDIRECT[name])
        print(f"stub redirect {path}")
        return

    content = path.read_text(encoding="utf-8")
    content = fix_mojibake(content)
    content = apply_copy_patches(content, name)
    content = replace_header_footer(content, is_index=(name == "index.html"))

    if name in META_UPDATES:
        meta = META_UPDATES[name]
        content = set_title(content, meta["title"])
        content = set_meta(content, "description", meta["description"])
        content = set_meta(content, "og:title", meta.get("og_title", meta["title"]), "property")
        content = set_meta(content, "og:description", meta["description"], "property")
        content = set_meta(content, "twitter:title", meta.get("og_title", meta["title"]), "property")
        content = set_meta(content, "twitter:description", meta["description"], "property")

    path.write_text(content, encoding="utf-8")
    print(f"updated {path}")


def process_text_file(path: Path) -> None:
    content = path.read_text(encoding="utf-8")
    fixed = fix_mojibake(content)
    if fixed != content:
        path.write_text(fixed, encoding="utf-8")
        print(f"fixed encoding {path}")


def main() -> None:
    blog_dir = BLOG / "blog"
    for html in sorted(blog_dir.glob("*.html")):
        process_html(html)

    for rel in [
        "blog/js/main.js",
        "blog/js/checklist-cnj-interativo.js",
        "blog/css/style.css",
        "blog/README.md",
    ]:
        process_text_file(BLOG / rel)

    sitemap = BLOG / "sitemap.xml"
    xml = sitemap.read_text(encoding="utf-8")
    entries = [
        "https://abreuebrum.com.br/blog/ataques-supply-chain-fornecedores.html",
        "https://abreuebrum.com.br/blog/provimento-213-cnj-cartorios-seguranca-informacao.html",
    ]
    for url in entries:
        if url not in xml:
            block = f"""    <url>
        <loc>{url}</loc>
        <lastmod>2026-07-08</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
"""
            xml = xml.replace("</urlset>", block + "</urlset>")
    sitemap.write_text(xml, encoding="utf-8")
    print("updated sitemap.xml")


if __name__ == "__main__":
    main()
