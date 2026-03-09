# SKILL: gemini-operations-refinement
**Version:** 1.0
**Owner:** The Sovereign Ledger (@BannedLuigi)
**Read this before:** Any task where Gemini output (Operations Reports, content recommendations, debate-format outputs) is being processed.

---

## 1. IDENTITY & PURPOSE

This skill defines how Claude processes output from Gemini Operations. Gemini functions as the Operations layer — it generates content recommendations, strategic reports, and the "PM vs Operations" debate format. Claude's role is to extract the clean deployment version, apply corrections, and validate CTA compliance. The goal is never to re-explain Gemini's reasoning — it's to extract and refine the executable output.

---

## 2. FRAMEWORK REFERENCE

### 2.1 The PM vs Operations Debate Format

Gemini often structures its content output as a simulated internal debate:
- **PM voice:** Advocates for aggressive growth positioning, reach-maximizing content, broader ICP
- **Operations voice:** Advocates for precision targeting, diagnostic depth, account health protocols

**Claude's role when this format appears:** Act as the final decision-maker, not a participant in the debate. Extract the deployment version that satisfies both voices without compromising either framework.

**Parsing protocol:**
1. Identify PM recommendations (usually: reach, hook strength, shareability)
2. Identify Operations recommendations (usually: ICP precision, CTA compliance, account safety)
3. Build the final post using: PM's hook + Operations' precision + Sovereign CTA Framework
4. Do not output the debate. Output only the clean, reconciled post.

### 2.2 Gemini Operations Report Structure

Gemini's standard output format for content sessions:

```
[SECTION 1: CONTEXT ANALYSIS]
What Gemini assessed about the current content environment

[SECTION 2: PM POSITION]
Content recommendations prioritizing reach and growth

[SECTION 3: OPERATIONS POSITION]
Corrections, risk flags, and precision adjustments

[SECTION 4: RECOMMENDED DEPLOYMENT PACKAGE]
Gemini's proposed final content

[SECTION 5: OPEN QUESTIONS]
Items Gemini flagged for human decision
```

**When processing this format:**
- Section 4 is the starting point, not Section 2 or 3
- Cross-validate Section 4 against the 5 Gaps + CIUN before using
- Section 5 Open Questions must be resolved before the content is deployment-ready

### 2.3 Gemini-Specific Drift Signals

Gemini produces high-quality strategic output but has predictable drift patterns that require correction:

| Drift Type | What It Looks Like | Correction |
|---|---|---|
| ICP broadening | Content written for "entrepreneurs" or "business owners" instead of SaaS founders | Tighten to $2K–$50K MRR SaaS founder language |
| Motivational drift | Inspirational tone creeping in ("Your hard work is paying off") | Replace with clinical diagnostic language |
| CTA softening | Vague CTAs ("Let me know what you think") | Replace with Smurf Lure or Hand-Raise from the CTA Framework |
| Over-explanation | Long setup before the insight | Cut to the diagnosis. Context layer must be ≤ 2 sentences. |
| Em-dash use | Standard in Gemini output | Systematic removal required |
| Generic examples | "Imagine you have a SaaS company..." | Replace with specific MRR-anchored scenarios |

### 2.4 CTA Compliance Validation

Every Gemini-recommended post must pass the Sovereign CTA Framework before deployment:

```
CTA CHECK
□ Is a CTA present?                           YES / NO (if NO: add one)
□ CTA type identified?                         Smurf Lure / Hand-Raise / None
□ Gap match: does CTA match the Gap?
  - Shadow Rate Gap → Smurf Lure
  - Pricing Gap → Smurf Lure
  - Retention Gap → Hand-Raise
  - Ops Gap → Hand-Raise
  - Scale Gap → Hand-Raise
□ CTA is specific (not "DM me for more")?      YES / NO
□ CTA is a command, not a question?            YES / NO
```

---

## 3. EXECUTION RULES

1. When Gemini output is pasted, do not re-explain what Gemini said. Extract and refine immediately.
2. Start from Section 4 (Recommended Deployment Package) of the Gemini Operations Report.
3. Run the Gemini Drift Check on the extracted content before making edits.
4. Apply all drift corrections before running CIUN compliance.
5. Run CTA Compliance Check. Add or replace CTA if needed.
6. Remove all em-dashes and banned words.
7. Output: clean deployment version only. No side-by-side comparison. No explanation of what was changed unless asked.
8. If Gemini's Section 5 has Open Questions, surface them as a numbered list after the deployment version. Do not resolve them without input.

---

## 4. TEMPLATES

### 4.1 Gemini Output Processing Session Framing

```
Gemini Operations Report — [Date]
Session context: [brief description of what was being built]
Raw Gemini output: [paste below]

Process using gemini-operations-refinement skill.
Output: clean deployment version + unresolved Open Questions (if any).
```

### 4.2 Refinement Output Format

```
## REFINED DEPLOYMENT VERSION

[Clean post, deployment-ready, CIUN-compliant, no em-dashes,
no banned words, correct CTA type]

---

## CORRECTIONS APPLIED
- [List of drift signals corrected, one line each]

## OPEN QUESTIONS (from Gemini Section 5)
1. [Question]
2. [Question]
```

---

## 5. ANTI-PATTERNS

- Re-explaining Gemini's debate or summarizing both positions before outputting the clean version
- Starting from the PM Position (Section 2) instead of the Recommended Deployment Package (Section 4)
- Leaving Gemini's CTAs in place without running the CTA Compliance Check
- Leaving em-dashes in the refined output (they appear in nearly every Gemini draft)
- Outputting a side-by-side "before/after" comparison unless explicitly asked for it
- Resolving Gemini's Open Questions without human input
- Retaining Gemini's ICP broadening (the refined version must speak to $2K–$50K MRR SaaS founders)
