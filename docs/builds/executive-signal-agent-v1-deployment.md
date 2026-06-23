# Executive Signal Agent v1 — Deployment Runbook

The steps below need your Supabase project and GitHub repo access, so they're done by you, not the agent. Allow ~20 minutes. Nothing here publishes anything to the public site.

Branch: `feature/executive-signal-agent-v1` (commit `f042d3c`).

---

## Step 1 — Run the database migration

1. Open **Supabase → SQL Editor** for project `mydxofjvpuurwwaohqys`.
2. Paste the full contents of `migration_build5.sql` and **Run**.
3. Confirm success:
   - `Table Editor` shows a new `executive_signals` table.
   - It has the unique `source_url` index and RLS enabled.

Quick check (run in SQL Editor):

```sql
select count(*) from executive_signals;                 -- expect 0
select policyname from pg_policies where tablename='executive_signals';  -- expect exec_signals_anon_read
```

The migration is additive and idempotent (uses `IF NOT EXISTS` / `DROP CONSTRAINT IF EXISTS`), so re-running it is safe.

---

## Step 2 — Set the GitHub Actions secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**. Add (if not already present from the research agent):

| Secret | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (for classification/scoring) |
| `SUPABASE_SECRET_KEY` | The Supabase **secret** key (server-side; bypasses RLS) |

These are the only two the signal agent needs. The admin endpoints additionally use `ADMIN_API_KEY` and `SUPABASE_SECRET_KEY` as **Vercel** env vars (same as the existing `/api/insights-*` endpoints) — confirm those are set in your Vercel project so `/admin/signals` works.

---

## Step 3 — Merge the branch (or push it) so the workflow is registered

GitHub only runs a workflow file that exists on the default branch (for `schedule`) and on any branch (for manual `workflow_dispatch` once it's on the default branch). Merge `feature/executive-signal-agent-v1` into your deploy branch when you're ready, or push it and open a PR.

> Local note: this folder's git had a stale `.git/index.lock` that the sandbox couldn't delete. If your local `git` complains, delete `.git/index.lock` manually (the file is empty/0 bytes) and continue.

---

## Step 4 — Dry-run dispatch (no data written)

Actions → **Executive Signal Agent → Run workflow**:

- `config` = `signal-sources.json`
- `max_items` = `20`
- `dry_run` = `1`

Watch the log. You should see: enabled sources fetched, a candidate count after dedupe, "Tier 1 triage", "Tier 2 signal generation", and a **RUN SUMMARY** block. With `dry_run=1` it prints `DRY_RUN=1 — not writing to Supabase`. This confirms feed-fetching and the API calls work end-to-end without touching the table.

---

## Step 5 — Small live run

Re-run the workflow with `max_items` = `20`, `dry_run` = `0`. This writes up to 20 evaluated rows to `executive_signals` (queued ones as `pending`).

Verify in Supabase:

```sql
select approval_status, count(*) from executive_signals group by 1;
select primary_pillar, executive_relevance_score, signal_title
from executive_signals where approval_status='pending'
order by executive_relevance_score desc;
```

---

## Step 6 — Review in the admin UI

Open `/admin/signals` on the deployed site, enter your admin key, and review the pending queue:

- Sanity-check pillar assignments and scores against the article.
- Edit `signal_title` / `why_it_matters` / `decision_question` / tags as needed → **Save edits**.
- **Approve** good signals; **Publish** any you want live on `/signals.html`; **Reject** the rest.

Only after you're comfortable with classification quality should you rely on the daily schedule.

---

## Step 7 — Let the daily schedule run

Once Steps 1–6 look good, no further action is needed. The workflow runs daily at **06:00 Europe/London** (DST-safe — see build notes) and creates only `pending` signals. Review them each morning in `/admin/signals`.

### Cost expectation
Two-tier model (Haiku triage → Sonnet on score ≥4), no web-search tool: roughly **$3–5/month** at 80–150 items/day. Levers: `max_items`, `max_items_per_source` and `lookback_hours` in the config, and `QUEUE_THRESHOLD` / batch sizes in the script.

---

## Rollback

- Disable the schedule: comment out the `schedule:` block in `.github/workflows/signal-agent.yml`, or disable the workflow in the Actions tab.
- The `executive_signals` table is independent of all other tables; dropping it affects nothing else. Public `/signals.html` simply shows its empty state if there are no published rows.
