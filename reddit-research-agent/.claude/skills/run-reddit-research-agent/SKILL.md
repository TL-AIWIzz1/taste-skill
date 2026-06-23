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

## Live fetch — running a fresh report

There are two ways to pull fresh Reddit data. **In this hosted Claude Code
environment, use the MCP path** — the standalone script's API host is blocked by
the egress policy here (see Gotchas).

### A. MCP path (works in this environment — preferred)

The `Scrape_Creators` MCP exposes the *same two endpoints* the script calls, but
server-side, so it isn't subject to this container's outbound policy. To run a
report for topic `<TOPIC>` across 1–2 subreddits:

1. **Search** each subreddit:
   `mcp__Scrape_Creators__v1_reddit_subreddit_search` with
   `{ subreddit, query: <TOPIC>, sort: "relevance", timeframe: "year" }`.
   Rank the returned `posts` by `num_comments` (most discussion = most VOC gold)
   and pick the top N (4–8).
2. **Pull comments** on each picked thread:
   `mcp__Scrape_Creators__v1_reddit_post_comments` with `{ url, trim: true }`.
   Keep each comment's `url`/`permalink` — that's the clickable deep-link.
3. **Synthesize** a `voc.json` (same shape as `sample/voc.json`): mine pains,
   desires, objections, swipe phrases, and 8–10 ad angles. Every quote must be
   **verbatim** from the JSON and carry its **real permalink**. Skip
   `[deleted]`/`[removed]`/bot comments.
4. **Render + shoot:**
   ```bash
   cd .claude/skills/run-reddit-research-agent
   node render.mjs sample/voc.json && node shoot.mjs
   ```
   (or write your `voc.json` elsewhere and pass its path to `render.mjs`).
5. Read `sample/dashboard.png` and hand the user `dashboard.html` + the angle.

### B. Standalone script (for a normal machine, not this sandbox)

```bash
echo 'YOUR_SCRAPECREATORS_KEY' > scrapecreators-key.txt   # gitignored; never commit
python3 fetch_reddit.py --query "collagen" \
  --subreddits Supplements SkincareAddiction --threads 8
```

It writes a `runs/<slug>-<stamp>/` folder (raw JSON) and prints the path; then
synthesize a `voc.json` from it and render as above. Cost ≈ 1 credit per
subreddit + 1 per thread. Free key (≈100 credits) at https://scrapecreators.com.
**This path fails inside the hosted environment** with
`Tunnel connection failed: 403` because `api.scrapecreators.com` is not on the
egress allow-list — use path A here.

## Run: Competitor Ad Teardown × VOC (merged dashboard)

A second dashboard merges a **Meta Ad Library competitor teardown** with the
Reddit VOC, so you can see what competitors actually advertise vs. what
customers actually say. Driver + template:

```bash
cd .claude/skills/run-reddit-research-agent
node render-teardown.mjs sample/collagen-teardown.json teardown-template.html sample/teardown.html
node shoot.mjs sample/teardown.html sample/teardown.png
```

`teardown-template.html` has four `<!-- REPEAT -->` blocks in order
**ads → plays → gaps → angles**; `render-teardown.mjs` fills them from a JSON
(`sample/collagen-teardown.json` is a real, worked example). Sections:
1. **Competitor ads working now** — ranked by *days live* (longevity ≈ the ad
   converts), each linked to the Meta Ad Library.
2. **Recurring plays** — patterns across their library.
3. **VOC × Ad gap** — real Reddit pains tagged `Ignored by their ads` /
   `Heavily run`. This is the whitespace.
4. **Your openings** — 8–10 angles aimed at the gaps, in customer language.

### Fetching ad data (hosted environment)

Use the `Scrape_Creators` Facebook Ad Library MCP tools (server-side, so they
work here — same reason the Reddit MCP does):
- `mcp__Scrape_Creators__v1_facebook_adLibrary_search_companies` → get a
  brand's `page_id`.
- `mcp__Scrape_Creators__v1_facebook_adLibrary_company_ads` (`pageId` or
  `companyName`, `status: ACTIVE`, `trim: true`) → their live ads. Each ad has
  `start_date` (epoch), `is_active`, `publisher_platform`, `snapshot.body.text`,
  `snapshot.cta_text`, and `url`. **Days live = (now − start_date) / 86400** —
  sort descending to surface winners.
- `..._search_ads` (keyword) and `..._ad_transcript` (video ads) also exist.

Large libraries blow the tool-output limit and get saved to a file; parse with
`jq` (see how `collagen-teardown.json` was built).

## Gotchas

- **B2B SaaS barely advertises on Meta.** Confirmed live: ChurnKey has no ad
  page; Userpilot's page has 0 active ads. The Ad Library is rich for
  **DTC/consumer** brands (supplements, beauty, apparel) and thin for B2B SaaS —
  pick the teardown target accordingly.
- **Ad Library shows creative, copy, start date, platforms — not spend or
  impressions** for normal (non-political) ads. Use *longevity* and *number of
  active variants* as the "what's working" proxy.

- **The Python fetch script can't reach the API from this hosted environment.**
  `api.scrapecreators.com` is not on the egress allow-list, so
  `fetch_reddit.py` dies with `Tunnel connection failed: 403 Forbidden`. The
  ScrapeCreators **MCP** is unaffected (server-side) — use the MCP path above
  for live fetches here.
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
