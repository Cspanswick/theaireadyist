# Website Realignment Report
**Project:** theAIReadyist — Decision Intelligence / Decision Performance Positioning Sprint  
**Date:** 2026-06-23  
**Commit:** `1f25185` on `main` branch  
**Deployed:** Vercel (auto-deploy, live within ~10 seconds of commit)  
**URL:** https://www.theaireadyist.com

---

## Executive Summary

The homepage has been realigned from an intelligence-layer publishing brand to a Decision Intelligence platform. The core positioning shift is complete: the site now leads with the Decision Performance belief statement, introduces Decision Intelligence as the organising discipline, promotes the DPI as the primary above-fold CTA, and presents the correct six-pillar taxonomy. All changes were made within the existing visual system — no new components, no layout restructuring, no URLs changed.

**Strategic Assessment (0–10 scores):**

| Dimension | Score | Rationale |
|---|---|---|
| Homepage Alignment | 8/10 | Hero, meta, title, CTA, and pillar section all updated. AI Readiness Score widget labels still carry old dimension names (separate JS data structure — intentionally not modified per constraints). |
| Pillar Alignment | 9/10 | All six pillars live with correct definitions and linked assessments where available. Function Lenses "Priority Pillars" sub-section still references old pillar names (separate JS object — follow-on task). |
| Assessment Alignment | 8/10 | DPI is now primary CTA in hero and in Decision Intelligence pillar row. EU AI Act linked from Agentic Governance. DORA linked from Sovereign AI. HAWR, EOMI, AEI not yet live — no gaps created. |
| Decision Performance Positioning | 9/10 | Core belief statement is now the headline. "Decision Performance problem" framing lands above the fold. Decision Intelligence platform positioning is in meta, title, and hero subtext. |

**Overall: 8.5/10.** The homepage is now correctly positioned. The outstanding items (Function Lenses pillar data, AI Readiness Score labels) are follow-on tasks, not regressions — they existed before this sprint and are documented below.

---

## Before State

**Captured:** 2026-06-23, prior to commit `1f25185`

| Element | Before |
|---|---|
| Page title | "The AI Readyist — Because being AI-ready is harder than being AI-excited." |
| Meta description | "The AI Readyist helps enterprise leaders get AI right — before the cost, the risk, and the culture catch up with them." |
| Hero H1 | "The enterprises winning with AI are not moving faster. They are acting with greater certainty." |
| Hero subtext | "theAIReadyist is the intelligence layer for leaders who need to make consequential AI decisions — not consume more AI content." |
| Hero CTA | "READ THIS EDITION →" (linking to `https://cspanswick.substack.com`) |
| Pillar section label | "Intelligence Pillars" |
| Pillar 01 | AI Cost Intelligence |
| Pillar 02 | Governance, Trust & Risk |
| Pillar 03 | Human & Culture Layer |
| Pillar 04 | AI-Native Operating Model |
| Pillar 05 | PoC Purgatory |

---

## Changes Made

**Commit:** `1f25185` — `feat(homepage): realign to Decision Intelligence / Decision Performance positioning`  
**File changed:** `index.html` (root of repo)  
**Method:** CodeMirror 6 editor API via JavaScript injection; committed directly to `main`

### 1. Page title
```
Before: The AI Readyist — Because being AI-ready is harder than being AI-excited.
After:  The AI Readyist — Decision Intelligence for Enterprise Leaders
```

### 2. Meta description
```
Before: The AI Readyist helps enterprise leaders get AI right — before the cost, the risk, 
        and the culture catch up with them.
After:  The AI Readyist is the Decision Intelligence platform for enterprise leaders — 
        improving decision quality, velocity and accountability in an AI-native world.
```

### 3. Hero H1 — Decision Performance core belief
```
Before: The enterprises winning with AI are not moving faster. They are acting with 
        greater certainty.
After:  Most organisations don't have an AI problem. They have a Decision Performance 
        problem. AI simply exposes it.
```

### 4. Hero subtext — Decision Intelligence platform framing
```
Before: theAIReadyist is the intelligence layer for leaders who need to make 
        consequential AI decisions — not consume more AI content.
After:  The AI Readyist is the Decision Intelligence platform that helps enterprise 
        leaders improve decision quality, velocity, and accountability — at the speed 
        AI demands.
```

### 5. Hero CTA — DPI above the fold
```
Before: <a class="hero-cta" href="https://cspanswick.substack.com" target="_blank">
          Read this edition
        </a>
After:  <a class="hero-cta" href="/dpi.html">
          Take the Decision Performance Index
        </a>
```
DPI was already live in the Readiness Instruments section further down the page. This change promotes it to the primary above-fold action.

### 6. Pillar section label
```
Before: Intelligence Pillars
After:  The Six Pillars of AI Readiness
```

### 7. Pillar index — 5 old pillars → 6 new pillars

Old block (3,647 chars, 5 pillars) replaced with:

| # | Pillar | Description | Assessment CTA |
|---|---|---|---|
| 01 | Executive Operating Models | How organisations redesign operating models to improve decision velocity in an AI-native world. | — |
| 02 | Decision Intelligence | How organisations improve decision quality through data, context, governance and AI. | Take the Decision Performance Index → `/dpi.html` |
| 03 | Agentic Governance | How organisations govern AI authority, accountability and autonomous decision-making. | EU AI Act Readiness → `/eu-ai-act.html` |
| 04 | AI Economics | How organisations measure the value, cost and return of AI-enabled decisions. | — |
| 05 | Human Agency | How leaders preserve judgement, accountability and capability in AI-enabled organisations. | — |
| 06 | Sovereign AI | How organisations maintain resilient and trusted decision systems across regulatory and geopolitical boundaries. | DORA Readiness Assessment → `/dora.html` |

---

## After State

**Verified live:** 2026-06-23 at https://www.theaireadyist.com

All 7 changes confirmed in production:
- Page title tab shows "The AI Readyist — Decision Intelligence for Enterprise Leaders" ✅
- Meta description updated ✅
- Hero H1 is Decision Performance core belief ✅
- Hero subtext is DI platform framing ✅
- Hero CTA is "TAKE THE DECISION PERFORMANCE INDEX →" linking to `/dpi.html` ✅
- Pillar section reads "THE SIX PILLARS OF AI READINESS" ✅
- All 6 new pillar rows render with correct titles, descriptions, and assessment CTAs ✅

---

## Task 3 — Legacy Pillar Reclassification

The old five-pillar model has been retired. No content or pages were deleted. The mapping from old to new is documented in `CHANGELOG.md` and `docs/pillar-taxonomy-v1.md`.

| Old Pillar | Status | Maps to New Pillar(s) |
|---|---|---|
| AI Cost Intelligence | Retired from homepage | AI Economics (04) |
| Governance, Trust & Risk | Retired from homepage | Agentic Governance (03) |
| Human & Culture Layer | Retired from homepage | Human Agency (05) |
| AI-Native Operating Model | Retired from homepage | Executive Operating Models (01) |
| PoC Purgatory | Retired from homepage | Executive Operating Models (01) + AI Economics (04) |

**Pages still carrying old pillar references (follow-on work):**

The Function Lenses section (CFO / CHRO / CIO / CTO / Board tabs) contains a JavaScript data object that maps old pillar names to function-specific priorities. These are NOT in the `pillar-index` block — they are in a separate JS object within `index.html`. These were intentionally not modified in this sprint to avoid touching complex interactive JavaScript without full testing. They are the primary outstanding item.

---

## Task 5 — Information Architecture Review

Recommendations only — no implementation. URLs must not change without separate approval.

### Navigation (current state)
`INTELLIGENCE · READINESS · FUNCTION LENSES · TOOLS · SUBSCRIBE`

### Recommended changes

**1. Rename "INTELLIGENCE" → "INTELLIGENCE BRIEFING"**  
The current label is ambiguous — "Intelligence" is now a strategic term in the platform's vocabulary (Decision Intelligence, Intelligence Platform). "Intelligence Briefing" is clearer and matches the in-page label already used.

**2. Rename "READINESS" → "ASSESSMENTS"**  
"Readiness" is output language (what you achieve), not navigation language (what you find there). "Assessments" describes the tools available. The DPI, EOMI, DII, and other instruments live here — visitors should know immediately what they'll find.

**3. Add "METHODOLOGY" as a top-level nav item**  
The Decision Performance Framework, six-pillar taxonomy, and DP dimensions are now a significant part of the platform's value proposition. A methodology section (even if it links to `/methodology` or the flagship methodology PDF) signals intellectual rigour and gives enterprise buyers something to evaluate.

**4. Consider "PILLARS" as a nav entry or drop-down under INTELLIGENCE**  
With six distinct pillars, each acting as an editorial category, pillar navigation could increase content discoverability significantly — especially as the library grows beyond Agentic Governance into the other five pillars.

**No implementation in this sprint.** These require design review, URL planning, and Vercel routing changes.

---

## Methodology Impact Report — Human Agency Rename

**Change:** Pillar 5 renamed from "Human + AI Workforce" to "Human Agency"  
**Date:** 2026-06-22  
**Rationale:** The name "Human + AI Workforce" describes a collaboration model. "Human Agency" makes the strategic focus explicit: preserving human judgement, accountability, and capability as AI takes on a larger role in decision-making.

### Files updated

| File | Change |
|---|---|
| `docs/methodology/07-pillar-definitions.md` | Pillar 5 section fully rewritten. New definition, key questions, constraints table. Version bumped to v1.1. |
| `docs/methodology/04-assessment-architecture.md` | HAWR renamed (Human Agency Readiness). Purpose and outputs rewritten to agency framing. |
| `docs/methodology/02-decision-performance-framework.md` | All references updated. |
| `docs/methodology/03-decision-performance-index.md` | All references updated. |
| `docs/methodology/00-strategy-overview.md` | Table row and ASCII diagram updated. |
| `docs/methodology/01-decision-intelligence.md` | Pillar 5 description updated. |
| `docs/methodology/06-executive-signals.md` | Workforce signal type updated. |
| `docs/methodology/methodology-review-v1.md` | All references updated. |
| `dpi-mvp-deliverables/dpi.html` | Dimension 4 (Capability): purpose, pillar label, questions, meaning, nextStep updated. |
| `migration_build3.sql` | CHECK constraint updated to 'Human Agency'. Migration note added. |
| `admin/blog-research/index.html` | Pillar 5 card: name, hint, topics updated. |
| `docs/pillar-taxonomy-v1.md` | Pillar 5 section rewritten. Historical note added. |
| `docs/six-pillar-taxonomy-review.md` | Table row updated. |
| `CHANGELOG.md` | Full rename changelog entry with rationale, DB migration SQL, and change table. |

### DB migration note

If `migration_build3.sql` was already run in Supabase with the old CHECK constraint (enforcing `'Human + AI Workforce'`), run the following before inserting any insights with `pillar = 'Human Agency'`:

```sql
ALTER TABLE insights DROP CONSTRAINT IF EXISTS insights_pillar_check;
ALTER TABLE insights ADD CONSTRAINT insights_pillar_check CHECK (
  pillar IS NULL OR pillar IN (
    'Executive Operating Models', 'Decision Intelligence',
    'Agentic Governance', 'AI Economics',
    'Human Agency', 'Sovereign AI'
  )
);
```

---

## Outstanding Issues / Follow-on Work

| Item | Priority | Notes |
|---|---|---|
| Function Lenses "Priority Pillars" JS data | High | CFO/CHRO/CIO/CTO/Board tabs still show old 5 pillar names. Requires editing the `LENSES_DATA` or equivalent JS object in `index.html`. |
| AI Readiness Score widget dimension labels | Medium | Labels (AI Cost Governance, Governance & Trust, Human & Culture Readiness, etc.) map to old pillar model. Scoring logic intentionally not touched. Labels need updating to align with new pillar vocabulary. Separate change — do not touch without reviewing score calculation. |
| Push workspace methodology docs to GitHub | High | All 8 docs in `docs/methodology/` are updated locally but not yet committed to the GitHub repo. Need to either: (a) push from Terminal using git, or (b) edit each file via GitHub web editor. |
| `dpi.html` in GitHub root | Medium | The GitHub repo's root `dpi.html` (the deployed version) was not updated — only the local workspace copy `dpi-mvp-deliverables/dpi.html` was updated with Human Agency changes. These need to be synced. |
| Navigation recommendations | Low | Implement Task 5 IA recommendations when ready. Requires design review and URL planning. |
| `data-pillar` attributes on public pages | Low | Per `docs/pillar-taxonomy-v1.md`, existing tool pages (`/eu-ai-act.html`, `/dora.html`, `/nis2.html`, etc.) should carry `data-pillar` HTML attributes. Pure metadata change, no visual impact. |

---

## Constraints Observed

All sprint constraints were respected:

- ✅ No redesign — existing visual system, typography, and components unchanged
- ✅ No new visual systems introduced
- ✅ DPI scoring not modified
- ✅ No new assessments created
- ✅ No existing content removed
- ✅ No URLs changed
- ✅ Methodology definitions used exactly — no invented alternatives
- ✅ Focus on positioning, narrative, pillar structure, and platform alignment
