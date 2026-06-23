---
name: run-reddit-research-agent
description: >-
  Build, render, and screenshot the Reddit VOC → Ad-Angle dashboard
  (the reddit-voc skill). Use when asked to run, launch, render, preview, or
  screenshot the reddit research agent / reddit-voc dashboard, to test a change
  to dashboard-template.html or fetch_reddit.py, or to see the voice-of-customer
  dashboard rendering with real data. Drives the render + screenshot path with
  Node + headless Chromium and a bundled real-data sample — no API key needed.
allowed-tools: Bash, Read, Write
---

# Run: reddit-research-agent (reddit-voc dashboard)

This project is a Claude Code skill (`reddit-voc`) with two halves:

1. **Fetch** — `fetch_reddit.py`, a stdlib-only Python CLI that hits the
   ScrapeCreators Reddit API and dumps raw thread/comment JSON. **Needs a paid
   API key.**
2. **Render** — Claude reads that JSON, writes a synthesized `voc.json`, and
   that JSON is stamped into `dashboard-template.html` to produce a
   self-contained dark `dashboard.html`. **This is the product surface.**

The agent path here drives the **render half** end to end with a committed
real-data sample, so you can change the template or the markup and *see* the
result without any key or network. Paths below are relative to
`reddit-research-agent/` (the unit root).

## Prerequisites

Node 22 and headless Chromium are already on this image — nothing to install.
The driver loads Playwright from `/opt/node22/lib/node_modules` and finds the
bundled Chromium under `/opt/pw-browsers/chromium-*`. Python 3 is only needed
for the (key-gated) live fetch.

## Run (agent path) — render + screenshot

Two scripts live in this skill dir. Run them from there:

```bash
cd .claude/skills/run-reddit-research-agent
node render.mjs        # sample/voc.json + ../../../dashboard-template.html -> sample/dashboard.html
node shoot.mjs         # sample/dashboard.html -> sample/dashboard.png (full page, 1320px @2x)
```

`render.mjs` fills every `{{PLACEHOLDER}}`, clones each `<!-- REPEAT -->` block
once per item, sets each meter's `--v`, and wires every quote/phrase/angle to
its real Reddit permalink. It prints the card counts and warns about any
unfilled placeholder (one expected warning: `{{PLACEHOLDER}}` appears in the
template's own instructional HTML comment — that is not a real slot).

Then **look at `sample/dashboard.png`** (Read it). A correct render shows the
"Collagen VOC Report" header, a 2 / 28 / 2 / 4 stat strip, ranked pain cards
with intensity bars, desires, objections, a swipe file, and a hero of 9 ad
angles — all dark theme.

To preview your own analysis, edit `sample/voc.json` (or point at another file:
`node render.mjs path/to/voc.json` then `node shoot.mjs`) and re-run both.

### What the sample is

`sample/` is a real run captured during this skill's authoring via the
ScrapeCreators Reddit API — the *same two endpoints* `fetch_reddit.py` calls
(`/v1/reddit/subreddit/search` and `/v1/reddit/post/comments`), topic
`collagen`, subreddits `Supplements` + `SkincareAddiction`. `run_meta.json` /
`thread-01.json` / `thread-02.json` are the raw fetch-shape JSON (trimmed to a
representative comment subset); `voc.json` is the synthesized analysis; all
permalinks are real and clickable.

## Live fetch (needs a key) — the data half

Not exercised by the agent path above (it requires a paid key). To pull fresh
data instead of the sample:

```bash
echo 'YOUR_SCRAPECREATORS_KEY' > scrapecreators-key.txt   # gitignored; never commit
python3 fetch_reddit.py --query "collagen" \
  --subreddits Supplements SkincareAddiction --threads 8
```

It writes a `runs/<slug>-<stamp>/` folder (raw JSON) and prints the path. Then
you (Claude) read that JSON, write a `voc.json` like `sample/voc.json`, and run
`render.mjs` / `shoot.mjs` pointed at it. Cost ≈ 1 credit per subreddit + 1 per
thread (default run ≈ 10). Get a free key (≈100 credits) at
https://scrapecreators.com.

## Gotchas

- **`runs/` is gitignored; `sample/` is not.** Render output for the live
  pipeline lands in `runs/` and won't be committed. The committed reference
  lives in this skill's `sample/` dir on purpose.
- **`render.mjs` relies on document order**, not block labels: the five
  `<!-- REPEAT -->` blocks must stay in the order pains → desires → objections
  → phrases → angles. If you reorder sections in the template, update the
  `sections` array in `render.mjs` to match.
- **`{{PLACEHOLDER}}` left-over warning is expected** — it's text inside the
  template's top instructional comment, not a fillable slot. Any *other*
  leftover token is a real bug in your `voc.json`.
- **Quotes must be verbatim with a real permalink.** `render.mjs` HTML-escapes
  text but does not invent or validate links — garbage in `voc.json` = a dead
  link in the dashboard. The whole demo's credibility is the clickable quotes.
- **`shoot.mjs` launches with `--no-sandbox`** (required as root in this
  container) and pins the bundled Chromium by globbing `/opt/pw-browsers`, so it
  doesn't depend on `PLAYWRIGHT_BROWSERS_PATH` being set.

## Troubleshooting

- `Cannot find package 'playwright'` → you're not on this image's Node setup;
  the driver hard-codes `/opt/node22/lib/node_modules`. Adjust the
  `createRequire(...)` path in `shoot.mjs` to wherever Playwright is installed.
- `shoot.mjs` hangs on `networkidle` → the template should be fully
  self-contained (no external fonts/scripts). If you added a remote asset,
  it'll stall; inline it or switch `waitUntil` to `"load"`.
- `render.mjs` warns about a real placeholder (not `{{PLACEHOLDER}}`) → that
  field is missing/misspelled in your `voc.json`; the matching `sections`
  mapping expects it.
