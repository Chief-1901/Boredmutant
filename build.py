#!/usr/bin/env python3
"""Build boredmutant.com from site/ into one self-contained index.html.

Run:     python3 build.py
Output:  index.html, sitemap.xml, llms-full.txt

site/index.html links ./page.css, which imports tokens.css and base.css and
references fonts under site/fonts/. The build inlines all of it (fonts as
base64 woff2), so the published page needs no other request except the logo,
favicon and share image, which are served from the repo root.
"""
import base64, datetime, pathlib, re
from html.parser import HTMLParser

SITE_DIR = pathlib.Path("site")
SITE = "https://www.boredmutant.com"


def bundle(name="index.html"):
    page = (SITE_DIR / "page.css").read_text(encoding="utf-8")
    stamp_end = page.index("*/") + 2 if page.startswith("/*") else 0
    rest = re.sub(r'@import url\("\./(tokens|base)\.css"\);\s*', "", page[stamp_end:])
    css = (page[:stamp_end] + "\n" + (SITE_DIR / "tokens.css").read_text(encoding="utf-8")
           + "\n" + (SITE_DIR / "base.css").read_text(encoding="utf-8") + "\n" + rest)

    def font(m):
        data = (SITE_DIR / m.group(1)).read_bytes()
        return "url(data:font/woff2;base64," + base64.b64encode(data).decode() + ")"

    css = re.sub(r'url\("\./(fonts/[^"]+)"\)', font, css)
    src = (SITE_DIR / name).read_text(encoding="utf-8")
    link = '<link rel="stylesheet" href="./page.css">'
    assert link in src, "site/index.html must link ./page.css"
    out = src.replace(link, "<style>\n" + css + "</style>")
    assert "./fonts/" not in out
    pathlib.Path(name).write_text(out, encoding="utf-8", newline="\n")
    return src


def sitemap():
    today = datetime.date.today().isoformat()
    pathlib.Path("sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"  <url>\n    <loc>{SITE}/</loc>\n    <lastmod>{today}</lastmod>\n    <priority>1.0</priority>\n  </url>\n"
        "</urlset>\n", encoding="utf-8", newline="\n")


class _Text(HTMLParser):
    """Visible text of <main>, skipping scripts, styles and anything aria-hidden."""
    VOID = {"br", "img", "input", "meta", "link", "hr", "source"}
    BLOCK = {"h1", "h2", "h3", "p", "li", "dt", "dd", "summary", "legend", "label", "article"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.stack, self.hidden, self.on = [], [], 0, False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "main":
            self.on = True
        if tag in self.VOID:
            return
        hide = a.get("aria-hidden") == "true" or tag in ("script", "style")
        self.stack.append(hide)
        self.hidden += hide
        if self.on and not self.hidden and tag in self.BLOCK:
            self.out.append("\n\n## " if tag in ("h1", "h2") else "\n### " if tag == "h3" else "\n")
        elif self.on and not self.hidden and tag in ("span", "cite", "b", "a"):
            self.out.append(" ")

    def handle_endtag(self, tag):
        if tag == "main":
            self.on = False
        if tag in self.VOID or not self.stack:
            return
        self.hidden -= self.stack.pop()

    def handle_data(self, data):
        if self.on and not self.hidden:
            self.out.append(data)


def llms_full(src):
    """Plain-text copy of the page for AI crawlers, taken from the same source."""
    p = _Text()
    p.feed(src)
    lines = [re.sub(r"[ \t\r\f\v]+", " ", l).strip() for l in "".join(p.out).split("\n")]
    body, blank = [], False
    for l in lines:
        if l:
            body.append(l); blank = False
        elif not blank:
            body.append(""); blank = True
    head = ["# BoredMutant", "", f"Canonical URL: {SITE}/", "Book a call: https://cal.com/boredmutant/automations",
            "Email: pranith@boredmutant.com", ""]
    pathlib.Path("llms-full.txt").write_text("\n".join(head + body).strip() + "\n", encoding="utf-8", newline="\n")


if __name__ == "__main__":
    src = bundle()
    bundle("404.html")
    print(f"404.html written ({pathlib.Path('404.html').stat().st_size:,d} bytes)")
    print(f"index.html written ({pathlib.Path('index.html').stat().st_size:,d} bytes)")
    sitemap()
    print("sitemap.xml written")
    llms_full(src)
    print(f"llms-full.txt written ({pathlib.Path('llms-full.txt').stat().st_size:,d} bytes)")
