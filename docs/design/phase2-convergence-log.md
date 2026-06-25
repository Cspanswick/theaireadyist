# Phase 2 — Per-Page Convergence Log

Each page is mapped to one template and adopts the type roles / reading measure / spacing scale, one reviewed PR per page, each verified live against the hero (spec §11). Conservative by design: exact-value rules become token aliases (zero visual change); off-scale sizes snap to the nearest role; UI micro-type that risks control layout is deferred and logged, not force-fitted.

---

## Page 1 — dpi.html · Decision Performance Index  →  **Assessment template (§8.3)**
**Status:** staged 2026-06-25 · awaiting deploy + live verification.

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
