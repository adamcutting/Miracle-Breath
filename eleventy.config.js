import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import markdownIt from "markdown-it";
import Image from "@11ty/eleventy-img";

const md = markdownIt({ html: false, linkify: false, typographer: false });

// Photos live in src/assets/photos (the Pages CMS media library).
// Content stores them as "/assets/photos/name.jpg".
const PHOTO_URL = "/assets/photos/";
const PHOTO_DIR = "src/assets/photos/";

// Largest width we ever serve for each kind of slot.
const SLOT_WIDTH = { ambient: 1600, split: 1100, portrait: 900 };

const escapeAttr = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export default function (eleventyConfig) {
  // Editable content: YAML files in /content are global data (home.yml -> `home`).
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  // Static files copied as-is (photos are processed by the `photo` shortcode instead).
  for (const p of ["css", "js", "img", "docs"]) {
    eleventyConfig.addPassthroughCopy(`src/assets/${p}`);
  }
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers", "src/_redirects": "_redirects", "src/robots.txt": "robots.txt" });

  /* ---------- Text filters ---------- */

  // Paragraphs: Markdown from the CMS rich-text editor -> HTML.
  eleventyConfig.addFilter("md", (s) => (s ? md.render(String(s)).trim() : ""));

  // One line of text: allows **bold** / *italic*, escapes everything else.
  eleventyConfig.addFilter("inline", (s) => (s ? md.renderInline(String(s)) : ""));

  // Headings: inline Markdown plus a raised ® (matches .rmark in style.css).
  eleventyConfig.addFilter("heading", (s) =>
    s ? md.renderInline(String(s)).replace(/®/g, '<sup class="rmark">®</sup>') : ""
  );

  // "07867 725291" -> "+447867725291"
  eleventyConfig.addFilter("tel", (s) => {
    const digits = String(s ?? "").replace(/[^\d+]/g, "");
    return digits.startsWith("0") ? "+44" + digits.slice(1) : digits;
  });

  // Class times as written in the CMS ("9–10pm", "12–1pm", "8.30–9.30pm")
  // -> { start: "21:00", end: "22:00" } for structured data. null if unreadable.
  eleventyConfig.addFilter("timeRange", (s) => {
    const m = String(s ?? "").toLowerCase().replace(/\s/g, "")
      .match(/^(\d{1,2})(?:[.:](\d{2}))?(am|pm)?[–—-](\d{1,2})(?:[.:](\d{2}))?(am|pm)$/);
    if (!m) return null;
    const to24 = (h, min, ap) => {
      h = Number(h) % 12 + (ap === "pm" ? 12 : 0);
      return String(h).padStart(2, "0") + ":" + (min || "00");
    };
    // "12–1pm": a start written without am/pm takes the end's, unless that would make it later than the end
    let startAp = m[3] || m[6];
    if (!m[3] && m[6] === "pm" && Number(m[1]) % 12 > Number(m[4]) % 12) startAp = "am";
    if (!m[3] && Number(m[1]) === 12) startAp = "pm";
    return { start: to24(m[1], m[2], startAp), end: to24(m[4], m[5], m[6]) };
  });


  /* ---------- Photos ---------- */

  // {% photo src, alt, slot, { class, eager } %}
  // Outputs <picture> with a WebP source and a JPEG fallback, sized for the slot.
  // A missing photo fails the build on purpose, so a broken page is never published.
  eleventyConfig.addAsyncShortcode("photo", async (src, alt = "", slot = "split", opts = {}) => {
    if (!src || !String(src).startsWith(PHOTO_URL)) {
      throw new Error(`Photo path must start with ${PHOTO_URL} (got "${src}")`);
    }
    const file = path.join(PHOTO_DIR, decodeURIComponent(String(src).slice(PHOTO_URL.length)));
    if (!fs.existsSync(file)) throw new Error(`Photo not found: ${file}`);

    const meta = await Image(file, {
      widths: [SLOT_WIDTH[slot] ?? 1100],
      formats: ["webp", "jpeg"],
      outputDir: path.join(eleventyConfig.directories.output, "assets/img/p/"),
      urlPath: "/assets/img/p/",
      sharpWebpOptions: { quality: 70 },
      sharpJpegOptions: { quality: 72, mozjpeg: true, progressive: true },
      svgShortCircuit: true,
    });
    const webp = meta.webp[0];
    const jpg = meta.jpeg[0];
    const cls = opts.class ? ` class="${escapeAttr(opts.class)}"` : "";
    const loading = opts.eager ? "" : ' loading="lazy"';
    return (
      `<picture><source srcset="${webp.url}" type="image/webp">` +
      `<img${cls} src="${jpg.url}" width="${jpg.width}" height="${jpg.height}" alt="${escapeAttr(alt)}"${loading} decoding="async"></picture>`
    );
  });

  return {
    dir: { input: "src", includes: "_includes", data: "../content", output: "_site" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
