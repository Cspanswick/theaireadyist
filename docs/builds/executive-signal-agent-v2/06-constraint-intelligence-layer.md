# D6 — Constraint Intelligence Layer (Future Architecture)

**Work Package 11 — Executive Signal Agent v2**
**Status:** Architecture only — **no implementation**
**Date:** 2026-06-23

---

## Concept

Once signals carry `constraint_type` and `dpi_dimension` (D2), the corpus of published signals becomes a dataset about the *recurring organisational constraints of the AI era*. The Constraint Intelligence Layer turns that dataset into a standing view:

> Governance Ambiguity appears in 42% of published signals.
> Decision Latency appears in 31%.
> Capability Deficit appears in 27%.

This is the asset that most strongly proves the category thesis — it lets TheAIReadyist say, with its own evidence, *"these are the constraints the market keeps hitting, and they are all Decision Performance failures."* It also seeds a future, defensible benchmark.

This document defines the architecture only. Nothing here is to be built under WP11.

---

## 1. Data model

The layer is **read-derived** from `executive_signals` — no new write path, no new source of truth. Two options:

**Option A (recommended for v1 of the layer): SQL view, computed on read.**

```sql
-- DRAFT — not to be applied under WP11
CREATE OR REPLACE VIEW constraint_intelligence AS
SELECT
  constraint_type,
  dpi_dimension,
  primary_pillar,
  decision_performance_impact,
  count(*)                                   AS signal_count,
  count(*) FILTER (WHERE decision_performance_impact IN ('High','Critical')) AS high_impact_count,
  date_trunc('month', COALESCE(published_at, created_at)) AS period
FROM executive_signals
WHERE approval_status = 'published'
GROUP BY constraint_type, dpi_dimension, primary_pillar,
         decision_performance_impact, period;
```

No new table; always current; cheap at this data volume. Expose aggregated figures to the public via a `SECURITY DEFINER` function or a dedicated endpoint — **never** by opening `executive_signals` to the anon key (same discipline as the DPI results table in build 4).

**Option B (if volume or query cost grows): materialised snapshot table.**

```sql
-- DRAFT — only if Option A becomes too costly
CREATE TABLE constraint_trends (
  id            text PRIMARY KEY,            -- CT-<period>-<constraint>
  period        date NOT NULL,               -- month bucket
  constraint_type text NOT NULL,
  dpi_dimension text,
  signal_count  int NOT NULL,
  share_pct     numeric(5,2),                -- % of that period's published signals
  high_impact_count int,
  computed_at   timestamptz NOT NULL DEFAULT now()
);
```

Refreshed by a scheduled job after each agent run / on publish. Adds a write path; only justified at scale.

**Recommendation:** start with Option A (a view). It is zero-maintenance and the published-signal volume will be modest for a long time.

---

## 2. Aggregation logic

- **Universe:** published signals only (approved + published). Pending/rejected are excluded — the layer reports what TheAIReadyist has editorially stood behind.
- **Core metrics:**
  - *Constraint frequency* — share of published signals per `constraint_type` (overall and per period).
  - *Dimension pressure* — share per `dpi_dimension`; which dimension the market is stressing most.
  - *Impact-weighted frequency* — frequency weighted by `decision_performance_impact` (Critical=4 … Low=1), so a rare-but-Critical constraint isn't hidden by a common-but-Low one.
  - *Cross-tabs* — constraint × pillar, constraint × persona, dimension × period (trend).
- **Guardrails:**
  - **Minimum N before display.** Suppress any percentage computed on fewer than ~20 published signals (or label it "emerging, low sample"). Early percentages are noise.
  - **Rolling windows.** Report 30/90-day and all-time; a single month can swing wildly.
  - **De-duplication already handled upstream** (unique `source_url`), so counts are event-counts not article-duplicates.

---

## 3. Dashboard concept

Two surfaces:

**(a) Internal — editorial/strategy view** (`/admin/constraints`)
- Constraint frequency bar chart (impact-weighted toggle).
- Dimension pressure radar (the six dimensions) — instantly legible against the DPI's own six-dimension output.
- Trend lines per constraint over time.
- Drill-through: click a constraint → the published signals behind it.
- Use: editorial planning ("we're light on Capability Deficit coverage"), and narrative ammunition for thought-leadership.

**(b) Public — "The Constraint Report" (concept)**
- A periodic, curated public view: *"The constraints enterprises keep hitting this quarter."*
- Headline figures (the 42% / 31% / 27% style), each linked to representative published signals.
- Strong category-building artefact; doubles as DPI lead-in ("recognise these? find which one constrains you → DPI").
- Must use only aggregated, published data via a controlled endpoint.

Wireframe (internal, conceptual):

```
  CONSTRAINT INTELLIGENCE                         [30d] [90d] [All]  [impact-weighted ▾]
  ───────────────────────────────────────────────────────────────────
  Governance Ambiguity   ████████████████████  42%
  Decision Latency       ███████████████       31%
  Capability Deficit     █████████████         27%
  Accountability Gap     ██████████            21%
  Economic Uncertainty   ████████              17%
  Data Fragmentation     █████                 11%
  Authority Conflict     ████                   9%

  DIMENSION PRESSURE (radar)        TREND — Governance Ambiguity
        Quality                      %│        ╭─╮
     Resil.   Velocity               │    ╭───╯ ╰──
     Value   Account.                │╭───╯
        Capability                   └──────────────► months
```

---

## 4. Future benchmark opportunities

- **Market-constraint benchmark:** publish the distribution of constraints over time as a recognised industry reference ("the enterprise AI constraint index").
- **Self vs market:** when a visitor completes the DPI, show their primary constraint *against* the market constraint distribution from this layer — "your primary constraint (Accountability) is the Nth most common in the market." This directly links the observatory (signals) to the instrument (DPI) without changing the DPI itself.
- **Sector / persona cuts:** once volume allows, segment constraint frequency by `decision_domain` or `executive_persona` for targeted thought leadership.
- **Leading-indicator framing:** correlate constraint surges with later DPI cohort movements (long-horizon, data-permitting).

---

## 5. Boundaries (non-negotiables honoured)

- Derives from existing signal metadata only; introduces **no new assessment** and does **not** alter the DPI.
- Public exposure is aggregate-only through a controlled endpoint; the signals table stays closed to anon beyond published rows.
- No personal data; pillars and the six-pillar model untouched.
- **No implementation under WP11** — this is the architecture for a later work package, gated on sufficient published-signal volume (suggest revisiting once ≥100–150 signals are published).
