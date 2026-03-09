# PLUGIN: character-counter-validator
**Version:** 1.0
**Owner:** The Sovereign Ledger (@BannedLuigi)
**Type:** Inline validation plugin — Claude executes this logic when invoked.

---

## INVOCATION

Invoke this plugin with: `Run character-counter-validator on [text]`
Or as part of an agent workflow: automatically runs before any X/Twitter post is marked deployment-ready.

---

## INPUT CONTRACT

```
INPUT: One of the following:
  - A single post (string)
  - A thread (array of strings, one per tweet)
  - A reply (string)

LABEL the input type:
  - "single post"
  - "thread: [N] tweets"
  - "reply"
```

---

## LOGIC

### Step 1: Character Count

Count every character in the text including:
- Letters
- Numbers
- Spaces
- Punctuation
- Line breaks (each line break = 1 character on X)
- Emoji (each emoji = 2 characters on X)

**URL handling:** On X, every URL is shortened to exactly 23 characters regardless of actual URL length. If the text contains a URL:
- Count the URL as 23 characters
- Note the URL separately in the output

### Step 2: Limit Check

| Format | Limit | Result if Over |
|---|---|---|
| Single post | 280 | FAIL — must trim |
| Thread tweet | 280 per tweet | FAIL for that tweet |
| Reply | 280 | FAIL — must trim |

### Step 3: Em-Dash Scan

Detect all three variants:
- `—` U+2014 em dash
- `–` U+2013 en dash
- `―` U+2015 horizontal bar

### Step 4: AI Signal Word Scan (Quick Check)

Check for the highest-priority AI signal words (subset of brand-voice-linter for quick pass):
- `delve`, `unleash`, `journey`, `unlock`, `elevate`, `game-changer`

This is a surface-level check. For comprehensive voice audit, run `brand-voice-linter`.

---

## OUTPUT FORMAT

**Single post:**
```
## CHARACTER COUNT REPORT

Input type: Single post
Character count: [N] / 280
Status: [PASS / FAIL]

[If FAIL:]
Over by: [N] characters
Suggested cuts:
  - Remove "[phrase]" (-[N] chars)
  - Shorten "[phrase]" to "[suggestion]" (-[N] chars)

EM-DASHES DETECTED: [YES / NONE]
[If YES: list each occurrence with character code and context]

AI SIGNAL WORDS: [YES / NONE]
[If YES: list each word]

DEPLOYMENT READY: [YES / NO — fix required]
```

**Thread:**
```
## CHARACTER COUNT REPORT

Input type: Thread — [N] tweets

Tweet 1: [N] / 280 — [PASS / FAIL]
Tweet 2: [N] / 280 — [PASS / FAIL]
[...]

FAILED TWEETS: [list tweet numbers that exceed 280]

EM-DASHES DETECTED: Tweet [N] — "[context]"

DEPLOYMENT READY: [YES / NO — list tweets that need trimming]
```

---

## INVOCATION EXAMPLE

**Input (single post):**
```
You're not underpaid. You're misallocated.

$180K ARR at 60hrs/week is a $57/hr Shadow Rate — 12 hours of support
per week is $35K/yr in misallocated capacity.

The hire isn't the fix. Reply with your ARR and I'll run it.
```

**Output:**
```
## CHARACTER COUNT REPORT

Input type: Single post
Character count: 246 / 280
Status: PASS

EM-DASHES DETECTED: YES
  - U+2014 (—) at "Shadow Rate — 12 hours"
  Fix: Replace with colon or period.
    Before: "Shadow Rate — 12 hours of support"
    After:  "Shadow Rate. 12 hours of support"

AI SIGNAL WORDS: NONE

DEPLOYMENT READY: NO — em-dash must be removed before deployment.
```

---

## NOTES

- Character count is the minimum gate. Never skip it.
- PASS on character count + em-dash detected = still NOT deployment-ready
- Only mark DEPLOYMENT READY: YES when all three checks clear (count, em-dashes, signal words)
- This plugin is a fast-pass check. Always follow with `brand-voice-linter` for comprehensive audit.
