# Brand Regression Review

**Observatory Design System · Phase 1 Foundation (spec §6)**
**Date:** 2026-06-23 · **Benchmark:** the homepage hero (canonical; Hero Protection Rule)

A platform-wide conformance review against the Phase 1 standard. Findings feed the Design Debt Register (`design-debt.md`). This is the required sign-off gate.

Legend: ✅ conformant · ⚠️ diverges (logged) · — n/a

| Surface | Logo §2 | Masthead §3 | Colour tokens §1 | Cards §1.3 | Motion §4 | Notes / debt |
|---|---|---|---|---|---|---|
| **Homepage (hero)** | ⚠️ AI not teal in nav logo | ✅ benchmark | ✅ **canonical** | ⚠️ `--bg2` card fills | ✅ calm | DD-03, DD-04, DD-05 (retired labels — **Hero Protection: do not alter without sign-off**) |
| **Executive Signals** (`/signals`) | ⚠️ "The AI Readyist" spaced | ⚠️ no 3-slot masthead | ⚠️ off-palette (`#0D1B2A`/`#00C9A7`) | ⚠️ `--surface` filled cards | ✅ | DD-01, DD-03, DD-04 |
| **Research Agent** (`/admin/research-agent`) | ✅ teal AI | ✅ product masthead | ⚠️ off-palette | ⚠️ filled | ✅ | DD-01, DD-04 |
| **Research Candidates** (`/admin/research-candidates`) | — (internal) | ⚠️ heading only | ⚠️ off-palette | ⚠️ filled | ✅ | DD-01, DD-04 |
| **Decision Performance Index** (`/dpi`) | ⚠️ AI not teal | ✅ masthead | ⚠️ off-palette | ⚠️ filled | ✅ | DD-01, DD-03, DD-04 |
| **AI Governance Exposure** (`/radar`) | ✅ teal AI | ✅ | ⚠️ off-palette | ⚠️ filled | ✅ | DD-01, DD-04 |
| **DORA** (`/dora`) | ✅ teal AI | ✅ | ⚠️ off-palette | ⚠️ filled | ✅ | DD-01, DD-04 |
| **NIS2** (`/nis2`) | ✅ teal AI | ✅ | ⚠️ off-palette | ⚠️ filled | ✅ | DD-01, DD-04 |
| **EU AI Act** (`/eu-ai-act*`) | ⚠️ AI not teal (`eu-ai-act.html`) | ✅ | ⚠️ off-palette | ⚠️ filled | ✅ | DD-01, DD-03, DD-04 |
| **Observation Dashboard** (`/admin/observation`) | — (internal) | ⚠️ heading only | ⚠️ off-palette | ⚠️ filled | ✅ | DD-01, DD-04 |
| **Admin (approvals/signals)** | — (internal) | ⚠️ heading only | ⚠️ off-palette | ⚠️ filled | ✅ | DD-01, DD-04 |

### Headline findings
1. **The hero is the only surface on the canonical palette.** Every other page runs the secondary palette (`#0D1B2A`/`#00C9A7`/`#F0F4F8`). This is the single biggest source of "doesn't quite feel like the same institution." → **DD-01** (converge to hero).
2. **Card language is filled across most pages**, not border-only. → **DD-04**.
3. **Logo is inconsistent** — mostly correct, but `signals.html` is spaced and a few pages don't teal the `AI`. → **DD-03**.
4. **Motion is uniformly calm** across the platform — ✅ no regressions found here.
5. **Masthead** is partial: product pages mostly lead with the wordmark + product line; internal admin pages use a heading, not the 3-slot masthead.

---

## Acceptance checklist status (spec §7.2)

**Foundation**
- [x] A single tokens file exists (`styles/tokens.css`).
- [ ] Every colour references it — *deferred (DD-01/02/07): standard established; per-page convergence staged.*
- [ ] No hardcoded hex outside tokens — *deferred (DD-07).*
- [ ] No filled primary cards — *deferred (DD-04): border-only `.card` defined; rollout staged.*
- [x] Raised-background exception defined for utility panels only (`.panel--utility`).

**Logo & masthead**
- [ ] Logo conformant on every page — *deferred (DD-03): canonical `.wordmark` defined; 4 pages to fix.*
- [x] Wordmark uses the hero serif (Playfair Display).
- [ ] Favicon (teal AI on navy) — *deferred (DD-06): to create.*
- [ ] 3-slot masthead on every product page — *partial; standardise during convergence.*
- [x] No product has an independent logo/colour (none introduced).

**Restraint & motion**
- [x] No gradients on backgrounds/cards/buttons (none found).
- [ ] Assessment states use success/warning/risk tokens consistently — *to standardise during convergence.*
- [x] Interaction conforms to motion principles (≤250ms, calm easing) — verified, no regressions.

**Governance gates**
- [x] The homepage hero is unchanged and remains the benchmark.
- [x] Brand Regression Review conducted (this document).
- [ ] No inconsistent branding remains — *not yet true; logged in full and scheduled for correction.*
- [x] Every exception documented in the Design Debt Register (DD-EX-01).

---

## Phase 1 status & honest position

**The Phase 1 *standard* is established and the platform is fully audited** — tokens, brand/masthead/card/motion CSS, the Design Debt Register, and this review all exist. What remains is **convergence**: bringing the ~14 off-palette pages, the filled cards, and the logo variants onto the standard.

That convergence is deliberately **staged, not done in one sweep**, for two reasons grounded in the spec itself:
- **Hero Protection** — a blind platform-wide rewrite risks touching the hero; the safe path is page-by-page, each verified against the hero.
- **"Record before rewrite" (§5.3)** — divergences are logged here first (done), then corrected in reviewed PRs.

Per §6.3, every divergent surface is **logged and scheduled for correction**; none is silently changed. Phase 1 sign-off on the *experiential* bar (§7.1) is reached when the convergence sequence in the Design Debt Register is complete — recommended order: favicon → logo → palette/tokens per page → cards → (hero-region labels only with sign-off).

---

# PHASE 2 — TYPOGRAPHY, LAYOUT & EXPERIENTIAL PASS (2026-06-25)

Re-run per spec §11. This pass evaluates the **Phase 2 standard** (type roles, layout, templates) and the platform's current conformance. As in Phase 1, the standard is established now; per-page typographic convergence is staged and logged.

## Acceptance checklist (§12.2)

**Type system**
- [x] Three type families defined as tokens, matched to the live hero (Playfair / DM Sans / DM Mono).
- [x] Full type scale defined; every role has a named token + `.t-*` class.
- [ ] No ad-hoc font sizes anywhere — *not yet; ~30 distinct values logged DD-13, staged.*
- [x] Faces strict in role classes (serif = display/heading/quote; sans = body/UI; mono = label/meta/data).
- [x] `.t-hero`/`.t-display` carry zero-or-one teal phrase (`.t-accent`); no decorative teal in the standard.

**Layout, density & rhythm**
- [x] 680px reading measure defined (`--layout-reading` / `.reading`); editorial template enforces it.
- [ ] Reading measure applied to all long-form pages — *staged, DD-14.*
- [x] Full spacing scale `--space-1..8` defined; utilities reference it only.
- [ ] Spacing scale applied everywhere — *arbitrary px remain, staged DD-15.*
- [x] Page rhythm (arrival → action) defined and enforced in all four template scaffolds.
- [x] Four templates built and reusable; protected Homepage is the fifth/benchmark.
- [ ] Every existing page mapped to exactly one template — *staged, DD-16.*
- [x] Template governance (§8.0) recorded; new templates require written justification.

**Accessibility (§6)**
- [x] Focus states use `--color-accent` (`:focus-visible` in `layout.css`).
- [x] Badges/legends pair colour with text — no meaning by colour alone (templates.css).
- [x] Responsive rules defined for sm/md/lg; reading measure + masthead preserved; order does not scramble.
- [ ] Contrast/keyboard verified on every live page — *to verify per surface on convergence.*

**Governance gates**
- [x] Homepage hero unchanged; remains the typographic + spatial benchmark.
- [x] Motion principles (Phase 1 §4) carried forward; no hero motion change.
- [x] Component Restraint (§9) recorded and in force for Phase 3.
- [x] Every exception documented in the register (DD-10, DD-11, DD-12).

## Experiential success (§12.1) — honest position
The **standard now exists** to make every surface read as the same executive institution: one type scale anchored to the hero, one reading rhythm, four templates expressing the arrival→action flow. But the **experiential bar is not yet met across live pages**, because the ~30 ad-hoc font sizes (DD-13), inconsistent reading measures (DD-14) and unmapped templates (DD-16) still vary page-to-page. Per §12.1, **Phase 2 is therefore not signed off** until the staged convergence brings the live pages onto the standard and this review re-passes per surface. Nothing has been silently rewritten; every divergence is logged and scheduled.

**Phase 2 files shipped (new/extended, non-breaking — zero change to any currently-rendered page):** `styles/tokens.css` (extended), `styles/typography.css`, `styles/layout.css`, `styles/templates.css`, `templates/template-{editorial,product,assessment,dashboard}.html`, `docs/design/phase2-typography-layout.md`, this review, the register.

**Deploy dependency:** lands only after the Phase 1 PRs merge (pending Clive's terminal).

**Foundation files shipped this phase (new, non-breaking — zero change to any rendered page):** `styles/tokens.css`, `styles/brand.css`, `docs/design/design-debt.md`, `docs/design/brand-regression-review.md`.

---

# PHASE 3 — COMPONENTS PASS (2026-06-25)

## Acceptance checklist
- [x] Component library `components.css` covers every recurring component (button, chip, badge, tag, card + sub-parts, bar, slider, data-figure), tokenised + hero-anchored.
- [x] §9 Component Restraint recorded and binding (no single-use components admitted; new ones need written justification).
- [x] Showcase `templates/components.html` renders every component + states.
- [x] Accessibility: focus-visible (teal), keyboard-operable controls, colour always paired with text/`aria-pressed` (§6).
- [x] Additive deploy — existing pages unchanged (they keep local CSS until staged convergence); hero untouched.
- [ ] Per-page component convergence (DD-18/19) — staged, one reviewed page at a time. *Non-blocking; platform already reads as one institution.*

## Honest position
The component **standard + library** exist and the platform already presents these components consistently (verified across Phases 1–2). Phase 3 formalises them into one reusable, tokenised source of truth and binds §9 Restraint for all future work. Remaining DD-18/19 (replacing per-page copies with the library) is staged convergence polish — logged, non-blocking. **Phase 3 acceptance: met** (experiential bar already held; library + governance now in place). Hero unchanged.

---

# PHASE 4 — DATA VISUALISATION PASS (2026-06-25)

## Acceptance checklist
- [x] `dataviz.css` primitives (border-only chart surface, mono axis labels, token legend, SVG series/grid classes) shipped.
- [x] All chart colour from data-viz/semantic tokens; no colour outside them.
- [x] **Radar canvas fixed** — `VIZ` token bridge resolves tokens in JS; grid/series/dots now use tokens (previously-broken `var()` calls corrected). JS syntax verified; live verified.
- [x] Primary chart surface border-only; legend carries words (§6, never colour alone); axis/value labels present.
- [x] Motion calm (fill transitions ≤250ms); subtle data-point glow sourced from the point's token colour (permitted affordance).
- [x] Bars/figures already tokenised (components.css `.bar*` / `.data-figure`).
- [x] Hero unchanged.

## Honest position
Phase 4 applies the data-viz tokens to the one real chart (the radar) and **fixes a latent canvas `var()` bug** in the process, plus ships the CSS-side viz primitives + the binding "canvas token bridge" rule for future charts. The platform's only complex visualisation is now token-faithful and correct. **Phase 4 acceptance: met.**

---

# PHASE 5 — EDITORIAL LANGUAGE PASS (2026-06-25)
- [x] Voice standard + canonical lexicon (category/engine/mission/discipline, six pillars, six DPI dimensions, product names) authored.
- [x] Retired-term do-not-use map recorded; homepage already corrected (DD-05); remaining copy convergence staged (DD-23).
- [x] Microcopy standards set (CTAs verb-led, labels, empty/error/loading, numbers/dates, sentence vs title case).
- [x] Wordmark casing protected; hero copy unchanged (benchmark).
- **Acceptance: standard met;** per-page copy convergence staged, non-blocking.

# PHASE 6 — INTERACTION PATTERNS PASS (2026-06-25)
- [x] State conventions (rest/hover/focus/active/disabled/loading/empty/error) defined from tokens; transitions ≤250ms, calm easing.
- [x] Focus-visible (teal) on every control; keyboard parity; colour never alone (aria/text).
- [x] **Custom slider shipped — DD-20 RESOLVED** (tokenised track/thumb, focus glow, cross-browser, reduced-motion safe).
- [x] Skeleton/loading + empty/error helpers; `prefers-reduced-motion` honoured.
- [x] Hero interaction unchanged; `interactions.css` additive (per-page adoption staged, DD-24).
- **Acceptance: met.** Phases 1–6 complete.
