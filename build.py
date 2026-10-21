#!/usr/bin/env python3
"""Stitch src/layout.html + src/sections/*.html into index.html.

Edit a section in src/sections/, then run:   python3 build.py
Reorder, add or remove sections by editing the lists below.
"""
from pathlib import Path

ROOT = Path(__file__).parent
SECTIONS = ROOT / "src" / "sections"

# Order on the page. Each name is a file in src/sections/ (without .html).
HEADER = ["header"]
MAIN = [
    "hero",
    "different-kind",
    "experience",
    "included",
    "how-it-works",
    "lifestyle",
    "coach",
    "pricing",
    "faq",
    "enroll",
]
FOOTER = ["closing", "mobile-cta"]


def load(names):
    parts = []
    for name in names:
        path = SECTIONS / f"{name}.html"
        if not path.exists():
            raise SystemExit(f"Missing section file: {path}")
        parts.append(path.read_text(encoding="utf-8").strip())
    return "\n\n".join(parts)


def main():
    layout = (ROOT / "src" / "layout.html").read_text(encoding="utf-8")
    html = (
        layout.replace("<!-- @header -->", load(HEADER))
        .replace("<!-- @main -->", load(MAIN))
        .replace("<!-- @footer -->", load(FOOTER))
    )
    banner = "<!-- Built by build.py from src/ — edit the files in src/sections/, not this file. -->"
    html = html.replace("<!doctype html>", "<!doctype html>\n" + banner, 1)
    (ROOT / "index.html").write_text(html, encoding="utf-8")
    print(f"Built index.html from {len(HEADER) + len(MAIN) + len(FOOTER)} sections.")


if __name__ == "__main__":
    main()
