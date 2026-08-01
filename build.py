#!/usr/bin/env python3
"""Assemble the BoredMutant static site from src/ into self-contained HTML pages.

Run:  python3 build.py
Output: index.html, how-it-works.html, document-chasing-for-accounting-firms.html,
        document-chasing-for-staffing-agencies.html, sitemap.xml
"""
import html as html_mod
import json, pathlib, re

SRC = pathlib.Path("src")
OUT = pathlib.Path(".")
SITE = "https://www.boredmutant.com"
TODAY = "2026-08-01"

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
    "description": ("BoredMutant builds automated client document collection systems for CPA firms, "
                    "accounting firms and staffing agencies. Escalating email reminders sent from the "
                    "firm's own mailbox that stop the moment a document arrives, with no client "
                    "portal."),
    "areaServed": {"@type": "Country", "name": "United States"},
    # Booking URL rather than an email address: there is no monitored inbox, and
    # publishing a dead one in schema invites mail that nobody will ever read.
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

def service(name, desc, audience):
    return {"@type": "Service", "name": name, "serviceType": "Business process automation",
            "provider": {"@id": f"{SITE}/#org"},
            "areaServed": {"@type": "Country", "name": "United States"},
            "audience": {"@type": "BusinessAudience", "name": audience},
            "description": desc}

PAGES = [
    dict(
        out="index.html", body="home.body.html", js="home.js", path="/",
        nav=None, priority="1.0",
        title="Document collection for CPA and staffing firms | BoredMutant",
        desc=("Automated client document collection for CPA firms and staffing agencies. Escalating "
              "reminders from your own mailbox. No client portal to log into."),
        og_title="Client document collection, without the client portal",
        og_desc=("Escalating reminders that send from your firm's own mailbox and stop the second the "
                 "document arrives. For CPA firms and staffing agencies."),
        graph=[ORG,
               service("Automated document chasing",
                       ("An escalating email reminder system installed inside a firm's own mailbox. It "
                        "tracks which client owes which document, sends firm-approved reminder templates "
                        "on a set schedule, stops automatically when the document arrives, and hands the "
                        "thread to staff when a client replies with a question."),
                       "Accounting firms and staffing agencies") | {
                   "@id": f"{SITE}/#service",
                   "offers": {"@type": "Offer", "name": "Founding client build", "price": "990",
                              "priceCurrency": "USD",
                              "description": "One-time setup, then $250 per month. Month to month, cancel anytime."}},
               {"@type": "WebSite", "@id": f"{SITE}/#website", "url": f"{SITE}/", "name": "BoredMutant",
                "publisher": {"@id": f"{SITE}/#org"}, "inLanguage": "en-US"}],
    ),
    dict(
        out="how-it-works.html", body="how.body.html", js="how.js", path="/how-it-works",
        nav="HOW", priority="0.9",
        title="How automated document collection works | BoredMutant",
        desc=("A step-by-step walkthrough of the document collection workflow: the daily pass, the "
              "reply branches, the escalation templates and the Friday digest."),
        og_title="How automated document collection actually works",
        og_desc=("The whole workflow drawn out: the daily pass, the reply branches, the escalation "
                 "templates and the Friday digest."),
        graph=[crumbs([("Home", "/"), ("How it works", "/how-it-works")]),
               {"@type": "WebPage", "url": f"{SITE}/how-it-works",
                "name": "How the document chaser works",
                "description": "A step-by-step walkthrough of the automated document chasing workflow.",
                "isPartOf": {"@id": f"{SITE}/#website"}, "about": {"@id": f"{SITE}/#service"}}],
    ),
    dict(
        out="document-chasing-for-accounting-firms.html", body="acc.body.html", js="page.js",
        path="/document-chasing-for-accounting-firms", nav="ACC", priority="0.9",
        title="Client document collection for CPA firms | BoredMutant",
        desc=("Tax document collection for CPA firms and preparers: 1099s, K-1s, bank statements and "
              "signed 8879s, chased from your own mailbox."),
        og_title="Client document collection for CPA firms",
        og_desc=("Stop paying preparers to write 'just following up'. Automated collection of 1099s, "
                 "K-1s, bank statements and signed 8879s, all from your own mailbox."),
        graph=[crumbs([("Home", "/"), ("Accounting firms", "/document-chasing-for-accounting-firms")]),
               service("Document chasing for accounting firms",
                       ("Automated escalating email reminders for the source documents and signatures that "
                        "block tax preparation and filing: 1099s, K-1s, bank statements, prior-year "
                        "returns, signed 8879s and engagement letters, sent from the firm's own mailbox."),
                       "Accounting firms and tax preparers")],
    ),
    dict(
        out="document-chasing-for-staffing-agencies.html", body="stf.body.html", js="page.js",
        path="/document-chasing-for-staffing-agencies", nav="STF", priority="0.9",
        title="Document collection for staffing agencies | BoredMutant",
        desc=("Onboarding paperwork and I-9 collection for staffing agencies. Certifications, "
              "references and timesheets chased from your own mailbox."),
        og_title="Onboarding document collection for staffing agencies",
        og_desc=("I-9s, certifications, references and timesheets chased automatically from your own "
                 "mailbox, so start dates stop slipping."),
        graph=[crumbs([("Home", "/"), ("Staffing agencies", "/document-chasing-for-staffing-agencies")]),
               service("Document chasing for staffing agencies",
                       ("Automated escalating email reminders for onboarding and compliance paperwork: "
                        "I-9s, certifications, licenses, references, background check consent and weekly "
                        "timesheets, sent from the agency's own mailbox."),
                       "Staffing and recruitment agencies")],
    ),
    # NOTE: the About page is built but currently unpublished. See src/abt.body.html.
    # To bring it back, restore this entry, the nav link in src/header.html, the footer
    # link in src/footer.html, and "ABT" in the nav-token loop below.
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
<meta property="og:image:alt" content="Automated document chasing by BoredMutant" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{og_title}" />
<meta name="twitter:description" content="{og_desc}" />
<meta name="twitter:image" content="{site}/og-image.png" />

<link rel="icon" href="/logo-mark.svg" type="image/svg+xml" />
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
    for key, token in (("HOW", "__NAV_HOW__"), ("ACC", "__NAV_ACC__"), ("STF", "__NAV_STF__")):
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
    out = ["# BoredMutant, full site content",
           "",
           "> Automated client document collection for CPA firms and staffing agencies. "
           "Escalating reminders send from the firm's own mailbox and stop the moment the "
           "document arrives. No client portal, no new software for clients to learn.",
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
