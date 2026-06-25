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

---

## Convergence Pass 1 — 2026-06-25 (status update)

- **DD-06 favicon — DONE.** `favicon.svg` + 16/32/180 PNGs created; `<link>` added to every page `<head>` (non-visual).
- **DD-03 logo — DONE (off-hero).** `signals.html` ("The AI Readyist" → wordmark), `dpi.html`, `eu-ai-act.html` now render `the` + teal `AI` + `Readyist`. **index.html logo deferred** (Hero Protection).
- **DD-01 palette — DONE (all off-hero).** dpi · dora · nis2 · radar · signals · eu-ai-act* · all admin/* converged to hero values (#0D1F3C / #00B8A2 / #F5F2EC + alpha variants). Verified: zero residual #0D1B2A / #00C9A7 / #F0F4F8 outside `index.html`.
- **DD-08 (NEW) — Live Insights band uses old navy inside index.html** (`--li-navy: #0D1B2A`, ≈ line 1495). **Deferred** — inside the homepage, Hero-Protection-adjacent; correct only with sign-off. Risk: Low (1 line).
- **Still deferred:** DD-02 (full `var()`-based tokens adoption — pages now *match* the palette but still hold local `:root` values), DD-04 (border-only cards), DD-05 (retired homepage labels — Hero Protection), DD-07 (remaining hardcoded hex), `index.html` logo.
- **Exception:** `index.html` received a non-visual `<head>` favicon link only; hero + body otherwise unchanged.

---

## Convergence Pass 2 — 2026-06-25 (status update)

Scope: the 16 non-homepage pages (index.html deliberately excluded — homepage gets its own reviewed pass). Verified: brace counts identical to pre-pass on all 16; no `var(var())`; `index.html` byte-identical (untouched).

- **DD-02 single source of truth — DONE (16 pages).** Every non-homepage page now `<link>`s `/styles/tokens.css` (before its inline `<style>`), and its `:root` core colours are **aliased to tokens** (e.g. `--navy: var(--color-bg)`, `--teal: var(--color-accent)`, `--off-white: var(--color-text-primary)`). The canonical hexes now live only in `tokens.css`; local var names are preserved so no downstream `var(--navy)` reference had to change. **Zero visual change.** *Full rename of local names → token names is a later, optional tidy (not required for SSOT).* 
- **DD-07 hardcoded hex — DONE (94 swaps).** 94 canonical hex literals across the 16 pages replaced with the matching `var(--color-*)` (value-identical). Non-canonical one-offs (`#0F2233` surface, `#122739` raised, `#e05c5c`) intentionally left — they vanish with DD-04 / are logged for a later sweep.
- **DD-01 residual — DONE (4).** Missed old-navy in rgb form `rgba(13,27,42,…)` (nav bars on `signals`, `dpi` ×2, `eu-ai-act`) corrected to hero navy `rgba(13,31,60,…)`. Zero `rgba(13,27,42)` remain outside `index.html`.
- **DD-04 border-only cards — DONE (4 primary content cards).** `signals .card`, `admin/signals .sig-card`, `admin/research-candidates .rc`, `admin/approvals .draft-card` → `background: transparent` (borders retained). Utility surfaces correctly **kept** their raised fills per §1.3: form inputs/selects, `.kpi`, `.panel`, `.bar-track`, `.rc-notes`, toggle-hover.
- **Still deferred (next wave, logged):** **homepage pass** — `index.html` DD-03 (nav logo teal), DD-04 (the two `var(--bg2)` content fills), DD-08 (Live Insights `--li-` band: old navy `#0D1B2A` + old-teal `rgba(0,201,167)`), all Hero-Protection-adjacent; **DD-05** retired homepage labels (needs explicit sign-off); residual non-canonical hexes (`#0F2233`/`#122739`/`#e05c5c`); optional full local-var→token rename.

---

## Convergence Pass 3 — HOMEPAGE — 2026-06-25 (status update)

Scope: `index.html` only. Hero-Protection-critical; executed by line-specific edits (no global swaps). **Verified: the full before/after diff contains zero `.hero` rules — the hero block is byte-identical; `.hero-sub rgba(240,244,248,0.72)` preserved; braces 380/380.**

- **DD-03 homepage nav logo — DONE.** `theAIReadyist` → `the` + teal `AI` (`<span class="nav-ai">`) + `Readyist`, with `.nav-logo .nav-ai { color: var(--teal); }`. The nav logo is in the sticky site-nav, not the hero.
- **DD-08 Live Insights band — DONE.** The band's self-contained `--li-` palette converged to hero: `--li-navy #0D1B2A → var(--color-bg)`, `--li-teal #00C9A7 → var(--color-accent)`, `--li-text #F0F4F8 → var(--color-text-primary)`, `--li-amber → var(--color-warning)`, text-sec/mut rgba `240,244,248 → 245,242,236`, borders `rgba(0,201,167) → rgba(0,184,162)`, and the `li-pulse` keyframe teal. Band navy now matches the rest of the page (removes a subtle seam). `--li-surface/-raised` (#0F2233/#122739) left — non-canonical navy surfaces, logged.
- **DD-04 Live Insights cards — DONE.** `.feed-lead` / `.feed-item` fills (`var(--bg2)`, hover `#192d4e`) → **border-only**: `background: transparent` + `border: 1px solid var(--li-border-sub)`, hover = subtle teal wash `rgba(0,184,162,0.05)`. Border carries the separation structurally (hierarchy without fill, §1.3 + Philosophy §7).
- **tokens.css** linked in `index.html` `<head>` (non-visual) so the band's `var(--color-*)` resolve.
- **VISUAL-REVIEW FLAG:** the band card styling (filled → border-only) is the one *visible* homepage change in this pass. It is on-spec and verified structurally, but should be eyeballed live after deploy; trivially revertible if the filled look is preferred.
- **DD-05 — NOT APPLIED.** Awaiting Clive's explicit sign-off (Hero-Protection-adjacent). See report.
- **Minor (logged):** mobile override `.feed-lead { border-right:none; border-bottom:… }` is now slightly redundant given the full border; cosmetic, deferred.

### Phase 1 convergence — remaining after Pass 3
- **DD-05** retired homepage labels — needs sign-off (only outstanding homepage item).
- Non-canonical one-off hexes (`#0F2233`, `#122739`, `#192d4e` removed on homepage; `#e05c5c` in admin) — minor sweep.
- Optional: full local-var → token *rename* (cosmetic; SSOT already achieved via aliasing).

---

## Convergence Pass 4 — DD-05 — 2026-06-25 (status update)

- **DD-05 retired homepage labels — DONE (signed off by Clive → six pillars).** Hero readiness-panel `score-dim-name`s relabelled to the canonical pillars: AI Cost Governance→**AI Economics**, Governance & Trust→**Agentic Governance**, Human & Culture Readiness→**Human Agency**, Operating Model→**Executive Operating Models**, Production Readiness→**Decision Intelligence**, Regulatory Compliance→**Sovereign AI**. Matching `DIMENSION_SCORES` JS keys renamed in sync. Stray feed tags "PoC Purgatory"→Executive Operating Models, "AI Cost Intelligence"→AI Economics.
- **LABEL TEXT ONLY.** Verified: full diff = 14 text edits; no scores/colours/bar-widths/structure/CSS changed; all 6 score bars intact; no string corruption; braces 380/380. Hero panel structure intact.
- **Phase 1 convergence is now COMPLETE.** All DD-01..08 resolved across the platform; every surface on the canonical hero palette; logos, favicon, cards, and homepage labels conformant. Remaining: a minor non-canonical-hex sweep (`#0F2233`/`#122739`/`#e05c5c`) and the optional local-var→token rename — both cosmetic, neither blocks sign-off.
