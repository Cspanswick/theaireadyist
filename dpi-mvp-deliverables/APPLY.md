# DPI MVP — how to get this onto GitHub / Vercel

Everything is committed on branch **`feature/decision-performance-index-mvp`**.
There is no GitHub connector available in this environment, so apply it to your
local checkout of `Cspanswick/theaireadyist` using **one** of the options below,
then push.

## Files in this folder
- `0001-dpi-mvp.patch` — the full commit (all 5 files) as a git patch.
- `dpi.html`, `api/dpi-submit.js`, `migration_build4.sql`,
  `docs/builds/dpi-mvp-build-notes.md` — raw files, mirroring the repo layout.
- `index.html.dpi-featured.diff` — the homepage change in isolation (adds the
  DPI flagship featured card; nothing else in `index.html` is touched).

---

## Option A — apply the patch (recommended, preserves the commit)
```bash
cd /path/to/theaireadyist           # your local clone of Cspanswick/theaireadyist
git checkout main && git pull
git checkout -b feature/decision-performance-index-mvp
git am /path/to/dpi-mvp-deliverables/0001-dpi-mvp.patch
git push -u origin feature/decision-performance-index-mvp
```
Then open a PR into `main`. Vercel will build a preview automatically.

## Option B — copy the files in by hand
Copy `dpi.html`, `api/dpi-submit.js`, `migration_build4.sql`, and
`docs/builds/dpi-mvp-build-notes.md` into the same paths in your repo, then
apply the homepage diff:
```bash
cd /path/to/theaireadyist
git checkout -b feature/decision-performance-index-mvp
git apply /path/to/dpi-mvp-deliverables/index.html.dpi-featured.diff
git add -A && git commit -m "feat(dpi): Decision Performance Index MVP v1.0"
git push -u origin feature/decision-performance-index-mvp
```

---

## After deploy
1. **Run `migration_build4.sql`** in Supabase → SQL Editor (creates `dpi_results`).
   Until then the assessment still works; results just aren't stored
   (`/api/dpi-submit` returns `{ ok: true, stored: false }`).
2. The page is live at **`/dpi`** (Vercel `cleanUrls` is already on).
3. No env var changes are required for the page itself. `/api/dpi-submit`
   reuses the existing `SUPABASE_SECRET_KEY` server secret.

## Note on the local `git am` lock issue
The project handoff mentions the workspace git repo has stale lock files. If
`git am` complains about an existing rebase/am state, clear it first with
`git am --abort` (or `rm -f .git/rebase-apply` only if you are sure no rebase is
in progress), then re-run.
