# 06 — Executive Signals
**TheAIReadyist Methodology Workspace**  
**Version:** 0.1 (Placeholder) | **Date:** 2026-06-22 | **Status:** Pre-design  
**Classification:** Internal — not for public distribution

---

> **Status note:** This document defines the intended Executive Signals capability at a conceptual level. No signal taxonomy, collection methodology, or delivery format has been finalised. This is a placeholder to establish design intent before the capability is built.

---

## Purpose

The Executive Signals capability is the continuous intelligence layer of TheAIReadyist platform.

Where assessments provide a point-in-time diagnostic and benchmarks provide peer context, Executive Signals provide the ongoing stream of intelligence that keeps leaders aware of changing conditions affecting their Decision Performance — before those changes become crises.

The goal is to shift leaders from reactive awareness ("we heard about this after it happened") to anticipatory awareness ("we saw this coming and acted before it arrived").

---

## What Executive Signals Are

Executive Signals are concise, evidence-based intelligence items that:

- Flag a development in the AI, regulatory, workforce, or economic environment that is material to Decision Performance
- Classify the signal by its type, urgency, and the Decision Performance dimension it affects
- Provide a clear indication of what the signal means for executive decision-making
- Arrive at the right frequency — enough to be useful, not so frequent as to become noise

Executive Signals are not news summaries. They are curated intelligence — selected and framed for their relevance to Decision Performance, not for their general newsworthiness.

---

## Signal Collection

*Collection methodology to be designed. The following describes design intent.*

Signal collection will draw from a defined set of high-quality source categories, prioritised in the same hierarchy used by the editorial research agent:

**Tier 1 — Primary sources:**
- Regulatory body announcements (EU AI Office, FCA, PRA, ECB, national data protection authorities)
- Standards bodies (ISO, NIST, IEEE)
- Government policy documents and consultations
- Company statements and earnings calls (where material to AI governance or economics)

**Tier 2 — Recognised research:**
- Analyst firms (Gartner, Forrester, McKinsey, Deloitte, PwC, KPMG, BCG)
- Academic research from recognised institutions
- Central bank and regulatory research papers

**Tier 3 — Trade and specialist press:**
- Credible specialist AI, governance, and enterprise technology publications
- Legal and compliance publications covering AI regulation

**Excluded:**
- Vendor marketing material
- Social media commentary
- Unverified claims or anonymous sources

Signal collection will be supported by the existing research agent infrastructure, with human review before publication.

---

## Signal Classification

Each Executive Signal will be classified across four dimensions:

### 1. Signal Type

| Type | Description |
|---|---|
| **Regulatory** | A regulatory development, enforcement action, or compliance deadline that affects AI governance, sovereignty, or operating model obligations |
| **Market** | A significant development in AI capability, competitive dynamics, or vendor landscape that affects AI Economics or operating model decisions |
| **Workforce** | A development affecting human judgement, capability, or agency in AI-augmented organisations — affecting the Human Agency dimension |
| **Geopolitical** | A geopolitical development affecting Sovereign AI risk — technology dependency, data sovereignty, or cross-border operating constraints |
| **Governance** | A governance failure, accountability precedent, or audit finding that affects Agentic Governance posture |
| **Economic** | A cost, value, or investment development affecting AI Economics decision-making |

### 2. Urgency

| Level | Description |
|---|---|
| **Immediate** | Requires executive attention within days — a regulatory deadline, enforcement action, or material operational event |
| **Near-term** | Requires decision or preparation within 30–90 days |
| **Strategic** | A developing trend that should influence medium-term strategy; no immediate action required |
| **Informational** | Background intelligence with no immediate decision implication; useful for context and learning |

### 3. Decision Performance Dimension Affected

Each signal is tagged to the primary Decision Performance dimension it affects (Quality, Velocity, Accountability, Capability, Value, or Resilience), and to the relevant pillar(s).

### 4. Confidence Level

| Level | Description |
|---|---|
| **High** | Primary source confirmed; signal is factual |
| **Medium** | Secondary source; signal is credible but unconfirmed by primary source |
| **Developing** | Signal is emerging; evidence is early or incomplete |

---

## Decision Performance Impact

Each signal will include an explicit assessment of its Decision Performance impact — what does this signal mean for an organisation's ability to make good decisions?

The impact assessment will address three questions:

**1. Which organisations are most affected?**  
Not every signal is equally material to every organisation. The impact assessment will indicate which sectors, geographies, or organisation types face the greatest exposure.

**2. What Decision Performance dimension is most at risk?**  
Signals are tagged to the dimension they most affect, with a brief explanation of the mechanism — how does this development translate into a Decision Performance consequence?

**3. What is the executive action implication?**  
A one-paragraph plain-English description of what a senior leader should do — or at least consider — in response to this signal. Not a comprehensive action plan; a directional steer.

---

## Executive Recommendations

For Immediate and Near-term signals, the Executive Signal will include a short recommendation — a specific action or decision that the intelligence supports.

Recommendations are designed to be:
- **Specific:** Not "review your governance framework" but "assess whether your audit trail documentation meets the standard the EU AI Office has indicated it will apply in enforcement."
- **Proportionate:** Calibrated to the urgency and materiality of the signal. Not every signal requires a board briefing.
- **Actionable by the right person:** Tagged to the executive role most likely to act on it (CEO, CFO, CIO, CTO, CHRO, Board, General Counsel).

Recommendations are not advice. TheAIReadyist does not provide legal, compliance, or financial advice. Recommendations are intelligence-led executive pointers; specific decisions require professional advice.

---

## Future Daily Intelligence Workflow

The intended end-state for the Executive Signals capability is a daily intelligence workflow that operates as follows:

```
COLLECTION (automated + research agent)
        ↓
   Source monitoring across Tier 1–3 sources
        ↓
CURATION (human editorial review)
        ↓
   Signal assessed for materiality, classified, confidence-rated
        ↓
ENRICHMENT (AI-assisted, human-reviewed)
        ↓
   Decision Performance impact assessed
   Executive recommendation drafted
   Relevant benchmark context added (if available)
        ↓
DELIVERY (platform + email)
        ↓
   Signal published to subscriber feed
   High-urgency signals trigger email alert to relevant subscribers
   Signals tagged to subscribers' sector, geography, and pillar focus
        ↓
ARCHIVE & TREND
        ↓
   Signals archived and indexed
   Trend analysis run monthly across signal corpus
   Material pattern changes surfaced as Strategic Signals
```

**Personalisation:** Signals will be filtered and prioritised based on the subscriber's assessment profile — sector, geography, organisation size, and identified primary constraint. A subscriber whose primary constraint is Decision Accountability will receive Regulatory and Governance signals at higher prominence than Economic or Market signals.

---

## Open Design Questions

1. **Volume:** How many signals per day/week is the right cadence? (Too few: insufficient coverage. Too many: becomes noise executives delegate or ignore.)
2. **Editorial vs automated:** What is the human/automation split in signal production? The research agent can collect and draft; a human editor should review. What is the minimum viable editorial process?
3. **Subscriber model:** Are Executive Signals free (driving top-of-funnel), premium (revenue), or gated by assessment completion?
4. **Personalisation depth:** At what point does personalisation require subscriber data that raises privacy considerations?
5. **Signal vs insight:** Where is the line between a Signal (current intelligence) and an Insight (editorial analysis)? How do the two products relate on the platform?
6. **Frequency controls:** Should subscribers be able to set their own signal frequency preferences (daily digest, weekly round-up, immediate alerts only)?
