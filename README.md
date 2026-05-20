# Bored Mutant — Landing Page

Single-page marketing site for boredmutant.com. React + Vite + Framer Motion.

## Quick start

```bash
npm install
npm run dev      # local dev server on http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## What's in the box

```
src/
  App.jsx               composition of all sections
  main.jsx              React entry, loads Inter Variable + global CSS
  index.css             single global stylesheet (no CSS-in-JS, no Tailwind)
  lib/
    config.js           ★ change EMAIL and CALENDLY_URL here
    motion.js           shared Framer Motion variants (moderate intensity)
  components/
    CTAButton.jsx       reusable animated "Book a 15-minute call" button
  sections/
    Header.jsx          sticky wordmark header
    Hero.jsx            H1, lede, primary CTA
    Proof.jsx           teal-bar credibility strip with scroll parallax
    Problem.jsx         "Sound familiar?" em-dash list
    Builds.jsx          three industry rows
    Steps.jsx           three numbered steps
    Why.jsx             three short reasons
    FinalCTA.jsx        closing pitch + CTA + email
    Footer.jsx          wordmark + studio line

public/
  assets/bored-mutant-wordmark.svg
  robots.txt            explicitly allows GPTBot, ClaudeBot, PerplexityBot, etc.
  llms.txt              short LLM-readable site summary (llmstxt.org)
  llms-full.txt         full page content as markdown
  sitemap.xml
```

## Editing the two things you'll actually change

Both live in [`src/lib/config.js`](src/lib/config.js):

```js
export const EMAIL = "contact@boredmutant.com";
export const BOOKING_URL = "https://cal.com/boredmutant";
```

- **EMAIL** — used by the "Or email me directly" line, the footer, and as the mailto fallback if `BOOKING_URL` is empty.
- **BOOKING_URL** — public booking page from any scheduling tool. Every "Book a 15-minute call" button points here and opens in a new tab. If you leave it as `""` (empty string), the buttons fall back to a pre-subjected mailto to `EMAIL`.

**Booking tool in use:** [Cal.com](https://cal.com) — free tier, no branding on the booking page, unlimited event types, syncs with Google / Outlook / iCloud calendars, auto-generates Zoom / Google Meet / Daily / Jitsi links. Profile URL is `https://cal.com/boredmutant`.

For one fewer click on the prospect's side, you can deep-link to a specific event type instead: `https://cal.com/boredmutant/intro-call-15-minutes` (or whatever your event slug is). Find it under Event Types → click the event → copy the public link.

Other tools also work as drop-in replacements: Calendly, SavvyCal, Zoho Bookings, Google Appointment Schedule, Microsoft Bookings — anything that gives you a public URL.

If you change `BOOKING_URL`, also update `public/llms.txt` and `public/llms-full.txt` so AI crawlers see the same link.

## Animations (Framer Motion)

Intensity is set to **moderate**: staggered fade-up reveals on scroll, sticky header drop-in, parallax on the proof strip, spring-pop on the step numbers, subtle hover lift on industry rows and the CTA. All variants live in `src/lib/motion.js` — change `EASE_OUT`, durations, or stagger times in one place to retune the whole site.

Respects `prefers-reduced-motion` automatically.

## Deploy

The output is a fully static site in `dist/` after `npm run build`. Drop it on any static host:

- **Vercel / Netlify / Cloudflare Pages** — point at this repo, build command `npm run build`, output dir `dist`.
- **GitHub Pages / S3 / Nginx** — `npm run build` and upload the contents of `dist/`.

The `public/` folder is copied verbatim into `dist/`, so `/robots.txt`, `/llms.txt`, `/llms-full.txt`, and `/sitemap.xml` are all served at the root.

## LLM-friendly notes

- `robots.txt` explicitly `Allow: /` for the major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended, Bytespider, meta-externalagent).
- `llms.txt` follows the [llmstxt.org](https://llmstxt.org) convention: a short, structured summary of the site for AI agents that prefer not to render a SPA.
- `llms-full.txt` mirrors every line of body copy so an agent never needs JavaScript to ingest the offer.
- `index.html` carries an `<link rel="alternate" type="text/markdown" href="/llms.txt">` so well-behaved agents can discover it without guessing.
