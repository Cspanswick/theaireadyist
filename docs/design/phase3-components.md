# Observatory Design System — Phase 3: Components

**Status:** Governing standard. Extends Phases 1 (Foundation) & 2 (Typography & Layout); does not replace them. All prior rules — Design Philosophy, Hero Protection, Platform Consistency, colour/motion tokens, type roles, the six templates, the Design Debt Register, the Brand Regression Review — remain in force.
**Date:** 2026-06-25 · authored from the established system (no external spec).

> **Deploy dependency:** `components.css` references Phase 1 tokens + Phase 2 type roles, so it deploys **after** Phases 1 & 2 (both live). It is **additive and non-breaking** — existing pages keep their local component CSS until they adopt the library during staged convergence; deploying it changes nothing rendered.

---

## Design philosophy (carried forward) + §9 Component Restraint (now binding)
Evolution not redesign · existing language is strong · consistency over novelty · simplicity over decoration · hierarchy before decoration · every decision reinforces executive trust.

**§9 Component Restraint — the gate for this phase:**
- A component **MUST** solve a problem that recurs across **multiple** products to enter the library.
- **NEVER** create a reusable component for a single page/use — build it locally; promote later only if it recurs (log it).
- The library stays small and durable. The default answer to "new component?" is **no**, with written justification required (as for templates, §8.0).

---

## Component inventory (formalised from live recurring patterns)
Anchored to the hero/homepage/signals (Hero Protection). Each is tokenised in `styles/components.css`.

| Component | Class | Variants | States | Recurs on |
|---|---|---|---|---|
| **Button / CTA** | `.btn` | `--link` (arrow), `--primary` (bordered), `--ghost`; `--arrow` | hover (colour / gap widen), focus-visible | every tool/landing CTA, hero |
| **Filter chip** | `.chip` | — | hover, `aria-pressed="true"`/`.active` | Signals, Index template, admin queues |
| **Badge** | `.badge` | `--success/--warning/--risk/--neutral/--score` | static (always carries its word, §6) | assessments, signals, dashboards |
| **Tag / pill** | `.tag` | — | static | signal cards, classifications |
| **Card** | `.card` (brand.css) | `--accent` (teal top); sub-parts `__meta/__title/__body/__tags/__foot` | hover (border), active/warning/risk | signals, products, priorities, queues |
| **Score / progress bar** | `.bar` | `__fill--teal/--amber/--risk/--muted` | animated width (≤250ms) | readiness panel, progress rail, dashboards |
| **Slider (range)** | `.slider` | — | hover, focus-visible (teal), keyboard | DPI, EU AI Act, DORA, NIS2, radar |
| **Data figure** | `.data-figure` | `--accent/--warning/--risk`; `__denom` | static | scores site-wide |

### Per-component rules
- **Button:** mono uppercase, teal; `--link` is the canonical arrow-link (gap widens on hover); `--primary` is the bordered CTA placed *after* the case (page rhythm §5). Motion = colour/gap only — never movement/scale.
- **Chip:** transparent, subtle border at rest → teal when pressed. **MUST** use `aria-pressed` for filter state (not colour alone, §6).
- **Badge / tag:** colour **always** paired with its word; mono `--type-meta`. Badge = state, tag = metadata.
- **Card:** border-only at rest (§1.3); `--accent` adds the 2px teal top. Sub-parts give every card the same meta→title→body→tags→foot rhythm. Raised fills only on genuine utility panels (`.panel--utility`).
- **Bar / slider:** semantic fill colours from tokens; slider relies on `accent-color` + visible focus; both fully keyboard-accessible.
- **Data figure:** mono, `--type-data-lg`; accent/semantic colour by meaning only.

## Accessibility (carried from §6)
Focus-visible uses `--color-accent` (layout.css); all interactive components keyboard-operable; meaning never via colour alone (badges/chips/legends carry text or `aria-pressed`); contrast holds on navy at every size.

---

## Files shipped
`styles/components.css` (library) · `templates/components.html` (showcase of every component + states) · this standard · register + regression-review updates.

## Deploy + convergence
1. Deploy `components.css` + showcase + docs (additive; zero render change). *After Phases 1 & 2 (live).*
2. **Staged convergence (logged, post-deploy):** pages replace their local button/chip/badge/bar/slider CSS with the library classes — one reviewed page at a time, verified against the hero, logged in the register. Non-blocking; the platform already reads as one institution.

## Success criteria
- Library covers every recurring component, tokenised, anchored to the hero.
- §9 Restraint recorded and binding (no single-use components admitted).
- Showcase renders all components + states; a11y holds.
- Hero unchanged; additive deploy changes nothing rendered.
- Per-page component convergence staged + logged (not a blind sweep).

## Roadmap
Phase 4 — Data Visualisation · Phase 5 — Editorial Language · Phase 6 — Interaction Patterns. Each inherits, none redefines. Permanence, not trend.
