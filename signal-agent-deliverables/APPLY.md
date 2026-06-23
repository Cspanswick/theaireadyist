# Executive Signal Agent v1 + strategy — how to get this onto GitHub / Vercel

Everything is committed locally on branch **`feature/executive-signal-agent-v1`** (code) with later strategy/ops docs on `feature/wp12-operating-model`. There is **no GitHub connector available** in this environment and the build environment has **no push credentials**, so apply this to your local checkout of `Cspanswick/theaireadyist` and push. Open a **PR into `main`** (don't push straight to main) so Vercel builds a preview and you can review before it goes live.

> **Already done for you (2026-06-23):** `migration_build5.sql` has **already been run** in Supabase production — the `executive_signals` table, indexes, constraints and RLS policy exist. You do **not** need to run it again. It's included here only for the record.

## What's in this folder
- `0001-executive-signals-and-strategy.patch` — the full set of added files (code + docs) as one patch.
- Raw go-live files mirroring the repo layout: `agent/`, `api/`, `admin/`, `signals.html`, `.github/workflows/signal-agent.yml`, `migration_build5.sql`.

## Files this delivers (paths in the repo)
**Runtime / go-live (required):**
- `agent/run-signal-agent.js` — the signal agent
- `agent/configs/signal-sources.json` — source config (13 feeds enabled across 7 groups)
- `api/signals-pending.js`, `api/signals-decision.js` — admin review endpoints
- `admin/signals/index.html` — editorial review UI
- `admin/observation/index.html` — internal observation dashboard
- `signals.html` — public published-signals page
- `.github/workflows/signal-agent.yml` — daily DST-safe schedule
- `migration_build5.sql` — (already applied)

**Docs (optional, in the patch):** `docs/builds/executive-signal-agent-*`, `docs/builds/executive-signal-agent-v2/`, `docs/strategy/`, `docs/decisions/DR-001-*`, `docs/observation/`.

---

## Option A — copy the runtime files in (simplest, recommended)
The runtime files are all **new** (they don't exist on `main`), so copying is safe — nothing is overwritten.
```bash
cd /path/to/theaireadyist            # your local clone of Cspanswick/theaireadyist
git checkout main && git pull
git checkout -b feature/executive-signal-agent-v1
# copy the runtime files from this folder, preserving paths:
cp -R /path/to/signal-agent-deliverables/agent .
cp -R /path/to/signal-agent-deliverables/api .
cp -R /path/to/signal-agent-deliverables/admin .
cp /path/to/signal-agent-deliverables/signals.html .
mkdir -p .github/workflows && cp /path/to/signal-agent-deliverables/.github/workflows/signal-agent.yml .github/workflows/
cp /path/to/signal-agent-deliverables/migration_build5.sql .
git add -A && git commit -m "feat: Executive Signal Agent v1 (pillar-based daily signal engine)"
git push -u origin feature/executive-signal-agent-v1
```
Then open a PR into `main`.

## Option B — apply the full patch (includes all docs)
```bash
cd /path/to/theaireadyist
git checkout main && git pull
git checkout -b feature/executive-signal-agent-v1
git apply --reject /path/to/signal-agent-deliverables/0001-executive-signals-and-strategy.patch
# If CHANGELOG.md is rejected (it already exists on main), merge those additions by hand
# from CHANGELOG.md.rej, then:
git add -A && git commit -m "feat: Executive Signal Agent v1 + Decision Performance operating model docs"
git push -u origin feature/executive-signal-agent-v1
```
*Note:* the only file likely to conflict is `CHANGELOG.md` (it exists on `main`); everything else is new. Use Option A if you just want it live and will add the docs separately.

---

## After the PR merges (Vercel auto-deploys)
1. **Set the secrets** (one-time):
   - GitHub → repo → Settings → Secrets and variables → Actions: `ANTHROPIC_API_KEY`, `SUPABASE_SECRET_KEY`.
   - Vercel → project → Settings → Environment Variables: confirm `ADMIN_API_KEY` and `SUPABASE_SECRET_KEY` exist.
2. **Test:** GitHub → Actions → "Executive Signal Agent" → Run workflow → `dry_run=1` (no writes), then `max_items=20, dry_run=0` (small live run).
3. **Review:** open `/admin/signals` (enter your admin key), approve/publish a couple, confirm they show on `/signals.html`.
4. **Observe:** the daily 06:00-UK schedule then runs automatically (pending only — nothing auto-publishes). Use `/admin/observation` and `docs/observation/` for the 30–60 day baseline.

## Note on local git lock files
The workspace git repo has stale, undeletable `.git/index.lock` / `.git/HEAD.lock` from the build environment. They don't affect your own clone. If your local `git` ever complains, delete those empty files.
