# Executive Lens Architecture Refresh — WP16

**Status:** Implemented (homepage `#function-lenses` section). Aligns to DR-001.
**Date:** 2026-06-23

## What changed

The Executive Lens tab bar moves from technology *job titles* to executive *decision ownership*:

| Before | After |
|---|---|
| CFO · CHRO · CIO · CTO · Board | **CEO · CFO · COO · Tech Executive · CHRO · Board** |

- **CIO and CTO are consolidated into "Tech Executive"** — a single, durable destination for the technology-leadership community, with a subtle subtitle under the lens heading: *Serving: CIO • CTO • CAIO • CDAO • CISO* (explanatory, **not** navigation).
- **CEO and COO added.** CFO, CHRO, Board kept.
- Each lens now states the **question that executive is answering** and their primary concern, per WP16.
- Default lens is now **CEO** (was CFO).

A secondary fix bundled in: the lens panels previously referenced the **retired five-pillar** names (AI Cost Intelligence, PoC Purgatory, etc.). They are now realigned to the **six canonical pillars**, consistent with the pillar index on the same page.

## Lens → question (as shipped)

- **CEO** — *Are we becoming an AI-ready enterprise?* (competitive advantage, growth, transformation, positioning)
- **CFO** — *Are we investing wisely and creating measurable value?* (AI economics, ROI, capital allocation)
- **COO** — *Can the organisation operationalise AI safely and repeatably?* (operating model, execution, decision velocity)
- **Tech Executive** — *Can we build, govern and operate AI at enterprise scale?* (architecture, data/production readiness, AI ops, governance implementation, cyber resilience)
- **CHRO** — *Can our people adapt successfully?* (workforce, skills, leadership, human agency)
- **Board** — *Are we governing AI responsibly?* (governance, oversight, fiduciary risk, resilience)

## Pillar ↔ lens mapping — critical review

WP16's proposed mapping was reviewed; it holds, with one refinement.

| Pillar | WP16 proposal | Verdict / refinement |
|---|---|---|
| Executive Operating Models | COO | **Validated.** COO owns execution; CEO secondary. |
| Decision Intelligence | CEO / COO | **Refined.** CEO owns *decision quality* strategically and COO consumes it operationally — but the **Tech Executive** builds the data/knowledge layer that makes Decision Intelligence possible, so they are a genuine co-owner (added as a "watch" pillar on the Tech Executive lens). Net: CEO primary, COO + Tech Executive supporting. |
| Agentic Governance | Board / Tech Executive | **Validated.** Board owns oversight; Tech Executive owns implementation. |
| AI Economics | CFO | **Validated** (strongest single-owner mapping). |
| Human Agency | CHRO | **Validated.** |
| Sovereign AI | Board / Tech Executive | **Validated.** Board owns the risk/resilience posture; Tech Executive owns infrastructure independence and data residency. |

The shipped lens `pillars` arrays reflect this: each lens surfaces its primary pillars as "Priority" and adjacent ones as "Monitor."

## Editorial guidance

When writing executive content, **write for the decision, not the job title.** For each piece, answer:

- **What decision is this executive trying to make?**
- **What risk are they managing?**
- **What outcome are they accountable for?**

Frame by accountability, not org chart. The same content should feel relevant whether a reader is a CIO, CTO, CAIO, CDAO or CISO — which is exactly why those roles share the Tech Executive lens. This keeps the architecture durable as AI executive roles continue to evolve.

## Non-negotiables honoured

No separate tabs for CIO / CTO / CAIO / CDAO / CISO (consolidated under Tech Executive); navigation simplified, relevance broadened; this is an information-architecture refinement, not a platform redesign; existing design system reused unchanged.
