# D1 — Decision Performance Signal Framework

**Work Package 11 — Executive Signal Agent v2**
**Status:** Design / specification (no code changes)
**Date:** 2026-06-23
**Authoritative sources:** `docs/methodology/02-decision-performance-framework.md`, `docs/methodology/07-pillar-definitions.md`

---

## Purpose

This framework is the conceptual bridge that turns Executive Signals from a pillar-classified feed into a **Decision Performance intelligence system**. It defines, for each of the six pillars, which Decision Performance dimension the pillar most directly informs, which dimension it secondarily affects, why, and what a representative signal looks like.

It does **not** invent a new mapping. It operationalises the canonical pillar-to-dimension relationship already defined in the methodology, so that every classified signal can be expressed in Decision Performance terms.

> **Category thesis the framework must teach:** *Most AI failures are Decision Performance failures.* A signal classified to a pillar is only half the story; the framework forces the second half — which dimension of the organisation's decision system the development actually stresses.

---

## The two axes

**Six Pillars** (editorial taxonomy — unchanged):
Executive Operating Models · Decision Intelligence · Agentic Governance · AI Economics · Human Agency · Sovereign AI

**Six DPI Dimensions** (outcome model — unchanged):
Quality · Velocity · Accountability · Capability · Value · Resilience

The pillars organise *what a development is about*. The dimensions express *what it does to the organisation's ability to decide*. The framework connects them.

---

## Canonical mapping (summary)

| Pillar | Primary DPI dimension | Secondary DPI dimension(s) |
|---|---|---|
| Executive Operating Models | **Velocity** | Accountability, Quality |
| Decision Intelligence | **Quality** | Capability, Value |
| Agentic Governance | **Accountability** | Resilience, Quality |
| AI Economics | **Value** | Quality, Accountability |
| Human Agency | **Capability** | Quality, Accountability |
| Sovereign AI | **Resilience** | Accountability, Quality |

This is a primary-relationship map, not a one-to-one wall. Every pillar touches every dimension to some degree; the table names the dimension each pillar most directly governs. (Source: `02-decision-performance-framework.md`, "Pillar-to-Dimension Mapping", and each pillar's "Relationship to Decision Performance" section in `07-pillar-definitions.md`.)

---

## The six relationships in full

### 1. Executive Operating Models → Decision **Velocity**

- **Primary connection:** Velocity. The operating model determines how fast the organisation can make high-quality decisions. Concentrated decision rights, unclear AI escalation paths and approval chains that add time without adding judgement are velocity constraints that better AI tools cannot fix.
- **Secondary connection:** Accountability (clarity of ownership in the decision architecture) and Quality (the decision architecture itself shapes how good decisions are).
- **Rationale:** Operating-model change stories are velocity stories. When a CIO restructures teams for AI-native delivery, the executive question is whether decisions now move at the pace the context requires — not whether AI was adopted.
- **Example signal:** *"Enterprise restructures around product/platform model to remove AI decision bottlenecks."* → Pillar: Executive Operating Models · Dimension: Velocity · Constraint exposed: Decision Latency.

### 2. Decision Intelligence → Decision **Quality**

- **Primary connection:** Quality. Decision Intelligence is the discipline most directly focused on the quality of individual decisions — inputs (data, context), process (decision architecture), and outputs (review, learning).
- **Secondary connection:** Capability (skills to apply DI methods) and Value (better decisions produce better, attributable outcomes).
- **Rationale:** Knowledge-platform, RAG, context-engineering and data-strategy developments are quality stories: do decision-makers have trusted intelligence at the point of decision?
- **Example signal:** *"Enterprise knowledge platform launches context layer for executive decision support."* → Pillar: Decision Intelligence · Dimension: Quality · Constraint exposed: Data Fragmentation.

### 3. Agentic Governance → Decision **Accountability**

- **Primary connection:** Accountability. Agentic Governance is the accountability layer: every consequential decision, including those made by AI agents, must be traceable, explainable and owned by an accountable human or function.
- **Secondary connection:** Resilience (governance failure creates regulatory/operational risk) and Quality (explainability requirements tend to improve decisions).
- **Rationale:** Agent-authority, AI-regulation, auditability and decision-rights developments are accountability stories: when an agent acts, who owns the outcome?
- **Example signal:** *"Autonomous procurement agents deployed without defined decision-rights boundary."* → Pillar: Agentic Governance · Dimension: Accountability · Constraint exposed: Accountability Gap.

### 4. AI Economics → Decision **Value**

- **Primary connection:** Value. AI Economics translates AI investment into measurable, attributable value — and demonstrates it to the board.
- **Secondary connection:** Quality (financial governance of AI decisions) and Accountability (value attribution requires clear ownership).
- **Rationale:** ROI scrutiny, cost-overrun, FinOps-for-AI and value-attribution developments are value stories: can the organisation show which AI investments produced measurable outcomes?
- **Example signal:** *"CFOs tighten scrutiny as AI programme costs outpace demonstrated returns."* → Pillar: AI Economics · Dimension: Value · Constraint exposed: Economic Uncertainty.

### 5. Human Agency → Decision **Capability**

- **Primary connection:** Capability. Human Agency is the capability layer: do the people making decisions have the skills, judgement and confidence to make good decisions with AI — including the capacity to override it?
- **Secondary connection:** Quality (people with genuine agency correct AI errors) and Accountability (genuine agency is the precondition for genuine accountability).
- **Rationale:** Leadership-trust, AI-literacy, judgement-atrophy and culture developments are capability stories: is human decision capability keeping pace with AI delegation?
- **Example signal:** *"Leaders report declining confidence in challenging AI-generated recommendations."* → Pillar: Human Agency · Dimension: Capability · Constraint exposed: Capability Deficit.

### 6. Sovereign AI → Decision **Resilience**

- **Primary connection:** Resilience. Sovereign AI is the resilience layer: the decision system must keep functioning and stay compliant when the environment changes — regulation, provider restriction, geopolitical disruption.
- **Secondary connection:** Accountability (regulation defines accountability requirements) and Quality (regulatory obligations constrain or expand decision data).
- **Rationale:** Sovereignty, data-residency, DORA/NIS2/EU AI Act and infrastructure-independence developments are resilience stories: would the decision system hold under stress?
- **Example signal:** *"New data-residency enforcement forces re-architecture of cross-border AI workloads."* → Pillar: Sovereign AI · Dimension: Resilience · Constraint exposed: Governance Ambiguity / single-provider dependency.

---

## How the framework is applied per signal

For every signal the engine already assigns a **primary pillar** (and optional secondary). v2 adds a **DPI dimension** derived as follows:

1. **Default:** the primary pillar's primary dimension (table above). This guarantees every signal carries a Decision Performance reading even when the model is uncertain.
2. **Override:** the signal-generation model may select the pillar's *secondary* dimension when the development is more about that dimension (e.g. an Agentic Governance story that is really about resilience under new regulation → Resilience).
3. **Cross-pillar:** when a secondary pillar is present, its primary dimension is a candidate for the signal's secondary dimension.

The model must justify any override in one line (stored in `classification_reason`). The default mapping ensures consistency; the override allows editorial precision. This logic is specified for the prompt in **D3** and the fields in **D2**.

---

## Design guardrails

- The framework **classifies signals against the six pillars** and *expresses* them in Decision Performance terms. It does **not** classify primarily by DPI dimension, and it does not rename or remove pillars.
- The DPI itself is untouched — this framework reuses its dimensions as a reading lens for signals; it introduces no new assessment.
- Dimension names are used in their short form (Quality, Velocity, Accountability, Capability, Value, Resilience) for signal metadata; the canonical long form ("Decision Quality" …) remains the methodology reference.
