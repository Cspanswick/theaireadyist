# Pillar Taxonomy v1 — The AI Readyist

**Version:** 1.0  
**Date:** 2026-06-22  
**Branch:** `feature/six-pillar-taxonomy`  
**Status:** Active — replaces the five-pillar model

---

## Overview

The AI Readyist organises its editorial content around six thematic pillars. Each pillar represents a distinct challenge domain that senior enterprise leaders face when deploying AI at scale. Pillars are not sequential stages — they are lenses through which any AI readiness question can be examined.

Content may carry a primary pillar (`data-pillar`) and optionally a secondary pillar (`data-secondary-pillar`). Cross-cutting lenses (`data-lenses`) describe the risk, value, or accountability dimensions that apply regardless of pillar.

---

## The Six Pillars

### Pillar 1 — Executive Operating Models

**Scope:** How enterprise leadership structures, decision rights, and operating models must change when AI is a core organisational capability — not a productivity tool bolted onto existing processes.

**Primary lenses:** Value, Resilience

**Characteristic questions:**
- What does it mean to run an AI-native enterprise?
- How should decision rights and accountability structures change?
- Why does AI strategy live in IT while value impact lands in Finance and Operations?
- What is the AI maturity model from the board down?

**Existing asset mapping:**
- AI Maturity Map → **Pillar 1 (primary)**

---

### Pillar 2 — Decision Intelligence

**Scope:** Designing systems where humans and AI make better decisions together — covering decision quality, speed, bias, explainability, and accountability of AI-assisted choices.

**Primary lenses:** Trust, Accountability

**Characteristic questions:**
- When is human-in-the-loop a real safeguard versus a governance checkbox?
- How do you measure the quality of AI-assisted decisions, not just their speed?
- Who is accountable when an AI-assisted decision causes harm?
- What does explainability actually require at enterprise scale?

**Existing asset mapping:**
- No existing assets assigned. This is a new pillar.

---

### Pillar 3 — Agentic Governance

**Scope:** The governance frameworks, audit trails, and accountability structures that enterprise AI — especially autonomous agents — require to operate safely at scale. Includes regulatory compliance dimensions (EU AI Act, sector-specific mandates).

**Primary lenses:** Risk, Accountability, Trust

**Characteristic questions:**
- What makes agentic AI governance different from software governance?
- What will regulators look for in audit trails?
- Who owns accountability when an agent makes an autonomous decision?
- How are enterprises building governance before agents fail?

**Existing asset mapping:**
- EU AI Act Readiness Assessment → **Pillar 3 (primary)**
- AI Governance Exposure Radar → **Pillar 3 (primary)**
- EU AI Act Enforcement article → **Pillar 3 (primary)**
- EU AI Act Risk Reference → **Pillar 3 (primary)**
- EU AI Act Navigator (eu-ai-act-tiers.html) → **Pillar 3 (primary)**
- EU AI Act Enforcement & Risk Reference → **Pillar 3 (primary)**
- Agent research drafts: `ai-governance-regulation-enterprise-accountability.*` → **Pillar 3 (primary)**

---

### Pillar 4 — AI Economics

**Scope:** The financial discipline behind AI investment — FinOps for AI, cost governance, ROI rigour, value attribution, and the gap between AI spend and demonstrable business value.

**Primary lenses:** Value, Risk

**Characteristic questions:**
- How do agentic workflows multiply inference costs beyond the original budget?
- What does a credible AI ROI framework look like before the budget is committed?
- How does AI FinOps differ from cloud FinOps?
- What does value attribution look like across AI-assisted processes?

**Existing asset mapping:**
- Vendor AI Scorecard → **Pillar 4 (primary)**, if present in site assets

---

### Pillar 5 — Human Agency

**Scope:** How organisations preserve and develop human judgement, accountability, and agency as AI takes on a greater role in decision-making — covering role design, adoption, capability development, accountability structures, and the cultural conditions that determine whether humans remain genuinely responsible decision-makers.

**Primary lenses:** Trust, Resilience, Value

**Characteristic questions:**
- Are leaders exercising genuine judgement in AI-augmented decisions, or deferring to AI outputs without meaningful scrutiny?
- How do you redesign roles to preserve meaningful human accountability alongside AI?
- What leadership behaviours build genuine human agency versus those that create AI dependency?
- How do you develop the judgement to know when to trust AI and when to override it?

**Existing asset mapping:**
- No existing assets assigned. Previously mapped loosely to "The Human & Culture Layer" (old Pillar 4).
- Previously named "Human Agency" (renamed 2026-06-22 to sharpen focus on agency and judgement).

---

### Pillar 6 — Sovereign AI

**Scope:** National AI strategies, regulatory sovereignty, geopolitical AI risk, and critical infrastructure obligations that enterprises must navigate — including DORA, NIS2, data residency requirements, and technology dependency risk.

**Primary lenses:** Risk, Resilience, Accountability

**Characteristic questions:**
- What does "sovereign AI" actually mean for enterprise compliance?
- How are European firms responding to DORA and NIS2 AI obligations?
- What are the supply chain and data residency risks for multinationals?
- How do enterprises manage diverging national regulatory frameworks?

**Existing asset mapping:**
- DORA Assessment → **Pillar 6 (primary)**
- NIS2 Readiness Lens → **Pillar 6 (primary)**

---

## Cross-Cutting Lenses

Lenses are not pillars — they are analytical frames that can apply across multiple pillars. Every piece of content should carry one or more lens tags.

| Lens | Description |
|---|---|
| **Trust** | Does the AI system, decision, or process deserve and maintain the trust of the humans affected by it? |
| **Risk** | What can go wrong, how likely is it, and what is the enterprise's exposure? |
| **Accountability** | Who is responsible when something goes wrong — and is that accountability structure clear before the failure? |
| **Resilience** | Can the organisation absorb, adapt to, and recover from AI-related disruption? |
| **Value** | Is the AI investment generating demonstrable, attributable business value? |

---

## Structured Metadata

All public-facing content should carry the following HTML data attributes where practical:

```html
<!-- Primary pillar (required for new content) -->
data-pillar="Agentic Governance"

<!-- Secondary pillar (optional, for cross-pillar content) -->
data-secondary-pillar="Sovereign AI"

<!-- Cross-cutting lenses (comma-separated, one or more) -->
data-lenses="Risk,Accountability,Trust"
```

### Database schema (Supabase `insights` table)

- `pillar` — `text`, nullable (null for legacy pre-taxonomy content)
- `secondary_pillar` — `text`, nullable
- `lenses` — `jsonb` array, defaults to `[]`

See `migration_build3.sql` for the ALTER TABLE statements.

---

## Asset Mapping — Old to New

| Old Pillar (five-pillar model) | New Pillar(s) |
|---|---|
| AI Cost Intelligence | AI Economics (Pillar 4) |
| PoC Purgatory | Executive Operating Models (Pillar 1) + AI Economics (Pillar 4) |
| Governance, Trust & Risk | Agentic Governance (Pillar 3) |
| The Human & Culture Layer | Human Agency (Pillar 5) |
| AI-Native Operating Model | Executive Operating Models (Pillar 1) |

| Existing Site Asset | New Primary Pillar | New Secondary Pillar |
|---|---|---|
| EU AI Act Readiness Assessment | Agentic Governance | — |
| DORA Assessment | Sovereign AI | Agentic Governance |
| NIS2 Readiness Lens | Sovereign AI | Agentic Governance |
| AI Governance Exposure Radar | Agentic Governance | — |
| EU AI Act Enforcement article | Agentic Governance | — |
| EU AI Act Risk Reference | Agentic Governance | — |
| EU AI Act Navigator | Agentic Governance | — |
| EU AI Act Enforcement & Risk Reference | Agentic Governance | — |
| Vendor AI Scorecard | AI Economics | — |
| AI Maturity Map | Executive Operating Models | — |

---

## Implementation Checklist

### Done in `feature/six-pillar-taxonomy`

- [x] `admin/blog-research/index.html` — six-pillar cards, JS `PILLARS` object, lens chips
- [x] `agent/run-agent.js` — `pillar` and `lenses` written to YAML frontmatter and Supabase row
- [x] `migration_build3.sql` — `pillar`, `secondary_pillar`, `lenses` columns added to `insights`
- [x] `docs/pillar-taxonomy-v1.md` — this file
- [x] `CHANGELOG.md` — taxonomy change documented

### Pending (requires access to live site repo or Vercel deploy)

- [ ] `index.html` — homepage pillar cards updated to six pillars with `data-pillar` attributes
- [ ] `eu-ai-act.html` — add `data-pillar="Agentic Governance"` to root element
- [ ] `dora.html` — add `data-pillar="Sovereign AI"` and `data-secondary-pillar="Agentic Governance"`
- [ ] `nis2.html` — add `data-pillar="Sovereign AI"` and `data-secondary-pillar="Agentic Governance"`
- [ ] `radar.html` — add `data-pillar="Agentic Governance"`
- [ ] `eu-ai-act-enforcement.html` — add `data-pillar="Agentic Governance"`
- [ ] `eu-ai-act-reference.html` — add `data-pillar="Agentic Governance"`
- [ ] `eu-ai-act-tiers.html` — add `data-pillar="Agentic Governance"`
- [ ] `eu-ai-act-enforcement-risk.html` — add `data-pillar="Agentic Governance"`
- [ ] Agent config files — add `pillar` and `lenses` fields to `agent/configs/default.json`

---

## Governance

- The canonical pillar list lives in `docs/pillar-taxonomy-v1.md` (this file).
- Any change to pillar names, definitions, or lenses requires a new versioned doc (`pillar-taxonomy-v2.md`) and a corresponding `migration_build{N}.sql` to update the DB constraint.
- Old pillar names must not be removed from the changelog — they belong in the history section of `CHANGELOG.md`.
