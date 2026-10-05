# Miracle Breath

Website for Miracle Breath, a breathwork and meditation practice run by
Samantha Harden, offering the SOMA Breath method online and in person.
Live at **https://miraclebreath.co.uk**.

## Editing the site (for Samantha)

All text and photos are edited at **https://app.pagescms.org**. Sign in with
your Miracle Breath email address. Press **Save** and the live site updates
about a minute later. See the separate handover guide for step-by-step help.

## How it works

- Page text lives in `content/*.yml`, one file per page plus `site.yml` for
  contact details and footer text. Pages CMS edits these files; `.pages.yml`
  describes its editing screens.
- Photos live in `src/assets/photos/` and are resized to WebP + JPEG at build.
- Templates are in `src/` ([Eleventy](https://www.11ty.dev/), Nunjucks). The
  shipped site is plain HTML, CSS and vanilla JavaScript with no tracking.
- Hosting is Cloudflare Pages, connected to this repo: every push to `main`
  (including each Pages CMS save) builds and deploys automatically.

## Running locally

```bash
npm install
npm start          # dev server with live reload
npm run build      # build into _site/
npm run check      # confirm content/*.yml and .pages.yml still match
```

## Cloudflare Pages settings

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `_site`
- Node version: 22 (from `.nvmrc`)

## Features worth noting

- Interactive guided-breathing exercise (4-7-8, box, 4-6 patterns)
- Subtle motion: cross-page view transitions, scroll reveals, image
  parallax, a breathing-logo hero, all disabled under `prefers-reduced-motion`
- Accessible: skip link, ARIA labelling, keyboard-friendly nav and widgets
- Responsive WebP images with JPEG fallback, lazy loading, explicit sizes
