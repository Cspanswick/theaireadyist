# Research Candidate Workflow — Design Specification

**Work Package 15**
**Status:** Design / specification. **No code, no migration applied** — build deferred to an approved implementation pass.
**Aligns to:** DR-001 (human judgement at the centre; no automation)
**Date:** 2026-06-23

This package specifies a **lightweight, human-curated bridge** between two independent live systems — the Executive Signal Agent ("what is happening?") and the Research Agent ("why does it matter?"). It introduces a curated handoff, not orchestration.

```
Signal → Observation → Research Topic → Research Agent → Article → Executive Briefing
                         ▲ human curates here (this package)
```

**Non-negotiables honoured:** no auto-trigger of research; no auto-created research projects; no auto-generated articles; no agent-to-agent orchestration; no background workflows or autonomous loops. Every step remains a human action.

> **DR-001 note:** building this adds a small new table and admin feature — which the operational-learning phase otherwise defers. Specifying it now (and building on explicit approval) keeps us consistent with the evidence-first posture while having the bridge ready. The bridge itself *supports* the observation goal (D5), so it is complementary to, not a deviation from, the operating model.

---

## D1 — Research Candidate Data Model

A lightweight object capturing a signal a human judged worth deeper research. It links a published signal to a future research topic.

| Field | Type | Notes |
|---|---|---|
| **Candidate ID** | text | `RQ-001`, `RQ-002`… (zero-padded sequential, app-assigned) |
| **Date Added** | timestamptz | Set on creation |
| **Source Signal — ID** | text | → `executive_signals.id` |
| **Source Signal — URL** | text | The original article URL (carried from the signal) |
| **Source Signal — Title** | text | The signal title at time of capture |
| **Associated Pillar** | text | One of the six canonical pillars (or null) |
| **Candidate Topic** | text | Short working title — e.g. *"Why CFOs are becoming the gatekeepers of AI."* |
| **Editorial Notes** | text | Optional free-text rationale |
| **Status** | text | `New` · `Reviewing` · `Research Started` · `Completed` · `Archived` |
| **Research Brief ID** | text | (optional) → `briefs.id` once research is launched — enables D5 tracking |

### Proposed migration (draft — **not applied**)

```sql
-- migration_build6.sql (DRAFT — WP15) — additive, not yet applied
CREATE TABLE IF NOT EXISTS research_candidates (
  id                text PRIMARY KEY,                 -- RQ-001 …
  created_at        timestamptz NOT NULL DEFAULT now(),
  signal_id         text,                             -- → executive_signals.id (informational)
  signal_url        text,
  signal_title      text,
  pillar            text,
  candidate_topic   text NOT NULL,
  editorial_notes   text,
  status            text NOT NULL DEFAULT 'new',      -- new|reviewing|research_started|completed|archived
  research_brief_id text,                             -- → briefs.id once launched
  created_by        text
);

ALTER TABLE research_candidates DROP CONSTRAINT IF EXISTS rc_status_check;
ALTER TABLE research_candidates ADD CONSTRAINT rc_status_check CHECK (
  status IN ('new','reviewing','research_started','completed','archived'));

ALTER TABLE research_candidates DROP CONSTRAINT IF EXISTS rc_pillar_check;
ALTER TABLE research_candidates ADD CONSTRAINT rc_pillar_check CHECK (
  pillar IS NULL OR pillar IN (
    'Executive Operating Models','Decision Intelligence','Agentic Governance',
    'AI Economics','Human Agency','Sovereign AI'));

CREATE INDEX IF NOT EXISTS rc_status_idx ON research_candidates (status, created_at DESC);
CREATE INDEX IF NOT EXISTS rc_pillar_idx ON research_candidates (pillar);
CREATE INDEX IF NOT EXISTS rc_signal_idx ON research_candidates (signal_id);

-- RLS: admin-only (server, secret key). No anon access — this is an internal backlog.
ALTER TABLE research_candidates ENABLE ROW LEVEL SECURITY;
```

`Candidate ID` sequence: assign `RQ-` + zero-padded count (server reads `max` on insert) or a dedicated Postgres sequence. Either is fine; the sequence is cleaner under concurrency (single editor makes this moot for v1).

---

## D2 — Signal Review Workflow Enhancement

Extend `/admin/signals`. Today each signal offers **Save edits · Approve · Publish · Reject**. Add one action:

**`Publish + Research Candidate`**

```
Signal approved
   ↓
Published   (unchanged — exactly as today)
   ↓
Research Candidate created  (added to a separate queue, status = New)
```

- The published signal is **not** altered — publishing behaves identically; the candidate is a separate record.
- The candidate is seeded from the signal: `signal_id`, `signal_url` (source_url), `signal_title`, `pillar` (primary_pillar). `candidate_topic` defaults to the signal title (editable later); `editorial_notes` blank.
- Implementation note: a new endpoint **`POST /api/research-candidates`** (x-admin-key, secret key) creates the row; the button calls the existing publish, then this endpoint. No change to the publish path itself.

---

## D3 — Research Candidate Queue

A dedicated internal page — **`/admin/research-candidates`** — a curated backlog of future research topics. Mirrors the existing admin design system.

- **Display per row:** candidate title · source signal (title + link) · date added · pillar · status.
- **Sort:** newest first.
- **Filter:** by pillar, by status.
- **No AI. No scoring.** A simple, human-maintained list.
- Status is editable inline (New → Reviewing → Research Started → Completed → Archived).

---

## D4 — Research Agent Integration

At the Research Agent launch screen (`/admin/research-agent`), the user chooses the topic source:

- **Option A — Free-text topic** (current behaviour, unchanged).
- **Option B — Research Candidate**: pick `RQ-001`, `RQ-002`… from a selector. The launch form then **pre-populates**:
  - Topic ← `candidate_topic`
  - Source signal ← `signal_title` + `signal_url` (passed into the brief payload / context)
  - Editorial rationale ← `editorial_notes`

The user still **manually launches** research (clicks run). On launch, set the candidate's `status = Research Started` and store the new `research_brief_id` on the candidate (D5 linkage). No automation — selection and launch are explicit human actions.

Mapping: the research brief payload (the `briefs` row the agent reads via `BRIEF_ID`) gains optional `sourceSignalUrl` / `sourceCandidateId` fields for provenance; the existing config shape is otherwise unchanged.

---

## D5 — Observation Support

The candidate records *are* the observation data — capture only, no analytics yet. The schema is designed so these questions become answerable later from plain queries:

- **Which signals repeatedly become research candidates?** → group by `signal_id` / recurring `signal_title` themes.
- **Which pillars generate the most research topics?** → count candidates by `pillar`.
- **Which observations lead to deeper investigation?** → candidates with `status` ≥ `research_started`, joined to `research_brief_id`.

No dashboards required now; the data accrues for the 30–60 day review.

---

## D6 — UX Specification (wireframes)

Uses the existing admin design system (navy surfaces, teal/amber accents, Playfair/DM fonts). No new visual language.

### Signal Review Screen — action row (addition)

```
 ┌──────────────────────────────────────────────────────────────┐
 │ SIG-…  PUBLISHED  AI ECONOMICS  SCORE 5  · McKinsey · 23 Jun   │
 │ Signal title · why it matters · decision question · tags …     │
 │ …                                                              │
 │ ┌──────────────┐ ┌──────────────────────────┐ ┌────────────┐ │
 │ │ Save edits   │ │ ✓ Publish                │ │ ✕ Reject   │ │
 │ └──────────────┘ └──────────────────────────┘ └────────────┘ │
 │ ┌────────────────────────────────────────────┐                │
 │ │ ✓ Publish + Research Candidate   ← NEW      │  (teal)        │
 │ └────────────────────────────────────────────┘                │
 │  Publish + add to the research backlog (separate queue)        │
 └──────────────────────────────────────────────────────────────┘
```

### Research Candidate Queue — list view (`/admin/research-candidates`)

```
 RESEARCH CANDIDATES                         [ Pillar ▾ ]  [ Status ▾ ]
 ──────────────────────────────────────────────────────────────────────
 RQ-003 · 23 Jun · AI Economics · NEW
   Why CFOs are becoming the gatekeepers of AI
   from: "Private Equity Data Shows AI Value Creation…"  ↗   [status ▾]
 ──────────────────────────────────────────────────────────────────────
 RQ-002 · 23 Jun · Agentic Governance · REVIEWING
   Governing agent authority before it outruns controls
   from: "UK Boardrooms Confront the Agentic Shift…"  ↗      [status ▾]
 ──────────────────────────────────────────────────────────────────────
 RQ-001 · 22 Jun · Sovereign AI · RESEARCH STARTED → brief BRIEF-019
   What 'sovereign cloud' really requires
   from: "Sovereign Cloud Labels Are a Legal Fiction…"  ↗    [status ▾]
```

### Research Candidate — detail view

```
 RQ-003                                                   Status: NEW ▾
 Candidate topic:  Why CFOs are becoming the gatekeepers of AI
 Source signal:    "Private Equity Data Shows AI Value Creation…"  ↗
 Pillar:           AI Economics      Added: 23 Jun 2026
 Editorial notes:  [ free text … ]
 ┌───────────────────────────┐  ┌──────────────┐  ┌──────────┐
 │ Launch in Research Agent →│  │ Save notes   │  │ Archive  │
 └───────────────────────────┘  └──────────────┘  └──────────┘
```

### Research Agent Launch Screen — topic source (addition)

```
 NEW RESEARCH BRIEF
 Topic source:   ( • ) Free text     ( ) Research Candidate
 ┌──────────────────────────────────────────────────────────┐
 │ [ free-text topic … ]                                     │   ← Option A
 └──────────────────────────────────────────────────────────┘
 — or —
 Research Candidate:  [ RQ-003 — Why CFOs are becoming… ▾ ]      ← Option B
   ↳ pre-fills: topic · source signal · editorial rationale
 …existing brief config (sectors, regions, length, guardrails)…
                                              [ Launch research → ]
```

---

## D7 — Future Considerations (design only — do not build)

Captured for the roadmap; explicitly **not** in scope:

- **Observation → Candidate recommendations** — suggest candidates from recurring observation patterns.
- **Candidate clustering** — group related candidates into themes.
- **Candidate prioritisation** — rank the backlog (would require scoring; deliberately omitted now).
- **Candidate → article tracking** — link a candidate through to the published article it produced.
- **Candidate → executive briefing tracking** — trace a candidate into briefing inclusion.

All remain future concepts, gated like the rest of the platform's expansion — built only when evidence and editorial need justify them.

---

## Success criteria (30–60 days)

The workflow should let the platform answer: *which signals trigger deeper curiosity, which topics deserve long-form analysis, and which pillars generate the richest research opportunities* — through a **human-curated** bridge, with **no automation** and **no loss of editorial control**.

## If approved — implementation order

1. `migration_build6.sql` (research_candidates table) — run in Supabase.
2. `POST /api/research-candidates` endpoint + the "Publish + Research Candidate" button on `/admin/signals` (D2).
3. `/admin/research-candidates` queue page (D3).
4. Research-candidate selector on `/admin/research-agent` + status/brief linkage (D4).

Deployed via the same PR flow as the homepage change. Say the word and I'll build it.
