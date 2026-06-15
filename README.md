# Miracle Breath

Website for Miracle Breath, a breathwork and meditation practice run by
Samantha Harden, offering the SOMA Breath method online and in person.

Tagline: *Transformational breathwork for healing, balance, energy and inner change.*

It's a static site built to run on GitHub Pages with no build step.

## Pages

- **Home** (`index.html`) — introduction, benefits, a taste of the practice
- **About** (`about.html`) — Samantha's story, what to expect, qualifications
- **SOMA Breath** (`soma-breath.html`) — what the method is and how it works
- **Healing** (`healing.html`) — how breathwork can support wellbeing
- **Timetable** (`timetable.html`) — sessions, filterable by format, with pricing
- **Contact** (`contact.html`) — enquiry form and details
- **404** (`404.html`) — custom not-found page

## Built with

Plain HTML, CSS and vanilla JavaScript. No frameworks, no dependencies, no
tracking. Type is Fraunces (headings) and Nunito Sans (body) from Google
Fonts. The palette is taken from the logo: sage green (`#8a9c80`) and warm
gold (`#d6ad61`) on cream (`#faf8f2`).

Features worth noting:

- Interactive guided-breathing exercise (4-7-8, box, 4-6 patterns)
- Filterable session timetable
- Photographic "ambient" bands and an image gallery
- Subtle motion: cross-page view transitions, scroll reveals, image
  parallax, a breathing-logo hero. All disabled under `prefers-reduced-motion`
- Accessible: skip link, ARIA labelling, keyboard-friendly nav and widgets,
  focus management on the mobile menu
- WebP images with JPEG/PNG fallback; lazy loading; sized to avoid layout shift

## Running locally

Any static server works:

```bash
python3 -m http.server 8000      # then open http://localhost:8000
# or: npx serve .
```

## Deploying to GitHub Pages

The site is plain static files with a `.nojekyll` marker.

1. Settings → Pages → Source → Deploy from a branch
2. Pick the branch and the `/ (root)` folder, then Save

## Images

The photographs are royalty-free placeholders from Unsplash, chosen to match
the palette. They stand in for real photography of Samantha and the space.
To swap them, replace the files in `assets/img/` keeping the same names
(`about-portrait`, `ambient-breath`, `ambient-forest`, `ambient-bowl`,
`ambient-water`, `glimpse-1/2/3`); both the `.jpg` and `.webp` versions.

## Placeholder content

This is a concept. Samantha's full biography, contact details, real session
dates and booking, named testimonials, certificate links and the formal
waiver / health information are placeholders to be replaced with real
details. Prices shown are indicative.
