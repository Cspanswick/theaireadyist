# D3 — Enhanced Signal Generation Prompt

**Work Package 11 — Executive Signal Agent v2**
**Status:** Design / specification (proposed prompt; **not wired into the live agent**)
**Date:** 2026-06-23
**Relates to:** Tier-2 signal generation in `agent/run-signal-agent.js` (the `SIGNAL_SYSTEM` prompt)

---

## What changes

v1 Tier-2 generation produces, per queued signal: **Signal Title**, **Why It Matters**, **Decision Question**, **Suggested Tags**.

v2 keeps all of those and adds three Decision-Performance outputs plus the structured metadata from D2:

| New output | Field | Purpose |
|---|---|---|
| **Constraint Exposed** | `constraint_type` (+ one-sentence statement) | Names the organisational limitation the development reveals |
| **Decision Performance Impact** | `dpi_dimension` (+ `decision_performance_impact` band + short explanation) | States which DPI dimension is hit and how hard |
| **Executive Action** | reuses/sharpens `decision_question` | A recommended executive question to act on |

It also asks the model to emit `dpi_dimension`, `dpi_dimension_secondary`, `executive_persona[]`, `decision_domain`, `constraint_type`, and `decision_performance_impact` (the D2 fields).

The Tier-1 Haiku triage is **unchanged** (still pillar + relevance score + keep/reject). The Decision-Performance enrichment happens only in Tier-2, only for queued (4–5) items — preserving the v1 cost profile.

---

## Output structure: before → after

**Before (v1):**
```json
{ "signal_title": "...", "why_it_matters": "...", "decision_question": "...", "suggested_tags": ["..."] }
```

**After (v2):**
```json
{
  "signal_title": "...",
  "why_it_matters": "...",
  "constraint_exposed": "Agent authority exceeds current governance controls.",
  "constraint_type": "Accountability Gap",
  "dpi_dimension": "Accountability",
  "dpi_dimension_secondary": "Resilience",
  "decision_performance_impact": "Critical",
  "decision_performance_impact_explanation": "Weakens accountability: no human owner is positioned to answer for agent-initiated commitments, and audit trails record actions without reasoning.",
  "executive_action": "Can any AI system currently commit the organisation to financial obligations without explicit human approval?",
  "decision_question": "Can any AI system currently commit the organisation to financial obligations without explicit human approval?",
  "executive_persona": ["Board", "CFO", "CIO"],
  "decision_domain": "AI Governance",
  "suggested_tags": ["agent authority", "decision rights", "governance", "accountability"]
}
```

`executive_action` and `decision_question` may be the same string (the executive action *is* the question to ask); both are emitted so the v1 `decision_question` field stays populated.

---

## Proposed replacement `SIGNAL_SYSTEM` prompt (draft)

> Drop-in replacement for the Tier-2 system prompt. Not yet applied. The D1 default mapping is embedded so the model has a deterministic starting point and only overrides with justification.

```text
You write Decision Performance signals for TheAIReadyist. Each input item has been
classified to a pillar and scored 4 or 5 (queue-worthy). TheAIReadyist owns the
"Decision Performance" category: every signal must help an executive see not just what
happened, but which decision is affected, which organisational constraint is exposed, and
which Decision Performance dimension is impacted. The lesson the platform teaches is:
"Most AI failures are Decision Performance failures."

THE SIX DECISION PERFORMANCE DIMENSIONS:
- Quality: are decisions well-informed, sound, and producing intended outcomes?
- Velocity: can high-quality decisions be made at the pace the context requires?
- Accountability: is responsibility for decisions (incl. AI-made ones) clearly owned?
- Capability: do people have the judgement to decide well with AI, and to override it?
- Value: can the organisation attribute measurable value to its decisions/AI investment?
- Resilience: do decisions hold up under regulatory, geopolitical, or technical stress?

DEFAULT PILLAR -> PRIMARY DIMENSION (use unless the story is clearly about another):
- Executive Operating Models -> Velocity
- Decision Intelligence       -> Quality
- Agentic Governance          -> Accountability
- AI Economics                -> Value
- Human Agency                -> Capability
- Sovereign AI                -> Resilience
You MAY override to the pillar's secondary dimension when justified; if you override,
keep it defensible from the title/excerpt. Set dpi_dimension_secondary only when the
signal genuinely spans two dimensions.

CONSTRAINT TYPES (choose the closest; this feeds constraint analytics):
Accountability Gap | Governance Ambiguity | Data Fragmentation | Authority Conflict |
Decision Latency | Capability Deficit | Economic Uncertainty

DECISION DOMAINS (choose one; "Other: <text>" allowed):
AI Governance | Workforce Strategy | Operating Model Design | AI Investment |
Risk Management | Vendor Selection | Sovereignty

EXECUTIVE PERSONAS (1-3, multiple allowed):
CEO | COO | CFO | CIO | CTO | CHRO | Board

DECISION PERFORMANCE IMPACT (severity of organisational consequence; independent of the
relevance score): Low | Medium | High | Critical

For each item produce:
- signal_title: a sharp executive headline (not the raw article title).
- why_it_matters: 2-4 sentences on the executive implication, not an article summary.
- constraint_exposed: ONE concise sentence naming the organisational limitation revealed
  (e.g. "Agent authority exceeds current governance controls.").
- constraint_type: the closest value from the list above.
- dpi_dimension (+ optional dpi_dimension_secondary).
- decision_performance_impact + decision_performance_impact_explanation: a short sentence
  on how it affects the named dimension(s).
- executive_action: ONE recommended question an executive should ask
  (e.g. "Can any AI system currently commit the organisation to financial obligations
  without explicit approval?"). Also output this as decision_question.
- executive_persona: the 1-3 roles most affected.
- decision_domain: the decision area.
- suggested_tags: 3-6 concise tags.

Do not invent facts beyond the title/excerpt; if the excerpt is thin, keep claims cautious.
Do not classify primarily by DPI dimension and do not rename pillars — the pillar is the
editorial home; the dimension is the Decision Performance reading of it.

OUTPUT: ONLY a JSON array, one object per input item, same order, no prose, no markdown fences.
```

---

## Quality bar for the new fields

- **Constraint Exposed** must be a *limitation*, not a restatement of the headline. Test: it should read as something an executive could put on a risk register.
- **Executive Action** must be answerable by the executive's own organisation ("Can *we*…?"), not a question about the news.
- **Impact** describes consequence to the decision system, not newsworthiness — a low-relevance item can still be High impact in its niche, and vice versa.
- The model must stay within the seeded vocabularies for `constraint_type` / `dpi_dimension` / `decision_performance_impact` (validated on store, same defensive parsing as v1).

---

## Implementation note (for when build is approved)

This is a Tier-2-only change. The `buildRow()` mapping in the agent would gain the six D2 fields; the admin review view (D4 covers the public card; the admin form would add matching inputs); validation mirrors the v1 whitelist approach. Tier-1 triage, dedup, scheduling and cost profile are unaffected. No change to the DPI or any assessment.
