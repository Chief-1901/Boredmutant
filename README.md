# BoredMutant: boredmutant.com

Static site: AI order entry and order-to-cash software for wholesale
distributors (home page) and Tally + WhatsApp order automation for India (/india).

No framework. `build.py` bundles `site/` into `index.html`, `india.html` and
`404.html` (CSS inlined, fonts copied to `/fonts/`), and writes `sitemap.xml`
and `llms-full.txt`. The hero's WebGL scene lives in `site/js-src/hero.js` and is
bundled with Three.js into `/js/hero.js`:

```bash
npm i three@0.187.0 && NODE_PATH=node_modules npx esbuild site/js-src/hero.js \
  --bundle --format=esm --minify --target=es2020 --outfile=js/hero.js
```

Posters (`/img/hero-poster*.webp`) are still frames of the same scene, shown
before WebGL loads and kept on devices without a hardware GPU.

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
  india.html          the India page
  js-src/hero.js      the WebGL hero scene (source)
  fonts/              Geist and Geist Mono, self-hosted woff2
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
