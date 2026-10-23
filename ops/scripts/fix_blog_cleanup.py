#!/usr/bin/env python3
"""Final blog cleanup: dedupe scripts, newsletter CTA, footer Blog link, pentest AB Scan."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BLOG = ROOT / "app/web/blog"

SCRIPT_BLOCK = """    <script src="../js/config.js"></script>
    <script src="../js/lead-tracking.js"></script>
    <script src="../js/analytics.js"></script>
    <script src="js/main.js"></script>
"""

NEWSLETTER_OLD = """    <!-- Newsletter -->
    <section class="blog-newsletter">
        <div class="container">
            <div class="newsletter-content">
                <h2>Fique por dentro das novidades</h2>
                <p>Receba dicas exclusivas de cibersegurança, atualizações sobre LGPD e insights do mercado. Sem spam, apenas conteúdo de valor.</p>
                <form class="newsletter-form">
                    <input type="email" placeholder="Seu melhor e-mail" required>
                    <button type="submit" class="btn btn-secondary">
                        <i class="fas fa-paper-plane"></i>
                        Inscrever-se
                    </button>
                </form>
            </div>
        </div>
    </section>"""

NEWSLETTER_NEW = """    <section class="blog-newsletter">
        <div class="container">
            <div class="newsletter-content">
                <h2>Precisa comprovar segurança web?</h2>
                <p>Comece com uma avaliação do domínio com o AB Scan e receba um relatório profissional para contratos, fornecedores e decisões técnicas.</p>
                <a href="../index.html#contato" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i>
                    Solicitar avaliação
                </a>
            </div>
        </div>
    </section>"""

PENTEST_AB_SCAN = """            <p>Antes de um pentest completo, muitas empresas começam com o <a href="../index.html#ab-scan">AB Scan</a> para mapear exposição do domínio, priorizar riscos e decidir se um teste manual faz sentido no momento.</p>

            <h2>Conclusão</h2>"""

FOOTER_BLOG_LINK = """                    <a href="../servicos/">Serviços complementares</a>
                </div>"""

FOOTER_BLOG_LINK_NEW = """                    <a href="../servicos/">Serviços complementares</a>
                    <a href="index.html">Blog</a>
                </div>"""


def dedupe_scripts(text: str) -> str:
    text = re.sub(
        r"\s*<script src=\"\.\./js/config\.js\"></script>\s*"
        r"<script src=\"\.\./js/lead-tracking\.js\"></script>\s*"
        r"<script src=\"\.\./js/analytics\.js\"></script>\s*"
        r"<script src=\"js/main\.js\"></script>\s*",
        "",
        text,
        flags=re.S,
    )
    return text.replace("</body>", f"{SCRIPT_BLOCK}</body>")


def main() -> None:
    for path in BLOG.glob("*.html"):
        if path.name in ("zero-trust.html", "supply-chain.html"):
            continue
        text = path.read_text(encoding="utf-8")
        original = text
        text = dedupe_scripts(text)
        if FOOTER_BLOG_LINK in text and "footer-services" in text:
            text = text.replace(FOOTER_BLOG_LINK, FOOTER_BLOG_LINK_NEW, 1)
        if path.name == "index.html":
            text = text.replace(NEWSLETTER_OLD, NEWSLETTER_NEW)
        if path.name == "pentest-teste-de-invasao-empresas.html":
            if "Antes de um pentest completo" not in text:
                text = text.replace(
                    "            <h2>Conclusão</h2>",
                    PENTEST_AB_SCAN,
                    1,
                )
        if text != original:
            path.write_text(text, encoding="utf-8")
            print(f"cleaned {path}")


if __name__ == "__main__":
    main()
