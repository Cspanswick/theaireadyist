# 05 — Benchmark Methodology
**TheAIReadyist Methodology Workspace**  
**Version:** 0.1 (Placeholder) | **Date:** 2026-06-22 | **Status:** Pre-design  
**Classification:** Internal — not for public distribution

---

> **Status note:** This document describes the intended benchmarking approach at a design-intent level. No scoring model, statistical methodology, or cohort definition has been finalised. This is a placeholder to establish the conceptual architecture before design work begins.

---

## Purpose

Benchmarking is the mechanism through which individual assessment scores become contextually meaningful. A Decision Performance Score in isolation tells an organisation how it performs against an absolute standard. Benchmarking tells it how that performance compares to peers — by industry, geography, and organisation size — and how it is changing over time.

The goal of TheAIReadyist benchmarking capability is to give executive leaders a credible, contextual answer to the question: **how ready are we, compared to the organisations we actually compete with?**

---

## Benchmark Dimensions

### 1. Industry Benchmarks

**Purpose:** Compare Decision Performance scores against organisations in the same or adjacent sectors.

Industry context matters because the decision environment — regulatory exposure, competitive dynamics, technology dependency, and workforce characteristics — varies significantly by sector. A Sovereign AI Readiness score of 65 means something different for a European bank operating under DORA than it does for a retail operation with no critical infrastructure obligations.

**Intended sectors at launch:**
- Financial Services (Banking, Insurance, Asset Management)
- Energy & Utilities (including Critical Infrastructure)
- Retail & Consumer
- Technology & Software
- Pharmaceutical & Life Sciences
- Manufacturing
- Professional Services
- Public Sector

*Sector taxonomy: to be finalised in cohort design phase.*

**Design considerations:**
- Minimum cohort size for statistical meaningfulness (to be defined)
- Sub-sector treatment: is BFSI one cohort or three?
- Cross-sector comparisons: how to handle organisations that operate across multiple sectors

---

### 2. Geography Benchmarks

**Purpose:** Compare Decision Performance against organisations operating in the same regulatory and economic environment.

Geography benchmarks are particularly important for the Sovereign AI Readiness and Agentic Governance dimensions, where regulatory obligations differ materially by jurisdiction. A governance posture adequate in one market may be non-compliant or insufficient in another.

**Intended geographies at launch:**
- United Kingdom & Ireland
- European Union (aggregate)
- Northern Europe (Nordics + DACH)
- Southern Europe
- Middle East & Africa
- Asia-Pacific
- North America

*Geography taxonomy: to be finalised based on assessment respondent data.*

**Design considerations:**
- How to handle organisations with significant multi-geography operations (use headquarters? use primary revenue geography? use geography of greatest regulatory exposure?)
- EU vs UK post-Brexit divergence in AI regulation: how to surface this in benchmarks without creating a compliance interpretation service
- Regional benchmark minimum cohort sizes

---

### 3. Organisation Size Benchmarks

**Purpose:** Compare Decision Performance against organisations of comparable scale, resource base, and structural complexity.

Decision Performance challenges vary significantly by organisation size. A 500-person organisation faces different Decision Velocity constraints (typically too slow at senior level, under-governed at operational level) than a 50,000-person organisation (too slow throughout, but for different reasons — hierarchy, bureaucracy, conflicting decision rights).

**Intended size bands:**
- Large Enterprise: 10,000+ employees
- Mid-Market: 1,000–9,999 employees
- Growth: 250–999 employees

*Size bands and revenue equivalents: to be defined in cohort design.*

**Design considerations:**
- Employee count vs. revenue as the primary size signal (or both?)
- How to handle organisations that have grown rapidly and whose structure lags their scale
- Private vs. publicly listed: does this materially affect Decision Performance profiles?

---

### 4. Trend Analysis

**Purpose:** Track changes in Decision Performance over time — at the individual organisation level and at the aggregate benchmark level.

Trend analysis is the mechanism through which benchmarks become a continuous intelligence asset rather than a point-in-time comparison. It enables two types of insight:

**Organisation-level trend:** Is this organisation's Decision Performance improving or declining? At what rate? In which dimensions? This is the data that makes the assessment a continuous improvement tool rather than a one-time diagnostic.

**Aggregate trend:** Is industry Decision Performance improving overall? Are specific dimensions improving faster than others? Are there leading indicators in the benchmark data that predict future Decision Performance changes?

**Design considerations:**
- Minimum number of data points for trend significance (likely: 2 assessments minimum, 3 for trend, 5 for pattern)
- Cohort stability: how to handle changes in the benchmark cohort composition over time
- External event correlation: how to tag benchmark data with significant external events (regulatory changes, AI capability shifts) that may explain aggregate trend changes
- Anonymisation: benchmark data used for trend analysis must be aggregated and anonymised to protect individual respondent confidentiality

---

## Data Collection and Integrity

*Scoring model and statistical approach not yet defined. The following are design-intent principles.*

**Respondent validation:** Benchmark integrity requires that respondents are who they say they are (organisation type, size, geography, sector). A validation approach will be required, to be defined.

**Self-assessment bias:** Self-reported assessments are subject to optimism bias, social desirability bias, and inconsistent interpretation of questions. The benchmark methodology must account for this — either through question design (forced-choice, evidence-based prompts) or through score calibration.

**Cohort transparency:** Benchmark comparisons should be transparent about cohort composition and size. An organisation should know whether it is being compared against 12 peers or 1,200. Minimum cohort sizes will be enforced before benchmark comparisons are surfaced.

**No vendor benchmarking:** Benchmark data will not be segmented by AI vendor or technology provider relationship. Benchmarks measure Decision Performance, not technology adoption.

---

## Benchmark Outputs (Intended)

When the benchmarking capability is built, it will produce:

**Percentile ranking:** Where the organisation sits within its benchmark cohort for each dimension and for the composite DPI score.

**Gap analysis:** The distance between the organisation's score and the benchmark median, and the benchmark top quartile. The gap to top quartile is the more actionable metric — it defines the improvement opportunity.

**Dimension comparison:** Which dimensions are above and below benchmark, enabling constraint prioritisation in a peer context.

**Trend line:** For returning respondents, how the organisation's scores have changed relative to the benchmark cohort trend.

**Narrative context:** Where benchmark data surfaces a significant finding (e.g. the organisation is in the bottom quartile for Decision Accountability in its sector), the output should provide interpretive context — what this typically means, and what organisations that have improved in this dimension have done differently.

---

## Open Design Questions

1. **Benchmark data source at launch:** The benchmark dataset will be empty at initial launch. How do we handle benchmarking before we have a statistically significant cohort? (Options: use proxy data from published research; use early-adopter cohort with explicit caveat; delay benchmark feature until minimum cohort is reached.)
2. **Update cadence:** How frequently are benchmark scores recalculated and published? Continuously (as new assessment data comes in) or on a defined schedule (quarterly)?
3. **Cohort access:** Should organisations be able to see their own cohort membership (i.e. which organisations are in the benchmark group) or only aggregate data?
4. **Benchmark as product:** Is the benchmark a free feature of taking an assessment, or a premium product?
5. **Research publication:** Does TheAIReadyist publish aggregate benchmark data as editorial content (e.g. an annual State of Decision Performance report)? This is both a value-creation and a brand-building opportunity.
