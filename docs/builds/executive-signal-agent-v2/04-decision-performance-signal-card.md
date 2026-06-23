# D4 — Decision Performance Signal Card

**Work Package 11 — Executive Signal Agent v2**
**Status:** Design / specification (no code changes)
**Date:** 2026-06-23
**Replaces:** the v1 public signal card on `/signals.html`

---

## Design intent

The card must **read as a Decision Performance instrument, not a news card**. A news card leads with the headline and source and stops at "why it matters". This card continues — it names the *constraint* and the *dimension impacted*, so the reader internalises the category lesson: *most AI failures are Decision Performance failures.*

The structural signal of that intent is a **two-zone card**: an editorial zone (what happened / why / what to ask) above a visually distinct **Decision Performance readout** (constraint · impact · dimension · persona). The readout is what makes it not-a-news-card.

Reuses existing design tokens only — no new visual system. Tokens: `--navy/--surface/--raised`, `--teal`, `--amber`, `--off-white/--slate-70/--slate`, Playfair Display / DM Sans / DM Mono.

---

## Required content hierarchy

Per the work package, in order:

1. **Signal Title**
2. **Why It Matters**
3. **Decision Question**
4. **Constraint Exposed**
5. **Decision Performance Impact**
6. **Executive Persona**
7. **Pillar**
8. **DPI Dimension**
9. **Source**

Grouped into three reading zones:

- **Zone A — Editorial:** Signal Title → Why It Matters → Decision Question
- **Zone B — Decision Performance readout** (visually separated band): Constraint Exposed → Decision Performance Impact → DPI Dimension
- **Zone C — Context strip:** Executive Persona · Pillar · Source

---

## Wireframe (desktop card)

```
┌─────────────────────────────────────────────────────────────┐
│  ◆ AGENTIC GOVERNANCE            ●●●● CRITICAL IMPACT        │  ← top meta: pillar eyebrow (teal) + impact badge (amber/red)
│                                                               │
│  Autonomous Procurement Agents Outrun Their                   │  ← Signal Title (Playfair, large)
│  Governance Controls                                          │
│                                                               │
│  AI agents are now executing purchase commitments faster      │  ← Why It Matters (DM Sans, slate-70)
│  than approval and audit processes can keep up. The control   │
│  gap is operational, not theoretical.                         │
│                                                               │
│  ▎Can any AI system currently commit the organisation to      │  ← Decision Question (italic, amber left-rule)
│  ▎financial obligations without explicit approval?            │
│                                                               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │  DECISION PERFORMANCE READOUT          (teal hairline)  │   │  ← Zone B band: --raised bg, teal top border
│ │                                                         │   │
│ │  CONSTRAINT EXPOSED                                     │   │
│ │  ⚠ Agent authority exceeds current governance controls. │   │
│ │                                                         │   │
│ │  IMPACTS  ►  ACCOUNTABILITY        [ ●●●● Critical ]     │   │  ← dimension chip + impact meter
│ │              Resilience (secondary)                     │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│  FOR: Board · CFO · CIO        Agentic Governance             │  ← Zone C: persona chips · pillar
│  ─────────────────────────────────────────────               │
│  Forrester · 21 Jun 2026                       source ↗       │  ← Source
└─────────────────────────────────────────────────────────────┘
```

## Wireframe (mobile card, ~360px)

```
┌───────────────────────────────┐
│ ◆ AGENTIC GOVERNANCE         │
│ ●●●● CRITICAL                 │
│                               │
│ Autonomous Procurement        │
│ Agents Outrun Their           │
│ Governance Controls           │
│                               │
│ AI agents are executing       │
│ commitments faster than       │
│ approval/audit can keep up…   │
│                               │
│ ▎Can any AI system commit us  │
│ ▎to obligations without       │
│ ▎explicit approval?           │
│                               │
│ ┌───────────────────────────┐ │
│ │ DECISION PERFORMANCE      │ │
│ │ CONSTRAINT EXPOSED        │ │
│ │ ⚠ Agent authority exceeds │ │
│ │   governance controls.    │ │
│ │ IMPACTS ACCOUNTABILITY    │ │
│ │ [ ●●●● Critical ]         │ │
│ └───────────────────────────┘ │
│                               │
│ Board · CFO · CIO             │
│ Agentic Governance            │
│ Forrester · 21 Jun · src ↗    │
└───────────────────────────────┘
```

On mobile the three zones simply stack; the Decision Performance band keeps its distinct background so the structure survives the narrow column.

---

## Element specifications

| Element | Field | Style notes |
|---|---|---|
| Pillar eyebrow | `primary_pillar` | DM Mono, `--teal`, uppercase, tracked. Optional decorative pillar-number prefix (e.g. ◆). |
| Impact badge | `decision_performance_impact` | DM Mono uppercase; 4-dot meter + label. Colour ramp: Low `--slate`, Medium `--amber`, High `--amber` bold, Critical `--red`. Top-right of card. |
| Signal Title | `signal_title` | Playfair Display 20–24px, `--off-white`. The only headline-weight element. |
| Why It Matters | `why_it_matters` | DM Sans, `--slate-70`, 2–4 sentences. |
| Decision Question | `decision_question` / `executive_action` | Italic DM Sans, `--off-white`, 2px `--amber` left rule. Carried over from v1. |
| **Readout band** | — | `--raised` background, 1px `--teal` top border, inset padding. This band is the "not a news card" signal. Labelled "DECISION PERFORMANCE" in DM Mono `--teal`. |
| Constraint Exposed | `constraint_exposed` (+`constraint_type`) | Label "CONSTRAINT EXPOSED" (DM Mono `--slate`); sentence in `--off-white` with a ⚠ glyph. `constraint_type` may show as a small chip. |
| Dimension + impact | `dpi_dimension` (+ secondary, + impact) | "IMPACTS ► <DIMENSION>" with dimension in `--teal`; impact meter to the right; secondary dimension muted below. |
| Persona chips | `executive_persona[]` | DM Mono mini-chips, `--slate-70`, hairline border. Prefix "FOR:". |
| Pillar (context) | `primary_pillar` | Restated quietly in Zone C for scannability. |
| Source | `source_name`, `published_at`, `source_url` | DM Mono `--slate`; "source ↗" link opens original in new tab. |

---

## Behavioural / graceful degradation

- v1 rows (no DPI metadata) render Zone A + Zone C only; the readout band is **omitted** when `dpi_dimension`/`constraint_exposed` are null, so old and new signals coexist.
- The card never shows empty labels — any absent field collapses.
- Pillar **filter chips** remain; a **dimension filter** and **persona filter** are added (see D5 / public page), so readers can browse by Decision Performance dimension — reinforcing the model.

---

## Why this satisfies the brief

The card visibly elevates the Decision Performance readout to a dedicated, styled band rather than burying it in metadata. A reader scanning the page sees, repeatedly, *constraint → dimension → impact* — which is precisely the recurring-pattern recognition the strategic objective calls for. It reuses existing tokens, renames nothing, and adds no assessment.
