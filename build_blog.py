"""Blog pages for boredmutant.com, built from site/blog/*.md.

Each post is Markdown with a front-matter block:

    ---
    title: Shown as the H1
    seo_title: Optional <title> (defaults to title)
    description: Meta description, 140-160 characters
    date: 2026-11-10
    updated: 2026-11-10
    keywords: comma, separated
    answer: Two or three sentences that answer the post's main question (shown first, used by answer engines)
    ---

A "## Frequently asked questions" section with "### Question" headings becomes
FAQPage structured data. Posts whose date is in the future, or with
`draft: true`, are skipped. Output: blog.html and blog/<slug>.html (Vercel
cleanUrls serves them at /blog and /blog/<slug>).
"""
import datetime, html, json, math, pathlib, re

import markdown

CAL = "https://cal.com/boredmutant/automations"
AUTHOR = "Pranith"


def _front(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    assert m, "post must start with a --- front-matter block"
    meta = {}
    for line in m.group(1).splitlines():
        if line.strip():
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
    return meta, m.group(2)


def _faq(md_text):
    m = re.search(r"^## Frequently asked questions\s*$(.*?)(?=^## |\Z)", md_text, re.S | re.M)
    if not m:
        return []
    out = []
    for q, a in re.findall(r"^### (.+?)\s*$\n(.*?)(?=^### |\Z)", m.group(1), re.S | re.M):
        plain = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", " ".join(a.split()))
        plain = plain.replace("**", "")
        if plain:
            out.append({"@type": "Question", "name": q.strip(), "acceptedAnswer": {"@type": "Answer", "text": plain}})
    return out


def _chrome(site_dir):
    src = (site_dir / "index.html").read_text(encoding="utf-8")
    header = re.search(r'<header class="nav">.*?</header>', src, re.S).group(0)
    footer = re.search(r'<footer class="foot">.*?</footer>', src, re.S).group(0)
    fix = lambda s: re.sub(r'href="#', 'href="/#', s)
    return fix(header), fix(footer)


def _head(title, desc, url, og_title, jsonld, css, og_type="article", extra=""):
    e = html.escape
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta name="theme-color" content="#fafaf8">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="canonical" href="{url}">
<link rel="preload" href="/fonts/geist-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="BoredMutant">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{e(og_title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="https://www.boredmutant.com/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
{extra}<script type="application/ld+json">{json.dumps(jsonld, ensure_ascii=False, separators=(",", ":"))}</script>
<style>
{css}</style>
<script>document.documentElement.classList.add('js');</script>
<script>window.va = window.va || function () {{ (window.vaq = window.vaq || []).push(arguments); }};</script>
<script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
"""


TAIL = """
<script>
(() => {
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();
</script>
</body>
</html>
"""


def _nice(d):
    return datetime.date.fromisoformat(d).strftime("%B %-d, %Y")


def build_blog(css, site_dir, site):
    css = css + "\n" + (site_dir / "blog.css").read_text(encoding="utf-8")
    header, footer = _chrome(site_dir)
    today = datetime.date.today().isoformat()
    posts = []
    for f in sorted((site_dir / "blog").glob("*.md")):
        meta, body = _front(f.read_text(encoding="utf-8"))
        if meta.get("draft") == "true" or meta["date"] > today:
            continue
        md = markdown.Markdown(extensions=["tables", "toc", "sane_lists"], extension_configs={"toc": {"toc_depth": "2"}})
        content = md.convert(body)
        content = re.sub(r"(<table>.*?</table>)", r'<div class="tbl">\1</div>', content, flags=re.S)
        content = re.sub(r'<a href="(https?://[^"]+)"', r'<a href="\1" rel="noopener"', content)
        toc = [(t["id"], t["name"]) for t in md.toc_tokens if t["level"] == 2 and t["name"] not in ("Sources",)]
        words = len(re.sub(r"<[^>]+>", " ", content).split())
        p = dict(meta, slug=f.stem, md=body, html=content, toc=toc, minutes=max(1, math.ceil(words / 230)),
                 updated=meta.get("updated") or meta["date"], faq=_faq(body))
        posts.append(p)

    posts.sort(key=lambda p: p["date"], reverse=True)
    out_dir = pathlib.Path("blog")
    out_dir.mkdir(exist_ok=True)
    e = html.escape
    org = {"@id": f"{site}/#org"}

    for p in posts:
        url = f"{site}/blog/{p['slug']}"
        graph = [
            {"@type": "BlogPosting", "@id": f"{url}#post", "headline": p["title"], "description": p["description"],
             "datePublished": p["date"], "dateModified": p["updated"], "inLanguage": "en",
             "author": {"@type": "Person", "name": AUTHOR, "url": f"{site}/", "worksFor": org},
             "publisher": {"@type": "Organization", "@id": f"{site}/#org", "name": "BoredMutant", "logo": {"@type": "ImageObject", "url": f"{site}/logo.png"}},
             "mainEntityOfPage": url, "image": f"{site}/og-image.png",
             "keywords": p.get("keywords", ""), "abstract": p.get("answer", "")},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{site}/"},
                {"@type": "ListItem", "position": 2, "name": "Guides", "item": f"{site}/blog"},
                {"@type": "ListItem", "position": 3, "name": p["title"], "item": url}]},
        ]
        if p["faq"]:
            graph.append({"@type": "FAQPage", "@id": f"{url}#faq", "mainEntity": p["faq"]})
        ld = {"@context": "https://schema.org", "@graph": graph}
        toc = "".join(f'<li><a href="#{i}">{n}</a></li>' for i, n in p["toc"])
        page = (_head(p.get("seo_title") or p["title"] + " | BoredMutant", p["description"], url, p["title"], ld, css,
                      extra=f'<meta property="article:published_time" content="{p["date"]}">\n<meta property="article:modified_time" content="{p["updated"]}">\n')
                + header + f"""
<main id="main">
<article class="post">
  <div class="container post__in">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog">Guides</a></nav>
    <h1>{e(p['title'])}</h1>
    <p class="post__meta">By {AUTHOR}, BoredMutant · Updated <time datetime="{p['updated']}">{_nice(p['updated'])}</time> · {p['minutes']} min read</p>
    <div class="answer"><span class="answer__label">Short answer</span><p>{e(p.get('answer', ''))}</p></div>
    {'<nav class="toc" aria-label="In this guide"><b>In this guide</b><ol>' + toc + '</ol></nav>' if toc else ''}
    <div class="prose">
{p['html']}
    </div>
    <aside class="cta" aria-labelledby="cta-h">
      <h2 id="cta-h">See what your POs would look like</h2>
      <p>Send us 10 recent purchase orders, redacted is fine. We'll show you how many would have gone into your ERP without anyone retyping them.</p>
      <a class="btn btn--light" href="{CAL}">Book a 15-minute call</a>
    </aside>
  </div>
</article>
</main>
""" + footer + TAIL)
        (out_dir / f"{p['slug']}.html").write_text(page, encoding="utf-8", newline="\n")

    # index
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Blog", "@id": f"{site}/blog#blog", "name": "BoredMutant guides", "url": f"{site}/blog", "publisher": org,
         "blogPost": [{"@type": "BlogPosting", "headline": p["title"], "url": f"{site}/blog/{p['slug']}", "datePublished": p["date"], "dateModified": p["updated"]} for p in posts]}]}
    cards = "".join(f"""
      <a class="card" href="/blog/{p['slug']}"><h2>{e(p['title'])}</h2><p>{e(p['description'])}</p><time datetime="{p['updated']}">Updated {_nice(p['updated'])} · {p['minutes']} min read</time></a>""" for p in posts)
    desc = "Plain guides to AI order entry, quoting and order-to-cash for wholesale distributors: how it works, what it costs, and how to judge it."
    index = (_head("Guides: AI order entry and order-to-cash for distributors | BoredMutant", desc, f"{site}/blog",
                   "Guides for distributors", ld, css, og_type="website") + header + f"""
<main id="main">
<section class="post">
  <div class="container post__in">
    <h1>Guides for distributors</h1>
    <p class="blog-lead">How AI order entry, quoting and collections work in a distribution business, what they cost, and how to judge them. Written for the people who run order desks.</p>
    <div class="posts">{cards or '<p>First guide coming soon.</p>'}
    </div>
  </div>
</section>
</main>
""" + footer + TAIL)
    pathlib.Path("blog.html").write_text(index, encoding="utf-8", newline="\n")
    return posts


def llms_guides(posts, site, path="llms.txt"):
    """Keep a '## Guides' section at the end of llms.txt listing every post."""
    p = pathlib.Path(path)
    text = re.sub(r"\n## Guides\n.*\Z", "", p.read_text(encoding="utf-8"), flags=re.S).rstrip() + "\n"
    if posts:
        text += "\n## Guides\n\n" + "".join(f"- [{x['title']}]({site}/blog/{x['slug']}): {x['description']}\n" for x in posts)
    p.write_text(text, encoding="utf-8", newline="\n")
