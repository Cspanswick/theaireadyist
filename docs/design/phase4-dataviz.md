# Observatory Design System — Phase 4: Data Visualisation

**Status:** Governing standard. Extends Phases 1–3; does not replace them. All prior rules remain in force (Hero Protection, Platform Consistency, tokens, type roles, templates, §9 Component Restraint).
**Date:** 2026-06-25 · authored from the established system.

> **Deploy:** `dataviz.css` is additive. The radar **canvas fix** is a real correction (see below) and is verified live. Deploys after Phases 1–3 (all live).

---

## Principles (carried forward, applied to charts)
Calm · editorial · evidence-led. A chart earns its ink: no chartjunk, no 3-D, no gradients-as-decoration, no colour without meaning. Hierarchy through structure and restraint, not ornament. The primary chart surface is **border-only** (§8.4); raised fills only on control rails/summary cells.

## Data-viz tokens (Phase 1 §1, now the only chart palette)
`--color-data-1` teal (primary series) · `--color-data-2` amber (secondary) · `--color-data-3` steel blue (tertiary) · `--color-data-grid` faint off-white (gridlines). Assessment/state series use the semantic tokens `--color-success / --warning / --risk`. **No chart may introduce a colour outside these.**

## ⚠️ Canvas token bridge (critical implementation rule)
A 2-D `<canvas>` context **cannot** read CSS custom properties — `ctx.strokeStyle = 'var(--x)'` silently fails. **MUST** resolve tokens in JS once, then use the resolved strings:
```js
const css = getComputedStyle(document.documentElement);
const VIZ = {
  grid:    css.getPropertyValue('--color-data-grid').trim(),
  gridHi:  'rgba(0,184,162,0.25)',            // outer ring = subtle teal
  accent:  css.getPropertyValue('--color-accent').trim(),
  warning: css.getPropertyValue('--color-warning').trim(),
  risk:    css.getPropertyValue('--color-risk').trim(),
  success: css.getPropertyValue('--color-success').trim(),
  data3:   css.getPropertyValue('--color-data-3').trim(),
  bg:      css.getPropertyValue('--color-bg').trim(),
};
```
SVG charts may use the `.viz-series-*` / `.viz-grid-line` classes directly (CSS var() works in SVG).

## Chart inventory
| Chart | Tech | Treatment |
|---|---|---|
| **AI Governance Exposure Radar** (`radar.html`) | `<canvas>` | grid = `VIZ.grid`, outer ring `VIZ.gridHi`; framework series = data-1/2/3; control series coloured by score band (success/accent/warning/risk); dots bordered in `VIZ.bg`; **fixed the broken `var()` ctx calls** |
| **Readiness / progress bars** (homepage, DPI, dashboards) | CSS | `.bar` / `.bar__fill--{teal,amber,risk,muted}` (components.css) |
| **Score figures** | CSS | `.data-figure` (components.css) |

## Rules
- **MUST** apply data-viz tokens to every chart element (series, grid, axis, points) via the token set / classes above.
- **MUST** keep the primary chart surface border-only; gridlines faint (`--color-data-grid`); axis labels mono (`.viz-axis-label`).
- **MUST** pair every series/encoding with a text legend (`.viz-legend`) or on-chart label — **never colour alone** (§6). The radar already labels each axis + score; a token-coloured legend reinforces it.
- **MUST** keep motion calm (fills/transitions ≤250ms); no spin-up theatrics.
- **NEVER** introduce a colour outside the data-viz/semantic tokens, a gradient as decoration (radial *glow* on data points is permitted as a subtle affordance, sourced from the point's token colour), or chartjunk.

## Accessibility
Axis + value labels present; legend carries words; series distinguishable by token hue **and** position/label (not hue alone); contrast holds on navy.

## Files shipped
`styles/dataviz.css` · `templates/dataviz.html` (showcase: tokenised radar legend + bars) · `radar.html` (canvas fixed to resolved tokens) · this standard · register + review updates.

## Success criteria
- Every chart uses only data-viz/semantic tokens; radar `var()`-in-canvas bug fixed and verified live.
- Primary surface border-only; legend carries text; a11y holds.
- Hero unchanged. Remaining bar/figure adoption is already covered by components.css.

## Roadmap
Phase 5 — Editorial Language · Phase 6 — Interaction Patterns. Each inherits, none redefines.
