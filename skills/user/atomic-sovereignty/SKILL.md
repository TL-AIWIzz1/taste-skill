# SKILL: atomic-sovereignty
**Version:** 1.0
**Owner:** The Sovereign Ledger (@BannedLuigi)
**Read this before:** Any single-post generation, formatting, or distribution task.

---

## 1. IDENTITY & PURPOSE

This skill governs the format, structure, and distribution logic for single X/Twitter posts under The Sovereign Ledger brand. The Atomic Monolith is the primary post format — a standalone, self-contained diagnostic that does not require a thread to deliver its payload. It is the workhorse of the content calendar.

---

## 2. FRAMEWORK REFERENCE

### 2.1 The Atomic Monolith Format

A single post structured as a complete CIUN cycle within 280 characters or across 2–4 short paragraphs (for longer formats).

**Structure:**
```
[C — Context]
One sentence. Specific founder scenario. Present tense. No hedging.

[I — Insight]
1–2 sentences. The non-obvious diagnostic. Should contain a number.

[U — Utility]
1 sentence. The concrete lever. Specific, not general.

[N — Node]
1 sentence. CTA, reframe, or pull. No trailing question marks on CTAs.
```

**Character budget (280-char single post):**
- Context: ~60 chars
- Insight: ~100 chars
- Utility: ~60 chars
- Node: ~60 chars

### 2.2 Thread vs Single Post Decision Logic

Use a thread when:
- The Utility layer requires step-by-step breakdown (3+ steps)
- The content contains a matrix, table, or comparison
- The shadow rate math needs full showing-of-work
- The seasonal frame supports a narrative arc (Future Pressure especially)

Use a single post (Atomic Monolith) when:
- The Gap can be named and diagnosed in 1–2 sentences
- The Utility is a single lever, not a system
- The posting cadence calls for a gap between longer threads
- The CTA is a Hand-Raise (simple signal request)

**Default:** When in doubt, Atomic Monolith. Threads perform better when the single-post version can't hold the logic. Don't thread for length — thread for structure.

### 2.3 Visual Asset Integration

Every Atomic Monolith should have an optional companion image. The image does not repeat the text — it visualizes the math or the gap.

**Visual spec:**
- Background: Deep charcoal #121212 (not the brand Obsidian — this is print-optimized)
- Accent: Neon green #00FF41
- Labels: Clinical, sans-serif, all-caps for headers
- Data: Monospace font for numbers and formulas
- Ratio: 16:9 for timeline posts
- Style: Brutalist, forensic, no gradients, no stock photo aesthetics

**Use the `visual-asset-prompter` plugin to generate the image prompt from content concept.**

### 2.4 Timing Recommendations

| Day | Content Type | Notes |
|---|---|---|
| Monday | Future Pressure or Shadow Rate Gap | Founders start the week reviewing the prior week's ops |
| Wednesday | Retention or Pricing Gap | Mid-week engagement peak on X |
| Friday | Ops or Scale Gap | End-of-week reflection mode |
| Tuesday/Thursday | Reserved for comment engagement | Do not post Atomic Monoliths on back-to-back days |

**Optimal posting window:** 8:00–10:00 AM EST or 6:00–8:00 PM EST. Never post at :00 — post at :07, :13, :22. Avoids automated post clustering.

---

## 3. EXECUTION RULES

1. Every Atomic Monolith must pass character count before deployment. Use `character-counter-validator` plugin.
2. No em-dashes in final text (U+2014 —, U+2013 –, U+2015 ―). Replace with commas, periods, or colons.
3. The Insight layer must contain at least one number. If it doesn't, the post is not diagnostic — it's an opinion.
4. The Node layer is not optional. Every post must have a pull point.
5. Visual asset is optional but recommended for Shadow Rate and Scale Gap content.
6. Run `brand-voice-linter` plugin before flagging a post as deployment-ready.
7. CTA selection: apply Smurf Lure for unknown-problem Gaps (Shadow Rate, Pricing). Apply Hand-Raise for known-problem Gaps (Retention, Ops, Scale).

---

## 4. TEMPLATES

### 4.1 Shadow Rate Gap — Atomic Monolith

```
You're not underpaid. You're misallocated.

$180K ARR at 60hrs/week is a $57/hr Shadow Rate.
12 hours of support work per week = $35K/yr in misallocated capacity.

The hire isn't the fix. The playbook that makes the hire a 2-hour onboarding is.

Reply with your ARR and weekly hours. I'll run your Shadow Rate.
```

### 4.2 Retention Gap — Atomic Monolith

```
Your acquisition numbers are misleading you.

At 5% monthly churn, you replace 46% of your customer base every year
just to stay flat. CAC paid twice for customers you already had.

Net Revenue Retention below 100% means growth is a cost, not a compound.

If this is your ceiling, the fix isn't more leads.
```

### 4.3 Scale Gap — Atomic Monolith

```
You didn't hit a revenue ceiling. You hit a decision ceiling.

At $25K MRR with no documented decision layer, every new customer
adds to the founder's cognitive load, not the business's capacity.

The constraint isn't hours. It's the number of things that only work
when you're involved.

DM me LEDGER if you want the diagnostic.
```

---

## 5. ANTI-PATTERNS

- Writing a post that needs a thread to make sense (the Atomic Monolith is self-contained)
- Insight layer with no number — it's an opinion, not a diagnostic
- Missing the Node layer — a post without a pull has no distribution function
- Em-dashes in final output
- Motivational or inspiring tone ("You've got this", "The grind pays off")
- Vague Utility ("focus on systems") — must be specific ("document the decision that gets made 10x/week")
- Posting on consecutive days without the Tuesday/Thursday gap
- Using a thread format for content that fits in a single Atomic Monolith
