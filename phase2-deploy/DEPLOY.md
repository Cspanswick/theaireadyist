# Phase 2 — Typography & Layout · Deploy

> **Run this ONLY after the Phase 1 PRs (foundation + convergence) are merged to `main`.**
> Phase 2 extends `tokens.css` and references the Phase 1 colour/font tokens. If Phase 1 isn't live first, the Phase 2 `tokens.css` still works (it carries the Phase 1 tokens too), but the convergence/logo/favicon work from Phase 1 should land first to avoid a confusing diff order.

This phase is **additive and non-breaking**: 4 new stylesheets/extensions + 4 template scaffolds + 3 docs. It changes **zero currently-rendered pages** (no existing page links these files yet — per-page convergence is staged, DD-13/14/15/16).

## One command (paste into Terminal where `gh` is authenticated)

```bash
cd ~/theaireadyist-deploy && \
git checkout main && git pull && \
git checkout -b feature/design-system-phase2 && \
SRC="$HOME/Documents/Claude/Projects/The AI Readyist Website Redesign -/phase2-deploy" && \
mkdir -p styles templates docs/design && \
cp "$SRC/styles/"*.css styles/ && \
cp "$SRC/templates/"*.html templates/ && \
cp "$SRC/docs/design/"*.md docs/design/ && \
git add -A && \
git commit -m "Design System Phase 2: typography & layout (tokens, roles, templates, docs)" && \
git push -u origin feature/design-system-phase2 && \
gh pr create --fill --title "Design System Phase 2 — Typography & Layout" \
  --body "Adds type scale (hero-anchored), type-role classes, layout/spacing/responsive, 4 page templates + scaffolds, and updated design-debt + regression review. Additive, non-breaking. See docs/design/phase2-typography-layout.md." && \
gh pr merge --squash --delete-branch
```

## Files this ships
- `styles/tokens.css` (extended: type scale, weights, layout grid, full spacing scale, breakpoints)
- `styles/typography.css`, `styles/layout.css`, `styles/templates.css` (new)
- `templates/template-{editorial,product,assessment,dashboard}.html` (new)
- `docs/design/phase2-typography-layout.md` (new), `design-debt.md` + `brand-regression-review.md` (updated)

## After merge
Tell me and I'll verify the files are live (raw URLs) in the browser. Then we can begin the staged per-page convergence (DD-16 → DD-13 → DD-14/15), one reviewed PR per page, each verified against the hero.
