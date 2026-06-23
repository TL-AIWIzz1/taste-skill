---
name: reddit-voc
description: >-
  Reddit voice-of-customer research for DTC brands and creative agencies. Give
  it a product/category plus 1-2 subreddits and it searches Reddit for the
  threads where people actually discuss the problem, pulls the posts and
  comments, and synthesizes everything into one polished dark HTML dashboard:
  ranked pain points, desires, objections, a swipe file of liftable phrases,
  and a hero section of 8-10 ready-to-test ad angles. Use when the user wants
  customer language, ad angles, VOC research, or "what are people saying on
  Reddit about X" for ad copy. Triggers: reddit voc, voice of customer, ad
  angles from reddit, mine reddit for <product>.
allowed-tools: Bash, Read, Write
---

# Reddit VOC → Ad-Angle Dashboard

Turn real Reddit discussion into a command-center dashboard of customer language
and ready-to-test ad angles. Built for SCALE AI (DTC brands + creative agencies).

The pipeline is deliberately split: a **thin Python fetch layer** that only
fetches and dumps raw JSON, and a **synthesis step** (you, reading that JSON)
that does all the thinking. Don't push analysis into the script; don't rigidly
parse in synthesis — read the JSON and judge.

## Inputs

- **topic** — the product/category, e.g. `collagen`
- **subreddits** — 1-2 subreddit names, case-sensitive, no `r/`
  (e.g. `Supplements SkincareAddiction`)
- optional: `--threads` (default 8), `--sort` (default `relevance`),
  `--timeframe` (default `year`)

## Cost

1 search credit per subreddit + 1 per thread. Default run ≈ 2 + 8 = **10 credits**.
The free 100 credits ≈ 10 runs. Tell the user the estimate before a big run.

## Step 1 — Check the API key

The fetch script reads the key from `scrapecreators-key.txt` (project root) or the
`SCRAPECREATORS_API_KEY` env var. **Never print, echo, or paste the key into any
file or message.** If `scrapecreators-key.txt` is missing, ask the user to create
it: `echo 'YOUR_KEY' > scrapecreators-key.txt` (it's gitignored). Get a key at
https://scrapecreators.com (free 100 credits).

## Step 2 — Fetch (thin layer)

Run the script from the project root. Example for the collagen demo:

```bash
python3 .claude/skills/reddit-voc/fetch_reddit.py \
  --query "collagen" \
  --subreddits Supplements SkincareAddiction \
  --threads 8
```

It searches each subreddit, ranks threads by discussion volume, pulls comments on
the top N, and writes a run folder under `runs/`:

- `run_meta.json` — header-strip stats (threads, comments, subreddits, credits) + thread list
- `search-<sub>.json` — raw search responses
- `thread-NN.json` — each selected thread: title, url, subreddit, post body, and
  a `comments` list (flattened, sorted by score: `{author, body, score, depth, permalink}`).
  **`permalink` is the canonical URL of that exact comment on Reddit** — keep it
  with every quote you lift; it's what makes the dashboard quotes clickable.

The script prints the run folder path on stdout (and `RUN_DIR=...` on stderr).

## Step 3 — Synthesize (you read the JSON)

Read `run_meta.json` and every `thread-NN.json` in the run folder. Then mine them:

- **Pain points** — recurring complaints, "I can't / it doesn't / I hate that..."
- **Desires** — "I wish / I just want / what I'm looking for..."
- **Objections** — why they won't buy, what burned them, skepticism, wasted money
- **Swipe phrases** — short, vivid, verbatim strings worth lifting into ad copy
- **Ad angles** — 8-10, each a hook line built from the above, in customer language

Rules that keep it credible:
- **Every quote must be a real verbatim string from the JSON.** Never paraphrase a
  quote or invent one. Light trimming for length is fine; mark cuts with `…`.
- **Carry each quote's `permalink`** so it can deep-link to the exact comment. If a
  quote comes from the post body (selftext) instead of a comment, use the thread's
  `url`. Verify the URL exists in the JSON — never hand-build or guess one.
- Tag every quote with the subreddit it came from.
- Rank by genuine frequency/intensity across threads — don't make every bar the same.
  One loud comment ≠ a pattern; note when something is a single strong signal.
- Skip `[deleted]` / `[removed]` / bot/spam comments.

## Step 4 — Render the dashboard

Copy `dashboard-template.html` into the run folder as `dashboard.html` and fill it:

1. Replace every `{{PLACEHOLDER}}` (topic, subreddits, generated_at, the four stat
   numbers from `run_meta.json`).
2. For each `<!-- REPEAT -->` block, clone the card once per item and fill it.
   Add/remove cards to fit the evidence — **except the hero, which should land 8-10
   ad angles.** Don't pad sections to a fixed count.
3. **Set every `{{COMMENT_URL}}` to the real `permalink` (or thread `url`) for that
   quote/phrase/angle.** This is the demo's centerpiece — clicking any quote or swipe
   phrase must open the exact comment on Reddit in a new tab. No dead or guessed links.
4. Set each `.meter`'s inline `--v:NN` (0-100) to reflect real intensity.
5. In each `.angle`, the `.from` line cites which pain/desire/objection it's built on,
   linked to the source comment.
5. Leave the `<style>` block untouched — the dark command-center look is the point.

The file is self-contained (no external fonts/scripts/network) so it opens offline
and records cleanly. Finish by giving the user the path to `dashboard.html` and a
2-3 line readout of the sharpest angle you found.
