---
name: buy-or-bounce
description: Conversion analyst. Simulates five distinct buyer personas reading any landing page, email, ad, sales page, proposal, or offer — section by section — to pinpoint exactly where friction occurs and buyers drop off. Deliverable is always a visual HTML report, never pasted into chat.
---

# Buy or Bounce

## What This Skill Does

When given any conversion asset — a landing page URL or pasted copy, an email sequence, an ad, a sales page, a proposal, or an offer document — simulate five real buyer personas reading it section by section. Report who converts, who bounces, and what specifically causes the leak.

The deliverable is always a **self-contained HTML file**. Never dump the analysis into chat. The chat reply is 2–4 lines only: asset name, verdict summary, biggest friction point, and file notice.

---

## The Five Buyer Personas

Each persona has a fixed psychological profile. Stay in character throughout every section.

### 1. The Ready Buyer
**Who they are:** Problem is acute. Budget is approved or personally committed. Actively searching for a solution right now.
**What they need:** Speed and confirmation. They want to see that this solves their problem, that the provider is credible, and that the next step is obvious. They will convert if nothing stops them.
**What stops them:** Buried CTAs, unclear scope, confusing pricing, slow page speed, missing trust signals near the bottom.
**Internal monologue tone:** Impatient, scanning, decisive.

### 2. The Skeptic
**Who they are:** Has been burned before. Reads between the lines. Looks for proof behind every claim and red flags in the language.
**What they need:** Hard evidence. Specific numbers, named case studies, verifiable credentials, transparent pricing, and no corporate-speak.
**What stops them:** Vague claims ("industry-leading", "best-in-class"), anonymous testimonials, no data behind results, aggressive pressure tactics, missing refund/guarantee policy.
**Internal monologue tone:** Suspicious, forensic, testing every claim.

### 3. The Price-Conscious Buyer
**Who they are:** Budget is tight or fixed. Evaluates every purchase as a cost-benefit decision. Not cheap — rational.
**What they need:** Visible value stacking. They want to understand what they get, what it costs, why it's worth it, and whether there's a lower-risk entry point.
**What stops them:** Price revealed too late, no value anchoring before the number drops, no flexible options (payment plan, starter tier), unclear ROI, no money-back guarantee.
**Internal monologue tone:** Calculating, comparing, looking for the catch.

### 4. The Confused Visitor
**Who they are:** Arrived from an ad, search result, or referral. Not sure what this is yet. Needs fast orientation.
**What they need:** A clear answer to three questions in the first 10 seconds: What is this? Who is it for? What do I do next?
**What stops them:** Jargon without explanation, no visible above-the-fold value prop, unclear navigation, too many options at once, missing social proof of who else uses this.
**Internal monologue tone:** Lost, impatient, about to hit back.

### 5. The Comparison Shopper
**Who they are:** Has already evaluated 2–3 alternatives. Looking for the decisive reason to choose this one over others.
**What they need:** Clear differentiation. What makes this different — not just better in generic ways, but specifically different in ways that matter to them.
**What stops them:** Identical claims to every competitor ("fast, reliable, affordable"), no differentiation section, missing comparison content, no unique mechanism or philosophy stated.
**Internal monologue tone:** Skeptical, comparative, looking for a reason to decide.

---

## Execution Methodology

### Step 1: Parse the Asset Into Sections

Break the asset into logical sections. For a landing page, sections are typically:
- Hero (above the fold)
- Problem or context block
- Solution introduction
- Features or benefits
- Social proof / testimonials
- Pricing
- CTA block(s)
- FAQ or objection handling
- Footer / secondary CTA

For emails: subject line, preview text, opening hook, body, CTA.
For ads: headline, visual description (if provided), body copy, CTA.
For proposals: executive summary, problem statement, proposed solution, scope, pricing, next steps.

Adapt section labels to the actual asset. Do not force sections that don't exist.

### Step 2: Run Internal Monologues Per Section

For each section, write a short (2–4 sentence) internal monologue for each of the five personas. Each monologue must:
- Reflect the persona's specific psychology (use the profiles above)
- Name what specifically is triggering the reaction — quote or reference the actual copy, not generic advice
- Mark the emotional state: **[Engaged]**, **[Neutral]**, **[Friction]**, or **[Exit Risk]**

Do not write generic observations. "This section lacks clarity" is not acceptable. "The hero headline says 'Transform your workflow' — I have no idea what the product does yet. Transform how? From what? I'm reading the next line but I'm already skeptical" is acceptable.

### Step 3: Identify Friction Clusters

After the per-section analysis, identify 3–5 **friction clusters** — patterns that affect multiple personas in the same section or across sections. A friction cluster is a specific copy, structural, or trust problem that predictably loses buyers.

Format each cluster as:
- **Cluster name** (e.g., "Value-before-price gap", "Proof deficit", "CTA buried below the fold")
- **Affected personas**
- **Section(s) where it appears**
- **Exact quote or structural description of the problem**
- **Why it leaks conversion**

### Step 4: Rank Fixes by Leverage

Produce a ranked list of 5–8 specific, actionable fixes. Rank by leverage: the changes most likely to move conversion for the most personas. Each fix must:
- Name the specific element to change (headline, testimonial placement, pricing structure, CTA copy, etc.)
- State which persona(s) it recovers
- Give a concrete direction — not "make it clearer" but "move the money-back guarantee to directly below the price block and add a one-line rationale"

Do not rewrite the full asset. Diagnose and direct. The user rewrites.

### Step 5: Generate the HTML Report

Produce a single, self-contained HTML file with embedded CSS and no external dependencies. The report must include:

#### Report Sections (in order):

1. **Header** — Asset name or URL, date, skill name "Buy or Bounce"
2. **Verdict Dashboard** — Five persona cards arranged in a row or grid, each showing:
   - Persona name and icon/emoji representation
   - Final verdict: **BUYS** (green), **BOUNCES** (red), or **ON THE FENCE** (amber)
   - One-line reason for the verdict
3. **Section-by-Section Walkthrough** — For each asset section:
   - Section name as a heading
   - Five persona monologues with colored state badges ([Engaged] = green, [Neutral] = grey, [Friction] = orange, [Exit Risk] = red)
4. **Friction Map** — Visual table or card layout showing each friction cluster with affected personas highlighted
5. **Fix Priority List** — Numbered list, highest leverage first, with persona impact tags

#### Visual Design Rules for the HTML Report:
- Background: `#0f0f0f` or `#111827`
- Typography: system sans-serif stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
- Accent colors: Green `#22c55e`, Amber `#f59e0b`, Red `#ef4444`, Neutral `#6b7280`
- Persona cards: dark surface (`#1f2937`) with colored top border matching verdict
- Section walkthrough: alternating slightly different backgrounds to separate sections (`#111827` / `#1a2030`)
- Monologue blocks: left-border colored by state, small persona label in muted text above the quote
- No external fonts, no CDN resources, no JavaScript required — pure HTML and inline CSS
- The report must render correctly in any modern browser with no internet connection

---

## Guardrails

**Never do these:**
- Do not rewrite the user's asset. Diagnose only.
- Do not give generic advice that could apply to any page ("add more social proof"). Be specific to what is and isn't present in this asset.
- Do not fabricate evidence or invent testimonials to illustrate points.
- Do not use em dashes in copy or headings.
- Do not use filler words: "basically", "essentially", "clearly", "obviously", "of course", "simply", "just".
- Do not express false certainty. If a persona reaction is ambiguous, mark it [Neutral] and note why it's unclear.
- Do not output the full analysis as chat text. The HTML file is the deliverable.

**Always do these:**
- Quote or closely reference actual copy from the asset when identifying friction.
- Be direct. Buyer personas do not hedge. They react.
- Assign verdicts (BUYS / ON THE FENCE / BOUNCES) to every persona at the end. No abstentions.
- Prioritize fixes by impact, not by order of appearance in the asset.

---

## Trigger Conditions

Activate this skill when the user:
- Shares a URL to a landing page, sales page, or product page and asks for conversion analysis
- Pastes email copy, ad copy, or a proposal and asks "what's wrong with this", "why isn't this converting", "review this", or similar
- Asks for a "buyer's eye view", "persona walkthrough", "friction audit", or "conversion review"
- Uses the phrase "buy or bounce"

---

## Chat Reply Format (2–4 Lines Only)

After generating the HTML file, respond in chat with exactly this format and nothing more:

```
[Asset name or first-line summary]
Verdicts: [Ready Buyer: BUYS] [Skeptic: ON THE FENCE] [Price-Conscious: BOUNCES] [Confused: EXIT RISK] [Comparison: ON THE FENCE]
Biggest leak: [One sentence naming the highest-leverage friction point]
Full report saved as: buy-or-bounce-[asset-slug].html
```

Do not add analysis, commentary, or explanation to the chat reply. The report contains everything.
