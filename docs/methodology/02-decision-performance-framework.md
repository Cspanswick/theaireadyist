# 02 — Decision Performance Framework
**TheAIReadyist Methodology Workspace**  
**Version:** 1.0 | **Date:** 2026-06-22 | **Status:** Active  
**Classification:** Internal — not for public distribution

---

## Working Definition

**Decision Performance is an organisation's ability to consistently make high-value decisions at the right speed, with appropriate accountability, supported by trusted intelligence and effective execution.**

It is the primary outcome that TheAIReadyist platform is designed to measure, benchmark, and improve. Every assessment, benchmark, and signal is traceable to its impact on one or more dimensions of Decision Performance.

Decision Performance is not a single metric. It is a composite of six interdependent dimensions, each of which can constrain overall performance regardless of how well the others are performing.

---

## Why Decision Performance, Not AI Maturity

Most AI readiness frameworks measure maturity — the degree to which AI has been deployed across the organisation. This is a useful but insufficient measure. It tells leaders how much AI they have, not whether it is producing better outcomes.

Decision Performance shifts the measurement to the outcome that actually matters: the quality, velocity, accountability, capability, value, and resilience of the organisation's decisions.

An organisation with high AI maturity and low Decision Performance is exposed. It has invested significantly in AI without building the decision systems, governance, or capabilities that produce reliable value from that investment.

An organisation with improving Decision Performance — even at a moderate level of AI deployment — is building durable competitive advantage. Better decisions compound. Poor ones also compound, but in the wrong direction.

---

## The Six Dimensions

### 1. Decision Quality
**Definition:** The degree to which decisions are well-informed, logically sound, contextually appropriate, and produce the intended outcome.

Decision Quality measures whether the decision itself — before execution — is a good one. It is affected by data quality, the diversity and relevance of inputs, the cognitive and analytical capability of the decision-makers, and the degree to which AI tools support or distort judgment.

**Primary constraint indicators:**
- Decisions made on incomplete or stale data
- Overreliance on AI outputs without human contextual judgment
- High rate of decisions requiring reversal or correction
- No explicit quality review process for high-stakes decisions
- Confirmation bias baked into AI training data or prompting

**Supporting pillar:** Decision Intelligence (Pillar 2)

---

### 2. Decision Velocity
**Definition:** The speed at which high-quality decisions can be made and executed without sacrificing quality, accountability, or compliance.

Decision Velocity is not a measure of raw speed. It measures the organisation's ability to move at the pace the context requires — faster when competitive conditions demand it, with appropriate deliberation when risk or complexity justify it. The failure mode is not slowness alone; it is also reckless speed driven by AI automation that bypasses necessary judgment.

**Primary constraint indicators:**
- Decision-making bottlenecks concentrated in senior leadership
- Unclear decision rights leading to escalation loops
- AI outputs that require extensive human review before use
- Approval chains that add time without adding judgment quality
- Slow information flows from operational to executive level

**Supporting pillar:** Executive Operating Models (Pillar 1)

---

### 3. Decision Accountability
**Definition:** The clarity with which responsibility for decisions — and their consequences — is assigned, understood, and upheld across the organisation, including in AI-augmented or automated decision processes.

Decision Accountability is the governance dimension of Decision Performance. As AI takes a larger role in decision processes, accountability gaps open: no individual or function clearly owns the outcome when an agent, model, or automated system was involved. Organisations with high Decision Accountability have closed these gaps by design, not by default.

**Primary constraint indicators:**
- No named owner for decisions made by AI agents or automated systems
- Audit trails that document process but not reasoning
- Governance frameworks designed for human decisions applied unchanged to AI decisions
- Regulatory compliance managed reactively rather than by design
- Board-level AI oversight that is nominal rather than substantive

**Supporting pillar:** Agentic Governance (Pillar 3)

---

### 4. Decision Capability
**Definition:** The depth and breadth of skills, judgment, and confidence within the workforce to make high-quality decisions — independently, collaboratively, and in partnership with AI systems.

Decision Capability measures whether the people making decisions — at all levels — have what they need to make them well. As AI changes the nature of decision support, the capability requirements shift: less emphasis on information retrieval and data processing, more emphasis on judgment, contextual reasoning, ethical evaluation, and accountability for AI-assisted outcomes.

**Primary constraint indicators:**
- AI tools deployed without investment in workforce capability development
- Leaders who delegate to AI without understanding its limitations
- Frontline staff who distrust AI outputs and ignore them, or who accept them uncritically
- No defined decision-making competency framework for an AI-augmented environment
- Capability concentrated in AI specialists rather than distributed across decision-makers

**Supporting pillar:** Human Agency (Pillar 5)

---

### 5. Decision Value
**Definition:** The degree to which decisions produce measurable, attributable business value — and the degree to which the organisation can demonstrate that the value was a consequence of the decision, not a coincidence.

Decision Value is the financial accountability dimension. It asks whether the organisation can trace its financial outcomes back to the quality of the decisions that produced them, and specifically whether investments in AI, people, and process are producing demonstrable returns. The inability to attribute value is itself a decision quality problem — it means the organisation cannot learn from its successes or failures.

**Primary constraint indicators:**
- AI investments with no defined value attribution model
- Business cases built on cost displacement without accounting for transition costs
- No mechanism to distinguish AI-driven value from market-driven value
- Finance and technology operating independently with no shared value framework
- ROI measured by AI usage metrics (seats, queries, tasks) rather than decision outcomes

**Supporting pillar:** AI Economics (Pillar 4)

---

### 6. Decision Resilience
**Definition:** The organisation's ability to maintain decision quality and velocity under stress — including regulatory change, geopolitical disruption, technology failure, and AI-specific risks such as model degradation or agent failure.

Decision Resilience measures robustness. High-performing decision systems are not just effective under normal conditions — they hold up when conditions deteriorate. As organisations become more dependent on AI in their decision processes, the resilience of those AI systems, and of the organisations' ability to function without them, becomes a material risk.

**Primary constraint indicators:**
- Critical decisions dependent on a single AI provider or data source
- No playbook for decision continuity when AI systems fail or produce unreliable outputs
- Regulatory changes (DORA, NIS2, EU AI Act) creating compliance disruption
- No assessment of geopolitical risk in technology supply chains
- AI governance frameworks that have not been stress-tested against adverse scenarios

**Supporting pillar:** Sovereign AI (Pillar 6)

---

## Pillar-to-Dimension Mapping

| Dimension | Primary Supporting Pillar |
|---|---|
| Decision Quality | Decision Intelligence (2) |
| Decision Velocity | Executive Operating Models (1) |
| Decision Accountability | Agentic Governance (3) |
| Decision Value | AI Economics (4) |
| Decision Capability | Human Agency (5) |
| Decision Resilience | Sovereign AI (6) |

This is not a rigid one-to-one relationship — every pillar influences every dimension to some degree. The mapping indicates which pillar most directly addresses each dimension as its primary focus.

---

## Interaction Effects

The six dimensions are interdependent. Weakness in one creates pressure on others:

- **Low Decision Quality + High Decision Velocity** = fast bad decisions. Speed amplifies error.
- **High Decision Quality + Low Decision Accountability** = no learning. When good decisions succeed and bad ones fail, the organisation cannot identify why.
- **High Decision Capability + Low Decision Value** = skilled people making decisions whose value cannot be demonstrated. The capability investment is real; the return is invisible.
- **High Decision Velocity + Low Decision Resilience** = fast decisions that break under stress. The operating model works until it doesn't.

The Decision Performance Index (see `03-decision-performance-index.md`) is designed to identify the **primary constraint** — the dimension that, if improved, would most lift overall Decision Performance. This constraint-led approach is more actionable than a balanced scorecard.

---

## Framework Status

The Decision Performance Framework defines the six dimensions that future assessments, benchmarks, and signals will measure. The scoring model, question design, and weighting methodology are not defined in this document — they will be specified in the assessment architecture (`04-assessment-architecture.md`) and benchmark methodology (`05-benchmark-methodology.md`).

This document is the stable conceptual foundation. It should not be changed without a corresponding version increment and review.
