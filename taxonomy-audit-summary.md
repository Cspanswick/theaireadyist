# Taxonomy Audit Summary — The AI Readyist
**Date:** 2026-06-22  
**Scope:** Full repository audit — `Cspanswick/theaireadyist` (main branch)  
**Constraint:** Analysis and reporting only. No code modified, no files renamed, no PRs raised.

---

## Totals

| Metric | Count |
|---|---|
| Total files in repository | 38 |
| Public-facing content assets (articles, references) | 3 |
| Public-facing tools (assessments, radar, navigator) | 5 |
| Admin / internal pages | 5 |
| Agent research drafts (all statuses) | 9 |
| Unique research draft topics | 2 |
| Infrastructure files (scripts, config, SQL, CSS, yml) | 16 |
| **Total distinct named categories in markup** | **0** |
| **Total pillar definitions (admin prompt builder only)** | **5** |
| **Pillar definitions present in public markup** | **0** |

---

## Defined Pillars

The five editorial pillars are defined only in `admin/blog-research/index.html`. They do not appear as structured metadata in any public page, the insights database schema, or the agent config.

| # | Pillar Name | Scope (from prompt builder) |
|---|---|---|
| 1 | AI Cost Intelligence | Agentic cost spirals, FinOps, CFO governance frameworks |
| 2 | PoC Purgatory | Why pilots succeed and production deployments fail |
| 3 | Governance, Trust & Risk | TRiSM, accountability, audit trails, regulatory compliance |
| 4 | The Human & Culture Layer | Adoption, automation anxiety, leadership behaviours |
| 5 | AI-Native Operating Model | Redesigning work, compounding value, workforce design |

**Coverage gap:** Every public content asset maps to Pillar 3 (Governance / Trust & Risk). Pillars 1, 2, 4, and 5 have zero published or drafted assets assigned to them.

---

## Current Categories

**Formal taxonomy: none.** No `data-category`, `data-pillar`, `data-tag`, or equivalent structured attributes appear in any HTML file. The only structured metadata lives in agent output frontmatter (YAML), which uses `topic`, `sectors`, and `regions` — not pillars.

Sector labels used in agent config and draft frontmatter: BFSI, Energy, Retail, CMT, Technology, FMCG, Pharma  
Region labels: UK&Ireland, Europe, Africa

---

## Duplicate Categories

No formal category system exists, so there are no duplicate category names per se. However, the following structural duplicates exist:

| Issue | Files Involved |
|---|---|
| Two pages cover EU AI Act tier classification | `eu-ai-act-tiers.html` ("EU AI Act Navigator") and `eu-ai-act-reference.html` ("EU AI Act — Risk Tier Reference") |
| 8 agent draft outputs on identical topic | `agent/output/*_ai-governance-regulation-enterprise-accountability.md` (runs dated 2026-06-10 through 2026-06-15) |

---

## Inconsistent Naming

| Issue | Detail |
|---|---|
| Site name inconsistency | "theAIReadyist" (nav/logo), "The AI Readyist" (admin title, meta description), "theaireadyist" (page titles suffix) — three variants |
| Pillar 3 name variants | "Governance, Trust & Risk" (prompt builder) vs "AI Governance" (agent config topic) vs "Governance" (implied by page grouping) |
| Insights page title | `insights/index.html` title is just "Insights — The AI Readyist" — no category context |
| Insight detail page | Title is the generic placeholder "Insight — The AI Readyist" — rendered dynamically but no pillar or category context |
| `eu-ai-act-reference.html` vs `eu-ai-act-tiers.html` | Functionally similar pages, named differently, no clear canonical relationship |

---

## Orphaned Content

Assets that exist in the repository but have no path from the main navigation:

| Asset | Location | Issue |
|---|---|---|
| EU AI Act — Enforcement & Risk Reference | `/eu-ai-act-enforcement-risk.html` | Not in homepage nav; only reachable from cross-links on eu-ai-act-enforcement.html and eu-ai-act-tiers.html |
| EU AI Act — Risk Tier Reference | `/eu-ai-act-reference.html` | Not in homepage nav; only reachable from eu-ai-act-enforcement-risk.html |
| How the EU AI Act Will Actually Be Policed | `/eu-ai-act-enforcement.html` | Long-form article with 5 h2 sections — highest-value content asset — not linked from homepage or main nav |
| AI Governance Exposure Radar | `/radar.html` | Not in homepage nav; discoverable only if user knows the URL or reaches it via tool pages |
| DORA Assessment | `/dora.html` | Not in homepage nav; reachable via radar.html only |
| NIS2 Assessment | `/nis2.html` | Not in homepage nav; reachable via radar.html only |

---

## Assets Requiring Manual Review

| Asset | Priority | Reason |
|---|---|---|
| `eu-ai-act-tiers.html` vs `eu-ai-act-reference.html` | High | Potential duplication — determine canonical page, redirect or archive the other |
| `eu-ai-act-enforcement.html` | High | Only long-form editorial article; not linked from homepage — needs surfacing in nav or via insights |
| 8× `ai-governance` agent drafts | High | 7 are identical-topic duplicates from repeated test runs; decide which (if any) to promote to Approvals |
| `insights` DB schema | Medium | No `pillar` column — if pillar-based filtering is ever needed on the public insights page, schema needs updating |
| `agent/configs/default.json` | Medium | Only one agent config file; briefs for Pillars 1, 2, 4, 5 don't exist yet |
| Homepage section IDs | Low | `function-lenses`, `readiness`, `tools`, `intelligence`, `live-insights` are structural hooks but not exposed as filter/nav labels anywhere |
| All public HTML pages — meta descriptions | Low | Only `index.html` has a meta description; all tool/article pages are missing it |

---

## Summary of Structural Gaps

1. **No taxonomy layer on public pages.** There are no tags, categories, or pillar markers in any public HTML. The 5-pillar system exists only in the admin prompt builder and is invisible to readers and search engines.

2. **Pillar 3 monopoly.** 100% of current content (8/8 agent drafts + 4/4 EU AI Act pages + all tools) maps to Governance/Trust/Risk. The other four pillars are entirely unpopulated.

3. **Navigation dead-ends.** Three significant pages — `/eu-ai-act-enforcement.html`, `/eu-ai-act-reference.html`, `/eu-ai-act-enforcement-risk.html` — are unreachable from the homepage and absent from any primary navigation.

4. **No pillar field in the insights schema.** Even after content is published, there is no database column to store which pillar it belongs to, making pillar-based filtering impossible without a schema change.

5. **Agent config gap.** Only one agent config (BRIEF-002, Pillar 3 topic) exists. Generating content for Pillars 1, 2, 4, and 5 requires new brief configs.
