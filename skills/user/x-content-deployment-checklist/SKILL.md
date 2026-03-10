# SKILL: x-content-deployment-checklist
**Version:** 1.0
**Owner:** The Sovereign Ledger (@BannedLuigi)
**Read this before:** Any content pre-deployment validation, format checking, or visual asset generation task.

---

## 1. IDENTITY & PURPOSE

This skill is the final gate before any content goes live on X/Twitter. It defines the validation steps, format rules, visual asset specifications, and account health protocols that ensure every post is deployment-ready and brand-compliant.

---

## 2. FRAMEWORK REFERENCE

### 2.1 X Character Limits

| Format | Limit | Notes |
|---|---|---|
| Single post | 280 characters | Hard limit. No exceptions. |
| Thread post | 280 characters per tweet | Each tweet validated independently |
| Reply | 280 characters | Subject to same rules |
| Quote tweet | 280 characters | Original tweet counts as embedded, not toward limit |

**Character count includes:** spaces, punctuation, line breaks, and emoji (if ever used).

**URLs:** Every URL on X is shortened to 23 characters regardless of actual length. Account for this in character budgets.

**Run `character-counter-validator` plugin on all content before marking as deployment-ready.**

### 2.2 Em-Dash Detection Protocol

Em-dashes are AI signal markers. They must be eliminated from all deployment content.

**Variants to detect and remove:**
| Character | Unicode | Name |
|---|---|---|
| — | U+2014 | Em dash |
| – | U+2013 | En dash |
| ― | U+2015 | Horizontal bar |

**Replacements:**
- Em-dash separating clauses → period or comma
- Em-dash before a punchline → colon
- Em-dash in a list → bullet point (if in a visual/image only)
- En-dash in ranges → use "to" or a hyphen: "$2K–$50K" → "$2K to $50K" or "$2K-$50K"

### 2.3 Visual Asset Specification

Every visual asset for The Sovereign Ledger follows this spec:

**Base spec:**
```
Background:  Deep charcoal #121212
Accent:      Neon green #00FF41
Secondary:   Steel grey #1F2833
Text color:  Silver #C5C6C7
Highlight:   Blueprint #66FCF1 (use sparingly, data callouts only)
Font:        JetBrains Mono or similar for data; Inter for labels
Ratio:       16:9 (1920×1080 for high-res, 1280×720 for standard)
Style:       Brutalist, forensic, clinical — no gradients, no glow effects,
             no stock aesthetic, no soft shadows
Labels:      All-caps, monospace, tight tracking
```

**Content types and visual treatment:**
| Content Type | Visual Approach |
|---|---|
| Shadow Rate calculation | Formula display with founder-specific numbers, highlighted result |
| Gap diagnosis | Split panel: "Current State" vs "Structural Cost" |
| Retention math | Chart or table showing churn compounding over 12 months |
| Comparison | Side-by-side, clinical labels, no decorative elements |
| Single stat | Large type, forensic label, source or assumption note |

**To generate the image prompt: use the `visual-asset-prompter` plugin with the content concept as input.**

### 2.4 CTA Selection Decision Tree

```
Is the founder's problem one they know they have?
│
├── NO → Use SMURF LURE CTA
│        "Your [Gap] is costing you $[X]. Reply with [input]
│         and I'll run the diagnostic."
│
└── YES → Use HAND-RAISE CTA
          "If this is your ceiling, DM me 'LEDGER' for the
           diagnostic. [Specific outcome they'll get]."
```

**Smurf Lure:** Used for Shadow Rate Gap and Pricing Gap content. Founder doesn't know the magnitude of the problem.

**Hand-Raise:** Used for Retention, Ops, and Scale Gap content. Founder knows the problem exists but not the mechanism.

### 2.5 Account Health Cool-Down Protocol

To maintain account safety and avoid X's automated engagement throttling:

| Rule | Threshold |
|---|---|
| Maximum posts per day | 3 (including replies) |
| Minimum gap between posts | 2 hours |
| Comment cool-down on same account | 7 days |
| Thread posts | Maximum 6 tweets per thread |
| DM outreach | Maximum 5 new DM threads per day |

**Red flags that trigger a cool-down day (no posts):**
- Any post gets reported
- Engagement rate drops below 1% for 3 consecutive posts
- Account receives a warning notification from X

---

## 3. EXECUTION RULES

1. Run character count validation before flagging any content as ready.
2. Scan for all three em-dash variants (U+2014, U+2013, U+2015) and eliminate.
3. Select CTA type before finalizing the Node layer.
4. Generate visual asset prompt for any content containing math or a Gap diagnosis.
5. Check posting day against the timing calendar (Mon/Wed/Fri cadence).
6. Confirm account health status — have the last 3 posts performed within normal range?
7. Thread vs single post decision: if content was flagged for a thread, confirm each tweet is ≤ 280 chars independently.

---

## 4. DEPLOYMENT CHECKLIST

Run this checklist on every piece of content before deployment:

```
PRE-DEPLOYMENT CHECKLIST

FORMAT
[ ] Character count ≤ 280 (single post) or per-tweet ≤ 280 (thread)
[ ] No em-dashes (U+2014 / U+2013 / U+2015)
[ ] No banned words (unleash, elevate, game-changer, delve,
    deep dive, journey, unlock)

STRUCTURE
[ ] Context layer present and specific
[ ] Insight layer contains at least one number
[ ] Utility layer is concrete (not generic)
[ ] Node layer is present (CTA or reframe)

VOICE
[ ] Tone is clinical/diagnostic, not motivational
[ ] No AI-slop transitions (In conclusion, It's important to note)
[ ] No trailing coaching questions

CTA
[ ] CTA type selected (Smurf Lure or Hand-Raise)
[ ] CTA matches the Gap being addressed

VISUAL
[ ] Visual asset prompt generated (if math/gap content)
[ ] Visual spec confirmed (16:9, #121212 bg, #00FF41 accent)

TIMING
[ ] Posting on Mon/Wed/Fri (standard cadence)
[ ] Time window: 8–10 AM EST or 6–8 PM EST
[ ] Not posting at :00 (use :07, :13, or :22)
[ ] Account cool-down status confirmed
```

---

## 5. ANTI-PATTERNS

- Deploying content without running character count
- Missing em-dash variants (the en-dash U+2013 is the most commonly missed)
- Using the wrong CTA type for the Gap (Smurf Lure on Ops content confuses readers)
- Posting on consecutive days (burns the Tuesday/Thursday gap)
- Skipping the visual asset for content that contains Shadow Rate math
- Deploying on a cool-down day
