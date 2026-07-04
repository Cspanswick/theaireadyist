# Observatory Design System — Phase 2: Typography & Layout

**Status:** Governing standard. Extends Phase 1 (Foundation); does not replace it. All Phase 1 rules — Design Philosophy, Hero Protection, Platform Consistency, colour tokens, motion, Design Debt Register, Brand Regression Review — remain in force.
**Date:** 2026-06-25

> **Deploy dependency:** Phase 2 references the Phase 1 tokens (`--color-*`, `--font-*`) and extends `tokens.css`. **It must deploy *after* the Phase 1 PRs merge.** Phase 1 deploy is currently pending Clive's terminal; Phase 2 is built against the staged Phase 1 files in the project folder and packaged to slot in once Phase 1 is live. Deploy order is enforced in §"Deploy".

---

## Files shipped this phase
| File | Role |
|---|---|
| `styles/tokens.css` *(extended)* | + type scale, weights, layout grid, full spacing scale, breakpoints |
| `styles/typography.css` *(new)* | type-role classes (`.t-hero` … `.t-data`, `.t-accent`) |
| `styles/layout.css` *(new)* | containers, reading measure, grid, spacing rhythm, a11y, responsive |
| `styles/templates.css` *(new)* | the four reusable page templates + state badge + legend |
| `templates/template-{editorial,product,assessment,dashboard}.html` *(new)* | reference scaffolds products inherit |

---

## 1. Type families (matched to the hero)
- **Serif** — `Playfair Display` — display, headings, product names, pull quotes (the brand voice).
- **Sans** — `DM Sans` — body, UI, navigation, forms, table content.
- **Mono** — `DM Mono` — labels, metadata, timestamps, data figures, scale anchors.

No fourth face. Serif never used for body/UI; sans never for display headlines (spec §1.3).

## 2. Hero ground-truth (the spec corrected to the hero)
Inspected on the live homepage and used to anchor the tokens (Hero Protection Rule):

| Element | Hero actual | Token set to | Deviation from spec placeholder |
|---|---|---|---|
| Headline | Playfair **700**, `clamp(36px,4.2vw,52px)`, lh **1.08**, −0.02em | `--type-hero: clamp(2.25rem,4.2vw,3.25rem)` / 700 | spec said `clamp(2.75rem,5vw,4rem)`/600 → **hero wins** (DD-10) |
| Standfirst | DM Sans **300**, 19px, lh 1.6 | `--type-body-lg: 1.1875rem` / lh 1.6 | spec said 18px/400 → reconciled to hero |
| Eyebrow | DM Mono 10px, tracking **0.18em**, uppercase | `--type-label/meta` mono, ~10–11px, tracking 0.16em | spec said 12px/0.08em → reconciled to hero (DD-11) |

## 3. Type roles (every element maps to exactly one)
`--type-hero · --type-display · --type-h1/h2/h3 · --type-body-lg · --type-body · --type-body-sm · --type-label · --type-meta · --type-data-lg · --type-data · --type-quote` → classes `.t-*` in `typography.css`. Assignments per spec §2.2. **Accent (§2.4):** hero/display headings carry **zero or one** teal phrase (`.t-accent`) — by meaning, never decoration.

## 4. Layout, spacing, density, rhythm
- Long-form reading constrained to **680px** (`.reading` / `--layout-reading`); max content **1200px** (`.layout`).
- Spacing scale `--space-1..8` only — no arbitrary px. Major sections separated by `--space-7`/`--space-8`.
- One primary focus per screen; never >3 dense blocks without a `.rhythm-break`; whitespace is functional, not filler (§4).
- Page rhythm enforced by template order: **arrival → orientation → primary message → supporting detail → evidence → action** (§5). Primary action never precedes the case for it.

## 5. The page templates (spec §8)
Every page is exactly one template; new templates are exceptional and require written justification (§8.0).

1. **Editorial** (`tmpl-editorial`) — Briefings, Research, Signals long-form. 680px reading surface; **no tool widgets/dashboards/mid-article CTAs**; action at the end only.
2. **Product / Tool Landing** (`tmpl-product`) — DPI, EU AI Act, DORA, NIS2, Radar. Border-only dimension cards; persona row; CTA after the case.
3. **Assessment** (`tmpl-assessment`) — DPI questions, EU AI Act domains. Sticky results panel (raised utility surface); state badges carry their word (§6).
4. **Dashboard / Radar** (`tmpl-dashboard`) — Governance Exposure, aggregate views. Border-only chart surface; raised summary/control panels; legend pairs colour with text.
5. **Index / Listing** (`tmpl-index`, §8.7) — Signals; future research archive, briefings index. A filterable, classified grid of border-only content cards: masthead + eyebrow + headline → filter bar (`tmpl-index__chip`, `aria-pressed`) → responsive card grid (`tmpl-index__grid`, 1-col below `--bp-md`).
6. **Homepage** — *protected; already exists; do not rebuild.* It is the ground-truth for all five above.

> **DD-12 RESOLVED (2026-06-25, ratified by Clive):** the spec's "six templates" is now complete — the missing sixth is **Index/Listing** (§8.7), added to cover multi-item filterable listings (e.g. Signals) that none of Editorial/Product/Assessment/Dashboard describes. §8.0 written justification recorded in `templates.css`. `signals.html` is mapped to it.

## 6. Accessibility (§6) & 7. Responsive (§8.5)
Focus states use `--color-accent` (`:focus-visible`); DOM order matches visual rhythm; meaning never via colour alone (badges/legends always carry text). Breakpoints `--bp-sm/md/lg`: hero scales via `clamp()`; multi-column card rows and right rails collapse to single column below `--bp-md`; masthead + wordmark never drop (≥90px); 680px reading preserved; reflow never scrambles order.

## 8. Component restraint (§9 — in force for Phase 3)
A reusable component must solve a recurring, multi-product problem. Single-page needs are built locally and only promoted to the system if they recur (logged in the register).

---

## Deploy (after Phase 1)
1. **Phase 1 PRs merge first** (foundation `tokens.css`+`brand.css`; convergence favicon/logos/palette). *Pending Clive's terminal.*
2. Then Phase 2: copy `styles/typography.css`, `styles/layout.css`, `styles/templates.css`, the extended `styles/tokens.css`, the `templates/` scaffolds, and the updated docs; open a PR; merge.
3. **Convergence (staged, post-merge):** map each existing page to one of the four templates and adopt the type roles / reading measure / spacing scale — page by page, each verified against the hero, each logged in the register. The hero is never altered.

Per Phase 1 governance: this phase establishes the **standard**; the per-page typographic convergence is staged and recorded, not done in a blind sweep.
