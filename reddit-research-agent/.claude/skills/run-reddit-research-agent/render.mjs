#!/usr/bin/env node
// render.mjs — fill dashboard-template.html from a synthesized VOC JSON.
//
// This is the mechanical half of the reddit-voc pipeline's render step
// (Step 4 in the project SKILL.md). In a real run, *Claude* writes voc.json
// by reading the raw thread JSON and judging it. This script then stamps that
// JSON into the template exactly the way the skill describes: every {{PLACE}}
// filled, every <!-- REPEAT --> block cloned once per item, every meter --v
// set, every quote/phrase/angle linked to its real permalink.
//
// Use it to drive + eyeball template/markup changes without an API key:
//   node render.mjs sample/voc.json reddit-research-agent/dashboard-template.html sample/dashboard.html
//
// Args (all optional, sensible defaults shown):
//   1: voc json        default ./sample/voc.json   (relative to this script)
//   2: template html   default ../../../dashboard-template.html
//   3: output html     default ./sample/dashboard.html
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
const vocPath = resolve(here, a[0] || "sample/voc.json");
const tplPath = resolve(here, a[1] || "../../../dashboard-template.html");
const outPath = resolve(here, a[2] || "sample/dashboard.html");

const voc = JSON.parse(readFileSync(vocPath, "utf8"));
let html = readFileSync(tplPath, "utf8");

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");

// Fill one cloned card: swap placeholders, rank number, and meter intensity.
const card = (tpl, repl, idx, v) => {
  let c = tpl;
  for (const [k, val] of Object.entries(repl)) c = c.split(k).join(val);
  c = c.replace(/(<span class="rank">)\d+(<\/span>)/, `$1${idx + 1}$2`);
  c = c.replace(/(<span class="n">)\d+(<\/span>)/, `$1${String(idx + 1).padStart(2, "0")}$2`);
  if (v != null) c = c.replace(/--v:\d+/, `--v:${v}`);
  return c;
};

// The five <!-- REPEAT --> blocks appear in this document order.
const sections = [
  (t, i) => card(t, { "{{PAIN_NAME}}": esc(voc.pains[i].name), "{{VERBATIM_QUOTE}}": esc(voc.pains[i].quote), "{{COMMENT_URL}}": escAttr(voc.pains[i].url), "{{SUBREDDIT}}": esc(voc.pains[i].subreddit), "{{N}}": voc.pains[i].mentions }, i, voc.pains[i].v),
  (t, i) => card(t, { "{{DESIRE_NAME}}": esc(voc.desires[i].name), "{{VERBATIM_QUOTE}}": esc(voc.desires[i].quote), "{{COMMENT_URL}}": escAttr(voc.desires[i].url), "{{SUBREDDIT}}": esc(voc.desires[i].subreddit) }, i, voc.desires[i].v),
  (t, i) => card(t, { "{{OBJECTION_NAME}}": esc(voc.objections[i].name), "{{VERBATIM_QUOTE}}": esc(voc.objections[i].quote), "{{COMMENT_URL}}": escAttr(voc.objections[i].url), "{{SUBREDDIT}}": esc(voc.objections[i].subreddit) }, i, voc.objections[i].v),
  (t, i) => card(t, { "{{EXACT_PHRASE}}": esc(voc.phrases[i].text), "{{COMMENT_URL}}": escAttr(voc.phrases[i].url) }, i),
  (t, i) => card(t, { "{{ANGLE_NAME}}": esc(voc.angles[i].name), "{{HOOK_LINE}}": esc(voc.angles[i].hook), "{{SOURCE_INSIGHT}}": esc(voc.angles[i].source), "{{COMMENT_URL}}": escAttr(voc.angles[i].url) }, i),
];
const counts = [voc.pains, voc.desires, voc.objections, voc.phrases, voc.angles].map((x) => x.length);

let block = -1;
html = html.replace(/<!-- REPEAT:[\s\S]*?-->([\s\S]*?)<!-- \/REPEAT -->/g, (_m, inner) => {
  block += 1;
  const fill = sections[block];
  const n = counts[block];
  let out = "";
  for (let i = 0; i < n; i++) out += fill(inner, i);
  return out;
});

const top = {
  "{{TOPIC}}": esc(voc.topic),
  "{{SUBREDDIT_A}}": esc(voc.subreddit_a),
  "{{SUBREDDIT_B}}": esc(voc.subreddit_b),
  "{{GENERATED_AT}}": esc(voc.generated_at),
  "{{THREADS}}": voc.stats.threads,
  "{{COMMENTS}}": voc.stats.comments,
  "{{SUBREDDITS}}": voc.stats.subreddits,
  "{{CREDITS}}": voc.stats.credits,
};
for (const [k, v] of Object.entries(top)) html = html.split(k).join(v);

const leftover = [...html.matchAll(/\{\{[A-Z_]+\}\}/g)].map((m) => m[0]);
if (leftover.length) {
  console.error("WARN: unfilled placeholders remain:", [...new Set(leftover)].join(", "));
}
writeFileSync(outPath, html);
console.log(`rendered ${outPath} (${counts.join("/")} cards: pains/desires/objections/phrases/angles)`);
