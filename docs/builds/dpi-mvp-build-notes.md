# DPI MVP — Build Notes

**Build:** Decision Performance Index (DPI) MVP v1.0
**Branch:** `feature/decision-performance-index-mvp`
**Date:** 2026-06-22
**Methodology source of truth:** `docs/methodology/` (00, 01, 02, 03, 07)

---

## 1. Summary

The Decision Performance Index is the flagship diagnostic for The AI Readyist. It does **not** measure AI maturity — it identifies the **primary organisational constraint** limiting Decision Performance across the six dimensions defined in the Decision Performance Framework (`02-decision-performance-framework.md`).

The MVP is a single, self-contained static page (`dpi.html`) that matches the existing site design language and assessment pattern (modelled on `eu-ai-act.html`). It runs entirely client-side and produces a constraint-led executive report. An anonymous, benchmark-ready result is posted to an optional serverless endpoint on submission; the assessment completes successfully whether or not storage is configured.

---

## 2. Architecture

| Concern | Decision |
|---|---|
| Page | `dpi.html` — single static HTML file, no build step, no new frameworks. Inline CSS + vanilla JS, identical token set to `eu-ai-act.html`. |
| Hosting | Vercel static (`cleanUrls: true` → served at `/dpi`). No `vercel.json` change needed. |
| Two views | One file, two views toggled in-place: **assessment** (`#assessment-view`) and **executive report** (`#report-view`). No navigation change. |
| Scoring | Computed in the browser on submit only. No server round-trip required to see results. |
| Storage | Optional `POST /api/dpi-submit` serverless function → Supabase `dpi_results`. Best-effort, fire-and-forget (`keepalive`), failure-silent. |
| Design language | navy `#0D1B2A` / teal `#00C9A7` / amber `#E8A838`; Playfair Display (headings), DM Sans (body), DM Mono (labels). Reused nav + footer chrome. |

### Flow

```
dpi.html (assessment view)
   18 statements (6 dimensions × 3), 1–5 Likert
   progress rail (X/18) — Generate button enabled at 18/18
        │  submit (answers saved only on submission)
        ▼
compute results client-side  ──►  render report view (#report-view)
        │                              Score · Band · Primary/Secondary
        │                              Constraint · What This Means ·
        │                              Next Step · Dimension Breakdown
        ▼ (best-effort, async)
POST /api/dpi-submit  ──►  Supabase dpi_results  (anonymous, benchmark-ready)
```

---

## 3. Data Model

### Client payload (POST `/api/dpi-submit`)
```json
{
  "assessment_id": "DPI-2026-06-22T14-05-31-220Z",
  "timestamp": "2026-06-22T14:05:31.220Z",
  "version": "1.0",
  "overall_score": 64.0,
  "band": "Performing",
  "primary_constraint": "Decision Accountability",
  "secondary_constraint": "Decision Velocity",
  "dimension_scores": {
    "quality": 75, "velocity": 50, "accountability": 41.7,
    "capability": 83.3, "value": 75, "resilience": 58.3
  },
  "industry": null, "org_size": null, "geography": null
}
```

### Supabase table (`migration_build4.sql`)
`dpi_results` — `id` (PK, `DPI-<iso>`), `created_at`, `version`, `overall_score numeric(5,1)`, `band`, `primary_constraint`, `secondary_constraint`, `dimension_scores jsonb`, and nullable `industry` / `org_size` / `geography`.

- CHECK constraints enforce the four canonical bands, the six canonical dimension names, and `overall_score ∈ [0,100]`.
- Indexes on `created_at`, `band`, `primary_constraint`, and the `(industry, org_size, geography)` cohort tuple.
- **RLS enabled with no anon policies** — the anon (publishable) key cannot read or write. All writes are server-side via `SUPABASE_SECRET_KEY` (bypasses RLS), mirroring the existing `insights` endpoints.

### Privacy
No personal data is collected or stored. The API sanitises input and drops any unexpected fields. Optional benchmark dimensions are coarse and non-identifying, and are not collected by the MVP UI (the fields exist for a future demographics step).

---

## 4. Scoring Implementation

Exactly as specified in the build instruction:

- **Scale:** 1 Strongly Disagree · 2 Disagree · 3 Neutral · 4 Agree · 5 Strongly Agree.
- **Dimension raw score** = sum of its 3 statements → range **3–15**.
- **Dimension score (0–100)** = `((raw − 3) / 12) × 100`.
- **Overall DPI** = arithmetic mean of the six dimension scores → range **0–100**.
- **Bands:** 0–39 Reactive · 40–59 Developing · 60–79 Performing · 80–100 Adaptive. The band is selected from the **rounded** overall so the displayed number and the band label are always consistent (avoids the integer-range gap between e.g. 39 and 40).
- **Primary constraint** = lowest-scoring dimension. **Secondary constraint** = second lowest.
- **Tie-break:** deterministic — equal scores resolve by canonical dimension order (Quality → Velocity → Accountability → Capability → Value → Resilience) via a stable index sort.

### Dimension → Pillar mapping (per `02`/`07`)
| Dimension | Recommended focus pillar |
|---|---|
| Decision Quality | Decision Intelligence |
| Decision Velocity | Executive Operating Models |
| Decision Accountability | Agentic Governance |
| Decision Capability | Human + AI Workforce |
| Decision Value | AI Economics |
| Decision Resilience | Sovereign AI |

### Verification
A standalone Node test reproduced the in-page logic and passed **19/19** assertions: formula endpoints (raw 3→0, 9→50, 15→100), all-1s (0 / Reactive), all-3s (50 / Developing), all-5s (100 / Adaptive), every band boundary (39/40/59/60/79/80), constraint ranking, and deterministic tie-breaking.

---

## 5. Outputs (Executive Report)

Renders, in order: Decision Performance Score (0–100) + Performance Band + band description; Primary Constraint (with recommended focus pillar) and Secondary Constraint; **What This Means** (constraint-specific narrative derived from the framework's constraint indicators); **Recommended Next Step** (constraint-specific, pointing to the mapped pillar); and a Dimension Breakdown of all six dimensions with the primary/secondary flagged. Report is print-optimised (`@media print`) for "Print / Save as PDF".

---

## 6. Future Benchmark Hooks

- `dpi_results` is designed for cohorting from day one: `band`, `primary_constraint`, per-dimension jsonb scores, and the `(industry, org_size, geography)` cohort index are all in place.
- The client payload already carries `industry` / `org_size` / `geography` slots — wiring a short optional demographics step before submit is the only UI work needed to start populating benchmark cohorts.
- Aggregate benchmark figures should be exposed later via a dedicated server endpoint or a `SECURITY DEFINER` view — **never** by opening `dpi_results` to the anon key.
- `version` is stored on every row so future question/scoring revisions remain comparable or filterable.

---

## 7. UX / Acceptance

- Completion target **under 7 minutes**; 18 statements; mobile + desktop responsive; sticky progress indicator; answers saved **only on submission**; clear final report; printable. ✅
- Methodology docs remain internal — no public route added; `docs/` is not served as part of any rendered page. ✅
- No new frameworks, no navigation redesign, no change to pillar definitions. ✅

---

## 8. Open Issues / Pre-release Recommendations

1. **Run `migration_build4.sql`** in the Supabase SQL editor before relying on storage. Until then `/api/dpi-submit` returns `{ ok: true, stored: false }` and the UI still works.
2. **Storage is currently anonymous-only and unauthenticated.** `/api/dpi-submit` has no rate limiting — add a basic rate limit / origin check (or a lightweight token) before public launch to prevent benchmark-data pollution.
3. **Demographics step** (industry / size / geography) is not yet in the UI. Add it as an optional pre-submit step to begin building benchmark cohorts. Keep it optional and non-identifying.
4. **Benchmark display** — the report currently shows absolute scores only. A "vs. peer cohort" comparison should follow once the dataset is meaningful (see `05-benchmark-methodology.md`).
5. **Equal weighting** is used across dimensions (per spec). If sector/maturity weighting is later introduced (open design question 4 in `03`), bump `DPI_VERSION` and persist the weighting profile on each row.
6. **Single respondent model.** The MVP assumes one respondent. Multi-respondent aggregation (open question 1 in `03`) is out of scope for v1.0.
7. **Result link/export.** Results are not persisted to a shareable URL; "Retake" clears state. A shareable/exportable report link is a candidate enhancement.
