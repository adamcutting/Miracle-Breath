# Miracle Breath — project context

Website for **Miracle Breath**, a breathwork & meditation practice run by
**Samantha Harden**, teaching the **SOMA Breath** method (online & in person).
Tagline: *Transformational breathwork for healing, balance, energy and inner change.*

It is a **hand-coded static site** (no build step) designed to feel calm,
spacious and premium. Domain (intended): `www.miraclebreath.com`.

## Stack & conventions
- Plain **HTML + CSS + vanilla JS**. No frameworks, no dependencies, no build.
- One stylesheet: `assets/css/style.css`. One script: `assets/js/main.js`.
- **Palette** (sampled from the logo): sage `#8a9c80`, gold `#d6ad61`, cream
  `#faf8f2`, deep sage `#333d2c`. AA-safe gold for text is `--gold-700 #8a6a28`.
- **Type**: Fraunces (display) + Nunito Sans (body), via Google Fonts.
- **Motion** must always respect `prefers-reduced-motion`. Patterns in use:
  scroll reveals (`.reveal`, gated behind `html.js`), image parallax on
  `.ambient__img`, hero entrance, view transitions, gold shimmer.
- **Reveal system is fail-safe**: content is visible by default; the hidden/
  animated state only applies once JS confirms support (`html.js`), plus a
  scroll-based safety net and a load-timeout failsafe. Never hide content
  in a way that depends solely on JS.
- **Images**: every photo ships `.webp` + `.jpg` via `<picture>`, with
  `width`/`height`, `loading="lazy"` (except the hero), `decoding="async"`.
  Optimise new photos (≤~150KB) and generate a webp twin.
- **Scroll restoration** is set to `manual` in the inline `<head>` script so a
  mobile refresh starts at the top (avoids reflow-jump). Keep that.
- Verify visual/behaviour changes by **rendering with Playwright headless**
  (it's installed) at desktop 1366/1440 and mobile 390 widths — check footers,
  broken images, stuck `.reveal:not(.in)`, and console errors.

## Pages
`index.html` (Home), `about.html`, `soma-breath.html`, `healing.html`,
`timetable.html`, `contact.html`, `404.html`.

## Brand visual language (derived from the logo)
- Round **emblem** → arched image framing (`.gallery`, `.portrait-card`).
- Logo **waves** → organic wave dividers on `.services` sections.
- Warm wash over photos for cohesion. Gold rule under centred section titles.

## Deployment
- Hosting target: **Cloudflare Pages** (connected to this GitHub repo).
  Build command: *none*. Output directory: `/` (repo root). Static.
- `_headers` sets caching + security headers for Cloudflare Pages.
- `.nojekyll` is a leftover from GitHub Pages; harmless on Cloudflare.

## Known placeholders / not-yet-done (concept stage)
- Real contact details, final bio, named testimonials, certificate links,
  and final prices are **placeholders**.
- Timetable is a **filterable card list**, not a real calendar/booking system,
  and has no date filter. Session buttons say "Ask about this" (brief asked
  for "Book / Enquire").
- No **Waiver & Important Information** (liability disclaimer) section yet —
  only short health notes on SOMA & Healing.

## Planned direction (agreed with owner)
Hand the "moving parts" to friendly tools so a **non-technical owner** can run
the site:
- **Booking/calendar**: embed a managed platform (SimplyBook.me / Bookwhen /
  Acuity / Cal.com) on the Timetable — owner manages sessions there.
- **Content + blog**: a git-based CMS (Sveltia / Pages CMS) at `/admin`.
  A blog likely means moving to a static generator (Eleventy/Astro) that
  Cloudflare builds automatically.
- **Forms**: Formspree / Cloudflare for enquiry + newsletter.

## Working agreement
- Keep the codebase dependency-free and the design calm/premium.
- Copy voice: warm, plain, first-person (Samantha), grounded/anti-woo — avoid
  AI tells (heavy em-dashes, "X, Y and Z" triads, generic wellness filler).
- Commit with clear messages; this work lives on branch
  `claude/miracle-breath-website-ek0mpq`.
