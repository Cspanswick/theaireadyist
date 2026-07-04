# 03 — Decision Performance Index
**TheAIReadyist Methodology Workspace**  
**Version:** 0.1 (Placeholder) | **Date:** 2026-06-22 | **Status:** Pre-design  
**Classification:** Internal — not for public distribution

---

> **Status note:** This document is a placeholder specification. It defines the purpose, outputs, and design principles of the Decision Performance Index. Assessment questions, scoring models, and weighting methodology are not included and will be developed in a subsequent design phase.

---

## Assessment Name

**Decision Performance Index (DPI)**

---

## Purpose

The Decision Performance Index is the flagship assessment of TheAIReadyist platform.

Its purpose is to identify the **primary organisational constraint to Decision Performance** — the single dimension that, if addressed, would most improve an organisation's ability to make high-value decisions consistently and at pace.

The DPI is not designed to produce a comprehensive audit of everything an organisation is doing with AI. It is designed to produce one high-value, actionable output: a clear-eyed identification of where the organisation's decision system is most constrained, and what that means for the executive team.

---

## Strategic Position

The Decision Performance Index sits at the top of the assessment architecture. It is the composite, cross-pillar assessment from which all pillar-specific assessments derive their context.

```
Decision Performance Index (flagship)
        ↓
┌───────────────────────────────────────┐
│  Pillar Assessments (six inputs)      │
│  ├─ Executive Operating Model Index   │
│  ├─ Decision Intelligence Index       │
│  ├─ Agentic Governance Score          │
│  ├─ AI Economics Index                │
│  ├─ Human Agency Readiness    │
│  └─ Sovereign AI Readiness            │
└───────────────────────────────────────┘
```

Organisations may take the DPI as a standalone assessment, or as the synthesis of their pillar assessment scores. The DPI provides the headline finding; the pillar assessments provide the detail.

---

## Future Outputs

When designed and built, the Decision Performance Index will produce three outputs:

### 1. Decision Performance Score
A composite score representing the organisation's overall Decision Performance across the six dimensions (Quality, Velocity, Accountability, Capability, Value, Resilience).

The score is designed to be benchmarkable — comparable against industry peers, geography, and organisation size — and to track improvement over time.

*Scoring model and scale: not yet defined.*

### 2. Primary Constraint
The single dimension of Decision Performance in which the organisation has the greatest gap relative to its own performance profile.

The primary constraint is the most important output of the assessment. It gives the executive team a clear starting point: this is where your decision system is most limited, and this is where investment will produce the greatest return.

The constraint-led model is a deliberate design choice. Most assessments produce a balanced view of strengths and weaknesses that spreads leadership attention across many improvement areas simultaneously. The DPI is designed to focus attention, not disperse it.

*Constraint identification methodology: not yet defined.*

### 3. Recommended Focus Area
Based on the primary constraint, the DPI will recommend a specific focus area — a pillar, a set of actions, or a sequence of follow-on assessments — that most directly addresses the identified constraint.

The recommendation is not a comprehensive improvement plan. It is a directional steer: *given your primary constraint, here is where to start.*

*Recommendation logic: not yet defined.*

---

## Design Principles for Future Development

**Constraint-led, not balanced.**  
The DPI's core value is identification of the primary constraint. The scoring model and question design should be optimised for this purpose, not for comprehensive coverage.

**Executive-legible outputs.**  
The DPI's outputs must be interpretable by a CFO, CHRO, or board member without technical translation. If the score or the constraint requires an explanatory layer to be meaningful, the design is not yet complete.

**Short enough to complete, deep enough to matter.**  
The assessment must be completable by a senior executive in a single session. This creates a real design constraint: question efficiency is critical. Every question must contribute meaningfully to constraint identification; no question should be present solely for comprehensiveness.

**No assessment questions yet.**  
Question design requires the scoring model, constraint identification methodology, and pillar weighting to be defined first. Those decisions will be made in the assessment design phase.

---

## Open Design Questions

The following questions must be resolved before the DPI can move from placeholder to design:

1. **Respondent:** Who takes the DPI? The CEO alone? A cross-functional leadership team? What is the aggregation model if multiple respondents?
2. **Length:** What is the target question count? (Design principle: short enough for a senior executive to complete without delegation.)
3. **Scoring model:** Likert scale, forced choice, self-assessment, or evidence-based? What is the scoring scale?
4. **Weighting:** Are the six dimensions weighted equally, or does the model apply different weights based on organisation type, sector, or maturity?
5. **Constraint identification:** How is the primary constraint determined — lowest absolute score, largest gap to benchmark, highest leverage point?
6. **Benchmarking:** At launch, what is the benchmark cohort? (The benchmark dataset will initially be empty; the DPI needs a designed-in path from early-adopter data to a statistically meaningful benchmark.)
7. **Cadence:** Is the DPI designed as a one-time diagnostic, an annual benchmark, or a continuous tracking tool?
8. **Format:** Web-based interactive? PDF export? Integration with a data model for benchmarking?

---

## Relationship to Pillar Assessments

The six pillar assessments (see `04-assessment-architecture.md`) each measure one dimension of Decision Performance in depth. The DPI is the composite view — it draws on the same six dimensions but is designed for breadth and strategic orientation, not pillar-level depth.

A leader taking the DPI should be able to identify their primary constraint and then choose the relevant pillar assessment for the deeper diagnostic. The two levels are complementary, not redundant.
