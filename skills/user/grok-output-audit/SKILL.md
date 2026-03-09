# SKILL: grok-output-audit
**Version:** 1.0
**Owner:** The Sovereign Ledger (@BannedLuigi)
**Read this before:** Any task where Grok output (scout reports, sentiment scans, prospect lists) is being processed.

---

## 1. IDENTITY & PURPOSE

This skill defines how Claude processes output from Grok. Grok is used as a scout layer — it finds prospects, scans sentiment, and surfaces signal from X/Twitter. Claude's role is not to re-explain what Grok found, but to validate it, score it, and translate it into a deployment-ready package.

---

## 2. FRAMEWORK REFERENCE

### 2.1 Operations Intelligence Report Format

When Grok output is processed, the output format is always the Operations Intelligence Report. This is the standard translation layer between Grok findings and deployment action.

**Format:**
```
## OPERATIONS INTELLIGENCE REPORT
Date: [YYYY-MM-DD]
Source: Grok Scout — [scan type]
Processed by: Claude (sovereign-ledger-content + grok-output-audit)

---

### TIER 1 PROSPECTS
[Handle] | [Estimated MRR range] | [Gap detected] | [Confidence: X/10]
[Handle] | [Estimated MRR range] | [Gap detected] | [Confidence: X/10]

### TIER 2 PROSPECTS
[Handle] | [Estimated MRR range] | [Gap detected] | [Confidence: X/10]

### TIER 3 — MONITOR ONLY
[Handle] | [Signal detected] | [Why not ICP]

---

### VALIDATED INSIGHTS
[Key finding 1 from Grok, validated against ICP criteria]
[Key finding 2]
[Key finding 3]

### FLAGGED (GROK ERRORS / MISCLASSIFICATIONS)
[Any Grok output that doesn't hold up to ICP scrutiny — with reason]

### DEPLOYMENT PACKAGE
[For each Tier 1 prospect: comment draft using sovereign-diagnostic-commenting templates]
```

### 2.2 Prospect Quality Scoring Rubric

Score each prospect Grok surfaces on a 1–10 confidence scale:

| Factor | Max Points | Scoring Criteria |
|---|---|---|
| Revenue signal strength | 3 | 3 = explicit MRR mentioned; 2 = strong proxy; 1 = weak proxy; 0 = none |
| Operational pain language | 3 | 3 = specific, quantified; 2 = named problem; 1 = vague frustration; 0 = absent |
| ICP match (stage, product) | 2 | 2 = clear SaaS post-PMF; 1 = probable; 0 = mismatch |
| Engagement window | 2 | 2 = posted within 24h; 1 = within 72h; 0 = stale |

**Threshold:**
- 7–10: Tier 1 (act now)
- 4–6: Tier 2 (monitor, light engagement)
- 0–3: Tier 3 (do not engage)

### 2.3 Grok-Specific Validation Rules

Grok is strong at surface-level signal detection but makes specific errors that require correction:

| Common Grok Error | Validation Check |
|---|---|
| Includes influencers/creators as prospects | Check: does the account have a SaaS product? Not a course, not a newsletter |
| Overstates revenue signals | Verify: is this an explicit MRR mention or a lifestyle inference? |
| Flags pre-PMF founders as prospects | Check: are they talking about customers or building? |
| Misses the Gap type | Re-classify using the 5 Gaps framework after reading their recent posts |
| Includes competitors or known accounts | Flag and remove — do not engage publicly |

---

## 3. EXECUTION RULES

1. When Grok output is pasted, do not re-explain what Grok said. Audit it immediately.
2. Score every prospect using the 4-factor rubric. No narrative scoring — use the number.
3. Re-classify every Grok-identified gap against the 5 Gaps framework. Grok's gap labeling is approximate.
4. Separate Tier 1, Tier 2, Tier 3 explicitly. Do not present as a single undifferentiated list.
5. For every Grok misclassification, note the reason. This improves future Grok prompt calibration.
6. For every Tier 1 prospect, produce a comment draft from the `sovereign-diagnostic-commenting` skill.
7. Output format is always the Operations Intelligence Report. Never a narrative summary.

---

## 4. TEMPLATES

### 4.1 Grok Scout Report Processing Prompt

When Grok has run a prospect scan, provide this framing in the session:

```
Grok Scout Output — [Scan Type: e.g., "SaaS founders complaining about churn"]
Platform: X/Twitter
Scan period: [date range]
Raw output: [paste Grok output below]

Process using grok-output-audit skill. Output: Operations Intelligence Report.
```

### 4.2 Validation Pass Template

For each prospect Grok surfaces:
```
Handle: @[handle]
Grok classification: [what Grok said]
Validation:
  - Revenue signal: [what was said / inferred / absent] → [score /3]
  - Op pain language: [quote or paraphrase] → [score /3]
  - ICP match: [SaaS? Post-PMF? Stage?] → [score /2]
  - Engagement window: [post date] → [score /2]
  Total confidence: [X/10] → Tier [1/2/3]
  Correct gap: [Gap name if different from Grok's]
  Action: [Comment now / Monitor / Skip]
```

---

## 5. ANTI-PATTERNS

- Summarizing Grok output narratively instead of running it through the scoring rubric
- Accepting Grok's gap classification without validating against the 5 Gaps framework
- Including Tier 3 prospects in the deployment package
- Outputting a single undifferentiated prospect list (must be tiered)
- Skipping the FLAGGED section — Grok errors must be documented for prompt improvement
- Producing narrative explanations instead of the Operations Intelligence Report format
