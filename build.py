#!/usr/bin/env python3
"""Assemble the BoredMutant static site from src/ into self-contained HTML pages.

Run:  python3 build.py
Output: index.html, how-it-works.html, security.html, about.html, sitemap.xml, llms-full.txt
"""
import html as html_mod
import json, pathlib, re

SRC = pathlib.Path("src")
OUT = pathlib.Path(".")
SITE = "https://www.boredmutant.com"
TODAY = "2026-11-06"

CSS = (SRC / "base.css").read_text(encoding="utf-8")
HEADER = (SRC / "header.html").read_text(encoding="utf-8")
FOOTER = (SRC / "footer.html").read_text(encoding="utf-8")
NAV_JS = (SRC / "nav.js").read_text(encoding="utf-8").strip()  # mobile menu, every page

ORG = {
    "@type": "Organization",
    "@id": f"{SITE}/#org",
    "name": "BoredMutant",
    "alternateName": "Bored Mutant",
    "url": f"{SITE}/",
    "logo": f"{SITE}/logo.png",
    "image": f"{SITE}/og-image.png",
    "foundingDate": "2025",
    "description": ("BoredMutant is a technology company registered in India, based in Hyderabad. "
                    "It builds department software, workflow automations, AI agents and company "
                    "brains for firms of 50 to 500 people, on top of the systems they already run, "
                    "with a person approving every agent output."),
    "areaServed": [{"@type": "Country", "name": "United States"}, {"@type": "Country", "name": "United Kingdom"}, {"@type": "Country", "name": "India"}],
    # Booking URL rather than an email address in schema: the contact email lives on the
    # About page; schema keeps the bookable action.
    "contactPoint": {"@type": "ContactPoint", "contactType": "sales",
                     "url": "https://cal.com/boredmutant/automations",
                     "availableLanguage": "English"},
}

def crumbs(items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u}
        for i, (n, u) in enumerate(items)]}

# Pull the FAQ straight out of the page body so the schema can never drift from the
# copy a visitor reads. Google rejects FAQPage markup that disagrees with the page.
FAQ_RE = re.compile(
    r"<details>\s*<summary>(.*?)</summary>\s*<p class=\"ans\">(.*?)</p>\s*</details>", re.S)

def _plain(s):
    return " ".join(html_mod.unescape(re.sub(r"<[^>]+>", "", s)).split())

def faq_schema(body, canonical):
    pairs = FAQ_RE.findall(body)
    if not pairs:
        return None
    return {"@type": "FAQPage", "@id": canonical + "#faq",
            "mainEntity": [{"@type": "Question", "name": _plain(q),
                            "acceptedAnswer": {"@type": "Answer", "text": _plain(a)}}
                           for q, a in pairs]}

SERVICE = {"@type": "Service", "@id": f"{SITE}/#service", "name": "Custom software and AI agents",
           "provider": {"@id": f"{SITE}/#org"},
           "serviceType": "Custom software, workflow automation, AI agents and company knowledge systems",
           "description": ("Department software, workflow automations, AI agents and company brains built on top of a "
                           "firm's existing systems. Every engagement starts with a two-week Workflow Sprint."),
           "offers": {"@type": "Offer", "name": "Workflow Sprint", "price": "1500", "priceCurrency": "USD",
                      "description": "Two weeks: map one workflow or department and build a working prototype on your data."}}
WEBSITE = {"@type": "WebSite", "@id": f"{SITE}/#website", "url": f"{SITE}/", "name": "BoredMutant",
           "publisher": {"@id": f"{SITE}/#org"}, "inLanguage": "en"}

PAGES = [
    dict(
        out="index.html", body="home.body.html", js="home.js", path="/",
        nav=None, priority="1.0",
        title="BoredMutant | Custom software, automations and AI agents for mid-sized firms",
        desc=("BoredMutant builds department software, workflow automations, AI agents and a company brain for "
              "firms of 50 to 500 people, on top of the systems they already run. Start with a two-week "
              "Workflow Sprint from $1,500."),
        og_title="The software team your company never got around to hiring",
        og_desc=("Department software, automations, AI agents and a company brain, built on your existing "
                 "systems. A person approves every agent output."),
        graph=[ORG, SERVICE, WEBSITE,
               {"@type": "WebPage", "url": f"{SITE}/", "name": "BoredMutant",
                "isPartOf": {"@id": f"{SITE}/#website"}, "about": {"@id": f"{SITE}/#org"}}],
    ),
    dict(
        out="how-it-works.html", body="how.body.html", js=None, path="/how-it-works",
        nav="HOW", priority="0.9",
        title="How an engagement works | BoredMutant",
        desc=("A two-week Workflow Sprint from $1,500, a fixed-price build, then monthly running and "
              "improvement. What happens in each step and what we need from you."),
        og_title="How an engagement with BoredMutant works",
        og_desc="Sprint, build, run: a working prototype on your data before you commit to a build.",
        graph=[crumbs([("Home", "/"), ("How it works", "/how-it-works")]),
               {"@type": "WebPage", "url": f"{SITE}/how-it-works", "name": "How an engagement works",
                "isPartOf": {"@id": f"{SITE}/#website"}, "about": {"@id": f"{SITE}/#service"}}],
    ),
    dict(
        out="security.html", body="security.body.html", js=None, path="/security",
        nav="SEC", priority="0.8",
        title="Security and data handling | BoredMutant",
        desc=("How BoredMutant handles access, data and models: agreements first, least-privilege "
              "credentials, no training on your data, human approval and full logging."),
        og_title="How BoredMutant handles your data and access",
        og_desc="Agreements first, least access, no training on your data, and a person approves every output.",
        graph=[crumbs([("Home", "/"), ("Security", "/security")]),
               {"@type": "WebPage", "url": f"{SITE}/security", "name": "Security and data handling",
                "isPartOf": {"@id": f"{SITE}/#website"}, "about": {"@id": f"{SITE}/#org"}}],
    ),
    dict(
        out="about.html", body="abt.body.html", js=None, path="/about",
        nav="ABT", priority="0.7",
        title="About BoredMutant",
        desc=("BoredMutant is a founder-led studio in Hyderabad, India, building custom software, "
              "automations, AI agents and company brains for firms of 50 to 500 people."),
        og_title="About BoredMutant",
        og_desc="A founder-led studio building the software teams mid-sized firms don't have.",
        graph=[crumbs([("Home", "/"), ("About", "/about")]),
               {"@type": "WebPage", "url": f"{SITE}/about", "name": "About BoredMutant",
                "isPartOf": {"@id": f"{SITE}/#website"}, "about": {"@id": f"{SITE}/#org"}}],
    ),
]

DEMOS = json.loads((SRC / "demos.json").read_text(encoding="utf-8"))

def _e(t):
    return html_mod.escape(t, quote=True)

def demo_static():
    """Server-render the first demo in its finished state, so the desk reads without JS."""
    tabs = "".join(
        f'<button class="demo-tab" type="button" role="tab" id="tab-{d["id"]}" aria-controls="demo-panel" '
        f'aria-selected="{"true" if i == 0 else "false"}" tabindex="{0 if i == 0 else -1}">{_e(d["tab"])}</button>'
        for i, d in enumerate(DEMOS))
    d = DEMOS[0]
    srcs = []
    for sblock in d["sources"]:
        kind = re.sub(r"[^a-z]+", "-", sblock["kind"].lower()).strip("-")
        meta = "".join(f"<div><dt>{_e(k)}</dt><dd>{_e(v)}</dd></div>" for k, v in sblock["meta"])
        paras = ""
        for para in sblock["paras"]:
            parts = "".join(_e(seg) if isinstance(seg, str)
                            else f'<span class="src" data-id="{seg[0]}">{_e(seg[1])}</span>' for seg in para)
            paras += f"<p>{parts}</p>"
        srcs.append(f'<article class="doc doc--{kind}"><div class="doc-head"><span class="doc-kind">{_e(sblock["kind"])}</span>'
                    f'<dl class="doc-meta">{meta}</dl></div><div class="doc-body">{paras}</div></article>')
    dr = d["draft"]
    fields = ""
    for f in dr["fields"]:
        note = f'<span class="note">{_e(f["note"])}</span>' if f.get("note") else ""
        attr = f' data-src="{" ".join(f["src"])}" tabindex="0"' if f["src"] else ""
        fields += (f'<div class="field"{attr}><dt>{_e(f["label"])}</dt><dd><span class="bar"></span>'
                   f'<span class="val">{_e(f["value"])}{note}</span></dd></div>')
    fattr = f' data-src="{" ".join(dr["flag"]["src"])}"' if dr["flag"]["src"] else ""
    draft = (f'<section class="draft" aria-label="{_e(dr["title"])}"><div class="draft-head">'
             f'<span class="draft-title">{_e(dr["title"])}</span><span class="draft-where">{_e(dr["where"])}</span></div>'
             f'<dl class="fields">{fields}</dl><div class="flag"{fattr}><strong>{_e(dr["flag"]["title"])}</strong>'
             f'{_e(dr["flag"]["text"])}</div><span class="stamp" aria-hidden="true">Approved</span></section>')
    stage = f'<div class="sources">{"".join(srcs)}</div>{draft}'
    return {"{{DEMO_TABS}}": tabs, "{{DEMO_STAGE}}": stage,
            "{{DEMO_STATUS}}": _e("Waiting for approval from " + dr["approver"]),
            "{{DEMO_ACTION}}": _e(dr["action"])}

TPL = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<title>{title}</title>
<meta name="description" content="{desc}" />

<link rel="canonical" href="{canonical}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
<meta name="theme-color" content="#f4f5f1" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="BoredMutant" />
<meta property="og:url" content="{canonical}" />
<meta property="og:title" content="{og_title}" />
<meta property="og:description" content="{og_desc}" />
<meta property="og:image" content="{site}/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="BoredMutant website preview" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{og_title}" />
<meta name="twitter:description" content="{og_desc}" />
<meta name="twitter:image" content="{site}/og-image.png" />

<!-- The favicon was previously the 330x47 wordmark. Google requires a square icon and
     silently drops non-square ones, which is why search results showed no icon at all.
     favicon.ico at the root is the fallback Google and browsers request by default. -->
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
<link rel="manifest" href="/site.webmanifest" />
<link rel="preload" href="/fonts/archivo-latin-var.woff2" as="font" type="font/woff2" crossorigin />

<script type="application/ld+json">
{jsonld}
</script>

<style>
{css}
</style>

<!-- The hamburger needs JS to open. Without JS, hide it; the footer carries every link. -->
<noscript><style>.navtoggle{{display:none!important}}</style></noscript>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

{header}
<main id="main">
<div id="top"></div>
{body}
</main>

{footer}

<script>
{nav_js}
{js}
</script>
</body>
</html>
"""

def render(p):
    header = HEADER
    for key, token in (("HOW", "__NAV_HOW__"), ("SEC", "__NAV_SEC__"), ("ABT", "__NAV_ABT__")):
        header = header.replace(token, ' aria-current="page"' if p["nav"] == key else "")
    canonical = SITE + "/" if p["path"] == "/" else SITE + p["path"]
    body = (SRC / p["body"]).read_text(encoding="utf-8").strip()
    js = ""
    if p["out"] == "index.html":
        for k, v in demo_static().items():
            body = body.replace(k, v)
        js = "var DEMOS = " + json.dumps(DEMOS, ensure_ascii=False).replace("</", "<\\/") + ";\n"
    if p["js"]:
        js += (SRC / p["js"]).read_text(encoding="utf-8").strip()
    graph = list(p["graph"])
    faq = faq_schema(body, canonical)
    if faq:
        graph.append(faq)
    jsonld = json.dumps({"@context": "https://schema.org", "@graph": graph}, indent=2)
    html = TPL.format(
        title=p["title"], desc=p["desc"], canonical=canonical, site=SITE,
        og_title=p["og_title"], og_desc=p["og_desc"], jsonld=jsonld, css=CSS,
        header=header, footer=FOOTER, nav_js=NAV_JS, body=body,
        js=js,
    )
    # newline="\n" so a build on Windows does not rewrite every line with CRLF
    # and turn a one-word copy edit into a whole-file diff.
    (OUT / p["out"]).write_text(html, encoding="utf-8", newline="\n")
    return len(html)

def sitemap():
    urls = "".join(
        f"  <url>\n    <loc>{SITE + '/' if p['path'] == '/' else SITE + p['path']}</loc>\n"
        f"    <lastmod>{TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n"
        f"    <priority>{p['priority']}</priority>\n  </url>\n" for p in PAGES)
    (OUT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n",
        encoding="utf-8", newline="\n")

def llms_full():
    """Every page's body copy as plain markdown.

    AI crawlers ingest this far more reliably than they parse HTML, and it is
    generated from the same partials as the pages so the two cannot disagree.
    """
    out = ["# BoredMutant, full site content",
           "",
           "> BoredMutant builds department software, workflow automations, AI agents and company "
           "brains for firms of 50 to 500 people, on top of the systems they already run. Based in "
           "Hyderabad, India; works with firms in the US, UK and India.",
           "",
           f"Canonical: {SITE}/",
           "Booking: https://cal.com/boredmutant/automations",
           ""]
    for p in PAGES:
        url = SITE + "/" if p["path"] == "/" else SITE + p["path"]
        body = (SRC / p["body"]).read_text(encoding="utf-8")
        out += ["", "---", "", f"## {p['title'].split(' | ')[0]}", "", f"URL: {url}", ""]
        # <details> renders as one run-on line once tags are stripped, so pull the
        # FAQ out first and re-emit it as explicit Q/A pairs.
        for q, a in FAQ_RE.findall(body):
            out.append(f"**Q: {_plain(q)}**\n\nA: {_plain(a)}\n")
        body = FAQ_RE.sub("", body)
        for chunk in re.split(r"(?=<h[123])", body):
            text = _plain(chunk)
            if text:
                out.append(text + "\n")
    (OUT / "llms-full.txt").write_text("\n".join(out).rstrip() + "\n",
                                       encoding="utf-8", newline="\n")

if __name__ == "__main__":
    for p in PAGES:
        print(f"{p['out']:52s} {render(p):>7,d} bytes")
    sitemap()
    print("sitemap.xml written")
    llms_full()
    print(f"llms-full.txt written ({(OUT / 'llms-full.txt').stat().st_size:,d} bytes)")
