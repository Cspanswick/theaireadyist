# Project Handoff — TheAIReadyist
**For:** New chat session  
**Date:** 2026-06-22  
**Workspace folder:** `The AI Readyist Website Redesign -`  
**GitHub repo:** `Cspanswick/theaireadyist`  
**Branch in progress:** `feature/six-pillar-taxonomy`

---

## What This Project Is

**TheAIReadyist** is an independent publication and assessment platform for senior enterprise leaders. It helps organisations build AI readiness through the lens of Decision Intelligence — the discipline of improving organisational decisions through data, context, governance, automation, and AI.

The platform has three layers:
1. **Editorial content** — articles, insights, and research for C-suite leaders
2. **Assessment tools** — interactive tools that diagnose AI readiness gaps
3. **Admin + agent infrastructure** — internal tooling for content production and approval

The owner is **Clive Spanswick** (`spanswickclive@gmail.com`).

---

## What's in the Local Workspace

The workspace folder (`The AI Readyist Website Redesign -`) contains **only the admin, agent, and documentation layer** of the project. The public-facing website (homepage, assessment tools, articles) lives in the GitHub repo at `Cspanswick/theaireadyist` and is deployed via Vercel. Those HTML files are **not** in the local workspace.

### Current file tree

```
/
├── CHANGELOG.md                          ← Taxonomy change log (new)
├── migration_build1.sql                  ← Supabase: adds next_run_at, runs table
├── migration_build2.sql                  ← Supabase: insights table + RLS
├── migration_build3.sql                  ← Supabase: pillar/lenses columns (new)
├── taxonomy-audit-summary.md             ← Full audit of site structure (read-only reference)
├── taxonomy-audit.csv                    ← Asset-level audit data (read-only reference)
│
├── admin/
│   ├── approvals/index.html              ← Approve/reject agent drafts
│   ├── blog-research/index.html          ← Prompt builder (UPDATED: 6 pillars)
│   └── research-agent/
│       ├── index.html                    ← Agent control centre
│       └── app.js                        ← Agent UI logic
│
├── agent/
│   └── run-agent.js                      ← Core agent runner (UPDATED: pillar/lenses in output)
│
├── api/
│   └── run-agent.js                      ← Serverless function: triggers GitHub Actions dispatch
│
└── docs/
    ├── pillar-taxonomy-v1.md             ← Public-facing taxonomy reference (new)
    ├── six-pillar-taxonomy-review.md     ← Design team review brief (new)
    ├── project-handoff.md                ← This file
    └── methodology/                      ← Internal IP workspace (new)
        ├── 00-strategy-overview.md
        ├── 01-decision-intelligence.md
        ├── 02-decision-performance-framework.md
        ├── 03-decision-performance-index.md
        ├── 04-assessment-architecture.md
        ├── 05-benchmark-methodology.md
        ├── 06-executive-signals.md
        └── 07-pillar-definitions.md
```

---

## Infrastructure

### Supabase
- **Project URL:** `https://mydxofjvpuurwwaohqys.supabase.co`
- **Publishable key:** `sb_publishable_gAIR6BSI1ZwMNSzafJCAdQ_hAb6jtAR`
- **Secret key:** stored as GitHub Actions secret `SUPABASE_SECRET_KEY` — not in repo

**Tables:**
- `briefs` — agent run configs created by the research agent control centre. Fields: `id` (BRIEF-NNN), `status`, `created_at`, `updated_at`, `form_state` (JSON), `payload` (JSON config)
- `runs` — append-only run history per brief. Fields: `id` (RUN-timestamp), `brief_id`, `scheduled_for`, `started_at`, `completed_at`, `status`, `insight_id`, `error`
- `insights` — content drafts and published articles. Fields: `id` (INS-timestamp), `slug`, `title`, `summary`, `pillar` (new), `secondary_pillar` (new), `lenses` (new jsonb array), `sectors` (jsonb), `regions` (jsonb), `status` (draft|published|rejected|superseded), `body`, `published_at`

**Pending migration:** `migration_build3.sql` needs to be run in Supabase SQL Editor to add the `pillar`, `secondary_pillar`, and `lenses` columns to `insights`.

### GitHub Actions
- Workflow file: `.github/workflows/research-agent.yml`
- Triggered via the `/api/run-agent.js` serverless function
- Runs `agent/run-agent.js` using `claude-sonnet-4-6` with web_search tool
- Writes markdown output to `agent/output/` and stages a draft in Supabase

### Agent model
- `claude-sonnet-4-6` (confirmed current, June 2026)
- Uses `web_search_20250305` tool type

---

## The Six-Pillar Taxonomy

This is the central editorial and product architecture. Everything maps to it.

| # | Pillar | Decision Performance Dimension | Primary Lenses |
|---|---|---|---|
| 1 | Executive Operating Models | Decision Velocity | Value, Resilience |
| 2 | Decision Intelligence | Decision Quality | Trust, Accountability |
| 3 | Agentic Governance | Decision Accountability | Risk, Accountability, Trust |
| 4 | AI Economics | Decision Value | Value, Risk |
| 5 | Human + AI Workforce | Decision Capability | Trust, Resilience, Value |
| 6 | Sovereign AI | Decision Resilience | Risk, Resilience, Accountability |

**Cross-cutting lenses:** Trust · Risk · Accountability · Resilience · Value

**Strategic hierarchy:**
```
Decision Intelligence (discipline)
        ↓
  Decision Systems (the six pillars)
        ↓
Decision Performance (the outcome)
```

**Replaced:** The old five-pillar model (AI Cost Intelligence / PoC Purgatory / Governance Trust & Risk / The Human & Culture Layer / AI-Native Operating Model). Full history in `CHANGELOG.md`.

### Existing site assets mapped to new pillars
| Asset | URL | Primary Pillar |
|---|---|---|
| EU AI Act Assessment | /eu-ai-act.html | Agentic Governance |
| DORA Assessment | /dora.html | Sovereign AI |
| NIS2 Readiness Lens | /nis2.html | Sovereign AI |
| AI Governance Exposure Radar | /radar.html | Agentic Governance |
| EU AI Act Enforcement article | /eu-ai-act-enforcement.html | Agentic Governance |
| EU AI Act Risk Reference | /eu-ai-act-reference.html | Agentic Governance |
| EU AI Act Navigator | /eu-ai-act-tiers.html | Agentic Governance |

---

## The Methodology Workspace

`docs/methodology/` is **internal IP** — not public-facing, not exposed by any route. It documents the intellectual architecture of the platform:

- **`00`** — Mission, strategic model, hierarchy, how pillars/assessments/benchmarks/signals relate
- **`01`** — Decision Intelligence: full definition, executive relevance by role, five components
- **`02`** — Decision Performance Framework: six dimensions, constraint indicators, pillar mapping
- **`03`** — Decision Performance Index (DPI): placeholder spec for the flagship assessment
- **`04`** — Assessment architecture: full two-level suite (DPI + 6 pillar assessments), build sequence
- **`05`** — Benchmark methodology: industry/geography/size/trend — placeholder
- **`06`** — Executive Signals: collection, classification, impact model, daily workflow design
- **`07`** — Pillar definitions: canonical internal reference with constraints and governance rules

**Assessment suite planned (not yet built):**
- DPI — Decision Performance Index (flagship, Level 1)
- EOMI — Executive Operating Model Index
- DII — Decision Intelligence Index
- AGS — Agentic Governance Score
- AEI — AI Economics Index
- HAWR — Human + AI Workforce Readiness
- SAIR — Sovereign AI Readiness

---

## What Was Done in This Session

### Session work (2026-06-22)

**1. Six-pillar taxonomy rollout** (`feature/six-pillar-taxonomy`)
- Rewrote `admin/blog-research/index.html` — five old pillar cards → six new ones, 3-column grid, lens chips, new JS PILLARS object with topics
- Updated `agent/run-agent.js` — `pillar` and `lenses` now written to YAML frontmatter and Supabase staging row
- Created `migration_build3.sql` — adds pillar/secondary_pillar/lenses to insights table
- Created `docs/pillar-taxonomy-v1.md` — public taxonomy reference with asset mapping and implementation checklist
- Created `CHANGELOG.md` — formal log with old pillar names preserved
- Created `docs/six-pillar-taxonomy-review.md` — design team review brief

**2. Methodology workspace**
- Created `docs/methodology/` with eight foundational documents (1,363 lines)
- Covers the full intellectual architecture: strategy, DI definition, DPF six dimensions, DPI spec, assessment architecture, benchmark methodology, executive signals design, canonical pillar definitions

---

## What's Still Pending

### High priority — needs live repo access
These require access to the public HTML files in `Cspanswick/theaireadyist`:

1. **Homepage pillar cards** — currently shows 5 old pillars. Needs updating to 6, with `data-pillar` attributes. Design question open: layout for 6 cards (3+3 recommended).
2. **`data-pillar` attributes on public pages** — all 7 asset pages listed in the mapping table above need `data-pillar`, `data-secondary-pillar`, `data-lenses` HTML attributes added.
3. **`agent/configs/default.json`** — referenced in agent code but not in the workspace. Should have `pillar` and `lenses` fields added when the file is accessible.

### Medium priority — product decisions needed
4. **Decision Performance Index design** — see `docs/methodology/03-decision-performance-index.md` for 8 open design questions. No assessment questions yet.
5. **Insights page pillar filtering** — now that `pillar` is in the DB, pillar-based filtering on `/insights` is possible. Design decision needed.
6. **`migration_build3.sql`** — run in Supabase SQL Editor when ready. Safe to run; existing rows get `pillar = NULL`.

### Low priority — future build
7. Six pillar-specific assessments (see `04-assessment-architecture.md` for build sequence)
8. Executive Signals capability
9. Benchmark infrastructure

---

## Conventions Established

**File naming:** Methodology docs use `NN-kebab-name.md` zero-padded numbering.

**Pillar references:** Always use the full canonical name (e.g. "Agentic Governance" not "AG" or "Pillar 3") except in code where the number is used as a key.

**HTML metadata pattern:**
```html
data-pillar="Agentic Governance"
data-secondary-pillar="Sovereign AI"
data-lenses="Risk,Accountability,Trust"
```

**Agent config shape** (when `pillar`/`lenses` are added):
```json
{
  "pillar": "Agentic Governance",
  "lenses": ["Risk", "Accountability", "Trust"],
  "topic": "...",
  "marketFocus": [...],
  "region": [...]
}
```

**Assessment IDs:** DPI, EOMI, DII, AGS, AEI, HAWR, SAIR (defined in `04-assessment-architecture.md`)

**Supabase pillar constraint** (enforced by `migration_build3.sql`):
```sql
CHECK (pillar IS NULL OR pillar IN (
  'Executive Operating Models', 'Decision Intelligence',
  'Agentic Governance', 'AI Economics',
  'Human + AI Workforce', 'Sovereign AI'
))
```

---

## Key Documents to Read First

If starting a new task, read these in order:

1. **This file** — project state and context
2. **`docs/methodology/00-strategy-overview.md`** — the strategic model everything derives from
3. **`docs/pillar-taxonomy-v1.md`** — the public taxonomy reference with implementation checklist
4. **`CHANGELOG.md`** — what changed and why (important for understanding the five→six transition)
5. **The specific methodology doc** for whatever area you're working in

---

## Git State

```
Branch: feature/six-pillar-taxonomy

Commits:
  db108d4  feat(methodology): add methodology workspace — docs/methodology/
  c8c7956  feat(taxonomy): introduce six-pillar taxonomy — replace five-pillar model
  e553be7  chore: initial commit — snapshot before six-pillar taxonomy refactor
```

Note: The git repo in the workspace folder has lock files from a prior process and cannot be committed to directly. Work has been committed to a clean copy at `/tmp/theaireadyist_work`. The workspace folder files are the source of truth for content; the temp repo is the git record.
