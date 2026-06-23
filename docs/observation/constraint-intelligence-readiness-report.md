# Constraint Intelligence Readiness Report

**Aligns to:** DR-001 · **Phase:** Priority 3 (evidence review)
**Type:** Evidence review — **NOT a build package.**
**Purpose:** determine whether sufficient platform data exists to justify building Constraint Intelligence v1.
**To be completed at:** end of the 30–60 day observation period, from `observation-log.md` + the SQL in `observation-plan.md`.

> Status: **TEMPLATE — to be populated with observed data.** Fields marked _[evidence]_ require real figures; do not pre-fill with assumptions. Per DR-001, Constraint Intelligence must emerge from observed patterns, not be imposed theoretically.

---

## 0. Period summary (fill first)

| | |
|---|---|
| Observation window | _[start]_ → _[end]_ ( __ days) |
| Total signals stored | _[evidence]_ |
| Total published | _[evidence]_ |
| Avg signals/day · /week | _[evidence]_ |
| Sources contributing | _[evidence]_ of __ enabled |

---

## Q1 — What recurring patterns are appearing?

*Method:* tag-frequency + theme review SQL (observation-plan §5) and the weekly free-text "emerging patterns".

- Top recurring tags/themes (with frequency): _[evidence]_
- Patterns by pillar (which pillars generate the most repeated themes): _[evidence]_
- Notable repeated executive situations (free text, not yet named as constraints): _[evidence]_

*Finding:* _[are there clear, repeated patterns — yes/partial/no, with examples]_

## Q2 — Do these patterns naturally cluster into constraint categories?

*Method:* attempt to group the Q1 patterns; test against (do not force into) the candidate two-level taxonomy from WP12 D5 (6 domains × named types).

- Observed clusters: _[evidence]_
- Map to candidate domains (Quality/Velocity/Accountability/Capability/Value/Resilience): _[which clusters map cleanly, which don't]_
- Clusters that resist the candidate taxonomy: _[evidence — these are the most important signals]_

*Finding:* _[do patterns cluster naturally — yes/partial/no]_

## Q3 — Are the proposed constraint taxonomies supported by evidence?

*Method:* compare the WP11/WP12 candidate constraint vocabulary against what actually recurred.

| Candidate constraint type | Observed? | Frequency | Keep / revise / drop |
|---|---|---|---|
| Accountability Gap | _[ ]_ | _[ ]_ | _[ ]_ |
| Governance Ambiguity | _[ ]_ | _[ ]_ | _[ ]_ |
| Data Fragmentation | _[ ]_ | _[ ]_ | _[ ]_ |
| Authority Conflict | _[ ]_ | _[ ]_ | _[ ]_ |
| Decision Latency | _[ ]_ | _[ ]_ | _[ ]_ |
| Capability Deficit | _[ ]_ | _[ ]_ | _[ ]_ |
| Economic Uncertainty | _[ ]_ | _[ ]_ | _[ ]_ |
| _(new, observed but not anticipated)_ | _[ ]_ | _[ ]_ | add? |

*Finding:* _[is the theoretical taxonomy evidence-backed, over-specified, or missing categories]_

## Q4 — What signal volume is required before meaningful benchmarking becomes possible?

*Method:* assess observed volume vs the minimum needed for stable percentages.

- Observed volume over the period: _[evidence]_
- Working threshold (assumption to validate): a constraint share is **directional at ≥ ~20 published signals per cell** and **reportable at ≥ ~100 total published**, with rolling 30/90-day windows. _(Estimate — refine against observed variance.)_
- Time-to-threshold at current run rate: _[evidence/projection]_

*Finding:* _[is current volume sufficient, or how long until it is]_

## Q5 — What data structures would be required for Constraint Intelligence v1?

*Method:* derive the minimum schema from what the evidence shows is real (not the full WP11 spec by default).

- Fields the evidence justifies adding (e.g. `constraint_type`, `dpi_dimension`, `executive_persona`): _[evidence-led list]_
- Whether to capture at signal level, assessment level, or both: _[evidence]_
- Aggregation needed (view vs table — see WP11 D6 / WP12 D5): _[evidence]_
- Minimum viable structure for CI v1 (the smallest thing that produces a credible Constraint Index): _[evidence]_

*Finding:* _[the lean data model the evidence supports]_

---

## Decision gate

**Proceed to Constraint Intelligence v1 build planning only if ALL hold:**

- [ ] Q1: clear, repeated patterns exist (not noise).
- [ ] Q2: patterns cluster naturally into a small number of categories.
- [ ] Q3: the taxonomy is evidence-backed (revised as needed), not theoretical.
- [ ] Q4: volume meets (or has a credible near-term path to) the benchmarking threshold.
- [ ] Q5: a lean, evidence-justified data model is defined.

**Recommendation:** ☐ Proceed to CI v1 build planning  ☐ Extend observation (insufficient evidence)  ☐ Revise taxonomy first

**Rationale:** _[evidence-based justification]_

> If "Proceed", the CI v1 design must be based on observed signal behaviour, and must still pass the DR-001 alignment test (improves Decision Performance; drives/uses credible DPI volume; respects non-negotiables).
