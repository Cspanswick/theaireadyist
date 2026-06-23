# Executive Signals v1 — Operations & Monitoring Runbook

**Aligns to:** DR-001 (Decision Performance Operating Model)
**Scope:** day-to-day operation of the live Executive Signal Agent.
**Date:** 2026-06-23

This is the operational reference for running Executive Signals once live. For first-time deployment steps see `executive-signal-agent-v1-deployment.md`; for architecture see `executive-signal-agent-v1-notes.md`.

---

## What runs, and where

| Component | Location | Cadence |
|---|---|---|
| Signal agent | GitHub Actions workflow `signal-agent.yml` | Daily, 06:00 Europe/London (DST-safe dual cron) |
| Data store | Supabase `executive_signals` | Written each run (pending/rejected) |
| Editorial review | `/admin/signals` (x-admin-key) | Human, as cadence requires |
| Public output | `/signals.html` | Published rows only |
| Secrets | GitHub: `ANTHROPIC_API_KEY`, `SUPABASE_SECRET_KEY`; Vercel: `ADMIN_API_KEY`, `SUPABASE_SECRET_KEY` | — |

Flow: **fetch RSS → dedupe → Haiku triage → Sonnet signal (score ≥4) → store pending → human approve/publish.** Nothing auto-publishes.

---

## Operational checks

### Daily (≈2 min)
1. **Run succeeded?** GitHub → Actions → "Executive Signal Agent" → latest run is green.
2. **Read the RUN SUMMARY** in the log: sources, items fetched, duplicates skipped, classified, queued, rejected, stored.
3. **Queue sane?** `/admin/signals` shows new pending signals roughly matching the "queued" count.

### Weekly (≈15 min)
1. Review the week's pending queue; approve/publish/reject (this *is* the observation-period editorial activity).
2. Scan feed warnings in the logs for any source repeatedly returning 0 items or errors.
3. Glance at Anthropic usage vs expectation (~$3–5/mo target).
4. Record the week's metrics in the observation log (`docs/observation/`).

---

## What to monitor

| Signal | Healthy | Investigate when |
|---|---|---|
| Workflow status | Green daily | Any red run (see failure modes) |
| Items fetched | Tens–low hundreds/day | 0 across all sources (network/feeds) or sudden 10× spike |
| Per-source items | Most enabled sources >0 | A source at 0 for several days (feed moved/broke) |
| Queued (pending) | A handful/day | 0 for many days (threshold too high?) or flood (threshold too low / spam) |
| Duplicates skipped | Non-trivial | ~0 always (dedup not working) |
| Classification | Canonical pillars, mixed | Everything one pillar, or many low-confidence |
| Cost | ~$3–5/mo | Material jump (item volume or model change) |

---

## Failure modes & recovery

| Symptom | Likely cause | Action |
|---|---|---|
| Workflow run fails immediately | Missing/invalid `ANTHROPIC_API_KEY` or `SUPABASE_SECRET_KEY` | Re-check GitHub secrets; re-run |
| Run green but "Stored 0" | `SUPABASE_SECRET_KEY` unset, or RLS/permission, or all duplicates | Check log line; verify secret; confirm table exists |
| One source logs fetch error / 0 items | Feed URL moved or host blocking | Confirm feed, update `signal-sources.json`, or disable the source |
| All sources 0 items | Network/runner issue | Re-run; if persistent, check GitHub status |
| Scheduled run "skipped (time guard)" | **Expected** — the non-London-06:00 cron exits by design | No action |
| Queue flooded with weak items | Threshold/triage drift | Tighten quality rules / raise `QUEUE_THRESHOLD` (code change, future) |
| Admin page "could not load" | `ADMIN_API_KEY` / Vercel env or Supabase reachability | Verify Vercel env vars; check Supabase status |
| Insert "duplicate key" noise | Re-seen `source_url` | Expected (unique index); ignored by `resolution=ignore-duplicates` |

### Manual / recovery runs
- **Dry run:** Actions → Run workflow → `dry_run=1` (no writes) to test fetch + API.
- **Bounded run:** `max_items=20` to cap cost while debugging.
- A failed run writes nothing partial that breaks the next run; dedup makes re-runs safe.

---

## Alerting (recommended, low-effort)
- Enable GitHub Actions failure notifications (email/Slack) for the workflow so a red daily run is noticed without manual checking.
- Optional: a lightweight weekly scheduled summary of counts (can be added later; not required for v1).

---

## Operational ownership
- **Editorial owner:** runs the weekly review, approves/publishes, records observation metrics.
- **Technical owner:** watches workflow health, secrets, feed config; handles failure modes.
- **Cadence during observation period:** daily glance + weekly review (see observation plan).

---

## Boundaries (DR-001)
Operating the platform is *operational learning*, not feature expansion. Do **not** add features, sources beyond verification, or Constraint Intelligence during this phase — collect data first.
