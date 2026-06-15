# 🌬️ Miracle Breath

> Transformational breathwork for **healing, balance, energy and inner change**.
> Rooted in the **SOMA Breath** method, led by **Samantha Harden**.

A calm, modern, premium concept website for Miracle Breath — a fast,
fully static site that runs anywhere and deploys to **GitHub Pages** with
zero configuration.

---

## ✨ Highlights

- **Six considered pages** — Home, About, SOMA Breath, Healing, Session
  Timetable and Contact.
- **Brand-true design** — palette, logo and motifs drawn directly from the
  Miracle Breath logo (soft sage green + warm gold on cream).
- **Interactive breathing exercise** — choose a rhythm (4·7·8, Box, 4·6) and
  breathe along with an animated guide.
- **Filterable session timetable** — by format (online / in person), class,
  workshop or 1:1.
- **Gentle motion** — drifting dandelion-seed particles, reveal-on-scroll and
  a breathing hero, all honouring `prefers-reduced-motion`.
- **Accessible & considerate** — skip links, ARIA labelling, keyboard-friendly
  navigation, semantic structure.
- **Zero build step** — plain HTML, CSS and vanilla JavaScript. No frameworks,
  no dependencies, no tracking.
- **SEO-ready** — descriptive metadata, Open Graph tags and structured data.

## 🗂 Project structure

```
.
├── index.html            # Home
├── about.html            # About Samantha Harden
├── soma-breath.html      # What is SOMA Breath?
├── healing.html          # Healing & wellbeing benefits
├── timetable.html        # Filterable session timetable
├── contact.html          # Enquiry form & contact
├── 404.html              # Friendly custom not-found page
├── assets/
│   ├── css/style.css     # Design system & all styles
│   ├── js/main.js        # Interactions, breathing exercise, filters
│   └── img/              # Logo lockup, emblem & favicon
└── .nojekyll             # Serve files as-is on GitHub Pages
```

## 🚀 Deploy to GitHub Pages

The site is plain static files with a `.nojekyll` marker, so it deploys with
zero configuration:

1. In **Settings → Pages**, set **Source** to **Deploy from a branch**.
2. Choose your branch and the `/ (root)` folder, then **Save**.
3. Your site goes live at `https://<user>.github.io/<repo>/`.

## 🛠 Develop locally

No tooling required — any static server works:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
# or: npx serve .
```

## 🎨 Design notes

- **Palette:** sage green `#8a9c80` + warm gold `#d6ad61` on cream `#faf8f2`,
  sampled straight from the logo.
- **Type:** *Fraunces* for expressive headings, *Nunito Sans* for clean body text.
- **Motion:** soft, slow and optional — calm by default.

## 📝 About the content

Miracle Breath is a **concept**. Samantha's full biography, contact details,
final session dates, testimonials, certificate links and the formal
waiver / health information are placeholders, ready to be swapped for the
real thing as they're supplied.

---

<p align="center"><em>Inhale calm · exhale tension</em></p>
