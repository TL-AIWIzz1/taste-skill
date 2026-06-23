#!/usr/bin/env node
// render-teardown.mjs — fill teardown-template.html from a merged JSON.
//
// Companion to render.mjs, for the "Competitor Ad Teardown × VOC" dashboard.
// Same mechanics: fill {{PLACEHOLDER}}s and clone each <!-- REPEAT --> block.
// Blocks appear in document order: ads -> plays -> gaps -> angles.
//
//   node render-teardown.mjs sample/collagen-teardown.json teardown-template.html sample/teardown.html
//   node shoot.mjs sample/teardown.html sample/teardown.png
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
const dataPath = resolve(here, a[0] || "sample/collagen-teardown.json");
const tplPath = resolve(here, a[1] || "teardown-template.html");
const outPath = resolve(here, a[2] || "sample/teardown.html");

const d = JSON.parse(readFileSync(dataPath, "utf8"));
let html = readFileSync(tplPath, "utf8");

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const card = (tpl, repl, idx, v) => {
  let c = tpl;
  for (const [k, val] of Object.entries(repl)) c = c.split(k).join(val);
  c = c.replace(/(<span class="rank">)\d+(<\/span>)/, `$1${idx + 1}$2`);
  c = c.replace(/(<span class="n">)\d+(<\/span>)/, `$1${String(idx + 1).padStart(2, "0")}$2`);
  if (v != null) c = c.replace(/--v:\d+/, `--v:${v}`);
  return c;
};

const sections = [
  (t, i) => card(t, { "{{BRAND}}": esc(d.ads[i].brand), "{{DAYS}}": d.ads[i].days, "{{AD_COPY}}": esc(d.ads[i].copy), "{{AD_URL}}": escAttr(d.ads[i].url), "{{PLATFORMS}}": esc(d.ads[i].platforms), "{{CTA}}": esc(d.ads[i].cta) }, i, Math.min(100, d.ads[i].days)),
  (t, i) => card(t, { "{{PLAY_NAME}}": esc(d.plays[i].name), "{{PLAY_NOTE}}": esc(d.plays[i].note) }, i),
  (t, i) => card(t, { "{{GAP_NAME}}": esc(d.gaps[i].name), "{{GAP_QUOTE}}": esc(d.gaps[i].quote), "{{VOC_URL}}": escAttr(d.gaps[i].url), "{{STATUS}}": esc(d.gaps[i].status), "{{STATUS_CLASS}}": d.gaps[i].ignored ? "ignored" : "run", "{{GAP_NOTE}}": esc(d.gaps[i].note) }, i),
  (t, i) => card(t, { "{{ANGLE_NAME}}": esc(d.angles[i].name), "{{HOOK_LINE}}": esc(d.angles[i].hook), "{{SOURCE}}": esc(d.angles[i].source), "{{SOURCE_URL}}": escAttr(d.angles[i].url) }, i),
];
const lists = [d.ads, d.plays, d.gaps, d.angles];

let block = -1;
html = html.replace(/<!-- REPEAT:[\s\S]*?-->([\s\S]*?)<!-- \/REPEAT -->/g, (_m, inner) => {
  block += 1;
  const n = lists[block].length;
  let out = "";
  for (let i = 0; i < n; i++) out += sections[block](inner, i);
  return out;
});

const top = {
  "{{TOPIC}}": esc(d.topic),
  "{{BRAND_LINE}}": esc(d.brand_line),
  "{{GENERATED_AT}}": esc(d.generated_at),
  "{{ADS}}": d.stats.ads,
  "{{LONGEST}}": d.stats.longest,
  "{{THREADS}}": d.stats.threads,
  "{{QUOTES}}": d.stats.quotes,
};
for (const [k, v] of Object.entries(top)) html = html.split(k).join(v);

const leftover = [...new Set([...html.matchAll(/\{\{[A-Z_]+\}\}/g)].map((m) => m[0]))];
if (leftover.length) console.error("WARN: unfilled placeholders:", leftover.join(", "));
writeFileSync(outPath, html);
console.log(`rendered ${outPath} (${lists.map((l) => l.length).join("/")} = ads/plays/gaps/angles)`);
