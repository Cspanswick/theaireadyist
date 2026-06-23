# Executive Signals v1 — Deployment Report

**Aligns to:** DR-001 · **Phase:** A (take v1 live)
**Date:** 2026-06-23
**Status:** **Build-complete and packaged for go-live. Live activation pending two credentialed owner steps (A1–A2).**

> Honest scope note: the build, configuration, tests and documentation are complete and committed. Actual go-live requires running the migration in your Supabase project and setting the GitHub/Vercel secrets — these need your credentials and cannot be performed from the build environment. The result fields below are pre-filled where known and marked **⧗ pending go-live** where they can only be captured on the first live run.

---

## 1. Summary

Executive Signals v1 is a pillar-based executive signal engine: it ingests public RSS/Atom feeds, classifies each item against the six pillars, scores executive relevance (1–5), two-tier (Haiku triage → Sonnet signal for 4–5), stores `pending` signals in Supabase, and routes them to human review at `/admin/signals`. Nothing auto-publishes.

## 2. Required outputs — status

| Required output | Status | Evidence |
|---|---|---|
| Successful deployment | ⧗ pending go-live (A1–A4) | Code committed on `feature/executive-signal-agent-v1` |
| Working ingestion pipeline | ✅ built; mock-tested end-to-end | `agent/run-signal-agent.js`; 13 feeds verified across 7 groups |
| Editorial review workflow | ✅ built | `/admin/signals` + `api/signals-pending.js` + `api/signals-decision.js` |
| Published signals capability | ✅ built | `/signals.html` (reads published only); publish action in admin |
| Monitoring & operational documentation | ✅ delivered | `executive-signal-agent-v1-operations.md` (this set) |

## 3. Go-live checklist (Phase A)

| # | Step | Owner | Status |
|---|---|---|---|
| A1 | Run `migration_build5.sql` in Supabase | Owner | ⧗ pending |
| A2 | Set `ANTHROPIC_API_KEY` + `SUPABASE_SECRET_KEY` (GitHub); confirm `ADMIN_API_KEY` + secret (Vercel) | Owner | ⧗ pending |
| A3 | Merge/push `feature/executive-signal-agent-v1` so the schedule registers | Owner | ⧗ pending |
| A4 | Dry-run dispatch (`dry_run=1`) → small live run (`max_items=20`) → review in `/admin/signals` | Owner + editorial | ⧗ pending |
| A5 | Confirm & enable remaining feeds from first-run logs | Build | ⧗ pending (post-A4) |
| A6 | Delete stale `.git/index.lock` / `.git/HEAD.lock` locally | Owner | ⧗ pending (cosmetic) |

Step-by-step: `executive-signal-agent-v1-deployment.md`.

## 4. Pre-flight verification (complete)

- ✅ Pipeline run end-to-end in mock mode across all enabled source groups (dedup, triage, tier-2 gating, reject path, row shape).
- ✅ Stored-row shape validated field-by-field against `migration_build5.sql`.
- ✅ All JS passes `node --check`; `signal-sources.json` parses; 13 sources enabled across 7 groups.
- ✅ DST time-guard verified across BST and GMT.
- ✅ No auto-publish; RLS confirmed (anon reads published only) in migration.

## 5. First live-run results — ⧗ to complete on go-live

| Metric | Value |
|---|---|
| Run date / status | _____ |
| Sources fetched (of enabled) | _____ |
| Items fetched | _____ |
| Duplicates skipped | _____ |
| Items classified | _____ |
| Queued (pending) | _____ |
| Rejected | _____ |
| Stored to Supabase | _____ |
| Feeds confirmed working (A5) | _____ |
| Feeds disabled after logs | _____ |

## 6. Open issues / risks

- ~34 disabled feeds need first-real-network verification (sandbox timed them out); harmless — they're off until confirmed.
- Local git lock files (cosmetic; commits made via plumbing).
- v1 captures volume/editorial/pillar metrics natively but **not** persona/constraint (v2 fields) — see observation plan for the manual-capture approach.

## 7. Recommendation

Execute A1–A4 in one short session, run A4's dry-run then bounded live run, confirm classifications look sane in `/admin/signals`, then let the daily schedule run. Begin the observation period (Priority 2) from the first full day live. Paste first-run figures into §5 to close this report.
