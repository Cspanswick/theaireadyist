# Decision Performance Index (DPI) — MVP Status Report

**For:** Design team
**From:** Build / engineering
**Date:** 2026-06-22
**Status:** Built, deployed to preview, validated end-to-end. Awaiting review + merge. Not yet live on production.

---

## 1. What this is

The Decision Performance Index is the platform's **flagship diagnostic instrument**. It does **not** measure AI maturity. It identifies the single organisational constraint most limiting an organisation's *Decision Performance*, across six dimensions, and returns a constraint-led executive report.

It is the Level 1 / composite assessment that sits above the six planned pillar assessments. Target audience: CEO, COO, CIO, CTO, CFO and senior transformation leaders. Target completion time: **5–7 minutes** (18 statements).

Live preview (this branch): `https://ai-readyist-git-feature-de-1107cc-spanswickclive-6538s-projects.vercel.app/dpi`
Pull request: `https://github.com/Cspanswick/theaireadyist/pull/1`

---

## 2. The instrument at a glance

**Six dimensions, three statements each (18 total), 1–5 agreement scale.**

| # | Dimension | Maps to pillar (recommended focus area) |
|---|---|---|
| 1 | Decision Quality | Decision Intelligence |
| 2 | Decision Velocity | Executive Operating Models |
| 3 | Decision Accountability | Agentic Governance |
| 4 | Decision Capability | Human + AI Workforce |
| 5 | Decision Value | AI Economics |
| 6 | Decision Resilience | Sovereign AI |

**Scale:** 1 Strongly Disagree · 2 Disagree · 3 Neutral · 4 Agree · 5 Strongly Agree.

**Scoring (per methodology):** each dimension scores 0–100 as `((sum of its 3 answers − 3) / 12) × 100`; the overall DPI is the mean of the six. Bands: 0–39 Reactive · 40–59 Developing · 60–79 Performing · 80–100 Adaptive. The **lowest-scoring dimension is the primary constraint**, the second-lowest is secondary.

---

## 3. Design language used

The page reuses the existing site system exactly — no new patterns introduced.

- **Palette:** navy `#0D1B2A`, teal `#00C9A7`, amber `#E8A838`, red `#d95f5f`, off-white `#F0F4F8`.
- **Type:** Playfair Display (serif headings), DM Sans (body, weight 300), DM Mono (labels/meta, uppercase, letter-spaced).
- **Chrome:** same sticky nav (`the<span>AI</span>Readyist` + "All Tools") and footer as the existing assessments (`/eu-ai-act`, `/dora`, etc.).
- **Components:** teal-bordered cards, thin progress rails, mono section labels — all consistent with the current instrument pages.
- **Colour semantics on results:** teal = strong (60+), amber = developing (40–59), red = constrained (<40), green = adaptive (80+).

---

## 4. UX flow

**Assessment view**
- Editorial hero: "What is constraining your organisation's *Decision Performance*?" with a short framing paragraph and meta strip (time, audience, "no personal data collected").
- Sticky progress rail showing `X / 18 rated` + a fill bar and the scale legend.
- Six dimension sections, each with number, title, one-line purpose, and a "Mapped pillar" tag, followed by three statements. Each statement uses a 5-cell Likert selector (1–5 with anchor labels).
- Answers are **saved only on submission** (no live score creeping as you go — a deliberate, calmer experience for executives). The "Generate Decision Performance Report" button stays disabled until all 18 are rated.

**Report view (replaces the assessment in place)**
- Score hero: large 0–100 score + performance band + band description.
- Two constraint cards: **Primary Constraint** (amber-accented, with recommended focus pillar and dimension score) and **Secondary Constraint**.
- "What this means" — a constraint-specific executive narrative.
- "Recommended next step" — a constraint-specific action pointing at the mapped pillar.
- Dimension breakdown — all six scored 0–100 with bars; primary/secondary flagged.
- Actions: Print / Save as PDF (print-optimised stylesheet) and Retake.

**Responsive:** verified at 380px width with no horizontal overflow; single-column breakpoints at 760px and 620px; legend hides on narrow screens.

---

## 5. Validation (done)

All passed on the preview deployment:

- Page loads; 18 statements render; progress works 0→18.
- Completes end-to-end; report renders correctly.
- Scoring correct (a deliberate test set produced 62.5 → displayed 63, Performing).
- Primary = lowest dimension; secondary = second-lowest (verified live: Decision Accountability → Agentic Governance; Decision Velocity → Executive Operating Models).
- Results store anonymously to Supabase (`dpi_results`), benchmark-ready; no personal data collected.
- Mobile layout clean; homepage features a single "Decision Performance Index" card linking to `/dpi`.

---

## 6. What's pending (not design-blocking)

- **Merge to production** — PR #1 is open and ready; engineering/owner decision.
- **Rate-limiting on the submit endpoint** before public launch (currently open/unauthenticated).
- **Optional demographics step** (industry / org size / geography) to seed benchmark cohorts — the data model already supports it.
- **Benchmark comparison** ("vs. peer cohort") in the report, once enough data exists.

---

## 7. Design questions for the team

These are open and would benefit from design input before or shortly after launch:

1. **Demographics step** — if we add industry/size/geography, where does it sit (a pre-assessment screen, or a light step before "Generate report")? Keep it optional and non-identifying.
2. **Benchmark presentation** — how should "your score vs. peers" appear in the report without cluttering the constraint-led message (which is the core value)?
3. **Single vs. multi-respondent** — MVP assumes one respondent. If a leadership team takes it together, how do we present aggregated/divergent views?
4. **Shareable/exportable report** — currently print-to-PDF only and "Retake" clears state. Do we want a shareable result link?
5. **Homepage treatment** — DPI is currently a second featured block above the existing EU AI Act feature. Should DPI become the *sole* flagship feature, with the regulatory tools demoted to the grid?

---

## 8. Reference

- Methodology source of truth: `docs/methodology/` (00 strategy, 02 framework, 03 DPI spec, 07 pillar definitions).
- Build detail: `docs/builds/dpi-mvp-build-notes.md` (architecture, data model, scoring, benchmark hooks, open issues).
- Files in the PR: `dpi.html`, `api/dpi-submit.js`, `migration_build4.sql`, `index.html` (featured card), build notes.
