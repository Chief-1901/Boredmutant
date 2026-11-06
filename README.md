# BoredMutant — boredmutant.com

Four-page static site for BoredMutant, a technology company registered in India
and based in Hyderabad. BoredMutant builds department software, workflow
automations, AI agents and company brains for firms of 50 to 500 people.
Pages: home, how-it-works, security, about.

No framework, no npm, no runtime dependencies. `build.py` assembles each page from
partials in `src/` and inlines the CSS and JS, so every published page is a single
self-contained HTML file. The only external asset is the self-hosted Archivo
variable font in `fonts/` (SIL Open Font License, see `fonts/OFL.txt`).

## Quick start

```bash
python build.py                     # rebuild the four pages, sitemap.xml, llms-full.txt
python -m http.server 4599          # preview on http://localhost:4599
```

There is no watch mode. Edit a file in `src/`, re-run `python build.py`, reload.

The local preview server does not do clean URLs, so links like `/how-it-works`
404 there. Vercel serves them via `cleanUrls` in `vercel.json`. Append `.html`
when clicking around locally.

## What's in the box

```
build.py                  the whole build: page list, metadata, JSON-LD, template
src/
  base.css                every style on the site, inlined into each page
  header.html             shared header + mobile nav markup
  footer.html             shared footer
  nav.js                  mobile hamburger menu, inlined into every page
  home.body.html          home page (demo placeholders filled by build.py)
  home.js                 interactive demo: tabs, fill-in, source highlighting, approval
  demos.json              sample scenarios for the demo (made-up companies and data)
  how.body.html           how-it-works page: Sprint, Build, Run
  security.body.html      security page: access, data, review, current limits
  abt.body.html           about page: the company and contact
fonts/                    Archivo variable font (latin, latin-ext) + OFL.txt

index.html                ─┐
how-it-works.html          │ build output — generated, do not hand-edit
security.html              │
about.html                 │
sitemap.xml, llms-full.txt ─┘

logo-mark.svg, logo.svg, logo.png, og-image.png
robots.txt, llms.txt      hand-maintained
vercel.json               hosting config: clean URLs, apex→www, security headers
```

## The demo

The home page demo shows seven sample builds (department software, company brain,
quote intake, document review, customer support, sales follow-up, HR coordination).
Each scenario in `src/demos.json` has source documents and a drafted record; every
drafted field lists the source passages it came from, and pointing at or focusing a
field highlights them. `build.py` server-renders the first scenario so the page works
without JS, then injects the full data as `var DEMOS`. Reduced-motion users get the
finished state without animation.

Generated files are committed so the repo can deploy without a build step on
Vercel. If you edit anything under `src/`, run `python build.py` and commit both
the source and the regenerated HTML.

## Adding a page

Everything lives in the `PAGES` list in `build.py`: output filename, body partial,
JS partial, URL path, nav token, title, meta description, Open Graph copy, and the
schema.org graph. Add an entry, add the body partial, run the build.

## Mobile

The stylesheet is mobile-first: base rules target phones and `min-width` queries
layer on the wider layouts. Below 900px the nav links collapse into a hamburger
panel (`src/nav.js`); at 900px and up the panel becomes the normal horizontal bar.
The header CTA and the in-panel CTA are the same link at two breakpoints — exactly
one of the two is ever displayed.

Verified with no horizontal overflow at 320, 390, 768, 1024 and 1440px on all
four pages.

## Deploy

Vercel's existing Git integration is connected to this repo's `main` branch, so
commits to `main` trigger deployment automatically. There is no build step: `vercel.json`
sets `framework`, `buildCommand`, `installCommand` and `outputDirectory` to `null`,
so the repo root is served as-is. `.vercelignore` keeps `src/` and `build.py` out of
the deployment, so build inputs are never publicly served.

`vercel.json` also handles clean URLs, the `boredmutant.com` → `www.boredmutant.com`
redirect, and the security headers.

## Booking and contact

Contact routes: the booking link `https://cal.com/boredmutant/automations` and the
work email `pranith@boredmutant.com` (footer and About page). The link appears in
the page bodies, `src/header.html`, `src/footer.html`, `llms.txt` and the JSON-LD
`contactPoint` in `build.py`. If either changes, grep for it — there is no single
config constant.

## LLM-friendly notes

- `robots.txt` explicitly allows the major AI search and training crawlers
  (GPTBot, ClaudeBot, OAI-SearchBot, PerplexityBot, Google-Extended, CCBot,
  Applebot-Extended, Bytespider, meta-externalagent).
- `llms.txt` follows the [llmstxt.org](https://llmstxt.org) convention. It is
  hand-maintained; update it when page copy changes materially.
- Every page carries a schema.org `@graph` (Organization, Service, WebSite,
  BreadcrumbList) generated in `build.py`.
- Pages are server-rendered static HTML, so no crawler needs to execute JS.
