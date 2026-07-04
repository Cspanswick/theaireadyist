# TheAIReadyist — Program Summary & Go-Live Plan

**For:** Architecture & Design teams
**Date:** 2026-06-23
**Governing model:** DR-001 (Approved) — see `docs/decisions/DR-001-operating-model.md`

---

## 1. Where we are (one paragraph)

The Executive Signal Agent **v1 is build-complete and tested** (mock end-to-end); it is one short credentialed session away from running live. The **v2 Decision-Performance alignment (WP11)** is fully specified as a design package, **not built** — and deliberately paused. The platform's **operating model (WP12) is ratified as DR-001**: Mission = AI Readiness, Category = Decision Performance, Engine = Constraint Intelligence, Discipline = Decision Intelligence. We have now deliberately shifted from strategy/design into an **operational-learning phase**: take v1 live, collect 30–60 days of Decision Performance data, then let Constraint Intelligence be justified by evidence rather than theory.

**One-line operating model:** *Mission: AI Readiness · Category: Decision Performance · Engine: Constraint Intelligence · Discipline: Decision Intelligence · Imperative: credible DPI volume.*

---

## 2. Program map

| Workstream | What it is | Status | Reference |
|---|---|---|---|
| **Executive Signals v1** | Pillar-based signal engine: ingest → classify → score → review → publish | **Built, tested; awaiting go-live** | `executive-signal-agent-v1-notes.md`, `…-deployment.md`, `…-operations.md` |
| **WP11 / v2** | Decision-Performance alignment (DPI fields, prompt, card, homepage, constraint layer) | **Designed only; build paused (gated)** | `docs/builds/executive-signal-agent-v2/` |
| **WP12 / DR-001** | Canonical operating model + category decision (Model C) | **Ratified** | `docs/strategy/`, `docs/decisions/DR-001…` |
| **Post-WP12 ops** | Phase A go-live + 30–60 day observation + CI readiness review | **Scaffolded; awaiting go-live** | `docs/observation/`, `…-deployment-report.md` |

---

## 3. For the architect

**Technical state.** v1 is a dependency-light Node agent (`agent/run-signal-agent.js`) run by a DST-safe daily GitHub Actions workflow; data lands in Supabase `executive_signals` (RLS: anon reads published only); review via two `x-admin-key` Vercel functions and `/admin/signals`; public output at `/signals.html`. 13 feeds verified across 7 of 8 source groups; two-tier Haiku→Sonnet keeps cost ~$3–5/mo. Nothing auto-publishes.

**Repo note worth knowing.** The working copy had no initial git commit; work is committed across feature branches (`feature/executive-signal-agent-v1`, `…-v2`, `feature/wp12-operating-model`) via git plumbing because the mount left stale `.git/*.lock` files that couldn't be deleted from the build environment. Before go-live, consolidate branches onto your default/deploy branch and clear those empty lock files locally.

**Architect's near-term:** own the go-live (§5 Phase A), confirm the Supabase/Vercel/GitHub secret configuration, and decide branch-consolidation strategy. The observation data model (`docs/observation/observation-plan.md`) is built on the existing schema — no migration required to start collecting.

**Data-model gap to be aware of (by design):** v1 captures volume, editorial and pillar metrics natively but **not** executive-persona or constraint fields (those are the un-built WP11/v2 columns). This is intentional — whether to build them is what the observation period decides.

## 4. For the design team

**What's designed and waiting (do not build yet — gated by DR-001):** the v2 **Decision Performance Signal Card** (two-zone card with a DP "readout" band; `…/04-…`) and the **"Decision Performance Signals" homepage module** (dimension-led observatory; `…/05-…`). Both reuse existing design tokens — no new visual system.

**Design's near-term is review, not build.** Useful now: review the D4 card and D5 homepage specs so they're sign-off-ready *if/when* the Constraint Intelligence readiness gate is cleared and v2 build is approved. There is no design build work in the current operational-learning phase. One open design topic flagged in WP12 D6 for eventual resolution: the brand–category drift (name anchors on *Readiness*; owned category is *Decision Performance*) — managed as a funnel, not a redesign.

---

## 5. Task list — "commit to run"

Critical path is **A1–A5** (everything needed to go live). Owner = credentialed owner unless noted.

### Phase A — Go-live (critical path)

| # | Task | Owner | Notes |
|---|---|---|---|
| A0 | Consolidate `feature/executive-signal-agent-v1` onto the default/deploy branch; clear stale `.git/*.lock` locally | Architect | Schedule only runs from default branch |
| A1 | Run `migration_build5.sql` in Supabase | Owner | Creates `executive_signals`; idempotent |
| A2 | Set secrets — GitHub: `ANTHROPIC_API_KEY`, `SUPABASE_SECRET_KEY`; Vercel: `ADMIN_API_KEY`, `SUPABASE_SECRET_KEY` | Owner | Two new GitHub secrets; admin needs the Vercel pair |
| A3 | Dry-run dispatch (`dry_run=1`) | Owner | Confirms fetch + API, no writes |
| A4 | Bounded live run (`max_items=20`) → review in `/admin/signals` | Owner + Editorial | Sanity-check classifications before trusting schedule |
| A5 | Enable the daily schedule; confirm/enable remaining ~34 feeds from first-run logs | Owner + Build | Build assists feed verification |
| A6 | Close the deployment report (paste first-run figures) | Build/Owner | `…-deployment-report.md` §5 |

### Phase B — Observation period (30–60 days)

| # | Task | Owner | Notes |
|---|---|---|---|
| B1 | Weekly editorial review + approve/publish/reject | Editorial | This *is* the editorial metric source |
| B2 | Run the metric SQL; fill the weekly observation log | Editorial/Build | `observation-plan.md` + `observation-log.md` |
| B3 | Capture persona (manual) + emerging themes (free text) | Editorial | No native field; capture, don't formalise |
| B4 | Monitor workflow health, feeds, cost | Build/Technical | `…-operations.md` |
| B5 | *(Optional)* schedule a weekly auto-metrics task | Build | Offer; not required |

### Phase C — Evidence gate (after observation)

| # | Task | Owner | Notes |
|---|---|---|---|
| C1 | Complete the **Constraint Intelligence Readiness Report** (5 Qs + decision gate) | Build + Strategy | `constraint-intelligence-readiness-report.md` |
| C2 | Decide: proceed to CI v1 build / extend observation / revise taxonomy | Owner + Architect | Must pass DR-001 alignment test |
| C3 | *(If proceed)* design sign-off on v2 card + homepage; plan CI v1 build | Design + Architect | Only after C2 |

---

## 6. What success looks like

Per DR-001, success in this phase is **not** more features, pages or assessments. Success is: **the platform is live and accumulating proprietary Decision Performance data** — the raw material that will eventually justify and power Constraint Intelligence. The next milestone is evidence, not build.
