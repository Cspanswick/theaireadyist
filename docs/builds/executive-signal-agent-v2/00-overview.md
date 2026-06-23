# Executive Signal Agent v2 — Decision Performance Alignment

**Work Package 11 — Design / Specification Package**
**Date:** 2026-06-23
**Status:** Design only. **No code changed, no migration applied, the live v1 engine and the DPI are untouched.**

---

## Why this package exists

Executive Signal Agent **v1** works: it ingests signals, classifies them against the six pillars, scores executive relevance, routes them to editorial review, and publishes approved signals. But v1 delivers *intelligence* — pillar-organised AI news.

TheAIReadyist is moving to own the **Decision Performance** category. The strategic gap: v1 classifies content into pillars but does not connect a signal to the *decision affected*, the *organisational constraint exposed*, or the *Decision Performance dimension impacted*. v2 closes that gap so the platform delivers **Decision Performance Intelligence** and the signal engine becomes a **category-building asset**.

Every published signal should let an executive see: (1) what happened, (2) why it matters, (3) which decision is affected, (4) which constraint is exposed, (5) which DPI dimension is impacted — teaching the recurring lesson: *most AI failures are Decision Performance failures.*

---

## Deliverables in this package

| # | Deliverable | File | Type |
|---|---|---|---|
| D1 | Decision Performance Signal Framework | `01-decision-performance-signal-framework.md` | Framework (markdown) |
| D2 | Signal Taxonomy Extension | `02-signal-taxonomy-extension.md` | Field spec + draft migration_build6 (not applied) |
| D3 | Enhanced Signal Generation Prompt | `03-enhanced-signal-generation-prompt.md` | Prompt spec + before/after |
| D4 | Decision Performance Signal Card | `04-decision-performance-signal-card.md` | UI spec + wireframes |
| D5 | Homepage Integration Strategy | `05-homepage-integration-strategy.md` | Module spec + desktop/mobile wireframes |
| D6 | Constraint Intelligence Layer | `06-constraint-intelligence-layer.md` | Future architecture only |

---

## How it hangs together

```
D1 Framework  ─ defines pillar → DPI-dimension mapping (grounded in existing methodology)
      │
D2 Taxonomy   ─ adds fields to carry it: dpi_dimension, constraint_type,
      │          executive_persona, decision_domain, decision_performance_impact
      │
D3 Prompt     ─ teaches Tier-2 generation to emit Constraint Exposed,
      │          Decision Performance Impact, Executive Action + the D2 fields
      │
D4 Card       ─ surfaces it publicly as a Decision Performance readout (not a news card)
      │
D5 Homepage   ─ "Decision Performance Signals" observatory module (dimension-led)
      │
D6 Constraint ─ future: aggregate constraint_type across published signals → category evidence + DPI bridge
   Intelligence
```

D1 is the conceptual core; D2/D3 carry it through the engine; D4/D5 express it to the reader; D6 is the long-game asset.

---

## Grounding

The pillar↔dimension mapping and the constraint vocabulary are **not invented** — they operationalise the existing methodology:
- `docs/methodology/02-decision-performance-framework.md` (the six dimensions + canonical pillar mapping)
- `docs/methodology/07-pillar-definitions.md` (per-pillar "Relationship to Decision Performance" + "Primary Constraints")

This keeps v2 consistent with the platform's own definitions rather than introducing a parallel model.

---

## Non-negotiables (all honoured)

Pillars not renamed · six-pillar model intact · no new assessment introduced · the broader platform not redesigned · **the Decision Performance Index is not altered** · signals still classified by pillar (the dimension is a *reading* of the pillar, not a replacement) · no personal data. The objective is **category reinforcement, not feature expansion**.

---

## Suggested review path & sequencing for the team

1. **Architect:** D2 (schema/migration approach) and D3 (Tier-2-only change, cost profile preserved) and D6 (read-derived, no new source of truth).
2. **Design:** D4 (card two-zone structure) and D5 (dimension rail is the key element; the rename is strategic, not cosmetic).
3. **Editorial/strategy:** D1 (the mapping that will appear in every signal) and D6's public "Constraint Report" concept.

If approved, the natural build order is **D2 → D3** (engine: migration_build6 + prompt, plus matching admin fields), then **D4 → D5** (public surfaces), with **D6** deferred until published-signal volume supports it (~100–150 signals).

Nothing in this package requires a decision today beyond review — the v1 engine continues to run unchanged in the meantime.
