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


def build_css():
    page = (SITE_DIR / "page.css").read_text(encoding="utf-8")
    stamp_end = page.index("*/") + 2 if page.startswith("/*") else 0
    rest = re.sub(r'@import url\("\./(tokens|base)\.css"\);\s*', "", page[stamp_end:])
    css = (page[:stamp_end] + "\n" + (SITE_DIR / "tokens.css").read_text(encoding="utf-8")
           + "\n" + (SITE_DIR / "base.css").read_text(encoding="utf-8") + "\n" + rest)

    # Fonts are served as files from /fonts/ (cached once for every page), not inlined.
    pathlib.Path("fonts").mkdir(exist_ok=True)

    def font(m):
        src = SITE_DIR / m.group(1)
        (pathlib.Path("fonts") / src.name).write_bytes(src.read_bytes())
        return f'url("/fonts/{src.name}")'

    return re.sub(r'url\("\./(fonts/[^"]+)"\)', font, css)


LINK = '<link rel="stylesheet" href="./page.css">'


def bundle(name="index.html"):
    css = build_css()
    src = (SITE_DIR / name).read_text(encoding="utf-8")
    assert LINK in src, f"site/{name} must link ./page.css"
    out = src.replace(LINK, "<style>\n" + css + "</style>")
    assert "./fonts/" not in out
    pathlib.Path(name).write_text(out, encoding="utf-8", newline="\n")
    return src


def sitemap(posts=()):
    today = datetime.date.today().isoformat()
    urls = [(f"{SITE}/", today, "1.0"), (f"{SITE}/india", today, "0.8")]
    if posts:
        urls.append((f"{SITE}/blog", max(p["updated"] for p in posts), "0.7"))
        urls += [(f"{SITE}/blog/{p['slug']}", p["updated"], "0.8") for p in posts]
    body = "".join(f"  <url>\n    <loc>{u}</loc>\n    <lastmod>{d}</lastmod>\n    <priority>{pr}</priority>\n  </url>\n" for u, d, pr in urls)
    pathlib.Path("sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + "</urlset>\n",
        encoding="utf-8", newline="\n")


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


def llms_full(src, posts=()):
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
    for p in posts:
        body += ["", "", f"# {p['title']}", "", f"URL: {SITE}/blog/{p['slug']}", f"Updated: {p['updated']}", "", p["answer"], "", p["md"].strip()]
    pathlib.Path("llms-full.txt").write_text("\n".join(head + body).strip() + "\n", encoding="utf-8", newline="\n")


from build_blog import build_blog, llms_guides  # noqa: E402  (site/blog/*.md -> /blog pages)

if __name__ == "__main__":
    src = bundle()
    bundle("404.html")
    if (SITE_DIR / "india.html").exists():
        bundle("india.html")
        print("india.html written")
    print(f"404.html written ({pathlib.Path('404.html').stat().st_size:,d} bytes)")
    print(f"index.html written ({pathlib.Path('index.html').stat().st_size:,d} bytes)")
    posts = build_blog(build_css(), SITE_DIR, SITE)
    print(f"blog: {len(posts)} post(s) written")
    llms_guides(posts, SITE)
    sitemap(posts)
    print("sitemap.xml written")
    llms_full(src, posts)
    print(f"llms-full.txt written ({pathlib.Path('llms-full.txt').stat().st_size:,d} bytes)")
