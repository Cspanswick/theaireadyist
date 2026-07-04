# Methodology Consistency Review — v1
**TheAIReadyist Methodology Workspace**  
**Review date:** 2026-06-22  
**Reviewer:** Independent audit (Claude, Cowork session)  
**Scope:** All eight methodology documents (00–07)  
**Classification:** Internal — not for public distribution

---

## Executive Summary

The methodology workspace establishes a coherent, distinctive intellectual architecture for TheAIReadyist platform. The strategic hierarchy (Decision Intelligence → Decision Systems → Decision Performance) is well-defined and the six-pillar model is consistently named and mapped across all documents. Pillar-to-dimension correspondence is airtight: every mapping table in every document is internally consistent.

The primary weaknesses are not contradictions — they are gaps in connecting tissue. The "Decision Systems" middle tier of the hierarchy is under-developed outside `00-strategy-overview.md`. The strategy overview incompletely enumerates the six Decision Performance dimensions, which weakens the top-level case. Secondary pillar impacts defined in `07-pillar-definitions.md` are absent from `02-decision-performance-framework.md`. And three of the eight documents are correctly labelled as pre-design placeholders — their thinness is appropriate now but creates a documentation debt that will matter as product build begins.

**Methodology Maturity Score: 72 / 100**

The foundation is strong. The gaps are fixable without redesign.

---

## Criterion 1 — Strategic Consistency

**Hierarchy under review:** Decision Intelligence → Decision Systems → Decision Performance

**Finding: CONSISTENT — with one gap**

The three-tier hierarchy is clearly defined in `00-strategy-overview.md` and coherently supported throughout. Decision Intelligence as both a pillar (Pillar 2) and the organising discipline of the whole platform is handled well: `01-decision-intelligence.md` devotes its final section to this explicitly, and the treatment is consistent with `07-pillar-definitions.md` (Pillar 2 definition) and `00` (role of the six pillars).

**Gap identified — "Decision Systems" as a formal concept:**

"Decision Systems" is defined meaningfully only in `00`:
> *"Decision Systems are the structures through which Decision Intelligence is applied — the operating models, governance frameworks, workforce designs, economics, and sovereignty postures that determine how decisions are made at scale."*

This definition does not appear in any subsequent document. Documents `02`, `03`, `04`, `07` use "decision system" and "decision systems" as common nouns (lowercase, informal) without reference to the formal three-tier hierarchy. The phrase "the six pillars ARE the Decision System" is implied but never stated outside `00`.

This matters because the strategic hierarchy is TheAIReadyist's most distinctive intellectual claim. If any of the working documents is shared in isolation — or if a new contributor reads only `07-pillar-definitions.md` — the connection to the three-tier hierarchy is invisible.

**Verdict: Pass with gap.** The hierarchy is coherent; the middle tier needs cross-referencing into `02` and `07` at minimum.

---

## Criterion 2 — Mission Consistency

**Mission statement:** *"Helping leaders build AI-ready organisations through better decisions."*

**Finding: CONSISTENT — minor language note**

The mission statement appears in `00-strategy-overview.md` and is implicitly reinforced throughout all documents. No document contradicts the mission or introduces a competing purpose statement.

**Minor language note:**

`00` states the mission as "better decisions." `01-decision-intelligence.md` uses the formulation:
> *"The organisations that will outperform in an AI-enabled economy are not those that deploy the most AI. They are those that make the **best** decisions with it."*

"Better" (comparative, continuous improvement) and "best" (superlative, competitive outcome) are not contradictions, but they carry different implications. "Better" is the more defensible editorial position — it is achievable and measurable. "Best" implies a competitive ranking that may be harder to operationalise. Recommend aligning on "better" throughout as the platform's consistent voice.

**Verdict: Pass.**

---

## Criterion 3 — Decision Performance Definition Consistency

**Definition under review:**
> *"Decision Performance is an organisation's ability to consistently make high-value decisions at the right speed, with appropriate accountability, supported by trusted intelligence and effective execution."*

**Finding: FULLY CONSISTENT**

This exact definition appears in `00-strategy-overview.md` and `02-decision-performance-framework.md`. No other document introduces an alternative wording. The definition is not paraphrased or abbreviated elsewhere in ways that would create ambiguity.

**Gap in `00-strategy-overview.md`:**

The strategy overview describes the platform as measuring "decision quality, decision velocity, decision accountability, and the organisational conditions that determine whether decisions produce value" — listing only three of the six dimensions by name. The six-dimension model (Quality, Velocity, Accountability, Capability, Value, Resilience) is fully defined in `02` but is not enumerated in `00`. For the flagship strategic document, this is an incomplete representation. A reader of `00` alone would not know the model has six dimensions.

**Verdict: Definition passes. Strategy overview coverage gap flagged as a recommended change.**

---

## Criterion 4 — Dimension Consistency

**Dimensions under review:** Quality / Velocity / Accountability / Capability / Value / Resilience

**Finding: FULLY CONSISTENT across all documents**

Every document that references Decision Performance dimensions uses the same six names in the same pillar mapping:

| Dimension | Primary Pillar | Named in 02 | Named in 04 | Named in 07 | Named in 06 |
|---|---|---|---|---|---|
| Decision Quality | Decision Intelligence (P2) | ✅ | ✅ (DII) | ✅ | ✅ |
| Decision Velocity | Executive Operating Models (P1) | ✅ | ✅ (EOMI) | ✅ | ✅ |
| Decision Accountability | Agentic Governance (P3) | ✅ | ✅ (AGS) | ✅ | ✅ |
| Decision Value | AI Economics (P4) | ✅ | ✅ (AEI) | ✅ | ✅ |
| Decision Capability | Human Agency (P5) | ✅ | ✅ (HAWR) | ✅ | ✅ |
| Decision Resilience | Sovereign AI (P6) | ✅ | ✅ (SAIR) | ✅ | ✅ |

No document introduces a seventh dimension, renames an existing one, or assigns a dimension to a different pillar.

**Gap — secondary impacts not reflected in `02`:**

`07-pillar-definitions.md` documents secondary dimension impacts for each pillar (e.g. Pillar 1 primarily affects Decision Velocity, secondarily affects Decision Accountability and Decision Quality). These secondary impacts are well-reasoned and add nuance. However, `02-decision-performance-framework.md` — the canonical DPF document — only presents the primary mapping table and does not acknowledge secondary impacts at all. The interaction effects section in `02` addresses dimension-to-dimension dynamics but not pillar-to-secondary-dimension relationships.

**Verdict: Pass. Secondary impacts gap flagged as a recommended change.**

---

## Criterion 5 — Pillar Mapping Validation

**Pillars under review:** Executive Operating Models / Decision Intelligence / Agentic Governance / AI Economics / Human Agency / Sovereign AI

**Finding: FULLY CONSISTENT**

Pillar names are identical across `00`, `01`, `02`, `03`, `04`, `06`, `07`, `CHANGELOG.md`, `docs/pillar-taxonomy-v1.md`, and `admin/blog-research/index.html`. No document uses an abbreviated, alternative, or legacy name.

The five cross-cutting lenses (Trust / Risk / Accountability / Resilience / Value) are consistently named across all documents that reference them. Lens-to-pillar assignments are consistent between `07-pillar-definitions.md` and `CHANGELOG.md`:

| Pillar | Lenses (07) | Lenses (CHANGELOG) | Match |
|---|---|---|---|
| Executive Operating Models | Value, Resilience | Value, Resilience | ✅ |
| Decision Intelligence | Trust, Accountability | Trust, Accountability | ✅ |
| Agentic Governance | Risk, Accountability, Trust | Risk, Accountability, Trust | ✅ |
| AI Economics | Value, Risk | Value, Risk | ✅ |
| Human Agency | Trust, Resilience, Value | Trust, Resilience, Value | ✅ |
| Sovereign AI | Risk, Resilience, Accountability | Risk, Resilience, Accountability | ✅ |

**One boundary clarity gap — AGS / SAIR overlap for DORA:**

`04-assessment-architecture.md` notes that AGS and SAIR are "closely related" and distinguishes them: AGS = internal governance design; SAIR = external regulatory and geopolitical exposure. However, the DORA regulatory framework addresses both internal operational resilience obligations (AGS territory) and external sovereignty/dependency risk (SAIR territory). The current asset mapping assigns DORA to Sovereign AI primary / Agentic Governance secondary — which is defensible — but the AGS/SAIR boundary as applied to DORA-type content is not explicitly resolved in either `04` or `07`. This will create classification ambiguity when producing content at the intersection of the two pillars.

**Verdict: Pass. AGS/SAIR boundary note flagged as a recommended change.**

---

## Criterion 6 — Assessment Architecture Validation

**Assessments under review:** DPI (L1) + EOMI, DII, AGS, AEI, HAWR, SAIR (L2)

**Finding: SOUND ARCHITECTURE — appropriate for pre-design status**

The two-level architecture (Level 1 flagship + Level 2 pillar-specific) is logically coherent. The DPI-as-entry-point-directing-to-pillar-assessments model is clearly articulated in both `03` and `04` and is consistent between them. Assessment IDs (DPI, EOMI, DII, AGS, AEI, HAWR, SAIR) are used consistently.

The build sequence proposed in `04` (DPI → AGS → AEI → EOMI → HAWR → DII → SAIR) is well-reasoned with explicit rationale per phase. No document contradicts this sequence.

**Gaps:**

1. **Respondent definition absent.** `03` raises "Who takes the DPI?" as an open question but neither document establishes a default position even at intent level. For architecture planning, a working assumption (e.g. "primary respondent: CEO or delegated senior leader") would allow assessment design to proceed without that question being fully resolved.

2. **Scoring model placeholder risk.** Five of the seven assessments (all except DPI placeholder) state "Design status: Not yet designed." This is accurate but means the assessment architecture document describes structure without any content. When design begins, `04` will need significant expansion — the current version is an index, not an architecture specification.

3. **Relationship diagram in `04` has a layout issue.** The ASCII diagram splits six pillar assessments into two rows of three but the connecting lines imply all six are equally subordinate to DPI. The AGS↔SAIR and EOMI↔DII cross-pillar relationships described in the prose are not visible in the diagram.

**Verdict: Pass for current pre-design phase. Gaps are appropriate deferred decisions, not errors.**

---

## Criterion 7 — Benchmark Architecture Validation

**Finding: ADEQUATE PLACEHOLDER — thinnest document in the workspace**

`05-benchmark-methodology.md` correctly identifies the four benchmark dimensions (Industry, Geography, Organisation Size, Trend Analysis) and their design rationale. The cold-start problem (empty dataset at launch) is honestly surfaced as the most critical open question.

**Gaps:**

1. **No data model.** The document describes benchmark outputs (percentile ranking, gap analysis, trend line, narrative context) but contains no discussion of how scores will be stored, versioned, or associated with benchmark cohorts. This is fine as a placeholder but means the benchmark section is conceptually thinner than the assessment section.

2. **Geography taxonomy tentative.** "United Kingdom & Ireland" as a single geography is potentially problematic post-Brexit given diverging AI regulatory frameworks between UK and EU/Ireland. This is flagged in the document but not resolved.

3. **"Research publication" opportunity not integrated with Signals.** `05` notes that an "annual State of Decision Performance report" is a brand-building opportunity (Question 5). `06` does not reference this as a planned output. These two capabilities would likely be developed together; the integration is implied but not stated.

**Verdict: Pass as placeholder. More design work needed before development begins than the assessment architecture section.**

---

## Criterion 8 — Executive Signals Validation

**Finding: WELL-STRUCTURED DESIGN INTENT — signal/insight naming requires resolution**

`06-executive-signals.md` presents a credible design framework: three-tier source hierarchy, four classification dimensions (Type, Urgency, DP Dimension, Confidence), impact model, and daily workflow. The classification system is coherent and maps cleanly to the six DP dimensions.

The source exclusion policy (no vendor marketing, no social media, no anonymous sources) is well-defined and consistent with the platform's editorial voice from `00`.

**Gaps:**

1. **Signal vs Insight naming conflict.** The platform's primary content units are called "Insights" (in the database, in the admin tool, in the agent output). The Signals capability introduces a different content type also called a "signal." `06` correctly identifies "where is the line between a Signal and an Insight?" as an open question but the current platform architecture does not distinguish them at the data model level. The `insights` table in Supabase will need a `content_type` field (or equivalent) before signals can be stored separately from editorial insights.

2. **Personalisation and assessment data.** `06` describes personalising signal delivery based on "the subscriber's assessment profile — sector, geography, organisation size, and identified primary constraint." This presupposes that the subscriber has taken an assessment and that the signal delivery system has access to the assessment result. That integration pathway is not described anywhere in the workspace. It is a future-state dependency that should be flagged explicitly.

3. **Editorial process minimum not defined.** The daily workflow diagram shows "CURATION (human editorial review)" as a distinct step. How many hours per day, by whom, and at what minimum viable process level — these are not addressed. For a solo founder publishing platform, this is a real operational constraint.

**Verdict: Pass. Signal/insight naming conflict is the most actionable near-term gap.**

---

## Strengths

**1. Air-tight pillar-to-dimension mapping.** Every document that references the six pillars maps them to the same six dimensions with zero inconsistency. This is a strong foundation for assessment design.

**2. Distinctive strategic positioning.** The Decision Intelligence → Decision Systems → Decision Performance hierarchy is coherent, original, and consistently applied. The shift from "AI maturity" to "Decision Performance" as the measurement frame is well-argued in `02` and implicit throughout.

**3. Canonical single source of truth.** `07-pillar-definitions.md` is clearly designated as the canonical reference with explicit governance rules (version increment, cross-reference update, changelog entry). This prevents definition drift across documents.

**4. Honest about what is not yet designed.** Three documents are explicitly labelled as pre-design placeholders (`03`, `05`, `06`) and use consistent status notation. Open questions are enumerated rather than glossed over. This is methodologically sound — it is better to have documented gaps than undocumented assumptions.

**5. Executive voice throughout.** All eight documents are written at the right level of abstraction for C-suite consumption. Design principles like "executive-legible outputs" and "short enough to complete, deep enough to matter" are lived by the documents themselves.

**6. Build sequence has explicit rationale.** The proposed assessment build sequence in `04` (DPI → AGS → AEI → EOMI → HAWR → DII → SAIR) is the right sequence for commercial reasons (regulatory demand) and platform reasons (DPI data feeds all others). The rationale is written down, which prevents future revisionism.

---

## Weaknesses

**1. "Decision Systems" middle tier is under-connected.** The formal definition of Decision Systems as the six pillars in aggregate only appears in `00`. Documents `02`, `03`, `04`, `07` use "decision system" informally without anchoring to the three-tier hierarchy. A reader of any document other than `00` cannot reconstruct the full strategic model.

**2. Strategy overview (00) incompletely names the six dimensions.** The primary strategic document names three DP dimensions but not all six. This is the first document a new contributor or investor will read. It should fully represent the six-dimension model.

**3. Secondary pillar impacts exist in `07` but not in `02`.** The DPF (`02`) is the canonical source for dimensions. Secondary impacts belong there, not only in pillar definitions.

**4. AGS/SAIR boundary is unresolved for dual-framework content.** Regulatory frameworks like DORA sit at the intersection of governance (AGS) and sovereignty (SAIR). The classification principle for dual-framework content is not established.

**5. Signal/Insight naming overlap at the data model level.** The `insights` table stores what will eventually be two distinct content types. This needs a structural decision before the Signals capability can be built.

**6. Benchmark section is thin relative to the rest.** The benchmark methodology is the least developed section. For a platform whose commercial value proposition includes benchmarking, this is the highest-risk gap as the build sequence progresses.

---

## Recommended Changes

### Critical — address before product design begins

**C1. Add six DP dimensions to `00-strategy-overview.md`**  
The strategy overview should name all six Decision Performance dimensions, not three. Add a brief table or summary in the "Primary Outcome" section. This is a two-paragraph addition.  
*Files:* `00-strategy-overview.md`

**C2. Define "Decision Systems" cross-referencing in working documents**  
Add a single paragraph to `02-decision-performance-framework.md` and `07-pillar-definitions.md` anchoring the six pillars to the formal "Decision Systems" concept defined in `00`. A cross-reference sentence is sufficient: *"The six pillars collectively constitute the organisation's Decision System — see `00-strategy-overview.md` for the full strategic hierarchy."*  
*Files:* `02-decision-performance-framework.md`, `07-pillar-definitions.md`

**C3. Add secondary pillar impacts to `02-decision-performance-framework.md`**  
`07` documents secondary dimension impacts per pillar. These should be summarised in the DPF as a supplementary table or as addenda to each dimension definition. Without this, `02` presents a simpler model than the one `07` has defined.  
*Files:* `02-decision-performance-framework.md`

**C4. Resolve Signal vs Insight naming at the data model level**  
Before the Signals capability can be built, a decision is needed: does a Signal become a new `content_type` value in the `insights` table, or does it go into a separate `signals` table? Document the decision in `06-executive-signals.md` and raise a migration task.  
*Files:* `06-executive-signals.md`, future `migration_build4.sql`

---

### Important — address in the next methodology iteration

**I1. Resolve AGS/SAIR boundary for dual-framework content**  
Add a classification principle to `04-assessment-architecture.md` for content at the AGS/SAIR intersection. Proposed principle: *"Primary pillar is determined by the dominant question — internal accountability design (AGS) vs. external regulatory/geopolitical exposure (SAIR). Content about DORA operational resilience obligations defaults to SAIR primary / AGS secondary unless the specific angle is internal control design."*  
*Files:* `04-assessment-architecture.md`

**I2. Add working assumption for DPI respondent**  
`03` lists "Who takes the DPI?" as an open question. Add a working assumption — even a provisional one — so assessment design can proceed. Recommended: *"Working assumption: Primary respondent is CEO or delegated C-suite member. Multi-respondent aggregation model to be designed."*  
*Files:* `03-decision-performance-index.md`

**I3. Cross-reference benchmark/Signals research publication opportunity**  
`05` identifies an "annual State of Decision Performance report" as a brand-building opportunity. `06` should reference this as the intended annual synthesis of the signals corpus. Add a paragraph to `06` linking the two.  
*Files:* `06-executive-signals.md`

**I4. Align "better" vs "best" language**  
Replace "make the best decisions" in `01-decision-intelligence.md` with language consistent with the mission ("better decisions"). Recommended: *"The organisations that will outperform are not those that deploy the most AI — they are those that consistently make better decisions with it."*  
*Files:* `01-decision-intelligence.md`

---

### Optional — for completeness, not blocking

**O1. Add secondary-impact awareness to `07` constraint tables**  
The constraint tables in `07` are excellent but focus only on the primary dimension. A brief note per pillar indicating which secondary dimensions are most at risk from each constraint would add depth.  
*Files:* `07-pillar-definitions.md`

**O2. Fix the `04` relationship diagram**  
The ASCII diagram in `04-assessment-architecture.md` doesn't show AGS↔SAIR or EOMI↔DII cross-relationships described in the prose. A revised diagram showing these lateral connections would help the document self-explain.  
*Files:* `04-assessment-architecture.md`

**O3. Add a minimum viable editorial process note to `06`**  
The daily signals workflow assumes editorial review. Add a minimum viable editorial process description — even if it's "one person, 60 minutes/day, using the following criteria" — so the capability is operationally grounded, not just architecturally elegant.  
*Files:* `06-executive-signals.md`

---

## Methodology Maturity Score

**72 / 100**

| Area | Score | Notes |
|---|---|---|
| Strategic hierarchy clarity | 80 | Well-defined in 00; under-connected in working docs |
| Mission consistency | 90 | Consistent; minor "better/best" language note |
| Decision Performance definition | 95 | Exact definition match across all docs |
| Dimension consistency | 90 | 100% consistent; 00 underrepresents the six dimensions |
| Pillar mapping | 90 | Air-tight; AGS/SAIR boundary unresolved |
| Assessment architecture | 75 | Sound structure; appropriate placeholder depth |
| Benchmark methodology | 60 | Thinnest section; cold-start unresolved |
| Executive Signals | 70 | Good design intent; signal/insight naming gap |
| **Composite** | **72** | Strong foundation; fixable gaps |

**Score interpretation:**
- 90–100: Production-ready methodology, minor refinements only
- 75–89: Solid foundation with known gaps, ready for assessment design phase
- 60–74: Coherent but incomplete; requires specific fixes before product build begins
- Below 60: Structural redesign needed

A score of 72 means the methodology is coherent and distinctive but has specific gaps that, if unaddressed, will create friction when product design begins. All Critical and Important changes are resolvable within the existing document structure — none require redesign.

---

## Review Scope and Limitations

This review assessed internal consistency across the eight methodology documents and the supporting taxonomy files (`pillar-taxonomy-v1.md`, `CHANGELOG.md`). It did not assess:

- Market validity of the Decision Performance framework vs competing frameworks
- Commercial viability of the assessment architecture or build sequence
- Technical feasibility of the benchmark or signals infrastructure
- Regulatory accuracy of the Sovereign AI or Agentic Governance content

Those assessments would require external validation outside the scope of a consistency audit.

---

*Review completed: 2026-06-22. Next review recommended: when Critical changes above are complete, or before assessment design phase begins — whichever comes first.*
