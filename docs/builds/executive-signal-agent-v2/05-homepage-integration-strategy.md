# D5 — Homepage Integration Strategy

**Work Package 11 — Executive Signal Agent v2**
**Status:** Design / specification (no code changes)
**Date:** 2026-06-23
**Supersedes:** the v1 "Latest Executive Signals" embed (`docs/builds/signals-homepage-embed.md`)

---

## The rename, and why it matters

**Replace "Latest Executive Signals" with "Decision Performance Signals."**

This is not cosmetic. "Latest Executive Signals" frames the module as a news ticker. "Decision Performance Signals" frames it as an **observatory** — the homepage's standing demonstration that external AI developments are, underneath, organisational decision-performance events. The rename plus the dimension-led layout is what converts the strip from a content asset into a **category-building asset**.

**Module objective:** show, at a glance, how recent external developments affect the six dimensions of Decision Performance — Quality, Velocity, Accountability, Capability, Value, Resilience — and invite the executive to ask which dimension their own organisation is most constrained on (the bridge to the DPI).

---

## Content hierarchy

1. **Section eyebrow:** `DECISION PERFORMANCE SIGNALS`
2. **Section statement (one line):** *"How this week's AI developments are testing enterprise decision systems."*
3. **Dimension rail (optional but recommended):** the six dimensions as selectable chips; each shows a count of recent signals touching it. This is the observatory cue — it makes the six dimensions the organising frame, not the pillars.
4. **Signal cards (top 3):** compact Decision Performance cards (D4, reduced) ordered by impact then recency. Each shows: dimension chip · impact · signal title · constraint exposed (one line) · pillar/source.
5. **CTAs:** primary → "View all signals" (`/signals.html`); secondary → "Find your primary constraint" (`/dpi`).

The secondary CTA is the strategic hinge: a reader who has just seen three external constraints is primed to ask about their own — which is exactly what the DPI answers.

---

## Desktop wireframe (~1080px content width)

```
────────────────────────────────────────────────────────────────────────────
  DECISION PERFORMANCE SIGNALS                                  View all  →
  How this week's AI developments are testing enterprise decision systems.

  [ Quality 3 ] [ Velocity 2 ] [ Accountability 5 ] [ Capability 1 ]        ← dimension rail (chips + counts)
  [ Value 2 ] [ Resilience 4 ]                          ◐ filters cards below

  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
  │ ACCOUNTABILITY ●●●●│  │ VALUE          ●●●○│  │ RESILIENCE     ●●●○│   ← dimension chip + impact meter
  │ Critical           │  │ High               │  │ High               │
  │                    │  │                    │  │                    │
  │ Agents outrun      │  │ CFOs tighten AI    │  │ Data-residency     │   ← signal title (Playfair)
  │ governance controls│  │ ROI scrutiny       │  │ rule forces re-arch│
  │                    │  │                    │  │                    │
  │ ⚠ Agent authority  │  │ ⚠ Value cannot be  │  │ ⚠ Single-provider  │   ← constraint exposed (1 line)
  │ exceeds controls   │  │ attributed to AI   │  │ dependency exposed │
  │                    │  │                    │  │                    │
  │ Agentic Governance │  │ AI Economics       │  │ Sovereign AI       │   ← pillar
  │ Forrester · source↗│  │ Chief Exec · src ↗ │  │ McKinsey · src ↗   │   ← source
  └────────────────────┘  └────────────────────┘  └────────────────────┘

        [ View all signals ]        Find your primary constraint  →            ← CTAs (primary + secondary→DPI)
────────────────────────────────────────────────────────────────────────────
```

## Mobile wireframe (~360px)

```
──────────────────────────────
 DECISION PERFORMANCE SIGNALS
 How this week's AI developments
 are testing decision systems.

 ‹ Quality Velocity Accountab… › ← dimension rail scrolls horizontally
   (chips + counts, swipeable)

 ┌──────────────────────────┐
 │ ACCOUNTABILITY  ●●●● Crit │
 │ Agents outrun governance  │
 │ ⚠ Agent authority exceeds │
 │   controls                │
 │ Agentic Governance · src↗ │
 └──────────────────────────┘
 ┌──────────────────────────┐
 │ VALUE          ●●●○ High  │
 │ CFOs tighten ROI scrutiny │
 │ ⚠ Value not attributable  │
 │ AI Economics · src ↗      │
 └──────────────────────────┘
        ⋯ 1 more

 [ View all signals ]
 Find your primary constraint →
──────────────────────────────
```

On mobile the cards stack (show 2, "+more" to expand or link out) and the dimension rail becomes a horizontally scrollable chip row. CTAs stack full-width.

---

## Placement & integration

- The live homepage is not in this workspace; integration follows the existing diff workflow (as the DPI feature did — see `dpi-mvp-deliverables/index.html.dpi-featured.diff`). Editorially, this module sits in the content/insights band, distinct from the "Readiness Instruments" band where the DPI/EU AI Act cards live (it complements them: instruments are self-assessment; signals are the observatory).
- Data source is unchanged: reads `approval_status = 'published'` rows via the anon key, now also reading the new `dpi_dimension`, `constraint_exposed`, `decision_performance_impact`, `executive_persona` fields. Hides itself when nothing is published.
- The v1 embed file remains valid as a fallback; this spec is the v2 evolution of it.

---

## CTA recommendations

| CTA | Label | Target | Rationale |
|---|---|---|---|
| Primary | "View all signals" | `/signals.html` | Depth — the full observatory. |
| Secondary (strategic) | "Find your primary constraint" | `/dpi` | Converts pattern-recognition into self-diagnosis; this is the category-to-product bridge. |
| Per-chip (optional) | dimension name | `/signals.html?dimension=<X>` | Lets a reader pursue the dimension that resonates. |
| Per-card | "source ↗" | original article | Credibility; opens in new tab. |

---

## Success test

A first-time visitor should leave the homepage able to complete the sentence: *"AI developments aren't just news — they stress my organisation's decision **[quality / velocity / accountability / …]**."* If the module reads as a news feed, the dimension rail and constraint lines are not prominent enough. The dimension rail is the single most important element for the category goal and should not be dropped to save space.
