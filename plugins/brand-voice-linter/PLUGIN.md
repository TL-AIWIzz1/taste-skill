# PLUGIN: brand-voice-linter
**Version:** 1.0
**Owner:** The Sovereign Ledger (@BannedLuigi)
**Type:** Inline validation plugin — Claude executes this logic when invoked.

---

## INVOCATION

Invoke this plugin with: `Run brand-voice-linter on [text block]`
Or as part of an agent workflow: Claude executes this automatically before any content is marked deployment-ready.

---

## INPUT CONTRACT

```
INPUT: Any block of text (post, comment, thread tweet, caption, or section of longer content)
FORMAT: Plain text or markdown
LENGTH: Any length — plugin scores line-by-line for precision
```

---

## LOGIC

### Step 1: Banned Words Scan

Scan the input for the following words/phrases. Each occurrence is a violation.

| Banned Word/Phrase | Why Banned |
|---|---|
| `unleash` | Hype language, not diagnostic |
| `elevate` | Vague, motivational |
| `game-changer` | Cliché, AI-slop signal |
| `delve` | AI-slop signal word |
| `deep dive` | AI-slop signal phrase |
| `journey` | Narrative fluff, not clinical |
| `unlock` | Hype language |
| `empower` | Motivational, off-voice |
| `transform` | Vague, overused |
| `leverage` | Business jargon, off-voice |
| `in conclusion` | AI-slop transition |
| `it's important to note` | AI-slop hedge |
| `it goes without saying` | AI-slop filler |
| `at the end of the day` | Cliché |
| `circle back` | Corporate jargon |

### Step 2: Em-Dash Detection

Scan for all three em-dash variants:
- U+2014 `—` (em dash)
- U+2013 `–` (en dash)
- U+2015 `―` (horizontal bar)

Each occurrence is a violation.

### Step 3: Voice Rules Check

Check for the following patterns:

| Rule | Violation Pattern | Example of Violation |
|---|---|---|
| No AI-slop compliment pattern | Text that opens with a compliment then pivots to a question | "Great insight! Have you considered..." |
| No OP rephrasing | Comment opens by summarizing what the OP said | "You mentioned that your churn is high. That's a real challenge." |
| Clinical not motivational | Presence of inspirational or encouraging tone | "You've got this!", "The hard work pays off", "Believe in your vision" |
| No trailing coaching questions | Post or comment ends with an open-ended encouragement question | "What steps will you take today?", "How does this resonate with you?" |
| No generic ICP language | References "entrepreneurs", "business owners", "leaders" without SaaS/MRR specificity | "Every entrepreneur faces this challenge." |

### Step 4: Scoring

Calculate:
```
Total possible points: 100
Deductions:
  - Each banned word occurrence:          -5 points
  - Each em-dash occurrence:              -3 points
  - Each voice rule violation:            -10 points
  - Generic ICP language (any instance):  -8 points

Score = 100 - total deductions
```

---

## OUTPUT FORMAT

```
## BRAND VOICE LINT REPORT

Score: [X]/100 — [PASS (≥85) / WARN (70–84) / FAIL (<70)]

### VIOLATIONS
[If none: "None detected."]

BANNED WORDS
- "[word]" — line [N]: [quoted context]
- "[word]" — line [N]: [quoted context]

EM-DASHES
- U+[code] at line [N]: "[quoted context]"

VOICE VIOLATIONS
- [Rule name] at line [N]: "[quoted context]"
  Fix: [specific replacement or instruction]

### CLEAN STATUS
[DEPLOYMENT READY / REQUIRES REVISION]
```

---

## INVOCATION EXAMPLE

**Input:**
```
Your journey to scale doesn't have to feel overwhelming. Every entrepreneur
faces this — but the ones who unlock growth are the ones who leverage their
strengths. Let me know how this resonates with you!
```

**Output:**
```
## BRAND VOICE LINT REPORT

Score: 42/100 — FAIL

### VIOLATIONS

BANNED WORDS
- "journey" — line 1: "Your journey to scale"
- "unlock" — line 2: "who unlock growth"
- "leverage" — line 2: "who leverage their strengths"

EM-DASHES
- U+2014 at line 1: "overwhelming. Every entrepreneur faces this —"

VOICE VIOLATIONS
- Generic ICP language at line 1: "Every entrepreneur"
  Fix: Replace with "Solo SaaS founders at $5K–$20K MRR" or equivalent
- Trailing coaching question at line 3: "Let me know how this resonates with you!"
  Fix: Remove. End with a diagnostic pull or CTA instead.
- Motivational tone at line 1–2: "doesn't have to feel overwhelming"
  Fix: Replace with clinical framing. State the cost or the mechanism.

### CLEAN STATUS
REQUIRES REVISION
```

---

## NOTES

- Run this plugin before marking any content deployment-ready
- A score below 85 requires revision before the content goes to the deployment checklist
- Scores 70–84 are warnable — small issues, can proceed with fixes noted
- Scores below 70 require a full rewrite
