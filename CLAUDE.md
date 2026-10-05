# Miracle Breath — project context

Website for **Miracle Breath**, a breathwork & meditation practice run by
**Samantha Harden**, teaching the **SOMA Breath** method (online & in person).
Tagline: *Transformational breathwork for healing, balance, energy and inner change.*

It is a static site built with **Eleventy**, designed to feel calm, spacious
and premium. Samantha (non-technical) edits all text and photos herself in
**Pages CMS** (app.pagescms.org); every save commits to `main` and Cloudflare
Pages rebuilds the live site automatically. Live domain: `miraclebreath.co.uk`.

## Stack & conventions
- **Eleventy 3** (Nunjucks) at build time only; the shipped site is still plain
  HTML + CSS + vanilla JS with no runtime dependencies.
- Layout: `src/` = templates (`_includes/base.njk` = head/header/footer, shared
  partials, one `.njk` per page). `content/*.yml` = **all editable copy**
  (Eleventy data dir: `home.yml` -> `home`, etc.). `.pages.yml` = the CMS
  editing screens. `archive/` = old concepts + hidden timetable (not built).
- **Every key in `content/*.yml` must have a field in `.pages.yml`**, or Pages
  CMS drops it on the next save. Run `npm run check` after changing either.
  Fixed, non-editable things belong in templates, not content files.
- Text filters: `heading` (inline Markdown + raised ®), `inline` (one line,
  allows **bold**/*italic*), `md` (paragraphs from the rich-text editor, stored
  as Markdown). Nunjucks autoescape is on; plain `{{ value }}` is escaped.
- Card icons are defined in `src/_includes/icons.njk`; names must match the
  `icon` select options in `.pages.yml`.
- One stylesheet: `src/assets/css/style.css`. One script: `src/assets/js/main.js`.
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
- **Photos**: originals live in `src/assets/photos/` (the CMS media library).
  The `{% photo src, alt, slot, {class} %}` shortcode (eleventy-img) outputs
  `<picture>` with WebP + JPEG, width/height, lazy loading, sized per slot
  (ambient 1600, split 1100, portrait 900). A missing photo fails the build on
  purpose, so Cloudflare keeps the last good version live. Logos, favicons and
  og-image are static files in `src/assets/img/`.
- **Scroll restoration** is set to `manual` in the inline `<head>` script so a
  mobile refresh starts at the top (avoids reflow-jump). Keep that.
- Verify visual/behaviour changes by **rendering with Playwright headless**
  at desktop 1366/1440 and mobile 390 widths — check footers, broken images,
  stuck `.reveal:not(.in)`, and console errors.

## Pages
`index.html` (Home), `about.html`, `soma-breath.html`, `healing.html`,
`classes.html`, `corporate.html`, `contact.html`, `404.html` — built from
`src/*.njk`. Classes and Corporate have a `show_in_menu` switch (off = not in
nav/footer/sitemap, `noindex`, but still reachable for preview). The old
`timetable` URLs redirect to `/classes`. Links to `/contact.html?interest=…`
pre-select the enquiry type (main.js).

## Local dev
`npm install`, then `npm start` (dev server with live reload) or
`npm run build` (output in `_site/`). `npm run check` validates content vs CMS.

## Brand visual language (derived from the logo)
- Round **emblem** → arched image framing (`.gallery`, `.portrait-card`).
- Logo **waves** → organic wave dividers on `.services` sections.
- Warm wash over photos for cohesion. Gold rule under centred section titles.

## Deployment (LIVE)
- **Cloudflare Pages, git-connected** to `adamcutting/Miracle-Breath`, branch
  `main`: build command `npm run build`, output `_site`, Node 22 (`.nvmrc`).
  Every push to `main` (including Pages CMS saves) deploys automatically;
  other branches get preview URLs. Domains: `miraclebreath.co.uk` + `www`.
- A failed build leaves the previous deployment live.
- `src/_headers` sets caching + security headers.

## Email & forms
- **Zoho Mail free plan (EU DC)** hosts mail: `samantha@` (owner) and `adam@`.
  DNS: Zoho MX ×3, SPF (`include:zohomail.eu`), DKIM (`zmail._domainkey`),
  DMARC p=none. Cloudflare Email Routing is disabled — do not re-enable while
  Zoho MX is live.
- Contact form POSTs to **FormSubmit** AJAX endpoint
  (`formsubmit.co/ajax/samantha@miraclebreath.co.uk`, hard-coded in
  `src/contact.njk`), handler in `main.js` (`[data-send-form]`). Activated for
  samantha@; a different address would need a new one-time activation.

## Known gaps / not-yet-done
- Final bio, named testimonials, and final prices still need owner sign-off.
- Timetable is a filterable card list, not a real calendar/booking system.
- No **Waiver & Important Information** (liability disclaimer) section yet —
  only short health notes on SOMA & Healing.
- No real social channels.

## Planned direction (agreed with owner)
- **Booking/calendar**: embed a managed platform (SimplyBook.me / Bookwhen /
  Acuity / Cal.com) on the Timetable — owner manages sessions there.
- **Blog** (if wanted): a Pages CMS `collection` of Markdown posts plus an
  Eleventy collection and post template.

## Working agreement
- Keep the shipped site dependency-free and the design calm/premium.
- Copy voice: warm, plain, first-person (Samantha), grounded/anti-woo — avoid
  AI tells (heavy em-dashes, "X, Y and Z" triads, generic wellness filler).
- Samantha's CMS saves land on `main`, so pull before working. Commit with
  clear messages; use a branch + preview URL for bigger changes.
