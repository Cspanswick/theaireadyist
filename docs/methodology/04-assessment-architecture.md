# 04 — Assessment Architecture
**TheAIReadyist Methodology Workspace**  
**Version:** 0.1 (Placeholder) | **Date:** 2026-06-22 | **Status:** Architecture draft  
**Classification:** Internal — not for public distribution

---

> **Status note:** This document defines the architecture of all planned assessments and their relationships. Individual assessment designs — questions, scoring models, and weighting — are not included and will be developed in subsequent design phases.

---

## Architecture Overview

TheAIReadyist assessment suite is designed as a two-level structure:

**Level 1 — Flagship composite assessment**  
Measures Decision Performance across all six dimensions. Produces a composite score, a primary constraint identification, and a recommended focus area. Entry point for most organisations.

**Level 2 — Pillar-specific assessments**  
Six assessments, one per pillar, each measuring a single dimension of Decision Performance in depth. Used for diagnostic depth after the flagship assessment identifies the primary constraint, or as standalone tools for leaders with a specific pillar focus.

The two levels are designed to be complementary. A leader takes the Decision Performance Index to identify their constraint, then takes the relevant pillar assessment to understand it in depth.

```
Level 1 — Flagship
┌────────────────────────────────────┐
│   Decision Performance Index       │
│   Cross-pillar · Constraint-led    │
└────────────────┬───────────────────┘
                 │ directs to
Level 2 — Pillar Assessments
┌──────┬──────┬──────┬──────┬──────┬──────┐
│  P1  │  P2  │  P3  │  P4  │  P5  │  P6  │
│ EOMI │ DII  │ AGS  │ AEI  │ HAWR │ SAIR │
└──────┴──────┴──────┴──────┴──────┴──────┘
```

---

## Assessment 1 — Decision Performance Index (DPI)

**Level:** Flagship (Level 1)  
**Pillar coverage:** All six pillars  
**Decision Performance dimension:** All six dimensions (composite)  
**Design status:** Placeholder — see `03-decision-performance-index.md`

**Purpose:**  
Identify the primary organisational constraint to Decision Performance. The DPI is the entry point for organisations engaging with TheAIReadyist platform for the first time. It is designed to be completed by a senior executive in a single session and to produce three outputs: a Decision Performance Score, a Primary Constraint, and a Recommended Focus Area.

**Intended respondent:** C-suite or senior leadership team  
**Intended cadence:** Annual benchmark + periodic check  
**Relationship to Level 2:** DPI primary constraint output directs the respondent to the relevant pillar assessment for deeper diagnosis

---

## Assessment 2 — Executive Operating Model Index (EOMI)

**Level:** Pillar (Level 2)  
**Pillar:** Executive Operating Models (Pillar 1)  
**Decision Performance dimension:** Decision Velocity  
**Design status:** Not yet designed

**Purpose:**  
Assess the degree to which the organisation's leadership structure, decision rights, and operating model are designed to support high-quality, high-velocity decisions in an AI-enabled environment. Identifies structural bottlenecks, decision right ambiguities, and operating model gaps that constrain Decision Velocity.

**Characteristic questions this assessment will address:**
- Are decision rights explicit, understood, and fit for an AI-augmented operating environment?
- Where are the structural bottlenecks in the organisation's decision flow?
- How does the operating model handle decisions that involve AI-generated recommendations?
- Is the leadership team structured to make AI governance decisions at the pace required?

**Key outputs (to be designed):**
- EOMI Score
- Primary structural constraint
- Operating model gap analysis

---

## Assessment 3 — Decision Intelligence Index (DII)

**Level:** Pillar (Level 2)  
**Pillar:** Decision Intelligence (Pillar 2)  
**Decision Performance dimension:** Decision Quality  
**Design status:** Not yet designed

**Purpose:**  
Assess the quality of the organisation's decision-making at the point of decision. Measures the data quality, decision architecture, analytical capability, and AI augmentation effectiveness that determine whether individual and collective decisions are well-informed and contextually appropriate.

**Characteristic questions this assessment will address:**
- How does the organisation define and measure decision quality?
- What is the quality of data available at the point of decision?
- Where are AI tools improving decision quality, and where are they introducing new errors?
- How are high-stakes decisions reviewed and challenged?

**Key outputs (to be designed):**
- DII Score
- Decision quality gap profile
- Data and process constraint identification

---

## Assessment 4 — Agentic Governance Score (AGS)

**Level:** Pillar (Level 2)  
**Pillar:** Agentic Governance (Pillar 3)  
**Decision Performance dimension:** Decision Accountability  
**Design status:** Not yet designed

**Purpose:**  
Assess the adequacy of the organisation's governance frameworks for AI-influenced and AI-automated decisions. Identifies accountability gaps, audit trail weaknesses, and compliance exposure specific to agentic AI systems.

**Characteristic questions this assessment will address:**
- Are accountability owners assigned for decisions made by or with AI agents?
- Do audit trails capture reasoning, not just process?
- Is the governance framework designed for AI-native accountability or adapted from pre-AI frameworks?
- How does the organisation manage EU AI Act, DORA, and other agentic AI compliance obligations?

**Key outputs (to be designed):**
- AGS Score
- Accountability gap map
- Regulatory exposure assessment

**Note:** This assessment has the strongest relationship to the existing EU AI Act and DORA assessment tools on the public site. The AGS is designed as the governance synthesis — the tool that gives a governance posture score across all agentic AI systems, not just one regulatory framework.

---

## Assessment 5 — AI Economics Index (AEI)

**Level:** Pillar (Level 2)  
**Pillar:** AI Economics (Pillar 4)  
**Decision Performance dimension:** Decision Value  
**Design status:** Not yet designed

**Purpose:**  
Assess the quality of the organisation's financial governance of AI investment. Identifies gaps in cost visibility, value attribution, ROI rigour, and financial decision-making about AI programmes.

**Characteristic questions this assessment will address:**
- Does the organisation have visibility of its total AI spend, including agentic and inference costs?
- How does the organisation measure and attribute AI-generated value?
- Are AI business cases subject to the same financial rigour as other capital investments?
- Does the finance function have the capability to evaluate AI investment decisions?

**Key outputs (to be designed):**
- AEI Score
- Cost visibility gap
- Value attribution maturity
- CFO readiness indicator

---

## Assessment 6 — Human Agency Readiness (HAWR)

**Level:** Pillar (Level 2)  
**Pillar:** Human Agency (Pillar 5)  
**Decision Performance dimension:** Decision Capability  
**Design status:** Not yet designed

**Purpose:**  
Assess the degree to which the organisation preserves genuine human judgement, accountability, and capability as AI takes on a greater role in decision processes. Identifies where human agency is being eroded — through adoption theatre, accountability diffusion, or judgement atrophy — and where it is being actively developed and protected.

**Characteristic questions this assessment will address:**
- Are leaders exercising genuine judgement in AI-augmented decisions, or deferring to AI outputs without meaningful scrutiny?
- Has the organisation redesigned roles to preserve meaningful human accountability, or is AI layered onto unchanged job descriptions?
- Does the workforce — at all levels — have the capability to evaluate, challenge, and override AI outputs when required?
- Does the culture support questioning AI recommendations, or does it pressure uncritical acceptance?

**Key outputs (to be designed):**
- HAWR Score
- Human agency gap profile
- Judgement atrophy risk indicators
- Accountability clarity assessment
- Capability development priority areas

---

## Assessment 7 — Sovereign AI Readiness (SAIR)

**Level:** Pillar (Level 2)  
**Pillar:** Sovereign AI (Pillar 6)  
**Decision Performance dimension:** Decision Resilience  
**Design status:** Not yet designed

**Purpose:**  
Assess the organisation's exposure to sovereign AI risks — regulatory change, geopolitical AI dependency, critical infrastructure obligations, and cross-border compliance complexity. Identifies resilience gaps in the decision system's operating environment.

**Characteristic questions this assessment will address:**
- How exposed is the organisation to DORA, NIS2, EU AI Act, and equivalent sovereign AI obligations?
- What is the organisation's dependency on AI providers subject to geopolitical risk?
- Does the organisation have decision continuity plans for AI system failure or regulatory restriction?
- Is the organisation's data residency and sovereignty posture consistent with its regulatory obligations?

**Key outputs (to be designed):**
- SAIR Score
- Regulatory exposure profile
- Geopolitical dependency map
- Resilience gap identification

**Note:** The existing DORA and NIS2 tools on the public site address specific regulatory frameworks. The SAIR is the strategic synthesis — the tool that gives an overall sovereign AI readiness posture across all relevant obligations and dependencies.

---

## Relationships Between Assessments

```
                    Decision Performance Index (DPI)
                              │
         ┌────────────────────┼────────────────────┐
         ↓                    ↓                    ↓
       EOMI                  DII                  AGS
  (Operating Model)    (Dec. Intelligence)  (Governance)
  Decision Velocity     Decision Quality    Dec. Accountability
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ↓                    ↓                    ↓
        AEI                 HAWR                 SAIR
   (AI Economics)      (Workforce)          (Sovereign AI)
   Decision Value     Decision Capability  Decision Resilience
```

**DPI → Pillar assessments:** The DPI identifies the primary constraint; the relevant pillar assessment diagnoses it in depth.

**AGS ↔ SAIR:** The governance (AGS) and sovereignty (SAIR) assessments are closely related — both address compliance and accountability, but from different angles. AGS focuses on internal governance design; SAIR focuses on external regulatory and geopolitical exposure. They are designed to be complementary, not overlapping.

**EOMI ↔ DII:** Operating model design (EOMI) directly affects decision quality (DII). An operating model that concentrates decisions in senior leadership creates a Decision Velocity constraint; it may also create a Decision Quality constraint if the concentration means decisions are made without sufficient context or analytical support.

**AEI ↔ HAWR:** Financial governance of AI (AEI) and workforce capability (HAWR) interact through the investment decision: organisations that cannot measure AI value (AEI gap) struggle to justify capability development investment (HAWR gap), creating a reinforcing cycle.

---

## Build Sequence (Proposed)

The following sequence is proposed for assessment development, subject to product and commercial priorities:

| Phase | Assessment | Rationale |
|---|---|---|
| 1 | Decision Performance Index | Flagship; anchors the entire architecture; generates benchmark data for all others |
| 2 | Agentic Governance Score | Highest current demand; links to existing public tools (EU AI Act, DORA); most acute regulatory pressure |
| 3 | AI Economics Index | CFO audience; differentiating; no strong existing competitors |
| 4 | Executive Operating Model Index | Board/CEO audience; enables operating model consulting adjacency |
| 5 | Human Agency Readiness | CHRO audience; high volume but more competitive market |
| 6 | Decision Intelligence Index | Core discipline; designed last because the DPI provides the headline DI measurement |
| 7 | Sovereign AI Readiness | Extends existing DORA/NIS2 tools; natural upsell from AGS |
