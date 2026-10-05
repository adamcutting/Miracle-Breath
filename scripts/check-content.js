// Checks that every key in content/*.yml has a matching field in .pages.yml
// (Pages CMS silently drops keys it has no field for) and vice versa.
// Run after changing templates or .pages.yml:  npm run check
import fs from "node:fs";
import yaml from "js-yaml";

const cfg = yaml.load(fs.readFileSync(".pages.yml", "utf8"));
const comps = cfg.components ?? {};
const resolve = (f) => (f.component ? { ...comps[f.component], ...f, fields: f.fields ?? comps[f.component].fields } : f);
let problems = 0;
const report = (msg) => { console.log(msg); problems++; };

function check(fields, data, where) {
  const byName = Object.fromEntries(fields.map((f) => [f.name, resolve(f)]));
  for (const k of Object.keys(data ?? {})) if (!byName[k]) report(`Not in .pages.yml (would be dropped on save): ${where}.${k}`);
  for (const [k, f] of Object.entries(byName)) {
    const v = data?.[k];
    if (v === undefined) { report(`Missing from content: ${where}.${k}`); continue; }
    if (f.type === "object") {
      if (!f.list) check(f.fields, v, `${where}.${k}`);
      else if (!Array.isArray(v)) report(`Expected a list: ${where}.${k}`);
      else v.forEach((item, i) => check(f.fields, item, `${where}.${k}[${i}]`));
    }
    if (f.type === "select" && v && !f.options.values.some((o) => o.value === v)) report(`Unknown option "${v}": ${where}.${k}`);
  }
}

const walk = (items) => items.forEach((i) => (i.type === "group" ? walk(i.items) : check(i.fields, yaml.load(fs.readFileSync(i.path, "utf8")), i.name)));
walk(cfg.content);
console.log(problems ? `${problems} problem(s)` : "content/*.yml and .pages.yml match");
process.exit(problems ? 1 : 0);
