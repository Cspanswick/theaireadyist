# Design Debt Register

**Observatory Design System · Phase 1 Foundation**
**Created:** 2026-06-23 · **Owner:** design-system
**Purpose (spec §5):** record every inconsistency discovered — the future clean-up roadmap. Nothing is silently removed or rewritten; it is logged here first.

Risk key: **Low** = isolated, reversible · **Medium** = visible change across pages, needs review · **High** = touches the hero or core content, needs explicit sign-off.

---

## DD-01 · Two divergent colour palettes across the platform
| | |
|---|---|
| **Description** | The homepage hero uses `--navy #0D1F3C`, `--teal #00B8A2`, `--off-white #F5F2EC`. **Every other page** (dpi, dora, nis2, radar, signals, all eu-ai-act-*, all admin/*) uses `--navy #0D1B2A`, `--teal #00C9A7`, `--off-white #F0F4F8`. Two palettes exist where there should be one. |
| **Location** | `dpi.html`, `dora.html`, `nis2.html`, `radar.html`, `signals.html`, `eu-ai-act*.html`, `admin/*/index.html` (all diverge from `index.html`) |
| **Recommendation** | Adopt `styles/tokens.css` (hero values are canonical per Hero Protection). Converge each page's `:root` to the tokens. Direction of travel: every page → the hero, never the reverse. |
| **Implementation risk** | **Medium** — a visible (small) colour shift on ~14 pages, but *toward* the benchmark, so it is a correction not a regression. Stage page-by-page; verify each against the hero. |

## DD-02 · No shared tokens file (per-file `:root` duplication)
| | |
|---|---|
| **Description** | Every HTML file defines its own `:root` colour block inline. There is no single source of truth, which is exactly how DD-01 arose. |
| **Location** | All `*.html` and `admin/*/index.html` |
| **Recommendation** | `styles/tokens.css` is the single source of truth (created this phase). Pages `<link>` it and reference variables; remove per-file colour definitions during convergence. |
| **Implementation risk** | **Medium** — mechanical but broad; do alongside DD-01 per page. |

## DD-03 · Logo non-conformance
| | |
|---|---|
| **Description** | `signals.html` renders the logo as **"The AI Readyist"** (spaces + `<em>`) — fully non-conformant with the locked wordmark. `index.html`, `dpi.html`, `eu-ai-act.html` render the `AI` letters **without the teal split** (missing `wordmark__ai` colour). Spec §2 requires one continuous word with white/teal/white on every page. |
| **Location** | `signals.html` (spaced form); `index.html`, `dpi.html`, `eu-ai-act.html` (AI not teal) |
| **Recommendation** | Replace with the canonical `.wordmark` markup from `brand.css`: `the<span class="wordmark__ai">AI</span>Readyist`. |
| **Implementation risk** | **Low–Medium** — `signals.html` is a clean swap; the homepage logo sits near the hero, so treat the `index.html` fix with Hero-Protection care (colouring the `AI` span does not alter hero typography/layout, but verify). |

## DD-04 · Filled-box cards used for primary content
| | |
|---|---|
| **Description** | Primary content cards use dark fills (`--surface #0F2233`, `--bg2 #162440`) on the navy background — the specific failure mode §1.3 corrects. Primary cards must be border-only/transparent. |
| **Location** | `signals.html`, `admin/signals`, `admin/observation`, `admin/research-candidates`, `admin/approvals` (`--surface` fills); `index.html` (`--bg2` card surfaces) |
| **Recommendation** | Move primary content cards to the `.card` (border-only, transparent) pattern from `brand.css`. Retain raised fills **only** for genuine utility panels (filters/control rails) via `.panel--utility`. |
| **Implementation risk** | **Medium** — visible change to card surfaces; verify contrast and that utility panels keep their hierarchy. Some homepage card surfaces are near the hero — High-caution there. |

## DD-05 · Retired taxonomy still present on the homepage
| | |
|---|---|
| **Description** | The homepage "AI Readiness Score" panel labels (`Cost Governance`, `Governance & Trust`, `Human & Culture`, `Operating Model`, `Production Readiness`, `Regulatory Compliance`) and stray strings (`PoC Purgatory`, `Cost Intelligence`) are the **retired five-pillar / old-dimension names**, not the six canonical pillars. |
| **Location** | `index.html` (≈ lines 1406–1441 readiness panel; ≈ 2027, 2053 instrument copy) |
| **Recommendation** | Align labels to the six pillars (Executive Operating Models · Decision Intelligence · Agentic Governance · AI Economics · Human Agency · Sovereign AI) — or to the six DPI dimensions where the panel is dimension-based. |
| **Implementation risk** | **High** — this content sits inside the homepage hero region. **Hero Protection applies.** Do not change without explicit sign-off; treat as a content correction, not a hero redesign. |

## DD-06 · No favicon
| | |
|---|---|
| **Description** | No `<link rel="icon">` / apple-touch-icon on any page. Spec §2.5 requires a favicon: teal `AI` on a navy square, 4px radius (16/32/180 + SVG). |
| **Location** | All pages (none reference a favicon) |
| **Recommendation** | Create the favicon set and reference it site-wide. |
| **Implementation risk** | **Low** — additive; no impact on existing layout. |

## DD-07 · Hardcoded hex values outside the tokens file
| | |
|---|---|
| **Description** | Literal hexes used outside any `:root` token (e.g. `#162440`, `#1c2d4e`, `#A0AEBB` in `index.html`; assorted inline `rgba(...)` across pages). Spec §1.2 forbids hardcoded hex outside the tokens file. |
| **Location** | `index.html` and others (inline styles / one-off values) |
| **Recommendation** | Replace with token references during per-page convergence; add any genuinely missing value to `tokens.css` rather than inlining. |
| **Implementation risk** | **Medium** — broad but mechanical; bundle with DD-01/DD-02. |

---

## Implementation exceptions logged (spec §5.3)

## DD-EX-01 · Token hexes anchored to the hero, not the spec placeholders
| | |
|---|---|
| **Description** | The spec body listed `--color-bg #0B1623`, `--color-accent #34D8C4`, `--color-text-primary #F2F5F8`. The live hero (canonical per Hero Protection + the §1.1 ground-truth note) uses `#0D1F3C` / `#00B8A2` / `#F5F2EC`. `tokens.css` uses the **hero** values. This is the §1.1-sanctioned exception ("the precise numbers must match the hero"), logged here as required. |
| **Location** | `styles/tokens.css` |
| **Recommendation** | None — this is correct. Recorded for transparency. |
| **Implementation risk** | **Low** — anchoring to the hero is the intended behaviour. |

---

## Convergence sequence (recommended)
1. **DD-06 favicon** (Low, additive) — quick win.
2. **DD-03 logo** on `signals.html` (clean swap), then audit the rest.
3. **DD-01 + DD-02 + DD-07** per page, starting with the highest-traffic non-hero surfaces (signals, admin, dpi), each converging to the hero palette via `tokens.css`.
4. **DD-04 cards** alongside each page's convergence.
5. **DD-05** only with explicit sign-off (Hero Protection).

Each correction ships via its own reviewed PR; the homepage hero itself is never altered.

> *Note:* the Phase 1 convergence-pass status and DD-08 (Live Insights band navy) are recorded in the `phase1-deploy/` copy of this register; they fold into this canonical register when the Phase 1 deploy is assembled.

---

# PHASE 2 — TYPOGRAPHY & LAYOUT DEBT (added 2026-06-25)

**Phase 2 establishes the type/layout standard.** Per Phase 1 governance, legacy typographic/layout issues are recorded here, not silently rewritten; the per-page convergence is staged.

## DD-09 · `--space-4` superseded (Phase 1 interim 16px → Phase 2 scale 24px)
| | |
|---|---|
| **Description** | Phase 1 shipped an interim `--space-4: 16px` (used by `.panel--utility` padding). The Phase 2 spacing scale (§3) defines `--space-4: 24px`. The Phase 2 value is authoritative; `.panel--utility` padding becomes 24px (slightly more generous, on-brand). |
| **Location** | `styles/tokens.css`, `styles/brand.css` (`.panel--utility`) |
| **Recommendation** | None beyond this note — adopt the full scale `--space-1..8`. Verify `.panel--utility` still reads correctly at 24px on convergence. |
| **Implementation risk** | **Low** — a 8px padding increase on utility panels only. |

## DD-13 · Ad-hoc font sizes not mapped to type roles
| | |
|---|---|
| **Description** | Pages declare font sizes inline rather than via type roles. Audit (2026-06-25): **80** `font-size` declarations in `index.html`, **86** in `nis2.html`, **67** in `dora.html`, **55** in `radar.html`, with **~30 distinct pixel values** platform-wide (8.5px, 9px, 9.5px, 10px, 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 19px, 20px, 22px, 24px, 28px…). Spec §2.3 requires every text element map to one named role; no ad-hoc sizes. |
| **Location** | `index.html`, `signals.html`, `dpi.html`, `dora.html`, `nis2.html`, `radar.html`, `eu-ai-act*.html`, `admin/*/index.html` |
| **Recommendation** | Adopt the `.t-*` role classes (`typography.css`). Map each element to its nearest role; collapse the ~30 ad-hoc values onto the 13-role scale during per-page convergence. Hero excepted (it *is* the reference). |
| **Implementation risk** | **Medium–High** — broad and visible; the largest Phase 2 convergence item. Stage page-by-page, verify each against the hero. |

## DD-14 · Inconsistent / absent reading measure (full-width prose)
| | |
|---|---|
| **Description** | Long-form prose is not consistently constrained to the 680px reading measure. Several pages (`dora.html`, `nis2.html`, `signals.html`, `eu-ai-act-enforcement.html`) carry ad-hoc max-widths; none reference a shared `--layout-reading` token. Spec §3 requires long-form ≤680px. |
| **Location** | editorial/long-form surfaces across the platform |
| **Recommendation** | Apply `.reading` / `--layout-reading` (680px) to editorial content; replace ad-hoc max-widths with the token. |
| **Implementation risk** | **Medium** — improves readability; verify no layout reflow regressions on wide tables/charts (those stay at `--layout-max`). |

## DD-15 · Spacing values outside the scale
| | |
|---|---|
| **Description** | Margins/padding use arbitrary px (e.g. 14px, 32px, 72px) rather than the `--space-1..8` scale. Spec §3 forbids arbitrary spacing. |
| **Location** | inline styles across `*.html` |
| **Recommendation** | Resolve each to the nearest scale step during convergence; if a value seems genuinely required off-scale, log it rather than inlining. |
| **Implementation risk** | **Medium** — mechanical but broad; bundle with DD-13 per page. |

## DD-16 · Pages not yet mapped to a template
| | |
|---|---|
| **Description** | Existing pages predate the four Phase 2 templates and are not yet declared as exactly one (`tmpl-editorial` / `tmpl-product` / `tmpl-assessment` / `tmpl-dashboard`). Spec §8.0 requires every page map to one template. |
| **Location** | all product/editorial/assessment/dashboard pages |
| **Recommendation** | Map each: Briefings/Signals long-form → editorial; DPI/DORA/NIS2/EU-AI-Act/Radar landings → product; DPI/EU-AI-Act question flows → assessment; Governance Exposure → dashboard. Adopt the template class + page rhythm on convergence. |
| **Implementation risk** | **Medium** — structural; do alongside DD-13/DD-15 so type, spacing and template land together per page. |

---

## Phase 2 implementation exceptions (hero wins, spec §2.1 ground-truth note)

## DD-10 · `--type-hero` anchored to the hero, not the spec placeholder
| | |
|---|---|
| **Description** | Spec §2.1 listed `--type-hero: clamp(2.75rem,5vw,4rem)`, serif **600**, lh 1.05. The live hero h1 is Playfair **700**, `clamp(36px,4.2vw,52px)`, lh **1.08**, −0.02em. Per the §2.1 ground-truth note + Hero Protection, the token matches the hero: `clamp(2.25rem,4.2vw,3.25rem)` / 700 / lh 1.08. |
| **Location** | `styles/tokens.css`, `styles/typography.css` (`.t-hero`) |
| **Recommendation** | None — correct by design. Recorded for transparency. |
| **Implementation risk** | **Low**. |

## DD-11 · Label/meta + standfirst reconciled to the hero
| | |
|---|---|
| **Description** | Spec placeholders: `--type-label` 12px/0.08em, `--type-meta` 11px/0.06em, `--type-body-lg` 18px/400. The hero eyebrow is DM Mono **10px / 0.18em** uppercase and the standfirst is DM Sans **300 / 19px / lh 1.6**. Tokens reconciled toward the hero: label/meta ~10–11px / 0.16em; body-lg 1.1875rem (19px) / lh 1.6 with light weight available. |
| **Location** | `styles/tokens.css`, `styles/typography.css` |
| **Recommendation** | None — hero wins per Hero Protection. Recorded for transparency. |
| **Implementation risk** | **Low**. |

## DD-12 · Spec says "six templates" but enumerates five
| | |
|---|---|
| **Description** | Spec §8 states "six template types" but details five: Editorial, Product/Tool Landing, Assessment, Dashboard/Radar, and the protected Homepage (§8.5 is responsive behaviour, not a template). The sixth is undefined. |
| **Location** | Phase 2 spec §8 |
| **Recommendation** | ~~Per §8.0, no sixth template was invented; flagged for Clive's clarification.~~ **RESOLVED 2026-06-25 (ratified by Clive):** the sixth template is **Index/Listing** (`tmpl-index`, §8.7) — a filterable, classified grid of content cards. §8.0 written justification recorded in `templates.css` (none of the other four describes a multi-item listing). `signals.html` mapped to it; scaffold `template-index.html` added. |
| **Implementation risk** | **Low** — resolved; additive template + one page mapping. |

---

## Phase 2 convergence sequence (recommended, post Phase-1 merge)
Per page, in one reviewed PR each, verified against the hero:
1. **Declare the template** (DD-16) — add the `tmpl-*` class + page rhythm.
2. **Adopt type roles** (DD-13) — map elements to `.t-*`; remove ad-hoc sizes.
3. **Apply reading measure + spacing scale** (DD-14, DD-15) — `.reading` / `.layout`, `--space-*`.
4. Re-run the Brand Regression Review (typography/layout pass) for that surface.

Start with the highest-traffic non-hero surfaces (signals, dpi, dora). The hero is never altered.

---

# PHASE 3 — COMPONENTS DEBT (added 2026-06-25)

Phase 3 ships the component **library** (`components.css`). Per §9 Restraint + "record before rewrite," existing per-page component CSS is logged here, not force-rewritten; convergence is staged.

## DD-18 · Duplicated per-page component CSS (no shared component layer)
| | |
|---|---|
| **Description** | Each page re-defines its own `.chip` / `.card` / `.tag` / score-bar / badge / CTA rules inline (e.g. `signals` chips/cards, homepage `.hero-cta`/`.score-bar-*`, assessment Likert/sliders). Same components, many copies — the component-level analogue of DD-02. |
| **Location** | `index.html`, `signals.html`, `dpi.html`, `dora.html`, `nis2.html`, `radar.html`, `eu-ai-act*.html`, `admin/*` |
| **Recommendation** | `components.css` is the single source of truth (this phase). Pages adopt `.btn`/`.chip`/`.badge`/`.tag`/`.card__*`/`.bar`/`.slider`/`.data-figure` and drop local copies during staged convergence. |
| **Implementation risk** | **Medium** — broad but mechanical; one reviewed page at a time, verified vs hero (as Phase 2). |

## DD-19 · Inconsistent CTA / button treatments
| | |
|---|---|
| **Description** | The arrow-link CTA varies by page (`.hero-cta` 10px/0.18em; `.panel-cta` 8.5px/0.14em; product pages use a bordered CTA). One canonical pattern should drive all three. |
| **Location** | `index.html` (`.hero-cta`, `.panel-cta`), product/landing pages |
| **Recommendation** | Adopt `.btn--link` / `.btn--primary` (+ `.btn--arrow`) from `components.css`; normalise size to `--type-label`. |
| **Implementation risk** | **Low–Medium** — small visible normalisation; verify against the hero CTA. |

## DD-20 · Slider styling minimal (native accent-color only)
| | |
|---|---|
| **Description** | Range inputs rely on `accent-color`; no custom editorial track/thumb. Acceptable + accessible now; richer styling belongs to Phase 6 (Interaction Patterns). |
| **Location** | assessment pages (DPI, EU AI Act, DORA, NIS2, radar) |
| **Recommendation** | ~~Keep accent-color for Phase 3; revisit in Phase 6.~~ **RESOLVED (Phase 6):** `interactions.css` ships a tokenised custom slider — thin `--color-border-subtle` track, teal `--color-accent` thumb bordered in `--color-bg`, teal focus glow, cross-browser (`-webkit-`/`-moz-`), keyboard-accessible; reduced-motion safe. |
| **Implementation risk** | **Low** — resolved; additive enhancement, falls back to accent-color. |

---

# PHASE 4 — DATA VISUALISATION DEBT (added 2026-06-25)

## DD-21 · Radar canvas used CSS var() (silently broken) + ad-hoc series hex — FIXED
| | |
|---|---|
| **Description** | `radar.html` draws on `<canvas>`, where `ctx.strokeStyle = 'var(--teal-dim)'` / `'var(--rule)'` / `'var(--navy)'` and `getColor`'s `'var(--teal)'` **do not resolve** — those grid rings, spokes, one fill branch and dot borders rendered as fallback (default/black), and framework series used ad-hoc hex (`#6a9fc0` etc.). |
| **Location** | `radar.html` canvas draw + `getColor` + slider colorMap |
| **Recommendation** | **DONE (Phase 4):** added a global `VIZ` token bridge (`getComputedStyle`, resolved once); grid→`--color-data-grid` (outer ring subtle teal), framework series→`--color-data-3/2`+success, score-band series→risk/warning/accent/success, dot border→`--color-bg`, slider tracks→`var(--color-data-3/…)` (CSS). Linked `dataviz.css`. |
| **Implementation risk** | **Low–Medium** — fixes latent rendering; verified live (chart now renders crisp token grid + series). |

## DD-22 · Canvas token bridge is the standing rule for future charts
| | |
|---|---|
| **Description** | Any future `<canvas>` chart must resolve tokens in JS (cannot use `var()`); SVG charts may use `.viz-series-*`/`.viz-grid-line` directly. |
| **Location** | platform-wide (forward rule) |
| **Recommendation** | Follow `phase4-dataviz.md` "Canvas token bridge". No debt outstanding — recorded so the pattern isn't reinvented. |
| **Implementation risk** | **Low** — governance note. |

---

# PHASE 5 — EDITORIAL LANGUAGE DEBT (added 2026-06-25)

## DD-23 · Retired terms / off-voice copy in live pages (staged)
| | |
|---|---|
| **Description** | Beyond the homepage (DD-05, fixed), stray retired terms and vendor-ish phrasing may remain in body copy/CTAs across pages. Phase 5 sets the lexicon + voice; live copy converges per page. |
| **Location** | platform-wide body/CTA copy |
| **Recommendation** | Run customer-facing copy against `phase5-editorial-language.md` (voice + lexicon + microcopy); replace retired terms per the do-not-use map; verb-led CTAs. One reviewed page at a time. |
| **Implementation risk** | **Low** — copy edits, reversible; hero copy is the benchmark (unchanged). |

# PHASE 6 — INTERACTION PATTERNS DEBT (added 2026-06-25)

## DD-24 · Per-page interaction/state CSS (converge to interactions.css)
| | |
|---|---|
| **Description** | Hover/focus/disabled/loading handled ad-hoc per page; native sliders. Phase 6 ships `interactions.css` (states + custom slider + skeleton). Pages adopt it during staged convergence. |
| **Location** | assessment pages (sliders), queues (loading/empty), interactive controls |
| **Recommendation** | Link `interactions.css`; adopt `.slider`, `.skeleton`/`.is-loading`, `.state-empty/.state-error`, focus conventions. |
| **Implementation risk** | **Low–Medium** — additive; verify slider + focus per page. |
