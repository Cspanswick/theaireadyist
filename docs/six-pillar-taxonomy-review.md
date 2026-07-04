# Six-Pillar Taxonomy — Design Review Brief
**Branch:** `feature/six-pillar-taxonomy`  
**Date:** 2026-06-22  
**Author:** Clive Spanswick  
**For:** Design Team Review

---

## What This Is

We've replaced the old five-pillar editorial model with a new six-pillar taxonomy across theAIReadyist. This doc summarises what changed, what it looks like, and what still needs design input before we merge.

---

## Why We Changed It

The old model had five pillars, but 100% of published content landed in Pillar 3 (Governance, Trust & Risk) — the other four were empty. The new model is more precise, better reflects how senior enterprise leaders actually talk about AI readiness, and separates two things that were conflated: **agentic governance** (internal AI controls) and **sovereign AI** (regulatory/national risk).

---

## The New Six Pillars

| # | Pillar | What it covers | Lenses |
|---|---|---|---|
| 1 | **Executive Operating Models** | How leadership structures and operating models must change when AI is a core capability | Value, Resilience |
| 2 | **Decision Intelligence** | Designing systems where humans and AI make better decisions together | Trust, Accountability |
| 3 | **Agentic Governance** | Governance frameworks, audit trails, and regulatory compliance for autonomous AI | Risk, Accountability, Trust |
| 4 | **AI Economics** | Financial discipline behind AI investment — FinOps, ROI, cost governance | Value, Risk |
| 5 | **Human Agency** | Preserving human judgement, accountability, and capability as AI takes on a larger role in decision-making | Trust, Resilience, Value |
| 6 | **Sovereign AI** | National AI strategies, DORA, NIS2, geopolitical risk, cross-border compliance | Risk, Resilience, Accountability |

### Cross-Cutting Lenses
Five lenses apply across all pillars. Every piece of content carries one or more:

**Trust · Risk · Accountability · Resilience · Value**

---

## What's Already Built

### 1. Admin Blog Research Prompt Builder
**File:** `admin/blog-research/index.html`

The pillar selector in the prompt builder has been fully updated.

**Before:** Five cards in a fluid auto-fit grid  
**After:** Six cards in a fixed 3-column grid (3+3)

Each card now shows:
- Pillar number and name
- One-line description
- Lens chips (small tags showing which cross-cutting lenses apply)

Cards carry `data-pillar` and `data-lenses` HTML attributes for future JS filtering.

The JavaScript `PILLARS` object has been rewritten with six entries — each has a `name`, `summary`, and five `topics` (clickable chips to pre-fill the post angle field).

**No visual redesign** — same colours, typography, and interaction patterns. The only layout change is the grid going from fluid auto-fit to 3 fixed columns to ensure the six cards always render as two clean rows.

---

### 2. Agent Output Metadata
**File:** `agent/run-agent.js`

When the research agent runs a brief, its output now includes `pillar` and `lenses` in:
- The YAML frontmatter of the markdown output file
- The Supabase database row staged for approval

This means approved insights will carry pillar metadata from the moment they're created — no manual tagging needed.

---

### 3. Database Migration
**File:** `migration_build3.sql`

Three new columns added to the `insights` table:
- `pillar` — the primary pillar name (text, nullable for existing content)
- `secondary_pillar` — for cross-pillar content (optional)
- `lenses` — JSON array of applicable lenses

A constraint enforces only the six canonical pillar names. Existing published content is unaffected (pillar stays null until manually assigned).

---

## What Still Needs Design Input

These items are **not yet built** — they require design decisions before implementation.

### A. Homepage Pillar Cards
The homepage currently shows five pillar teasers as plain text with no data attributes. We need to update this to six pillars.

**Questions for design:**
- Do the six pillars all fit in the current homepage section, or does the layout need to change?
- The old five cards likely used a 5-up or 2+3 layout. A 3+3 grid is the natural fit for six — does that work visually at all breakpoints?
- Should the cross-cutting lenses appear on the homepage cards, or only on content pages?
- Do we want a hover state that reveals the lens tags?

---

### B. `data-pillar` Attributes on Public Pages
All existing tool and article pages need `data-pillar`, `data-secondary-pillar`, and `data-lenses` added to their root elements. This is a markup-only change (no visual impact) but it enables future filtering, SEO structured data, and analytics segmentation.

**Mapping:**
| Page | Primary Pillar | Secondary Pillar |
|---|---|---|
| `/eu-ai-act.html` | Agentic Governance | — |
| `/dora.html` | Sovereign AI | Agentic Governance |
| `/nis2.html` | Sovereign AI | Agentic Governance |
| `/radar.html` | Agentic Governance | — |
| `/eu-ai-act-enforcement.html` | Agentic Governance | — |
| `/eu-ai-act-reference.html` | Agentic Governance | — |
| `/eu-ai-act-tiers.html` | Agentic Governance | — |
| `/eu-ai-act-enforcement-risk.html` | Agentic Governance | — |

**Question for design:** Should pillar labels be surfaced visually on these pages (e.g. a breadcrumb or category label), or just carried as invisible metadata for now?

---

### C. Insights Page — Pillar Filtering
The `/insights` listing page currently has no category filters. Now that insights carry a `pillar` field in the database, we could add pillar-based filtering.

**Question for design:** Is this in scope for this branch, or a follow-on? If in scope, what filter pattern — tabs, pills, a dropdown?

---

## Files Delivered in This Branch

| File | What it is |
|---|---|
| `admin/blog-research/index.html` | Updated prompt builder — six pillar cards, lens chips, new JS |
| `agent/run-agent.js` | Agent output now carries pillar + lenses metadata |
| `migration_build3.sql` | DB migration — run in Supabase SQL Editor |
| `docs/pillar-taxonomy-v1.md` | Full taxonomy reference doc (definitions, asset mapping, checklist) |
| `CHANGELOG.md` | Formal changelog — old pillar names preserved for history |

---

## What to Review

1. **The pillar card layout in the prompt builder** — open `admin/blog-research/index.html` in a browser. Check the 3-column grid at desktop and mobile. Check the lens chips read clearly. Check the topic chips still work when a pillar is selected.

2. **The pillar definitions and topic lists** — are the six pillars described accurately and in the right voice for theAIReadyist? Any names or descriptions that should change?

3. **The homepage questions above** — design decision needed before the homepage can be updated.

4. **The taxonomy doc** — `docs/pillar-taxonomy-v1.md` is the canonical reference. Flag anything that's wrong or missing.

---

## Constraints

- No existing pages deleted
- No URLs changed
- No visual redesign beyond the prompt builder grid
- Vercel build unaffected (no build config or JS module changes)
- Existing tools continue to work
