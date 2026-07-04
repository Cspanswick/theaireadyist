# TheAIReadyist — Consolidated Deploy Runbook
**Run order: PR 1 → PR 2 → PR 3.** Each is one paste into a Terminal where `gh` is authenticated as `Cspanswick` and `~/theaireadyist-deploy` is your local clone. After each merges, tell me and I'll verify it live before you run the next.

> Why three PRs: Foundation is invisible (nothing references it yet) so it lands safely first; Convergence is the visible site-wide change; Phase 2 adds the type/layout standard on top. Clean review boundaries, easy rollback.

---

## PR 1 — Phase 1 Foundation  (zero visible change)
```bash
cd ~/theaireadyist-deploy && git checkout main && git pull && \
git checkout -b feature/design-system-phase1 && \
SRC="$HOME/Documents/Claude/Projects/The AI Readyist Website Redesign -/phase1-deploy" && \
mkdir -p styles && \
cp "$SRC/styles/tokens.css" "$SRC/styles/brand.css" styles/ && \
git add -A && \
git commit -m "Design System Phase 1 Foundation: tokens + brand CSS (non-breaking)" && \
git push -u origin feature/design-system-phase1 && \
gh pr create --fill --title "Design System Phase 1 — Foundation" --body "Canonical tokens.css + brand.css. Nothing references them yet; zero render change." && \
gh pr merge --squash --delete-branch
```

## PR 2 — Phase 1 Convergence  (visible: palette, wordmark, favicon, cards, homepage)
```bash
cd ~/theaireadyist-deploy && git checkout main && git pull && \
git checkout -b feature/design-system-convergence && \
SRC="$HOME/Documents/Claude/Projects/The AI Readyist Website Redesign -/phase1-deploy" && \
mkdir -p styles docs/design admin && \
cp "$SRC"/*.html . && \
cp -R "$SRC"/admin/* admin/ && \
cp "$SRC"/favicon.svg "$SRC"/favicon-16.png "$SRC"/favicon-32.png "$SRC"/apple-touch-icon.png . && \
cp "$SRC"/docs/design/*.md docs/design/ && \
git add -A && \
git commit -m "Design System Phase 1 Convergence: hero palette, wordmark, favicon, border-only cards, homepage band + pillar labels (passes 1-4)" && \
git push -u origin feature/design-system-convergence && \
gh pr create --fill --title "Design System Phase 1 — Convergence" --body "All 17 pages on the canonical hero palette via tokens; teal AI wordmark site-wide; favicon; primary content cards border-only; homepage Live Insights band + readiness labels aligned to the six pillars. Hero structure unchanged (verified byte-identical)." && \
gh pr merge --squash --delete-branch
```

## PR 3 — Phase 2 Typography & Layout  (additive; run after PR 1 + PR 2)
```bash
cd ~/theaireadyist-deploy && git checkout main && git pull && \
git checkout -b feature/design-system-phase2 && \
SRC="$HOME/Documents/Claude/Projects/The AI Readyist Website Redesign -/phase2-deploy" && \
mkdir -p styles templates docs/design && \
cp "$SRC/styles/"*.css styles/ && \
cp "$SRC/templates/"*.html templates/ && \
cp "$SRC/docs/design/"*.md docs/design/ && \
git add -A && \
git commit -m "Design System Phase 2: typography & layout (tokens, roles, templates, docs)" && \
git push -u origin feature/design-system-phase2 && \
gh pr create --fill --title "Design System Phase 2 — Typography & Layout" --body "Type scale (hero-anchored), type-role classes, layout/spacing/responsive, four page templates + scaffolds. Additive, non-breaking." && \
gh pr merge --squash --delete-branch
```

---

## After all three merge
Tell me and I'll verify in the browser (Vercel auto-deploys `main`):
- favicon renders (teal **AI** on navy) on a hard refresh
- wordmark shows teal **AI** on every page incl. homepage nav
- off-hero pages match the hero navy/teal/off-white
- signals + admin cards are border-only
- homepage Live Insights band matches the page navy; readiness panel shows the six pillars
- `/styles/tokens.css`, `typography.css`, `layout.css`, `templates.css` all 200 OK

Then Phase 1 gets its experiential sign-off and we start Phase 2 per-page convergence (DD-13–16).
```
If any push is rejected, `gh` isn't authed, or a prompt blocks you — stop and send me the exact output; don't guess.
```
