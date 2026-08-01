# BoredMutant — boredmutant.com

Four-page static marketing site for BoredMutant, an automated document-chasing
service for accounting firms and staffing agencies.

No framework, no npm, no runtime dependencies. `build.py` assembles each page from
partials in `src/` and inlines the CSS and JS, so every published page is a single
self-contained HTML file.

## Quick start

```bash
python build.py                     # rebuild the four pages + sitemap.xml
python -m http.server 4599          # preview on http://localhost:4599
```

There is no watch mode. Edit a file in `src/`, re-run `python build.py`, reload.

Note that the local preview server does not do clean URLs, so links like
`/how-it-works` 404 there. Vercel serves them via `cleanUrls` in `vercel.json`.
Append `.html` when clicking around locally.

## What's in the box

```
build.py                  the whole build: page list, metadata, JSON-LD, template
src/
  base.css                every style on the site, inlined into each page
  header.html             shared header + mobile nav markup (__NAV_*__ tokens
                          are replaced with aria-current="page" per page)
  footer.html             shared footer
  nav.js                  mobile hamburger menu, inlined into every page
  home.body.html          ─┐
  how.body.html            │ page bodies, one per published page
  acc.body.html            │
  stf.body.html           ─┘
  abt.body.html           About page — written but NOT published, see below
  home.js / how.js        page-specific scroll-reveal and demo scripts
  page.js                 the lighter script used by the two industry pages

index.html                ─┐
how-it-works.html          │ build output — generated, do not hand-edit
document-chasing-for-…     │
sitemap.xml               ─┘

logo-mark.svg, logo.svg, logo.png, og-image.png
robots.txt, llms.txt      hand-maintained
vercel.json               hosting config: clean URLs, apex→www, security headers
```

Generated files are committed so the repo can deploy without a build step on
Vercel. If you edit anything under `src/`, run `python build.py` and commit both
the source and the regenerated HTML.

## Adding a page

Everything lives in the `PAGES` list in `build.py`: output filename, body partial,
JS partial, URL path, nav token, title, meta description, Open Graph copy, and the
schema.org graph. Add an entry, add the body partial, run the build.

### The About page

`src/abt.body.html` is written but deliberately unpublished — it is not in `PAGES`,
not in the nav, not in the footer, and not in `sitemap.xml`. To publish it, restore
its `PAGES` entry, add the nav link in `src/header.html`, the footer link in
`src/footer.html`, and `"ABT"` to the nav-token loop in `render()`.

## Mobile

The stylesheet is mobile-first: base rules target phones and `min-width` queries
layer on the wider layouts. Below 900px the nav links collapse into a hamburger
panel (`src/nav.js`); at 900px and up the panel becomes the normal horizontal bar.
The header CTA and the in-panel CTA are the same link at two breakpoints — exactly
one of the two is ever displayed.

Verified with no horizontal overflow at 320, 360, 390, 414, 768, 899, 900 and
1024px on all four pages.

## Deploy

Vercel, connected to this repo's `main` branch. There is no build step: `vercel.json`
sets `framework`, `buildCommand`, `installCommand` and `outputDirectory` to `null`,
so the repo root is served as-is. `.vercelignore` keeps `src/` and `build.py` out of
the deployment, so build inputs are never publicly served.

`vercel.json` also handles clean URLs, the `boredmutant.com` → `www.boredmutant.com`
redirect, and the security headers.

## Booking and contact

The booking link is `https://cal.com/boredmutant` and the contact address is
`contact@boredmutant.com`. Both appear in the page bodies, `src/header.html`,
`src/footer.html`, `llms.txt` and the JSON-LD in `build.py`. If either changes,
grep for it — there is no single config constant.

## LLM-friendly notes

- `robots.txt` explicitly allows the major AI search and training crawlers
  (GPTBot, ClaudeBot, OAI-SearchBot, PerplexityBot, Google-Extended, CCBot,
  Applebot-Extended, Bytespider, meta-externalagent).
- `llms.txt` follows the [llmstxt.org](https://llmstxt.org) convention. It is
  hand-maintained; update it when page copy changes materially.
- Every page carries a schema.org `@graph` (Organization, Service, WebSite,
  BreadcrumbList) generated in `build.py`.
- Pages are server-rendered static HTML, so no crawler needs to execute JS. The
  scroll-reveal animations start at `opacity:0`, and a `<noscript>` block resets
  them to visible for any client that does not run scripts.
