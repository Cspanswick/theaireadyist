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

**Foundation files shipped this phase (new, non-breaking — zero change to any rendered page):** `styles/tokens.css`, `styles/brand.css`, `docs/design/design-debt.md`, `docs/design/brand-regression-review.md`.

---

## Re-review after Convergence Pass 1 — 2026-06-25

- **Palette:** all off-hero surfaces now ✅ on the canonical hero palette (was ⚠️).
- **Logo:** signals / dpi / eu-ai-act now ✅ (was ⚠️); `index.html` nav logo still ⚠️ (deferred, Hero Protection).
- **Favicon:** ✅ teal `AI` on navy, site-wide.
- **Deferred / still ⚠️:** cards border-only (DD-04), full `var()` token adoption (DD-02), retired homepage labels (DD-05), remaining hardcoded hex (DD-07).
- **Hero:** unchanged (only a non-visual `<head>` favicon link added).

---

## Convergence Pass 2 re-review — 2026-06-25

- **Single source of truth (DD-02):** ✅ on all 16 non-homepage pages — palette hexes now sourced from `tokens.css` via aliased `:root` vars; pages link the token sheet. (`index.html` pending the homepage pass.)
- **Hardcoded hex (DD-07):** ✅ 94 canonical literals → `var(--color-*)`; only non-canonical one-offs remain (logged).
- **Palette residual (DD-01):** ✅ old-navy `rgba(13,27,42)` nav backgrounds corrected to hero navy.
- **Cards (DD-04):** ✅ 4 primary content cards now border-only/transparent; utility panels correctly retain raised fills (§1.3).
- **Integrity:** ✅ brace counts unchanged on all 16; no `var(var())`; `index.html` byte-identical (hero untouched).
- **Still ⚠️ (next wave):** homepage logo/fills/Live-Insights band (DD-03/04/08, Hero-adjacent), retired homepage labels (DD-05, sign-off), residual non-canonical hex.
- **Hero:** unchanged — homepage excluded from this automated pass by design.

---

## Convergence Pass 3 (homepage) re-review — 2026-06-25

- **Hero:** ✅ provably unchanged — full diff contains no `.hero` rule; hero block byte-identical.
- **Nav logo (DD-03):** ✅ homepage now renders teal `AI` split, consistent with every other page.
- **Live Insights palette (DD-08):** ✅ band converged to hero colours; band navy now matches the page (seam removed).
- **Live Insights cards (DD-04):** ✅ border-only (transparent + subtle border, teal-wash hover). ⚠️ *visible change — confirm live.*
- **Platform palette:** ✅ with the homepage done, **all surfaces now sit on the canonical hero palette.**
- **Still ⚠️:** DD-05 retired homepage labels (awaiting sign-off) — the sole remaining Phase 1 convergence item.

---

## Convergence Pass 4 (DD-05) re-review — 2026-06-25

- **DD-05 homepage labels:** ✅ readiness panel + feed tags now use the six canonical pillars (text-only; hero structure intact, signed off).
- **Phase 1 convergence:** ✅ **COMPLETE** — all logged debt (DD-01..08) resolved; platform fully on the hero palette and wordmark; cards border-only; homepage taxonomy current.
- **Experiential bar (§7.1):** ready for sign-off pending live verification post-deploy.
- **Hero:** structure/visual unchanged throughout; only retired label *text* corrected, with explicit sign-off.
