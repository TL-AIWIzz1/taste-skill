# PLUGIN: shadow-rate-calculator
**Version:** 1.0
**Owner:** The Sovereign Ledger (@BannedLuigi)
**Type:** Inline calculation plugin — Claude executes this math when invoked.

---

## INVOCATION

Invoke this plugin with:
```
Run shadow-rate-calculator:
  Annual revenue: $[X]
  Weekly hours: [N]
  Hours lost to gap: [N] per week
  Gap type: [Shadow Rate / Retention / Pricing / Ops / Scale]
```

Or as part of a content generation workflow when the post contains Shadow Rate math.

---

## INPUT CONTRACT

```
REQUIRED:
  annual_revenue:     Annual revenue in USD ($)
  weekly_hours:       Total hours worked per week by the founder
  gap_type:           One of the 5 Gaps (used for labeling output)

OPTIONAL (for full diagnostic):
  hours_lost_to_gap:  Hours per week consumed by the identified gap
                      (If not provided, plugin outputs Shadow Rate only)
  mrr:                Monthly recurring revenue (for MRR-anchored output)
```

---

## LOGIC

### Calculation 1: Shadow Rate

```
Shadow Rate ($/hr) = Annual Revenue ÷ (Weekly Hours × 52)
```

Round to 2 decimal places.

### Calculation 2: Gap Cost (requires hours_lost_to_gap)

```
Gap Cost ($/yr) = Shadow Rate × Hours Lost to Gap Per Week × 52
```

Round to nearest dollar.

### Calculation 3: Operational Tax (requires Gap Cost)

```
Operational Tax (%) = Gap Cost ÷ Annual Revenue × 100
```

Round to 1 decimal place.

### Calculation 4: Annualized Hours Lost (requires hours_lost_to_gap)

```
Annualized Hours Lost = Hours Lost to Gap Per Week × 52
```

### Edge Cases

| Situation | Handling |
|---|---|
| Weekly hours = 0 | Return error: "Weekly hours cannot be zero." |
| Annual revenue = 0 | Return error: "Annual revenue required for Shadow Rate calculation." |
| Hours lost > weekly hours | Flag: "Hours lost to gap exceeds total weekly hours. Verify input." |
| MRR provided but no ARR | Calculate ARR as MRR × 12 and note the assumption |

---

## OUTPUT FORMAT

```
## SHADOW RATE DIAGNOSTIC

Inputs:
  Annual Revenue:       $[X]
  Weekly Hours:         [N] hrs
  Gap Type:             [Gap Name]
  Hours Lost to Gap:    [N] hrs/week [or "Not provided"]

Results:
  Shadow Rate:          $[X.XX] / hr
  Annualized Gap Hours: [N] hrs/yr  [if hours_lost provided]
  Gap Cost:             $[X] / yr   [if hours_lost provided]
  Operational Tax:      [X.X]%      [if hours_lost provided]

---

DIAGNOSTIC SUMMARY:
At $[ARR] ARR, [founder's] time is worth $[Shadow Rate]/hr.
[Gap type] is consuming approximately [hours_lost] hrs/week.
That's $[Gap Cost]/yr in [Gap type] drag — [Operational Tax]% of annual revenue
allocated to a solvable operational constraint.

---

DEPLOYMENT BLOCK (paste-ready):
"At $[MRR or ARR anchor], your Shadow Rate is $[X]/hr.
[Hours lost] hours/week on [Gap type] = $[Gap Cost]/yr in operational drag.
That's [Operational Tax]% of your revenue working against you."
```

---

## INVOCATION EXAMPLE

**Input:**
```
Run shadow-rate-calculator:
  Annual revenue: $216,000
  Weekly hours: 55
  Hours lost to gap: 14 per week
  Gap type: Ops Gap
```

**Output:**
```
## SHADOW RATE DIAGNOSTIC

Inputs:
  Annual Revenue:       $216,000
  Weekly Hours:         55 hrs
  Gap Type:             Ops Gap
  Hours Lost to Gap:    14 hrs/week

Results:
  Shadow Rate:          $75.52 / hr
  Annualized Gap Hours: 728 hrs/yr
  Gap Cost:             $54,979 / yr
  Operational Tax:      25.5%

---

DIAGNOSTIC SUMMARY:
At $216,000 ARR, this founder's time is worth $75.52/hr.
The Ops Gap is consuming approximately 14 hrs/week.
That's $54,979/yr in operational drag — 25.5% of annual revenue
allocated to a solvable operational constraint.

---

DEPLOYMENT BLOCK (paste-ready):
"At $18K MRR, your Shadow Rate is $75/hr.
14 hours/week on ops = $55K/yr in operational drag.
That's 25% of your revenue working against you."
```

---

## NOTES

- Always verify math before including in a post. This plugin produces the calculation — spot-check the arithmetic before deployment.
- The Deployment Block is formatted for direct use in an Atomic Monolith post or a diagnostic comment.
- MRR-anchored language in the Deployment Block is more resonant for ICP than ARR. Convert if MRR was provided.
- Shadow Rate is always rounded down for deployment copy — conservative estimates build more credibility than inflated ones.
