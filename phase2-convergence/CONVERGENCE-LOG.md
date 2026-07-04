# Phase 2 — Per-Page Convergence Log

Each page is mapped to one template and adopts the type roles / reading measure / spacing scale, one reviewed PR per page, each verified live against the hero (spec §11). Conservative by design: exact-value rules become token aliases (zero visual change); off-scale sizes snap to the nearest role; UI micro-type that risks control layout is deferred and logged, not force-fitted.

---

## Page 1 — dpi.html · Decision Performance Index  →  **Assessment template (§8.3)**
**Status:** ✅ DEPLOYED + VERIFIED LIVE 2026-06-25 (PR #9). Live screenshot confirms the page reads as the same institution as the hero: Playfair display at hero scale with one teal accent phrase, mono eyebrow/meta, DM Sans lead at 680px, "MAPPED PILLAR" labels rendering, Likert UI intact.

**Template mapping:** declared `class="tmpl tmpl-assessment"` (interactive self-assessment: dimensions → statements → Likert → verdict). The page predates the four templates; this is the §8.16 mapping.

**Phase 2 stylesheets linked:** `typography.css`, `layout.css` (after `tokens.css`).

**Type roles adopted (content hierarchy):**
| Element | Was | Now | Effect |
|---|---|---|---|
| `.hero-title` | `clamp(34px,4.4vw,50px)` | `--type-hero` | aligns to hero clamp (36–52) |
| `.hero-kicker` (eyebrow) | `9px` mono | `--type-label` (11px) | minor snap up |
| `.hero-desc` (lead) | `16px` | `--type-body` | exact — zero change |
| `.hero-desc` width | `660px` | `--layout-reading` (680) | reading measure |
| `.hero-meta` | `9px` mono | `--type-meta` (10px) | minor snap |
| `.dim-title` | `22px` serif | `--type-h2` | exact — zero change |
| `.dim-purpose` | `13.5px` | `--type-body-sm` (15px) | minor snap up |
| `.dim-pillar` | `8.5px` mono | `--type-meta` (10px) | minor snap up |
| `.stmt-text` | `15px` | `--type-body-sm` | exact — zero change |

**Deferred (logged, DD-13 UI micro-type):** Likert cells/numbers/labels, progress rail, legend, nav, `.dim-num` numeral, `.stmt-idx` — control chrome where snapping risks the assessment UI layout; revisit with the Phase 3 component pass.

**Spacing (DD-15):** not touched this pass (limit risk on a complex interactive page); section spacing review deferred.

**Verification:** diff = 11 intended edits only; braces 213/213; single `<style>` intact; `index.html`/other pages untouched. **Live screenshot vs hero pending deploy.**

---

## Pages 2–5 — Tool pages (one batch PR) · staged 2026-06-25
**Finding (verified live, DORA screenshot):** these pages **already meet the experiential bar** after Phase 1 — teal accent (note: their legacy `--gold` var is aliased to `var(--teal)`, so it renders teal), correct faces, border-only cards, raised utility panels. So this is **lightweight formalisation, not a restyle**: link the Phase 2 layer, declare the template, and tokenise exact-value content sizes (value-identical → zero visual change). Off-scale label/score/nav sizes and reading-measure polish **deferred** (logged) — no risky scale changes on already-consistent pages.

| Page | Template (§8) | Stylesheets | Exact-value sizes tokenised |
|---|---|---|---|
| `eu-ai-act.html` | Assessment | linked | 3 |
| `dora.html` | Assessment | linked | 19 |
| `nis2.html` | Assessment | linked | 26 |
| `radar.html` | Dashboard | linked | 16 |

Exact-value map applied (16→`--type-body`, 15→`--type-body-sm`, 22→`--type-h2`, 18→`--type-h3`, 19→`--type-body-lg`). **Verification:** each page's diff = only stylesheet links + `font-size` token aliases + `<body>` template class; brace counts byte-preserved vs source (pre-existing one-off `{` imbalance left untouched); no other lines changed. **Zero visual change expected; live spot-check pending deploy.**

**Deferred platform note (DD-13 UI / DD-02 naming):** legacy var names (`--gold`/`--orange` aliased to teal/amber) are cosmetic naming-debt, not visual divergence; off-scale label/score sizes (12px, 14px, 17px, 20px, score numerals) and reading-measure tokens remain for an optional later polish — pages already read as one institution.

---

## Pages 6–10 — Reference pages + signals (one batch PR) · staged 2026-06-25
Same lightweight formalisation (link Phase 2 layer, declare template, tokenise exact-value sizes; zero visual change).

| Page | Template (§8) | Exact-value sizes tokenised |
|---|---|---|
| `eu-ai-act-tiers.html` | Editorial | 11 |
| `eu-ai-act-reference.html` | Editorial | 2 |
| `eu-ai-act-enforcement.html` | Editorial | 7 |
| `eu-ai-act-enforcement-risk.html` | Editorial | 16 |
| `signals.html` | **none — template gap (DD-12)** | 3 |

**`signals.html` template-coverage gap:** it's a filterable, pillar-classified **card index** — none of the four templates (Editorial / Product / Assessment / Dashboard) fits a content-index surface. Per §8.0 no template was invented; **no `tmpl-*` class applied**. This is the concrete instance of the **"six vs five" question (DD-12)** — a sixth "Index/Listing" template may be the right answer, but that needs Clive's sign-off before it's created. signals still got the Phase 2 stylesheet links + exact-value size tokens.

**Verification:** every page's diff = only stylesheet links + `font-size` token aliases + (where applicable) `<body>` template class; brace counts byte-preserved; no other lines changed.

---

## Phase 2 convergence — coverage after this batch
**All public pages converged:** homepage (Phase 1), dpi, eu-ai-act, dora, nis2, radar, eu-ai-act-tiers/-reference/-enforcement/-enforcement-risk, signals. **Remaining:** 6 `admin/*` internal pages (lowest priority — not customer-facing). **Open decision:** DD-12 sixth template for index/listing surfaces (signals).

---

## DD-12 RESOLVED + sixth template ratified + admin convergence · 2026-06-25

**Sixth template — Index/Listing (`tmpl-index`, §8.7), ratified by Clive.** Added to `templates.css` with §8.0 written justification (none of Editorial/Product/Assessment/Dashboard describes a filterable multi-item listing). Scaffold `templates/template-index.html` added; `phase2-typography-layout.md` §5 + `design-debt.md` DD-12 updated to RESOLVED.

- **`signals.html`** now declares `class="tmpl tmpl-index"` (its existing `.filters`/`.grid`/`.chip` CSS already implements the pattern; this formalises conformance).

**Admin pages (6) — lightweight formalisation** (links + exact-value size tokens + best-fit template class; internal tools, not customer-facing):
| Page | Template | sizes |
|---|---|---|
| `admin/signals` | Index | 3 |
| `admin/research-candidates` | Index | 2 |
| `admin/approvals` | Index | 3 |
| `admin/observation` | Dashboard | 1 |
| `admin/research-agent` | Product | 0 |
| `admin/blog-research` | Product | 2 |

Each diff = only stylesheet links + `font-size` aliases + `<body>` class; braces byte-preserved; zero visual change.

## Phase 2 convergence — COMPLETE
Every page (public + admin) mapped to one of the **six** ratified templates and on the type-role tokens. Remaining DD-13/14/15 items (off-scale UI micro-type, reading-measure tokens) are optional polish — logged, non-blocking, platform already reads as one institution. **Phase 2 acceptance: met.**
