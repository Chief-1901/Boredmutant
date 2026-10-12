#!/usr/bin/env python3
"""Assemble the BoredMutant static site from src/ into self-contained HTML pages.

Run:  python3 build.py
Output: index.html, how-it-works.html, about.html, sitemap.xml, llms-full.txt
"""
import html as html_mod
import json, pathlib, re

SRC = pathlib.Path("src")
OUT = pathlib.Path(".")
SITE = "https://www.boredmutant.com"
TODAY = "2026-10-12"

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
    "description": ("BoredMutant is a technology company registered in India, building Aham — "
                    "a WhatsApp-first agent transaction network that helps consumers discover "
                    "local services, compare structured offers from businesses, and book "
                    "appointments with explicit approval. Starting in Hyderabad."),
    "areaServed": {"@type": "Country", "name": "India"},
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

PAGES = [
    dict(
        out="index.html", body="home.body.html", js="home.js", path="/",
        nav=None, priority="1.0",
        title="Aham | WhatsApp-First Agent Transaction Network",
        desc=("Aham is an early-stage WhatsApp-first agent transaction network by BoredMutant: "
              "describe what you need in chat, compare structured offers from local businesses, "
              "approve, and book. Hyderabad first."),
        og_title="Aham: real-world services, arranged by agents",
        og_desc=("A WhatsApp-first agent transaction network in development, with clear offers, "
                 "explicit authorization and provider-confirmed bookings. Hyderabad first."),
        graph=[ORG | {
                   "description": ("BoredMutant is building Aham, a WhatsApp-first agent transaction "
                                  "network that helps consumers discover local services, compare "
                                  "structured business offers, and book appointments with explicit "
                                  "approval."),
                   "areaServed": [{"@type": "Country", "name": "India"},
                                  {"@type": "City", "name": "Hyderabad"}]},
               {"@type": "WebPage", "url": f"{SITE}/", "name": "Aham",
                "description": "An early-stage WhatsApp-first agent transaction network for discovering local services, comparing structured offers, and booking with explicit approval.",
                "isPartOf": {"@id": f"{SITE}/#website"}},
               {"@type": "WebSite", "@id": f"{SITE}/#website", "url": f"{SITE}/", "name": "BoredMutant",
                "publisher": {"@id": f"{SITE}/#org"}, "inLanguage": "en-IN"}],
    ),
    dict(
        out="how-it-works.html", body="how.body.html", js="page.js", path="/how-it-works",
        nav="HOW", priority="0.9",
        title="How Aham works | BoredMutant",
        desc=("How Aham arranges a booking: describe the need on WhatsApp, the orchestrator finds "
              "eligible businesses, business agents return structured offers, you approve, and the "
              "provider confirms the booking."),
        og_title="How Aham works",
        og_desc=("The booking flow step by step: request, discover, compare, approve, and a "
                 "provider-confirmed booking. Models interpret; deterministic software enforces."),
        graph=[crumbs([("Home", "/"), ("How it works", "/how-it-works")]),
               {"@type": "WebPage", "url": f"{SITE}/how-it-works",
                "name": "How Aham works",
                "description": "A step-by-step walkthrough of how Aham coordinates a service booking across consumer and business agents.",
                "isPartOf": {"@id": f"{SITE}/#website"}, "about": {"@id": f"{SITE}/#org"}}],
    ),
    dict(
        out="about.html", body="abt.body.html", js="page.js", path="/about",
        nav="ABT", priority="0.8",
        title="About BoredMutant | Building Aham",
        desc=("BoredMutant is a technology company registered in India, building Aham — a "
              "WhatsApp-first agent transaction network for local services, starting in Hyderabad."),
        og_title="About BoredMutant",
        og_desc=("A technology company registered in India, building Aham: a WhatsApp-first agent "
                 "transaction network for local services."),
        graph=[crumbs([("Home", "/"), ("About", "/about")]),
               {"@type": "WebPage", "url": f"{SITE}/about",
                "name": "About BoredMutant",
                "description": "BoredMutant is a technology company registered in India, building the Aham agent transaction network.",
                "isPartOf": {"@id": f"{SITE}/#website"}, "about": {"@id": f"{SITE}/#org"}}],
    ),
]

TPL = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />

<title>{title}</title>
<meta name="description" content="{desc}" />

<link rel="canonical" href="{canonical}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
<meta name="theme-color" content="#0f1113" />

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
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

<script type="application/ld+json">
{jsonld}
</script>

<style>
{css}
</style>

<!-- Scroll-reveal animations start at opacity:0 and are switched on by JS. Without this
     fallback, any crawler or reader that does not execute JS sees blank sections. -->
<noscript><style>
.card,.datecard,.pstep,.price,.out,.node,.tl,.tl-mark,.item,.checks li,.stat,.wfn,.callout,
.msg,.attach,.halt{{opacity:1!important;transform:none!important}}
.halt{{transform:none!important}}
/* The hamburger needs JS to open. With JS off, drop it and put the booking CTA back
   in the mobile header; the footer still carries the full set of page links. */
.navtoggle{{display:none!important}}
.nav-cta{{display:inline-flex!important}}
</style></noscript>
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
    for key, token in (("HOW", "__NAV_HOW__"), ("ABT", "__NAV_ABT__")):
        header = header.replace(token, ' aria-current="page"' if p["nav"] == key else "")
    canonical = SITE + "/" if p["path"] == "/" else SITE + p["path"]
    body = (SRC / p["body"]).read_text(encoding="utf-8").strip()
    graph = list(p["graph"])
    faq = faq_schema(body, canonical)
    if faq:
        graph.append(faq)
    jsonld = json.dumps({"@context": "https://schema.org", "@graph": graph}, indent=2)
    html = TPL.format(
        title=p["title"], desc=p["desc"], canonical=canonical, site=SITE,
        og_title=p["og_title"], og_desc=p["og_desc"], jsonld=jsonld, css=CSS,
        header=header, footer=FOOTER, nav_js=NAV_JS, body=body,
        js=(SRC / p["js"]).read_text(encoding="utf-8").strip(),
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
    out = ["# BoredMutant and Aham, full site content",
           "",
           "> Aham is an early-stage WhatsApp-first agent transaction network being built by "
           "BoredMutant. It is intended to connect consumer requests with participating businesses "
           "whose agents can return structured offers and coordinate bookings. The initial "
           "operational focus is Hyderabad, India.",
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
