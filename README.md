# 🌿 Miracle Breath

> Breathwork, meditation & mindfulness in the heart of **Kelvedon, Essex**.
> *Find your calm, one breath at a time.*

Miracle Breath is a wellness-studio **concept website**, designed as a fast,
beautiful, fully static site that runs anywhere — and is ready to deploy to
**GitHub Pages** out of the box.

---

## ✨ Highlights

- **Single-page, multi-section** marketing site with a calm, premium feel.
- **Interactive breathing exercise** — choose a pattern (4·7·8, Box, 4·6) and
  breathe along with an animated guide.
- **Modern, responsive design** — looks great from mobile to widescreen.
- **Accessible & considerate** — skip links, ARIA labels, keyboard-friendly
  navigation and full `prefers-reduced-motion` support.
- **Zero build step** — just HTML, CSS and vanilla JavaScript. No frameworks,
  no dependencies, no tracking.
- **SEO-ready** — descriptive metadata, Open Graph tags and
  `LocalBusiness` structured data.

## 🗂 Project structure

```
.
├── index.html            # The full single-page site
├── 404.html              # Friendly custom not-found page
├── assets/
│   ├── css/style.css     # Design system & all styles
│   ├── js/main.js        # Interactions + breathing exercise
│   └── img/              # SVG logo & favicon
├── .nojekyll             # Serve files as-is on GitHub Pages
└── .github/workflows/    # Auto-deploy to GitHub Pages
```

## 🚀 Deploy to GitHub Pages

This repo ships with a workflow that publishes the site automatically.

1. Push to the default branch.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Your site goes live at `https://<user>.github.io/<repo>/`.

Prefer the classic route? Because the site is plain static files with a
`.nojekyll` marker, you can also set **Pages → Source → Deploy from a branch**
and pick the branch root — it just works.

## 🛠 Develop locally

No tooling required. Any static server will do:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

## 🎨 Design notes

- **Palette:** grounded sages, warm cream and a soft gold accent — calm,
  natural, never clinical.
- **Type:** *Fraunces* for expressive headings, *Nunito Sans* for clean,
  readable body text.
- **Motion:** gentle reveal-on-scroll, a breathing hero orb and subtle
  hover lifts — all disabled automatically for reduced-motion users.

## 📝 About the content

Miracle Breath is a **concept**. The business, practitioner (Elena Hart),
testimonials and contact details are illustrative placeholders, ready to be
swapped for the real thing.

---

<p align="center"><em>Inhale calm · exhale tension</em></p>
