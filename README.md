# BoredMutant: boredmutant.com

One-page static site: own the software your company runs on. Custom software
that replaces rented SaaS, built and run by BoredMutant.

No framework and no runtime dependencies. `build.py` bundles `site/` into one
self-contained `index.html` (CSS and fonts inlined), and writes `sitemap.xml`
and `llms-full.txt` from the same source.

## Quick start

```bash
python3 build.py                    # rebuild index.html, sitemap.xml, llms-full.txt
python3 -m http.server 4599         # preview on http://localhost:4599
```

## What's in the box

```
build.py              the build: bundles site/ into index.html
site/
  index.html          page markup and script (edit this, not the root index.html)
  page.css            page styles; imports tokens.css and base.css
  tokens.css          colours, type, spacing
  base.css            resets and shared base rules
  fonts/              Fredoka and Nunito Sans, self-hosted woff2
index.html            built output, served by Vercel
logo-mark.svg         the BoredMutant wordmark, used in nav and footer
favicon.svg, *.png    icons
og-image.png          1200x630 share image
llms.txt              short summary for AI crawlers; llms-full.txt is generated
vercel.json           clean URLs, redirects (/about and /how-it-works go to /), headers
```

## Deploy

Vercel deploys `main` as a static site with no build step, so run
`python3 build.py` and commit the built `index.html` along with your edits.

## Design

Beige paper, warm ink, one cobalt accent. Fredoka headings in sentence case
over Nunito Sans, matching the logo. The 3D scenes are CSS 3D (no WebGL); every
state is reachable without motion for visitors who prefer reduced motion.
