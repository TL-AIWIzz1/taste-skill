# Reddit VOC → Ad-Angle Dashboard

**Created by: Mike Futia | SCALE AI: https://www.skool.com/scale-ai/about**

A [Claude Code](https://claude.com/claude-code) skill that turns real Reddit
discussion into a polished, dark **voice-of-customer dashboard** — ranked pain
points, desires, objections, a swipe file of liftable phrases, and 8–10
ready-to-test ad angles. Every quote deep-links to the exact comment on Reddit.

Built for DTC brands and creative agencies who want ad copy grounded in the
words customers actually use.

## How it works

The pipeline is deliberately split in two:

1. **Fetch (thin Python layer)** — `fetch_reddit.py` searches each subreddit for
   your topic, ranks threads by discussion volume, pulls the comments on the top
   N, and dumps everything as raw JSON. It does no analysis.
2. **Synthesize (Claude)** — Claude reads the JSON, mines the pains/desires/
   objections/phrases, and fills `dashboard-template.html` into a self-contained
   `dashboard.html` you can open offline.

## Prerequisites

- **[Claude Code](https://claude.com/claude-code)** — this skill runs inside it.
- **Python 3** — the fetch script is standard-library only (no `pip install`).
- **A free ScrapeCreators API key** — get one at
  [scrapecreators.com](https://scrapecreators.com). The free tier includes ~100
  credits (≈ 10 runs).

## Install

1. Copy this folder into your Claude Code skills directory:

   ```bash
   cp -r reddit-voc ~/.claude/skills/reddit-voc
   # or, per-project:  .claude/skills/reddit-voc
   ```

2. Add your API key. Copy the example file and drop your real key in:

   ```bash
   cp scrapecreators-key.example.txt scrapecreators-key.txt
   # then edit scrapecreators-key.txt and replace the placeholder
   ```

   The script reads the key from `scrapecreators-key.txt` (searched from the
   working directory upward) **or** the `SCRAPECREATORS_API_KEY` environment
   variable. `scrapecreators-key.txt` is gitignored so you can't commit it.

## Run it

In Claude Code, invoke the skill and describe what you want:

```
/reddit-voc collagen, subreddits Supplements and SkincareAddiction, 8 threads
```

Claude runs the fetch, synthesizes the findings, and renders the dashboard. You
can also run the fetch layer directly:

```bash
python3 fetch_reddit.py --query "collagen" --subreddits Supplements SkincareAddiction --threads 8
```

Output lands in a timestamped folder under `runs/` (raw JSON + the final
`dashboard.html`).

## Cost

1 credit per subreddit searched + 1 per thread pulled. A default run
(2 subreddits, 8 threads) ≈ **10 credits**.

## License

MIT
