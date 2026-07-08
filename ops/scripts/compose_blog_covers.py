#!/usr/bin/env python3
"""Compose blog cover images on the official ABREU & BRUM 16:9 template."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
TEMPLATE = ROOT / "app/web/images/brand/templates/abreu_brum_template_16x9.png"
OUT_DIR = ROOT / "app/web/images/blog"

COVERS = {
    "pentest-teste-de-invasao-empresas.png": "PenTest manual",
    "vulnerabilidades-web-aplicacoes-api.png": "Vulnerabilidades web",
    "ataques-supply-chain-fornecedores.png": "Supply chain",
    "provimento-213-cnj-cartorios-seguranca-informacao.png": "Provimento 213 CNJ",
}


def load_font(size: int, bold: bool = True) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def wrap_text(text: str, font: ImageFont.ImageFont, max_width: int, draw: ImageDraw.ImageDraw) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current: list[str] = []
    for word in words:
        trial = " ".join(current + [word]) if current else word
        if draw.textlength(trial, font=font) <= max_width:
            current.append(word)
        else:
            if current:
                lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return lines or [text]


def compose_cover(title: str, output_path: Path, template_path: Path) -> None:
    base = Image.open(template_path).convert("RGBA")
    draw = ImageDraw.Draw(base)
    title_font = load_font(86, bold=True)

    max_width = int(base.width * 0.52)
    x = int(base.width * 0.055)
    y = int(base.height * 0.36)
    line_height = 98

    for line in wrap_text(title, title_font, max_width, draw):
        draw.text((x, y), line, fill=(255, 255, 255, 255), font=title_font)
        y += line_height

    output_path.parent.mkdir(parents=True, exist_ok=True)
    base.convert("RGB").save(output_path, format="PNG", optimize=True)
    print(f"wrote {output_path}")


def main() -> None:
    if not TEMPLATE.exists():
        raise SystemExit(f"Template not found: {TEMPLATE}")

    for filename, title in COVERS.items():
        compose_cover(title, OUT_DIR / filename, TEMPLATE)


if __name__ == "__main__":
    main()
