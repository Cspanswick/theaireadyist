# Observatory Design System — Phase 6: Interaction Patterns

**Status:** Governing standard. **Final phase** of the Observatory Design System. Extends Phases 1–5; does not replace them. All prior rules remain in force.
**Date:** 2026-06-25 · authored from the established system.

> Phase 6 governs **how the platform feels in motion** — states, focus, transitions, loading/empty/disabled, and the custom slider (resolving DD-20). Carries the Phase 1 motion principles forward and makes them the binding interaction contract. `interactions.css` is additive.

---

## 1. Interaction principles (carried forward, now binding)
Calm, editorial, purposeful. Interaction confirms; it never performs.
- **MUST** keep all transitions **≤250ms** with the standard easing (`--motion-ease`). Tokens: `--motion-fast` 120ms (micro-feedback), `--motion-base` 200ms, `--motion-slow` 250ms (entrances — ceiling).
- **MUST** express hover/focus as **colour, border-colour or a small gap shift** — never scale, bounce, or translate the element.
- **NEVER** use attention-seeking motion (spin, pulse-as-decoration, parallax, autoplay). The one sanctioned pulse is the Live-Insights "live" dot.
- **MUST** honour `prefers-reduced-motion: reduce` — disable non-essential transitions/animations.
- **NEVER** animate the hero's typography, spacing or behaviour.

## 2. State conventions (every interactive element)
| State | Convention |
|---|---|
| **Rest** | border-only / transparent (cards, chips, buttons) |
| **Hover** | colour → primary text and/or border → `--color-border`; arrow CTAs widen gap (`--space-2`→`--space-3`); ≤200ms |
| **Focus-visible** | `2px solid var(--color-accent)`, `outline-offset: 2px` — on **every** focusable control (keyboard parity) |
| **Active / pressed / selected** | accent colour + `--color-border-active`; filters use `aria-pressed="true"` |
| **Disabled** | `opacity: 0.45; cursor: not-allowed;` + `aria-disabled`; no hover response |
| **Loading** | quiet skeleton shimmer (`.is-loading`) or factual text ("Loading…"); never a spinner-as-theatre |
| **Empty** | calm directive copy (Phase 5 §4), not an error |
| **Error** | `--color-risk` border + plain blame-free text + next step |

- **MUST** give every interactive element a visible focus state and full keyboard operability (Enter/Space activate; arrow keys move sliders).
- **MUST** pair non-text state (selected, error, loading) with text/`aria-*` — never colour alone (§6).

## 3. The custom slider (resolves DD-20)
Assessment sliders move from native `accent-color` to a tokenised editorial track/thumb, keyboard-accessible, with a visible focus ring. Specified in `interactions.css` (`.slider`): thin track (`--color-border-subtle`), teal thumb (`--color-accent`), focus ring teal. Cross-browser (`-webkit-` + `-moz-`). Falls back to `accent-color` where custom pseudo-elements aren't supported.

## 4. Loading / skeleton
`.skeleton` — a calm shimmer in `--color-bg-raised` → faint, ≤1.4s linear, reduced-motion safe (static block). Used while connector/agent data loads (Signals, candidate queue, dashboards). No layout shift on resolve.

## 5. Accessibility (carried from §6, made operational)
Focus order matches visual order (DOM = rhythm); focus never trapped; all controls reachable and operable by keyboard; motion respects reduced-motion; hit targets ≥ comfortable size on touch.

## Files shipped
`styles/interactions.css` (custom slider, focus, hover, disabled, skeleton/loading, empty/error helpers; reduced-motion) · `templates/interactions.html` (showcase of every state) · this standard · register (DD-20 resolved) + regression pass.

## Success criteria
- Every interactive element has rest/hover/focus/active/disabled states from the tokens; transitions ≤250ms, calm easing.
- Custom slider shipped (DD-20 resolved), keyboard + focus verified.
- Loading/empty/error conventions defined; reduced-motion honoured.
- Hero interaction unchanged. Per-page adoption staged (additive).

## The Observatory Design System — complete
Phases 1–6 are authored and implemented:
1 Foundation · 2 Typography & Layout · 3 Components · 4 Data Visualisation · 5 Editorial Language · 6 Interaction Patterns.
A durable, hero-anchored standard: future contributors can build recognisably *theAIReadyist* without reinterpretation. Permanence, not trend.
