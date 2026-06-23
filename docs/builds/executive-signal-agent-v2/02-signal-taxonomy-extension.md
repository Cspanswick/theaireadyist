# D2 — Signal Taxonomy Extension

**Work Package 11 — Executive Signal Agent v2**
**Status:** Design / specification (proposed schema; **not applied**)
**Date:** 2026-06-23

---

## Principle

All v1 fields remain unchanged. v2 is **additive** — it layers Decision Performance metadata on top of the existing `executive_signals` row. No existing field is renamed, removed, or repurposed. This mirrors how builds 3 and 4 extended the schema (additive columns, `IF NOT EXISTS`, constrained values).

---

## New fields

### 1. `dpi_dimension`

- **Type:** single value (text).
- **Allowed values:** `Quality` · `Velocity` · `Accountability` · `Capability` · `Value` · `Resilience`.
- **Meaning:** the Decision Performance dimension this signal most directly stresses, derived via the D1 framework (default = primary pillar's primary dimension; override permitted with a one-line reason).
- **Required for queued (4–5) signals.** Optional/null for rejected rows.

### 2. `dpi_dimension_secondary`  *(supporting field, recommended)*

- **Type:** single value (text), nullable.
- **Allowed values:** same six as above (or null).
- **Meaning:** a secondary dimension when the signal meaningfully spans two. Keeps parity with the existing `secondary_pillar` pattern. Optional — included so the card and constraint layer can show cross-dimension effects without a second migration later.

### 3. `executive_persona`

- **Type:** **array** (jsonb) — multiple allowed.
- **Allowed values:** `CEO` · `COO` · `CFO` · `CIO` · `CTO` · `CHRO` · `Board`.
- **Meaning:** which executive role(s) the signal most concerns. Drives persona filtering on the public page and persona-targeted editorial.
- **Guidance:** prefer 1–3 personas; avoid tagging all seven (dilutes the signal). Default heuristics by pillar: Operating Models → CEO/COO/Board; Decision Intelligence → CIO/CTO; Agentic Governance → Board/CIO; AI Economics → CFO/Board; Human Agency → CHRO/CEO; Sovereign AI → CIO/Board.

### 4. `decision_domain`

- **Type:** single value (text), open vocabulary with a seeded list.
- **Seed values:** `AI Governance` · `Workforce Strategy` · `Operating Model Design` · `AI Investment` · `Risk Management` · `Vendor Selection` · `Sovereignty`.
- **Meaning:** the executive decision area the signal informs. Open vocabulary (not a hard DB constraint) so editorial can add domains; the seed list is enforced in the prompt and admin dropdown, with "Other → free text" allowed.

### 5. `constraint_type`

- **Type:** single value (text), seeded vocabulary aligned to the methodology's per-pillar constraints.
- **Seed values:** `Accountability Gap` · `Governance Ambiguity` · `Data Fragmentation` · `Authority Conflict` · `Decision Latency` · `Capability Deficit` · `Economic Uncertainty`.
- **Meaning:** the recurring organisational limitation the signal exposes. This is the field that feeds the **Constraint Intelligence Layer** (D6).
- **Mapping to methodology constraints** (`07-pillar-definitions.md`):

  | constraint_type | Maps to methodology constraint(s) | Typical pillar |
  |---|---|---|
  | Accountability Gap | "Accountability gap", "Accountability diffusion" | Agentic Governance, Human Agency |
  | Governance Ambiguity | "Framework adaptation failure", "Scope creep", "Regulatory opacity" | Agentic Governance, Sovereign AI |
  | Data Fragmentation | "Data quality at point of decision", "Bias amplification" | Decision Intelligence |
  | Authority Conflict | "Centralised decision rights", "Undefined AI escalation paths" | Executive Operating Models |
  | Decision Latency | "Operating model lag", "Decision-making bottlenecks" | Executive Operating Models |
  | Capability Deficit | "Judgement atrophy", "Role design lag", "Adoption theatre" | Human Agency |
  | Economic Uncertainty | "Cost opacity", "Attribution failure", "Weak business cases" | AI Economics |

  (Open vocabulary; editorial may extend, but new values should map to a documented constraint to keep the D6 aggregation meaningful.)

### 6. `decision_performance_impact`

- **Type:** single value (text).
- **Allowed values:** `Low` · `Medium` · `High` · `Critical`.
- **Meaning:** the severity of the signal's impact on Decision Performance. Distinct from the existing 1–5 `executive_relevance_score` (which measures editorial/queueing relevance). This measures *organisational consequence*. Recommended alignment: score 5 ↔ often Critical/High; score 4 ↔ High/Medium — but the two are set independently.

---

## Proposed migration (draft — **not applied**)

For the architect to review. This would be `migration_build6.sql`, following the established conventions. Nothing here has been run.

```sql
-- ============================================================
-- Build 6 Migration (DRAFT — Work Package 11, v2 design) — theAIReadyist
-- Adds Decision Performance metadata to executive_signals.
-- ADDITIVE ONLY. No existing column changed. Not yet applied.
-- ============================================================

ALTER TABLE executive_signals ADD COLUMN IF NOT EXISTS dpi_dimension            text;
ALTER TABLE executive_signals ADD COLUMN IF NOT EXISTS dpi_dimension_secondary  text;
ALTER TABLE executive_signals ADD COLUMN IF NOT EXISTS executive_persona        jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE executive_signals ADD COLUMN IF NOT EXISTS decision_domain          text;
ALTER TABLE executive_signals ADD COLUMN IF NOT EXISTS constraint_type          text;
ALTER TABLE executive_signals ADD COLUMN IF NOT EXISTS decision_performance_impact text;

-- DPI dimension constrained to the six canonical dimensions (short form) or null
ALTER TABLE executive_signals
  DROP CONSTRAINT IF EXISTS exec_signals_dpi_dimension_check;
ALTER TABLE executive_signals ADD CONSTRAINT exec_signals_dpi_dimension_check CHECK (
  dpi_dimension IS NULL OR dpi_dimension IN
    ('Quality','Velocity','Accountability','Capability','Value','Resilience')
);
ALTER TABLE executive_signals
  DROP CONSTRAINT IF EXISTS exec_signals_dpi_dimension_sec_check;
ALTER TABLE executive_signals ADD CONSTRAINT exec_signals_dpi_dimension_sec_check CHECK (
  dpi_dimension_secondary IS NULL OR dpi_dimension_secondary IN
    ('Quality','Velocity','Accountability','Capability','Value','Resilience')
);

-- Impact constrained to the four severity bands or null
ALTER TABLE executive_signals
  DROP CONSTRAINT IF EXISTS exec_signals_dp_impact_check;
ALTER TABLE executive_signals ADD CONSTRAINT exec_signals_dp_impact_check CHECK (
  decision_performance_impact IS NULL OR decision_performance_impact IN
    ('Low','Medium','High','Critical')
);

-- decision_domain and constraint_type are intentionally UNCONSTRAINED (open vocab);
-- the seed lists are enforced in the prompt and admin UI, not the DB.

-- Indexes for the Constraint Intelligence Layer (D6) and persona/dimension filtering
CREATE INDEX IF NOT EXISTS exec_signals_dpi_dim_idx     ON executive_signals (dpi_dimension);
CREATE INDEX IF NOT EXISTS exec_signals_constraint_idx  ON executive_signals (constraint_type);
CREATE INDEX IF NOT EXISTS exec_signals_dp_impact_idx   ON executive_signals (decision_performance_impact);

-- RLS unchanged: anon still reads published rows only (the new columns inherit it).
-- Done. Existing rows get NULL dimension/domain/constraint/impact and []
-- executive_persona; they remain valid and display correctly.
```

---

## Backfill & compatibility

- Existing v1 rows get nulls / empty arrays for the new fields — valid, and the public card (D4) renders gracefully when a field is absent.
- Optional one-off backfill: run the v2 classifier over published v1 signals to populate `dpi_dimension` + `constraint_type` so the Constraint Intelligence Layer has history. Not required for go-live.

## Out of scope (non-negotiables honoured)

No pillar renamed; six-pillar model intact; no new assessment; DPI untouched; no broader platform redesign. These fields *describe* signals in Decision Performance terms — they do not create a new scoring instrument.
