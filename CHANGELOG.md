# Changelog — The AI Readyist

All notable changes to the editorial taxonomy, site structure, and agent configuration are documented here.

---

## [Ops] — Editorial Operating Model v1 (Work Package 13)

**Date:** 2026-06-23

Operating package for the first 60 live days (docs only; no code/schema/strategy):

- `docs/editorial/editorial-operating-model-v1.md` — D1 Signal Publishing Framework (+ editorial decision tree), D2 Executive Relevance Scoring Model (1–5 with anchors), D3 Weekly Intelligence Review process + template, D4 Observation Methodology, D5 30-Day Success Criteria + template, D6 60-Day Evidence Gate framework, D7 Operational Dashboard Specification.
- `docs/editorial/observation-register.md` — canonical Observation Register (WP13 fields incl. Editorial Notes); supersedes the earlier emerging-pattern-register.

D6 uses the existing `constraint-intelligence-readiness-report.md` as its instrument; D7 documents the already-live `/admin/observation` dashboard (no schema changes). Non-negotiables honoured.

---

## [Ops] — Execute DR-001: operational baseline tooling

**Date:** 2026-06-23

Evidence-gathering tooling for the observation period (existing data only; no new schema, taxonomy, or Constraint Intelligence):

- `admin/observation/index.html` — internal observation dashboard answering "what is the platform learning?" (volume, pillar distribution, source contribution, editorial outcomes, emerging tags/recent). Reads the existing `/api/signals-pending?status=all` endpoint; reuses existing design tokens. Read-only.
- `docs/observation/weekly-operational-report-template.md` — weekly operational report (Signal Volume, Source Quality, Pillar Distribution, Editorial Performance, Platform Health) with method/SQL per metric.
- `docs/observation/emerging-pattern-register.md` — lightweight pattern register (patterns, not constraints) feeding the CI readiness review.

Priority 1 (Phase A go-live) remains the single highest priority — blocked only on credentialed owner steps (migration + secrets).

---

## [Governance/Ops] — Post-WP12 direction (DR-001 + Phase A + observation)

**Date:** 2026-06-23

- `docs/decisions/DR-001-operating-model.md` — **DR-001 (Approved):** Mission AI Readiness · Category Decision Performance · Engine Constraint Intelligence · Discipline Decision Intelligence. All future build packages must reference DR-001.
- `docs/builds/executive-signal-agent-v1-operations.md` — operations & monitoring runbook (checks, failure modes, recovery, cost, alerting).
- `docs/builds/executive-signal-agent-v1-deployment-report.md` — Phase A deployment report (build-complete; go-live pending credentialed owner steps A1–A2; first-run result fields to complete).
- `docs/observation/observation-plan.md` + `observation-log.md` — 30–60 day observation measurement plan (metric definitions, ready-to-run SQL, weekly log). Notes v1 captures volume/editorial/pillar natively; persona/themes captured manually.
- `docs/observation/constraint-intelligence-readiness-report.md` — evidence-review template (5 questions + decision gate). **Constraint Intelligence is not built until evidence justifies it.**

No code, migrations, features or assessments added — operational learning phase per DR-001.

---

## [Strategy] — `feature/wp12-operating-model` (Work Package 12)

### Added — Decision Performance Operating Model (strategy only, no code)

**Date:** 2026-06-23

Canonical strategic architecture for the platform. **No code, UI, migrations or assessments** — strategic architecture only. In `docs/strategy/`:

- `wp12-category-model-decision.md` — A/B/C category evaluation. **Ratified Model C**: Category = Decision Performance; proprietary engine = Constraint Intelligence; mission = AI Readiness; Decision Intelligence retained as internal discipline. Scorecard: A 20/50, B 32/50, C 44/50.
- `wp12-decision-performance-operating-model.md` — the canonical operating model (D1 concept hierarchy, D2 asset map, D3 proprietary analysis, D4 data model, D5 constraint intelligence framework, D6 category ownership, D7 3-year north star).

Key decision: **Constraint Intelligence is the proprietary engine, not the category** (partially retracts an interim WP12 working statement). Organising principle: *become AI Ready by improving Decision Performance through Decision Intelligence, using Constraint Intelligence to find the one limit that matters most.* Non-negotiables honoured: pillars/DPI/six-pillar model unchanged.

---

## [Design] — `feature/executive-signal-agent-v2` (Work Package 11)

### Added — Decision Performance Alignment design package (no code changes)

**Date:** 2026-06-23

A design/specification package aligning Executive Signals with the Decision Performance category. **Design only** — no code changed, no migration applied, the v1 engine and the DPI are untouched. Located in `docs/builds/executive-signal-agent-v2/`:

- D1 — Decision Performance Signal Framework (pillar → DPI-dimension mapping, grounded in `docs/methodology`).
- D2 — Signal Taxonomy Extension: new fields `dpi_dimension`, `dpi_dimension_secondary`, `executive_persona[]`, `decision_domain`, `constraint_type`, `decision_performance_impact`; draft (un-applied) `migration_build6.sql`.
- D3 — Enhanced Signal Generation Prompt: adds Constraint Exposed, Decision Performance Impact, Executive Action (Tier-2 only; cost profile preserved).
- D4 — Decision Performance Signal Card: two-zone card with a Decision Performance readout band (+ wireframes).
- D5 — Homepage Integration Strategy: rename "Latest Executive Signals" → "Decision Performance Signals"; dimension-led observatory module (+ desktop/mobile wireframes).
- D6 — Constraint Intelligence Layer: future architecture only (read-derived constraint analytics; DPI bridge).

Non-negotiables honoured: pillars not renamed, six-pillar model intact, no new assessment, DPI unaltered, no platform redesign.

---

## [Unreleased] — `feature/executive-signal-agent-v1`

### Added — Executive Signal Agent v1

**Date:** 2026-06-23

A pillar-based executive signal engine. It ingests public RSS/Atom feeds from approved sources, classifies each item against the six pillars, scores executive relevance 1–5, and queues scores 4–5 for human approval. **Nothing is auto-published.**

#### Files added

- `agent/configs/signal-sources.json` — source config (8 feed-verified/enabled across 5 groups; ~35 more configured-and-disabled with notes).
- `agent/run-signal-agent.js` — orchestrator: fetch → dedupe (URL) → Tier-1 Haiku triage → Tier-2 Sonnet signal generation (score ≥4 only) → store pending in Supabase. Supports `MOCK_CLASSIFY`, `FEED_FIXTURES`, `DRY_RUN`, `MAX_ITEMS`.
- `migration_build5.sql` — `executive_signals` table with pillar + status + score constraints, unique `source_url`, RLS (anon reads `published` only).
- `api/signals-pending.js` — admin GET endpoint (x-admin-key) with status/pillar/source/score filters.
- `api/signals-decision.js` — admin POST endpoint (x-admin-key): approve / reject / publish / save-edits.
- `admin/signals/index.html` — human review UI (filter, inline-edit, approve, reject, publish).
- `signals.html` — public page; reads `published` signals via the anon key only.
- `.github/workflows/signal-agent.yml` — daily scheduled run (creates pending only; no commit/push, no publish).
- `docs/builds/executive-signal-agent-v1-notes.md` — full build documentation.

#### Notes

- Two-tier model (Haiku triage → Sonnet on promote) keeps running cost to ~$3–5/month; no web-search tool used.
- **Channel Futures** was sunset (Oct 2025) → config uses **Channel Dive** (Informa TechTarget).
- Paywalled sources (FT, Economist, WSJ, Bloomberg) are configured but disabled — RSS headline/excerpt only, never full-body fetch.
- Scheduling cron is UTC (`0 5 * * *` = 06:00 UK in BST); see build notes for the DST caveat.

---

## [Unreleased] — `feature/six-pillar-taxonomy`

### Changed — Six-Pillar Taxonomy (replaces five-pillar model)

**Date:** 2026-06-22

The editorial taxonomy has been updated from five pillars to six. The old pillars are preserved below for historical reference and must not be reused as current labels in any new content or tooling.

#### Reason for change

The five-pillar model was defined in 2025 as an early editorial framework. After the taxonomy audit (June 2026), it was clear that:

1. The old Pillar 3 (Governance, Trust & Risk) attracted 100% of published content — the other four pillars were empty.
2. Two distinct subject areas — agentic AI governance and national/regulatory sovereignty — had been conflated into a single pillar, reducing editorial precision.
3. The old model had no clear home for "AI economics" as a standalone discipline (it was split between Pillar 1 and implied by Pillar 2).
4. The six-pillar model better reflects how senior enterprise leaders actually frame AI readiness decisions.

#### New pillars (v1, active from 2026-06-22)

| # | Pillar | Primary Lenses |
|---|---|---|
| 1 | Executive Operating Models | Value, Resilience |
| 2 | Decision Intelligence | Trust, Accountability |
| 3 | Agentic Governance | Risk, Accountability, Trust |
| 4 | AI Economics | Value, Risk |
| 5 | Human Agency | Trust, Resilience, Value |
| 6 | Sovereign AI | Risk, Resilience, Accountability |

Cross-cutting lenses: **Trust · Risk · Accountability · Resilience · Value**

#### Old pillars (v0 — retired 2026-06-22, preserved for history)

| # | Old Pillar Name | Mapped to New Pillar(s) |
|---|---|---|
| 1 | AI Cost Intelligence | AI Economics (4) |
| 2 | PoC Purgatory | Executive Operating Models (1) + AI Economics (4) |
| 3 | Governance, Trust & Risk | Agentic Governance (3) |
| 4 | The Human & Culture Layer | Human Agency (5) — formerly "Human + AI Workforce" |
| 5 | AI-Native Operating Model | Executive Operating Models (1) |

#### Files changed

- `admin/blog-research/index.html` — Pillar cards and JS `PILLARS` object replaced with six new pillars. Lens chips added to each card.
- `agent/run-agent.js` — `pillar` and `lenses` fields added to YAML frontmatter output and Supabase staging row.
- `migration_build3.sql` — New migration: `pillar`, `secondary_pillar`, and `lenses` columns added to `insights` table. DB constraint enforces six canonical pillar names.
- `docs/pillar-taxonomy-v1.md` — Full taxonomy documentation: definitions, lenses, asset mapping, implementation checklist.
- `CHANGELOG.md` — This file.

#### Files with pending changes (not in this branch — requires live site repo access)

- `index.html` — Homepage pillar cards need updating to six pillars with `data-pillar` attributes.
- All public tool and article pages — `data-pillar`, `data-secondary-pillar`, `data-lenses` attributes to be added per the asset mapping in `docs/pillar-taxonomy-v1.md`.
- `agent/configs/default.json` — `pillar` and `lenses` fields to be added.

#### Acceptance criteria status

| Criterion | Status |
|---|---|
| Admin prompt builder uses all six pillars | ✅ Done |
| No references to old five-pillar model in admin/agent files | ✅ Done |
| Agent output carries pillar + lenses metadata | ✅ Done |
| DB schema supports pillar/lenses on insights | ✅ Done (migration_build3.sql) |
| Taxonomy documented | ✅ Done (docs/pillar-taxonomy-v1.md) |
| Changelog added | ✅ Done (this file) |
| Homepage shows all six pillars | ⏳ Pending (homepage not in this workspace) |
| All public pages carry data-pillar attributes | ⏳ Pending (requires live repo access) |
| Existing tools still work | ✅ No functional changes to tool logic |
| Vercel build passes | ✅ No build config or JS module changes |

---

## [Unreleased] — Website Realignment Sprint

### Changed — Pillar 5 Renamed: Human + AI Workforce → Human Agency

**Date:** 2026-06-22

Pillar 5 renamed from "Human + AI Workforce" to "Human Agency" as part of the website realignment to the Decision Intelligence / Decision Performance platform positioning.

**Reason for change:**

The name "Human + AI Workforce" describes a collaboration model (humans and AI working together). "Human Agency" makes the strategic focus explicit: the central question is not collaboration design but the preservation of human judgement, accountability, and capability as AI takes on a larger role in decision-making. The new name signals a sharper, more strategic position — one that enterprises and senior leaders will recognise as a live concern.

**What changed:**

| Area | Change |
|---|---|
| Pillar 5 name | Human + AI Workforce → Human Agency |
| Pillar 5 description | Updated across all files to reflect agency/judgement focus |
| DPI assessment (dpi.html) | Dimension 4 updated: purpose, questions, and nextStep text |
| Prompt builder (admin/blog-research/index.html) | Pillar card name, hint text, and topic chips updated |
| migration_build3.sql | CHECK constraint updated to use 'Human Agency' |
| All methodology docs (00–07) | All references updated |
| CHANGELOG.md | This entry |

**DB migration note:**

If `migration_build3.sql` was already run in Supabase with the old CHECK constraint (enforcing 'Human + AI Workforce'), run the following before inserting any insights with pillar = 'Human Agency':

```sql
-- Remove old constraint
ALTER TABLE insights DROP CONSTRAINT IF EXISTS insights_pillar_check;

-- Add updated constraint with new pillar name
ALTER TABLE insights ADD CONSTRAINT insights_pillar_check CHECK (
  pillar IS NULL OR pillar IN (
    'Executive Operating Models',
    'Decision Intelligence',
    'Agentic Governance',
    'AI Economics',
    'Human Agency',
    'Sovereign AI'
  )
);
```

---

## History

Prior to 2026-06-22, no formal changelog was maintained. The five-pillar model was established during initial site build (2025) and was defined only in `admin/blog-research/index.html`. It was not reflected in any public-facing markup, the insights database schema, or agent output.
