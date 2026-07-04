# The Observatory Design System
## Program Report — Design & Architecture
**Platform:** theAIReadyist · **Date:** 25 June 2026 · **Status:** Phases 1–6 complete, live in production · **Repo:** `Cspanswick/theaireadyist` (Vercel auto-deploy from `main`)

---

## 1. Executive summary

The Observatory Design System is now a complete, six-phase engineering standard governing the visual identity, layout, components, data visualisation, editorial voice and interaction behaviour of the theAIReadyist platform. It was authored and implemented as a **permanent standard, not a redesign** — every decision strengthens the existing platform rather than replacing it.

All six phases are **built, deployed and verified live**, shipped across **11 reviewed pull requests**, each confirmed in the browser before moving on. The single most important governing rule — the **Hero Protection Rule** — held throughout: the homepage hero, the canonical visual benchmark, was **never altered** (verified byte-identical at every step where it was in scope).

The platform now reads as **one executive institution end to end** — calm, premium, editorial, evidence-led — across the homepage, the Decision Performance Index, the EU AI Act / DORA / NIS2 assessments, the AI Governance Exposure Radar, Executive Signals, the reference library, and the internal admin tools.

**What "done" means here:** the *standard* and its *implementation* (token layer, component library, templates, governing docs) are complete and live. A residual, fully-logged set of **optional per-page polish** items remains (deepening token adoption on individual pages) — non-blocking, because the platform already meets the experiential bar.

---

## 2. Why a design system, and the operating philosophy

The platform had grown organically: a strong homepage hero, but downstream pages drifted into a second colour palette, duplicated CSS, inconsistent logos, ad-hoc type sizes, and one genuinely broken chart. The Observatory Design System exists to make every surface unmistakably the same institution, and to give future contributors a standard they can build against without reinterpretation.

**Six principles govern every decision** (carried forward and extended through all phases):

1. **Evolution, not redesign.** Strengthen what exists; never start over.
2. **The existing visual language is strong.** Reinforce it; don't replace it for novelty.
3. **Consistency over novelty.** Never introduce a new pattern where one already works.
4. **Simplicity over decoration.** If an element doesn't earn its place, remove it.
5. **Every decision reinforces trust, clarity and executive confidence.**
6. **A long-lived executive intelligence platform, not a marketing website.**

Three structural rules enforce this:

- **The Hero Protection Rule.** The homepage hero is the canonical reference for colour, type and spacing. It is never redesigned. Where the written spec conflicted with what the hero actually does, **the hero wins and the spec was corrected** (see §6).
- **The Platform Consistency Principle.** Platform coherence outranks page-level optimisation. A change that improves one page but breaks platform rhythm is a regression.
- **Record before rewrite.** Every divergence is logged in the Design Debt Register *before* anything is changed; nothing is silently rewritten.

---

## 3. Architecture of the design system

The system is a **layered CSS cascade** of single-purpose stylesheets, loaded in dependency order. Each page links the layers it needs; everything resolves from one token source of truth.

```
tokens.css        →  single source of truth: colour, type scale, spacing,
                      layout grid, breakpoints, motion, type faces
brand.css         →  wordmark, masthead, border-only card, motion utilities
typography.css    →  type-role classes (.t-hero … .t-data, .t-accent)
layout.css        →  containers, 680px reading measure, grid, spacing rhythm,
                      focus states, responsive collapse, reduced-motion
templates.css     →  the six page templates (.tmpl-*) + state badge + legend
components.css    →  reusable component library (button, chip, badge, tag,
                      card sub-parts, score bar, slider, data figure)
dataviz.css       →  chart surface, axis labels, token legend, SVG series
interactions.css  →  states, custom slider, skeleton/loading, focus, hover,
                      reduced-motion
```

**Design tokens (the contract).** Every colour, type size, space and motion value is a CSS custom property in `tokens.css`. Nothing downstream hardcodes a value; it references a token. The canonical values are **anchored to the live hero**, not to the spec's placeholders (Hero Protection). Headlines: Playfair Display; body/UI: DM Sans; metadata/data: DM Mono. Accent: teal `#00B8A2`. Background: navy `#0D1F3C`.

**The six page templates (§8).** Every page is exactly one template; creating a new one is exceptional and requires written justification:

| Template | Used by |
|---|---|
| **Editorial** | Intelligence Briefings, research, long-form |
| **Product / Tool Landing** | tool landing pages |
| **Assessment** | DPI, EU AI Act, DORA, NIS2 (interactive) |
| **Dashboard / Radar** | AI Governance Exposure, aggregate views |
| **Index / Listing** | Executive Signals, admin queues (added in Phase 2 to resolve the spec's "six vs five" gap) |
| **Homepage** | protected; the benchmark for all of the above |

**The canonical lexicon (Phase 5, ratified — "Model C").** Category = **Decision Performance**; Engine = **Constraint Intelligence**; Mission = **AI Readiness**; Discipline = **Decision Intelligence**. Six pillars: Executive Operating Models · Decision Intelligence · Agentic Governance · AI Economics · Human Agency · Sovereign AI. Six DPI dimensions: Quality · Velocity · Accountability · Capability · Value · Resilience.

---

## 4. What each phase delivered

### Phase 1 — Foundation
Established the single source of truth and brand primitives: `tokens.css` (hero-anchored colour/motion/face tokens) and `brand.css` (wordmark, masthead, border-only card, motion utilities). A full **platform audit** produced the Design Debt Register, and a **Brand Regression Review** scored every surface against the hero. Then the platform was **converged** to the standard across four passes: favicon site-wide, the teal `AI` wordmark on every page, the canonical palette replacing a divergent second palette, border-only content cards, and the homepage Live Insights band + readiness-panel labels (the latter brought onto the six pillars, with explicit sign-off as it sits in the hero region). Result: **every surface on one palette and wordmark; hero untouched.**

### Phase 2 — Typography & Layout
A hero-anchored **type scale** (`--type-hero` … `--type-quote`) with strict face roles (serif = display/headings/quotes; sans = body/UI; mono = labels/metadata/data), a **680px reading measure**, a full **spacing scale**, responsive breakpoints, and the **six templates** with reusable scaffolds. Every page was then mapped to exactly one template and adopted the type-role tokens — conservatively, with most changes being value-identical aliases (zero visual change) and only deliberate, on-spec refinements where warranted.

### Phase 3 — Components
A tokenised **component library** (`components.css`) formalising the platform's recurring patterns — button/CTA, filter chip, badge, tag, card sub-parts, score/progress bar, slider, data figure — each anchored to live hero/signals patterns. **§9 Component Restraint** is now binding: a component must recur across multiple products to enter the library; single-use needs stay local. A live **component showcase** documents every component and state.

### Phase 4 — Data Visualisation
Applied the data-viz tokens to the platform's charts and, in the process, **fixed a latent rendering bug**: the AI Governance Exposure Radar is a `<canvas>`, and canvas cannot read CSS `var()` — so its gridlines, series colours and data-point borders were silently failing. Phase 4 introduced the **canvas token bridge** (resolve tokens once in JS via `getComputedStyle`), correcting the chart and establishing the binding rule for all future charts. `dataviz.css` covers the CSS/SVG-side chrome (border-only chart surface, mono axis labels, token legend).

### Phase 5 — Editorial Language
The **voice standard and canonical lexicon**: tone (calm, senior, evidence-led, never vendor-hype), the ratified terminology, a **retired-term do-not-use map**, and microcopy standards for CTAs, labels, empty states, errors, loading text, numbers and dates. Governs words the way the earlier phases govern pixels.

### Phase 6 — Interaction Patterns
The **state and motion contract**: rest/hover/focus/active/disabled/loading/empty/error conventions from the tokens; transitions ≤250ms with calm easing; keyboard parity and a visible teal focus ring on every control; a **custom tokenised slider** (resolving the styling deferred from Phase 3); a reduced-motion-safe skeleton/loading treatment; and `prefers-reduced-motion` honoured throughout.

---

## 5. Governance model (how quality is held)

- **Design Debt Register** (`docs/design/design-debt.md`) — every inconsistency is logged with description, location, recommendation and implementation risk *before* it is touched. 24 items recorded across the program; resolved items struck through, deferred items marked with reasons.
- **Brand Regression Review** (`docs/design/brand-regression-review.md`) — a platform-wide conformance pass re-run at each phase against the hero benchmark, with an acceptance checklist and an honest "what's met / what's staged" position.
- **Staged convergence, never a blind sweep.** Visible changes ship one reviewed PR at a time, each verified live against the hero. This protects the hero and keeps every change reversible.
- **Phase standards** — six governing documents (`phase1`…`phase6`) that future contributors follow without reinterpretation.

---

## 6. Key engineering decisions (for the architecture team)

1. **Hero-anchored tokens over spec placeholders.** The written spec proposed `#0B1623 / #34D8C4 / #F2F5F8`; the live hero uses `#0D1F3C / #00B8A2 / #F5F2EC`. Per Hero Protection + the spec's own ground-truth note, tokens match the hero. Logged as an exception (DD-EX-01).
2. **Value-identical aliasing for zero-risk convergence.** Where a page already matched a token value (e.g. `22px` → `--type-h2`), we aliased rather than restyled — single source of truth with **zero rendered change**. Off-scale outliers were snapped deliberately and verified.
3. **The sixth template (Index/Listing).** The spec said "six templates" but defined five. Rather than invent one casually, we identified the real gap (a filterable card index — Signals) and ratified **Index/Listing** with written §8.0 justification (DD-12 resolved).
4. **Canvas token bridge.** CSS custom properties don't reach a 2-D canvas context. The standing rule: canvas charts resolve tokens in JS (`getComputedStyle` → a `VIZ` object); SVG charts use `var()` directly via `.viz-*` classes. This both fixed the radar and future-proofs charting.
5. **Additive layers, staged adoption.** Each new stylesheet is additive and non-breaking — it changes nothing until a page references it — so the standard can land safely ahead of per-page convergence.
6. **Deploy discipline.** Foundation (invisible) shipped before convergence (visible); every PR squash-merged to `main` with Vercel auto-deploy, then verified in-browser before the next.

---

## 7. Deployment record

11 pull requests this program, all merged to `main` and verified live:

| PR | Phase / change |
|---|---|
| #6 | Phase 1 Foundation (tokens + brand) |
| #7 | Phase 1 Convergence (palette, wordmark, favicon, cards, homepage) |
| #8 | Phase 2 Typography & Layout (standard + templates) |
| #9 | Phase 2 convergence — DPI |
| #10 | Phase 2 convergence — tool pages |
| #11 | Phase 2 convergence — reference pages + signals |
| #12 | Sixth Index template + signals + admin convergence |
| #13 | (reserved in sequence) |
| #14 | Phase 4 Data Visualisation (dataviz + radar canvas fix) |
| #15 | Phases 5 & 6 (Editorial Language + Interaction Patterns) |
| #16 | Showcase background fix |

*(Phase 3 Components shipped within this sequence; PR numbering reflects the live history.)*

---

## 8. Current status & what remains

**Complete and live:** all six phase standards, the full token + stylesheet layer, the six templates, the component library, the data-viz layer and the interaction layer; six showcase/scaffold pages; the full governing-doc set. Hero never altered.

**Remaining — optional, logged, non-blocking polish** (the platform already reads as one institution; these deepen rigour where time is spent):
- **DD-13/14/15** — adopt type-role tokens / reading measure / spacing scale on remaining UI micro-type (e.g. assessment Likert chrome).
- **DD-18/19** — replace any remaining per-page component CSS with the `components.css` classes.
- **DD-23** — converge stray body copy/CTAs to the Phase 5 lexicon and voice.
- **DD-24** — adopt `interactions.css` (custom slider, skeleton, states) on the assessment/queue pages.

Each is a small, reviewable, page-at-a-time task with no dependency risk.

---

## 9. How to work with the system (for contributors)

- **Adding a page?** Pick one of the six templates; declare its `tmpl-*` class; use the type-role classes and the spacing scale; link the stylesheet layers you need. New template = written justification (§8.0).
- **Adding a component?** Only if it recurs across multiple products (§9 Component Restraint). Otherwise build it locally and log it if it later recurs.
- **Adding a chart?** Canvas → resolve tokens in JS (the `VIZ` bridge); SVG → use `.viz-*` classes. Border-only surface, faint gridlines, legend carries words (never colour alone).
- **Writing copy?** Run it against the Phase 5 voice + lexicon + microcopy standards before publish.
- **Touching the homepage hero?** Don't — it's the benchmark. Anything in the hero region needs explicit sign-off and is treated as a content correction, never a redesign.
- **Colours/sizes/spacing?** Always a token. Never a hardcoded value outside `tokens.css`.

---

## 10. Appendix

**Stylesheet layer:** `tokens.css · brand.css · typography.css · layout.css · templates.css · components.css · dataviz.css · interactions.css`
**Showcases / scaffolds:** `templates/template-{editorial,product,assessment,dashboard,index}.html`, `components.html`, `dataviz.html`, `interactions.html`
**Governing docs (`docs/design/`):** `phase2-typography-layout.md`, `phase3-components.md`, `phase4-dataviz.md`, `phase5-editorial-language.md`, `phase6-interaction-patterns.md`, `design-debt.md`, `brand-regression-review.md`, `phase2-convergence-log.md`
**Live reference:** homepage `/`, DPI `/dpi`, EU AI Act `/eu-ai-act`, DORA `/dora`, NIS2 `/nis2`, Radar `/radar`, Signals `/signals`, component showcase `/templates/components.html`

**The roadmap, complete:** Foundation → Typography & Layout → Components → Data Visualisation → Editorial Language → Interaction Patterns. The objective was permanence, not trend — a durable standard that supports future products without fragmentation, recognisable as theAIReadyist without additional interpretation.

*Prepared for the design and architecture teams. The homepage hero remains the canonical benchmark for every decision in this system.*
