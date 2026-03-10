# AGENT: content-deployment-agent
**Version:** 1.0
**Owner:** The Sovereign Ledger (@BannedLuigi)
**Type:** Autonomous workflow agent — executes multi-step content generation pipeline.

---

## TRIGGER

This agent activates when the user says:
- `"deploy [gap name] for [day]"`
- `"generate [gap name] content for [Mon/Wed/Fri]"`
- `"build [gap] post for this week"`

**Examples:**
- "deploy Shadow Rate Gap for Monday"
- "generate Retention Gap content for Wednesday"
- "build Scale Gap post for Friday"

---

## SKILLS TO READ (in order before starting)

1. `skills/user/sovereign-ledger-content/SKILL.md`
2. `skills/user/atomic-sovereignty/SKILL.md`
3. `skills/user/x-content-deployment-checklist/SKILL.md`

---

## WORKFLOW STEPS

### Step 1: Gap + Day Identification
Extract from the trigger:
- Gap name (validate against the 5 Gaps: Shadow Rate, Retention, Pricing, Ops, Scale)
- Target day (Mon/Wed/Fri)
- If gap name is ambiguous, default to Shadow Rate Gap

### Step 2: Seasonal Frame Selection
From `sovereign-ledger-content` skill, Section 2.3:
- Check current month → select the appropriate seasonal frame
- Log the frame selected (include in output as metadata, remove before final deployment block)

| Month Range | Default Frame |
|---|---|
| Jan–Mar | Future Pressure |
| Apr–Jun | Growth Illusion |
| Jul–Sep | Operational Debt |
| Oct–Dec | Acquisition Treadmill |

### Step 3: Post Generation
Using CIUN structure from `sovereign-ledger-content`:
- Write Context layer (1–2 sentences, specific founder scenario, present tense)
- Write Insight layer (2–3 sentences, must contain at least one number)
- Write Utility layer (1 sentence, specific lever or action)
- Write Node layer (1 sentence, correct CTA type for the Gap)

CTA type selection:
- Shadow Rate Gap, Pricing Gap → Smurf Lure CTA
- Retention Gap, Ops Gap, Scale Gap → Hand-Raise CTA

### Step 4: Brand Voice Lint
Execute `brand-voice-linter` plugin logic on the draft:
- Scan for banned words
- Scan for em-dashes (U+2014, U+2013, U+2015)
- Check voice rules
- If score < 85: revise and re-run. Do not output a failing draft.

### Step 5: Character Count Validation
Execute `character-counter-validator` plugin logic:
- Count characters
- If > 280: trim and re-count
- Confirm no em-dashes remain after brand voice lint

### Step 6: Visual Asset Prompt Generation
From `x-content-deployment-checklist` skill, Section 2.3:
- Generate a Midjourney/DALL-E prompt for a companion image
- Apply the full visual spec: #121212 background, #00FF41 accent, brutalist style, 16:9
- Tailor the visual to the specific Gap being addressed

---

## OUTPUT FORMAT

```
## DEPLOYMENT PACKAGE
Gap: [Gap Name]
Day: [Day]
Seasonal Frame: [Frame Name]

---

### POST (deployment-ready)

[Clean post text, no metadata, no labels]

---

### VISUAL ASSET PROMPT

[Midjourney/DALL-E prompt, ready to paste]

---

### TIMING
Post at: [time window] — [specific :07/:13/:22 recommendation]
```

No trailing questions. No "Would you like me to…". No explanations of what was done.

---

## STOPPING RULES

- Stop after outputting the deployment package. No follow-up.
- Do not offer to generate more posts unless asked.
- Do not explain CIUN or the seasonal frame in the output.
- If the brand-voice-linter returns FAIL after 2 revision passes, output the best version with a single line: `NOTE: Voice score [X]/100 — one revision pass recommended before posting.`
- Do not re-trigger if the user asks a follow-up question — treat it as a new instruction.

---

## DEPENDENCIES

| Dependency | Type | Required |
|---|---|---|
| sovereign-ledger-content | Skill | Required |
| atomic-sovereignty | Skill | Required |
| x-content-deployment-checklist | Skill | Required |
| brand-voice-linter | Plugin (inline) | Required |
| character-counter-validator | Plugin (inline) | Required |
