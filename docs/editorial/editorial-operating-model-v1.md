# Editorial Operating Model v1

**Work Package 13 — Operating Package**
**Aligns to:** DR-001 (Mission AI Readiness · Category Decision Performance · Engine Constraint Intelligence)
**Applies to:** the first 60 operational days after Executive Signals v1 goes live.
**Date:** 2026-06-23

This is how TheAIReadyist *operates* as an intelligence platform during the first operational period. It governs signal quality, editorial consistency, evidence integrity, observation discipline, and repeatable learning. It is **not** strategy, design or build. Success is the **quality and quantity of proprietary Decision Performance observations** accumulated — not features, pages or assessments.

**Non-negotiables:** do not build Constraint Intelligence; no schema changes / new fields; no homepage or signal-card redesign; no new assessments or strategy frameworks. Existing data and tooling only.

---

## D1 — Signal Publishing Framework

Every queued signal resolves to one of four actions: **Publish · Rewrite · Escalate · Reject.**

### Publish — required criteria (all must hold)
- Executive relevance score **4 or 5** (see D2).
- Classified to **one of the six pillars** with **medium or high** confidence.
- A clear **executive implication** (the "why it matters" is an implication, not a summary).
- **Credible source**; not a vendor press release / product launch lacking executive implication.
- **Not a duplicate** (URL dedup already applied; check for near-duplicate stories).
- Headline-level metadata only; **no paywalled body** was needed.

*Examples (publish):*
- *"CFOs tighten scrutiny as AI programme costs outpace returns"* (AI Economics, 4) — material board/CFO implication.
- *"New data-residency enforcement forces re-architecture of cross-border AI workloads"* (Sovereign AI, 5) — board-level resilience implication.

### Rewrite — editorial intervention, then publish/approve
Substance qualifies but the packaging is weak. Fix, don't reject.
- Signal title is the **raw article headline** → sharpen to an executive headline.
- "Why it matters" reads as a **summary** → recast as the executive implication.
- **Decision question is generic** ("should we care about this?") → make it answerable about the reader's own org.
- **Pillar looks misassigned** or claim is **over-strong** for the evidence → correct pillar / soften claim.

*Examples (rewrite):* a strong Agentic Governance story whose title just restates the vendor's; a score-4 item whose decision question is vague.

### Escalate — trigger discussion (weekly review or ad-hoc with Strategy)
- **High potential impact but low/uncertain pillar confidence** — needs a second opinion.
- Looks like the **start of a recurring theme** → log to the Observation Register (D4) and flag.
- **Challenges a DR-001 assumption** (e.g., suggests a different category/engine read) — Strategy must see it.
- **Sensitivity/legal**: named individuals, unverified allegations, reputational risk.
- **Source-quality dispute** or a **volume anomaly** (sudden spike/drop).

### Reject — required criteria (any one)
- Score **≤ 3** (unless the source is exceptional **and** daily volume is low — then it may be held, not published).
- **Vendor PR / product launch** with no executive implication; low-quality SEO; social posts; rumours.
- **Not relevant to any pillar** (`not_relevant_to_pillars`).
- **Duplicate** / near-duplicate of an already-handled story.

*Examples (reject):* "New GPU now available, webinar next week"; a sponsored buyers-guide; generic "AI is transforming everything" filler.

### Editorial decision tree

```
 Incoming queued signal
        │
        ▼
 Relevant to a pillar?──no──► REJECT (not_relevant_to_pillars)
        │ yes
        ▼
 Vendor PR / launch / SEO / social / rumour, no exec implication?──yes──► REJECT
        │ no
        ▼
 Score ≥ 4?──no──► (exceptional source & low-volume day? ─yes─► HOLD for review)
        │ yes                                   └─no─► REJECT (below threshold)
        ▼
 Pillar confidence ≥ medium?──no──► ESCALATE (second opinion)
        │ yes
        ▼
 Title/why/decision-question strong & claim supported?──no──► REWRITE ──┐
        │ yes                                                            │
        ▼                                                                ▼
 Sensitivity / new-theme / challenges-DR-001?──yes──► ESCALATE      (then re-enter)
        │ no
        ▼
 PUBLISH
```

---

## D2 — Executive Relevance Scoring Model

Score the **executive implication**, not how interesting the news is. When torn between two scores, pick the **lower** unless the item is genuinely board-level. Only **4–5** are publishable.

| Score | Meaning | Test | Examples |
|---|---|---|---|
| **1 — Noise** | Not strategically relevant | Would no executive change anything? | Minor product tweak; routine vendor update |
| **2 — Peripheral** | Relevant to a pillar but low urgency/impact | Connected but "so what?" is weak | A small survey stat; a niche regional item |
| **3 — Monitor** | Useful context, not yet actionable | Worth watching, not deciding on | Early-stage trend; one analyst's opinion piece |
| **4 — Strategic** | Material implication for C-suite / MSP / telco leadership | A named executive should ask a question because of it | CFO ROI scrutiny intensifying; CIO restructuring for AI delivery |
| **5 — Board-level** | Significant implication for AI strategy, governance, economics, operating model, sovereignty or human leadership | The board should hear about it | Regulation forcing AI re-architecture; agent authority outrunning governance |

**Consistency rules:**
1. Implication over interest — a fascinating story with no org implication is ≤ 2.
2. Specificity raises score — concrete, decision-relevant detail beats vague "AI is big."
3. Audience seniority raises score — board/CxO implication → 4–5; manager-level → ≤ 3.
4. Evidence caps score — thin/unverified evidence caps at 3 regardless of topic.
5. Re-score on rewrite if editing changes the implication.

Tie-breakers and disagreements ≥ 1 point go to the weekly review for calibration.

---

## D3 — Weekly Intelligence Review Process

A repeatable rhythm to keep quality high and learning compounding.

- **Cadence:** weekly, **30–45 minutes.**
- **Attendees:** Editorial (owns the queue), Strategy (owns DR-001 alignment), Platform owner (owns health/decisions).
- **Pre-work:** Editorial fills the metrics from `/admin/observation` + the weekly operational SQL; new observations logged to the Observation Register.

**Agenda (timeboxed):**
1. **Metrics review (~8 min):** signals ingested / approved / rejected / published; approval & publication rates; avg score.
2. **Pattern review (~12 min):** recurring themes, unusual observations, signal concentration (one pillar/source dominating). Log/upgrade observations.
3. **Source review (~10 min):** strongest/weakest sources; source-quality trends; feeds to enable/disable.
4. **Action review (~10 min):** changes required (scoring calibration, editorial fixes, source changes); owner + due date each.

**Outputs:** a completed weekly review record + an updated Observation Register + logged actions.

### Weekly review template (copy-ready)

```
# Weekly Intelligence Review — Week of YYYY-MM-DD
Attendees: Editorial __ · Strategy __ · Platform owner __

1. METRICS
   Ingested __ | Approved __ | Rejected (agent __/admin __) | Published __
   Approval rate __% | Publication rate __% | Avg score __

2. PATTERNS
   Recurring themes this week: ____
   Unusual observations: ____
   Concentration (pillar/source dominance): ____
   Observations logged/upgraded (IDs): ____

3. SOURCES
   Strongest: ____   Weakest: ____   Trend: ____
   Enable/disable: ____

4. ACTIONS  (owner · due)
   - ____
   - ____

Calibration notes (scoring disagreements resolved): ____
```

---

## D4 — Observation Methodology

Capture **observations**, not constraints. An observation is a recurring or notable pattern seen in signals. Naming, clustering and taxonomy come **later**, at the 60-day gate — never automatically.

**Observation Register — required fields:**

| Field | Definition |
|---|---|
| **Observation ID** | `OBS-001`, sequential, never reused |
| **Date** | First logged |
| **Source** | The signal(s)/source(s) evidencing it (IDs or names) |
| **Description** | What is recurring/notable — observational, not prescriptive |
| **Potential Executive Impact** | Why it might matter to a CxO/board (tentative) |
| **Associated Pillar** | Which of the six it seems to relate to (tentative) |
| **Confidence Level** | Low (2–3×, anecdotal) · Medium (recurring across weeks/sources) · High (frequent, multi-source, consistent) |
| **Editorial Notes** | Reviewer commentary, links, caveats, supersessions |

**Rules:** one row per distinct pattern; log liberally; upgrade confidence as evidence accumulates; never delete (supersede with a note); do **not** label anything a "constraint." Stored in `docs/editorial/observation-register.md`. This supersedes the earlier WP12 Emerging Pattern Register (fields aligned + Editorial Notes added).

---

## D5 — 30-Day Success Criteria

At day 30, answer the five questions from the dashboard, weekly reviews and register. These are diagnostic, not pass/fail.

1. **Which pillars dominate?** (distribution + whether any pillar is starved)
2. **Which sources contribute most value?** (accepted/published share, not just volume)
3. **What approval rates are observed?** (and are they stable/sensible?)
4. **What recurring themes appear?** (from the Observation Register)
5. **What editorial challenges emerge?** (scoring drift, thin pillars, source gaps)

Reference expectations (assumptions to validate, not targets): a *healthy* month shows multiple pillars represented (not 90% one pillar), a handful of sources doing most of the work, an approval rate that isn't ~0% or ~100%, and ≥ a few logged observations.

### 30-Day Review Template (copy-ready)

```
# 30-Day Review — period [start]→[end]
Volume: total __ | published __ | avg/day __
1. Pillar dominance: ____ (starved pillars: ____)
2. Top-value sources: ____ | low-value sources: ____
3. Approval rate __% | publication rate __% | avg score __ | assessment: ____
4. Recurring themes (OBS IDs): ____
5. Editorial challenges: ____
Adjustments for next 30 days: ____
```

---

## D6 — 60-Day Evidence Gate

The decision framework for what happens after the observation period. Its instrument is the existing **Constraint Intelligence Readiness Report** (`docs/observation/constraint-intelligence-readiness-report.md`); this is its governing logic.

**Five questions:**
1. Do recurring patterns exist? (Observation Register has repeated, non-noise entries.)
2. Do they cluster naturally? (Patterns group into a small number of categories.)
3. Is there evidence supporting a constraint taxonomy? (Clusters map to candidate categories without forcing.)
4. Is there enough data volume to justify Constraint Intelligence v1? (Per the readiness report's volume threshold.)
5. Decision: **proceed / continue observation / revise assumptions.**

### Decision framework

```
 Q1 patterns exist? ──no──────────────► CONTINUE OBSERVATION (extend 30 days)
   │ yes
 Q2 cluster naturally? ──no──────────► CONTINUE OBSERVATION / refine capture
   │ yes
 Q3 taxonomy evidence-backed? ──no──► REVISE ASSUMPTIONS (adjust taxonomy, re-observe)
   │ yes
 Q4 volume sufficient? ──no──────────► CONTINUE OBSERVATION (collect to threshold)
   │ yes
 All yes ─────────────────────────────► PROCEED to Constraint Intelligence v1 build planning
                                         (must still pass DR-001 alignment test)
```

A "proceed" decision starts a *build package*, designed from observed behaviour — never a return to theoretical design.

---

## D7 — Operational Dashboard Specification

Specifies the internal dashboard. The live implementation already exists at **`/admin/observation`** (reads existing data via the existing `/api/signals-pending?status=all`; **no schema changes, no new fields**). This spec documents its required views and the one register-sourced addition.

| View group | Metrics | Data source |
|---|---|---|
| **Platform Health** | daily run success / failures (time-guard skips excluded); feed failures; API cost | GitHub Actions logs + Anthropic usage (manual entry — not in DB) |
| **Editorial Metrics** | approval rate; publication rate; rejection rate (agent vs admin); avg score | `executive_signals` via existing endpoint *(live in dashboard)* |
| **Signal Metrics** | volume (day/week); source contribution; pillar distribution | `executive_signals` via existing endpoint *(live in dashboard)* |
| **Observation Metrics** | observation count; recurring themes (by frequency); confidence-level trend | **Observation Register** (`observation-register.md`) — manual/register-sourced, since observations are not a DB field (no schema change) |

Notes:
- Editorial + Signal views are already implemented and need no change.
- Platform Health is partly outside the DB (run status, cost) — capture in the weekly review; a future enhancement could surface Actions status, but that is **not** in scope here.
- Observation Metrics are sourced from the register, honouring "existing data only / no new fields." If/when the 60-day gate approves Constraint Intelligence, observation data may graduate to the database — but not before, and not under this package.

---

## Operating cadence summary

| Rhythm | Activity | Artifact |
|---|---|---|
| Daily | Glance at run health + queue | `/admin/observation` |
| Per review | Apply D1 decision tree + D2 scoring to the queue | `/admin/signals` |
| Weekly | Intelligence review (D3) | Weekly review record + Observation Register |
| Day 30 | 30-day review (D5) | 30-Day Review |
| Day 60 | Evidence gate (D6) | Constraint Intelligence Readiness Report → decision |

**The discipline is the product.** Repeatable observation, consistent scoring, and honest evidence capture are what turn 60 days of operation into the proprietary dataset that the platform's next advantage depends on.
