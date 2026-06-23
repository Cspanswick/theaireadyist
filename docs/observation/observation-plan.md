# Executive Signals — Observation Period Plan

**Aligns to:** DR-001 · **Phase:** Priority 2 (operational learning)
**Duration:** minimum 30–60 days of live signal collection from go-live.
**Objective:** **data collection, not content production.** Begin accumulating proprietary Decision Performance data. **Do not build Constraint Intelligence during this period** — let patterns emerge.

---

## What the v1 data model can and cannot measure

| Metric family | Native in v1? | How captured |
|---|---|---|
| Signal volume (day/week/source) | ✅ Yes | SQL on `executive_signals` |
| Editorial metrics (approval/rejection/publication) | ✅ Yes | SQL (separating agent- vs admin-decisions) |
| Pillar distribution | ✅ Yes | SQL on `primary_pillar` |
| **Executive-persona distribution** | ⚠️ **No native field** | Manual capture during review (v1 has no `executive_persona`; it is a v2 field). |
| **Emerging themes / constraints** | ⚠️ **Partial** | Mine `classification_reason`, `suggested_tags`, `excerpt`; capture patterns manually. **Do not formalise as constraints yet.** |

This gap is intentional and useful: whether persona/constraint metadata is worth building is precisely what the **Constraint Intelligence Readiness Report** will decide from this period's evidence.

---

## Metrics & ready-to-run SQL

Run in Supabase SQL Editor. Adjust the interval as needed.

### 1. Signal volume

```sql
-- Per day (last 60 days)
SELECT created_at::date AS day, count(*) AS signals
FROM executive_signals
WHERE created_at >= now() - interval '60 days'
GROUP BY 1 ORDER BY 1;

-- Per ISO week
SELECT date_trunc('week', created_at)::date AS week, count(*) AS signals
FROM executive_signals
GROUP BY 1 ORDER BY 1;

-- Source contribution
SELECT source_name, source_group, count(*) AS signals
FROM executive_signals
GROUP BY 1,2 ORDER BY signals DESC;
```

### 2. Editorial metrics

The agent stores items as `pending` (score 4–5) or `rejected` (below threshold / filtered). Human decisions act on the pending queue. Separate the two:

```sql
-- Agent throughput: what the agent queued vs auto-rejected
SELECT
  count(*) FILTER (WHERE approval_status = 'pending'  AND approved_by IS NULL) AS still_pending,
  count(*) FILTER (WHERE approval_status = 'approved')                          AS approved,
  count(*) FILTER (WHERE approval_status = 'published')                         AS published,
  count(*) FILTER (WHERE approval_status = 'rejected' AND rejected_reason = 'admin_rejected') AS admin_rejected,
  count(*) FILTER (WHERE approval_status = 'rejected' AND COALESCE(rejected_reason,'') <> 'admin_rejected') AS agent_rejected,
  count(*) AS total
FROM executive_signals;

-- Editorial rates (of items a human actually decided on)
WITH decided AS (
  SELECT
    count(*) FILTER (WHERE approval_status IN ('approved','published')) AS approved_pub,
    count(*) FILTER (WHERE approval_status = 'rejected' AND rejected_reason = 'admin_rejected') AS admin_rej
  FROM executive_signals
)
SELECT approved_pub, admin_rej,
       round(approved_pub::numeric / NULLIF(approved_pub + admin_rej,0) * 100, 1) AS approval_rate_pct,
       round(admin_rej::numeric    / NULLIF(approved_pub + admin_rej,0) * 100, 1) AS rejection_rate_pct
FROM decided;

-- Publication rate (of approved items, how many went public)
SELECT
  count(*) FILTER (WHERE approval_status = 'published') AS published,
  count(*) FILTER (WHERE approval_status IN ('approved','published')) AS approved_or_published,
  round(count(*) FILTER (WHERE approval_status='published')::numeric
        / NULLIF(count(*) FILTER (WHERE approval_status IN ('approved','published')),0) * 100,1) AS publication_rate_pct
FROM executive_signals;
```

### 3. Pillar distribution

```sql
SELECT primary_pillar, count(*) AS signals,
       round(count(*)::numeric / SUM(count(*)) OVER () * 100, 1) AS pct
FROM executive_signals
WHERE primary_pillar IS NOT NULL
GROUP BY 1 ORDER BY signals DESC;

-- Pillar distribution among PUBLISHED only (what the platform stood behind)
SELECT primary_pillar, count(*) AS published
FROM executive_signals
WHERE approval_status = 'published'
GROUP BY 1 ORDER BY published DESC;
```

### 4. Executive-persona distribution (manual, no native field)

v1 has no persona field. Two options during observation:
- **Light manual tag:** the reviewer records 1–3 personas per *published* signal in the weekly log (use the WP11 pillar→persona heuristic as a starting point: Operating Models→CEO/COO/Board; Decision Intelligence→CIO/CTO; Agentic Governance→Board/CIO; AI Economics→CFO/Board; Human Agency→CHRO/CEO; Sovereign AI→CIO/Board).
- **Proxy via pillar:** report persona relevance *inferred from pillar mix* — directional only, flagged as inference.

Capture this in the weekly log, not the database. If persona proves consistently useful to capture, that is direct evidence for building the v2 `executive_persona` field.

### 5. Emerging themes (capture, do not classify)

```sql
-- Recent approved/published signals with the raw material for theme-spotting
SELECT created_at::date AS day, primary_pillar, signal_title,
       classification_reason, suggested_tags
FROM executive_signals
WHERE approval_status IN ('approved','published')
ORDER BY created_at DESC
LIMIT 200;

-- Tag frequency (themes often surface here first)
SELECT tag, count(*) AS freq
FROM executive_signals, jsonb_array_elements_text(suggested_tags) AS tag
WHERE approval_status IN ('approved','published')
GROUP BY 1 ORDER BY freq DESC LIMIT 40;
```

Record recurring observations as free-text patterns in the weekly log. **Do not yet name them as formal constraints** — that is the readiness report's job, on accumulated evidence.

---

## Weekly observation log (template)

Copy one block per week into `docs/observation/observation-log.md`.

```
## Week of YYYY-MM-DD

Volume:        __ signals (vs prev __) · daily avg __ · top sources: ____
Editorial:     queued __ · approved __ · published __ · admin-rejected __
               approval rate __% · publication rate __%
Pillar mix:    EOM __ · DI __ · AG __ · AIEcon __ · HA __ · Sov __  (counts or %)
Persona (manual/inferred): CEO _ COO _ CFO _ CIO _ CTO _ CHRO _ Board _
Emerging patterns (free text, NOT constraints):
  - ____
Feed health notes: ____
Anomalies / actions: ____
```

---

## Period close (day 30–60)
Compile the weekly logs into the **Constraint Intelligence Readiness Report** (`constraint-intelligence-readiness-report.md`) and answer its five questions from the evidence. Only then does CI build planning become eligible.

## Guardrails (DR-001)
Data collection only. No new features, no CI build, no taxonomy imposition. Patterns are captured, not formalised.
