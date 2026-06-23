#!/usr/bin/env python3
"""
Reddit VOC — thin fetch layer.

Searches each target subreddit for a topic, ranks threads by how much real
discussion they have, pulls the comments on the top threads, and dumps
everything as raw JSON for Claude to synthesize into a dashboard.

Deliberately dumb: it fetches and saves. It does NOT analyze, score sentiment,
or shape the data for any particular dashboard layout. Synthesis happens later
by reading the JSON, so it adapts to whatever shape the API returns.

Usage:
  python3 fetch_reddit.py \
      --query "collagen" \
      --subreddits Supplements SkincareAddiction \
      --threads 8 \
      --sort relevance \
      --timeframe year \
      --outdir runs

Auth: reads the API key from (in order)
  1. SCRAPECREATORS_API_KEY env var
  2. scrapecreators-key.txt in the current dir or any parent dir
The key is never printed or written to any output file.
"""

import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request
import urllib.error
from datetime import datetime, timezone

BASE = "https://api.scrapecreators.com"


# --------------------------------------------------------------------------- #
# Auth
# --------------------------------------------------------------------------- #
def load_api_key():
    key = os.environ.get("SCRAPECREATORS_API_KEY", "").strip()
    if key:
        return key
    d = os.getcwd()
    while True:
        candidate = os.path.join(d, "scrapecreators-key.txt")
        if os.path.isfile(candidate):
            with open(candidate, "r") as f:
                key = f.read().strip()
            if key:
                return key
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    sys.exit(
        "ERROR: No API key found.\n"
        "  Put your ScrapeCreators key in scrapecreators-key.txt (project root)\n"
        "  or set the SCRAPECREATORS_API_KEY environment variable.\n"
        "  Get a key at https://scrapecreators.com (free 100 credits)."
    )


# --------------------------------------------------------------------------- #
# HTTP
# --------------------------------------------------------------------------- #
def api_get(path, params, key):
    """GET a ScrapeCreators endpoint. Returns parsed JSON or raises."""
    url = f"{BASE}{path}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"x-api-key": key})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "ignore")[:300]
            if e.code in (429, 500, 502, 503) and attempt < 2:
                time.sleep(2 * (attempt + 1))
                continue
            raise SystemExit(f"ERROR: {path} returned HTTP {e.code}: {body}")
        except urllib.error.URLError as e:
            if attempt < 2:
                time.sleep(2 * (attempt + 1))
                continue
            raise SystemExit(f"ERROR: could not reach {path}: {e}")


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def first(d, *keys, default=None):
    for k in keys:
        if isinstance(d, dict) and d.get(k) is not None:
            return d[k]
    return default


def flatten_comments(node, out, depth=0):
    """Walk top-level comments and nested replies into a flat list of dicts."""
    if isinstance(node, dict):
        items = node.get("items") or node.get("comments") or []
    elif isinstance(node, list):
        items = node
    else:
        return
    for c in items:
        if not isinstance(c, dict):
            continue
        body = (c.get("body") or "").strip()
        if body and body not in ("[deleted]", "[removed]"):
            out.append(
                {
                    "author": c.get("author"),
                    "body": body,
                    "score": first(c, "votes", "ups", "score", "likes", default=0),
                    "depth": depth,
                    "permalink": c.get("url") or c.get("permalink"),
                }
            )
        replies = c.get("replies")
        if replies:
            flatten_comments(replies, out, depth + 1)


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--query", required=True)
    ap.add_argument("--subreddits", nargs="+", required=True)
    ap.add_argument("--threads", type=int, default=8)
    ap.add_argument("--sort", default="relevance")
    ap.add_argument("--timeframe", default="year")
    ap.add_argument("--outdir", default="runs")
    args = ap.parse_args()

    key = load_api_key()
    credits = 0

    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    slug = "".join(ch if ch.isalnum() else "-" for ch in args.query.lower()).strip("-")
    run_dir = os.path.join(args.outdir, f"{slug}-{stamp}")
    os.makedirs(run_dir, exist_ok=True)

    # ---- Step 1: search each subreddit ---------------------------------- #
    all_posts = []
    for sub in args.subreddits:
        print(f"  searching r/{sub} for '{args.query}' ...", file=sys.stderr)
        data = api_get(
            "/v1/reddit/subreddit/search",
            {
                "subreddit": sub,
                "query": args.query,
                "sort": args.sort,
                "timeframe": args.timeframe,
            },
            key,
        )
        credits += 1
        with open(os.path.join(run_dir, f"search-{sub}.json"), "w") as f:
            json.dump(data, f, indent=2)
        for p in data.get("posts", []) or []:
            sub_name = sub
            if isinstance(p.get("subreddit"), dict):
                sub_name = p["subreddit"].get("name", sub)
            all_posts.append(
                {
                    "title": p.get("title"),
                    "url": p.get("url"),
                    "subreddit": sub_name,
                    "votes": first(p, "votes", "score", "ups", default=0),
                    "num_comments": first(p, "num_comments", default=0),
                    "created_at": first(p, "created_at_iso", "created_at"),
                }
            )

    # ---- Rank: most-discussed first (comments = VOC gold) --------------- #
    seen, ranked = set(), []
    for p in sorted(all_posts, key=lambda x: (x["num_comments"] or 0, x["votes"] or 0), reverse=True):
        if not p["url"] or p["url"] in seen:
            continue
        seen.add(p["url"])
        ranked.append(p)
    selected = ranked[: args.threads]
    print(f"  found {len(ranked)} unique threads, pulling comments on top {len(selected)}", file=sys.stderr)

    # ---- Step 2: pull comments on each selected thread ------------------ #
    threads, total_comments = [], 0
    for i, p in enumerate(selected, 1):
        print(f"  [{i}/{len(selected)}] r/{p['subreddit']}: {(p['title'] or '')[:60]}", file=sys.stderr)
        data = api_get("/v1/reddit/post/comments", {"url": p["url"], "trim": "true"}, key)
        credits += 1
        flat = []
        flatten_comments(data.get("comments", []), flat)
        total_comments += len(flat)
        thread = {
            "rank": i,
            "title": p["title"],
            "url": p["url"],
            "subreddit": p["subreddit"],
            "votes": p["votes"],
            "num_comments": p["num_comments"],
            "post_body": first(data.get("post", {}) or {}, "selftext", "body", default=""),
            "comments": sorted(flat, key=lambda c: c["score"] or 0, reverse=True),
        }
        threads.append(thread)
        with open(os.path.join(run_dir, f"thread-{i:02d}.json"), "w") as f:
            json.dump(thread, f, indent=2)

    # ---- Run metadata (header-strip stats live here) ------------------- #
    meta = {
        "query": args.query,
        "subreddits": args.subreddits,
        "sort": args.sort,
        "timeframe": args.timeframe,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "threads_pulled": len(selected),
        "comments_analyzed": total_comments,
        "subreddits_hit": len(args.subreddits),
        "credits_used": credits,
        "threads": [
            {k: t[k] for k in ("rank", "title", "url", "subreddit", "votes", "num_comments")}
            for t in threads
        ],
    }
    with open(os.path.join(run_dir, "run_meta.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print(
        f"\nDONE. {len(selected)} threads, {total_comments} comments, "
        f"{credits} credits.\nRaw JSON: {run_dir}\nRUN_DIR={run_dir}",
        file=sys.stderr,
    )
    # stdout = machine-readable handoff for the skill
    print(run_dir)


if __name__ == "__main__":
    main()
