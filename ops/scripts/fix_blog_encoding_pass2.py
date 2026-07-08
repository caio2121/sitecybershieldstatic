#!/usr/bin/env python3
"""Second pass: fix mixed mojibake line-by-line and remove duplicate shell blocks."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BLOG = ROOT / "app/web/blog"


def fix_line(line: str) -> str:
    if "Ã" not in line and "â€" not in line and "Â" not in line and "ðŸ" not in line:
        return line
    try:
        fixed = line.encode("latin-1").decode("utf-8")
    except (UnicodeDecodeError, UnicodeEncodeError):
        return line
    replacements = {
        "â€”": ",",
        "â€“": ",",
        "nÂº": "nº",
        "Âº": "º",
        " ,": ",",
    }
    for old, new in replacements.items():
        fixed = fixed.replace(old, new)
    return fixed


def fix_content(text: str) -> str:
    lines = [fix_line(line) for line in text.splitlines(keepends=True)]
    text = "".join(lines)

    # dedupe shell blocks
    text = re.sub(
        r'(\s*<a href="#main-content" class="skip-link">.*?</a>\s*){2,}',
        r'\n    <a href="#main-content" class="skip-link">Pular para o conteúdo</a>\n\n',
        text,
        flags=re.S,
    )
    text = re.sub(
        r'(\s*<div class="floating-cta">.*?</div>\s*){2,}',
        lambda m: m.group(0).split("</div>")[0] + "</div>\n\n",
        text,
        count=1,
        flags=re.S,
    )
    # simpler dedupe for floating cta
    seen = 0
    out = []
    i = 0
    while i < len(text):
        if text.startswith('<div class="floating-cta">', i):
            if seen:
                end = text.find("</div>", i) + len("</div>")
                i = end
                while i < len(text) and text[i] in "\r\n":
                    i += 1
                continue
            seen += 1
        out.append(text[i])
        i += 1
    text = "".join(out)

    text = text.replace(
        "<p>Insights e dicas práticas sobre cibersegurança para PMEs. Conteúdo especializado em LGPD, pentest, vulnerabilidades web e muito mais.</p>",
        '<p class="blog-hero-subtitle">Insights sobre segurança web, evidências para contratos e o caminho entre AB Scan e PenTest manual.</p>',
    )
    text = text.replace(
        "<p>Insights e dicas prÃ¡ticas sobre ciberseguranÃ§a para PMEs. ConteÃºdo especializado em LGPD, pentest, vulnerabilidades web e muito mais.</p>",
        '<p class="blog-hero-subtitle">Insights sobre segurança web, evidências para contratos e o caminho entre AB Scan e PenTest manual.</p>',
    )
    return text


def main() -> None:
    targets = list(BLOG.glob("*.html")) + [
        BLOG / "js/main.js",
        BLOG / "js/checklist-cnj-interativo.js",
        BLOG / "css/style.css",
        BLOG / "README.md",
    ]
    for path in targets:
        if not path.exists():
            continue
        original = path.read_text(encoding="utf-8")
        fixed = fix_content(original)
        if fixed != original:
            path.write_text(fixed, encoding="utf-8")
            print(f"fixed {path}")


if __name__ == "__main__":
    main()
