# Executive Signal Agent — Progress Report (v1 + v2)

**For:** Architecture & Design teams
**From:** Build (Cowork)
**Date:** 23 June 2026
**Branches:** `feature/executive-signal-agent-v1` (built — 4 commits: `f042d3c → 92271de → 213e0ea → 7e08164`) · `feature/executive-signal-agent-v2` (Work Package 11 design package — `240fed0`)
**Status:** v1 built and tested in mock mode, awaiting two credentialed deployment steps before first live run. v2 (Decision Performance alignment) delivered as a design/spec package, awaiting team sign-off before build. **Nothing auto-publishes.**

> See **§6 — Remaining work to complete the build** for the full outstanding roadmap.

---

## 1. What this is

A pillar-based executive signal engine — not a generic AI news scraper. Each day it pulls headline metadata from approved enterprise IT, MSP, telco, analyst and executive-leadership feeds, classifies every item against the six pillars, scores it for executive relevance (1–5), and queues the strongest items (4–5) for human approval. Approved items can then be published to the public site. The whole v1 is deliberately human-gated: the agent only ever creates `pending` rows.

It reuses the patterns already established by the Research News Agent and the insights approval flow, so it should feel familiar to anyone who has worked on those.

---

## 2. For the architect

### Pipeline

```
signal-sources.json ─► run-signal-agent.js
                          1. fetch + parse RSS/Atom (headline metadata only)
                          2. dedupe by URL (within-run + against stored rows)
                          3. Tier 1 — Haiku 4.5  : classify pillar + score 1–5 + keep/reject  (every item)
                          4. Tier 2 — Sonnet 4.6 : write signal fields                          (only score ≥ 4)
                          5. store rows in Supabase `executive_signals`
                                pending  (4–5, classified) ─► /admin/signals ─► /signals.html
                                rejected (everything else)  ─► audit + dedup memory
```

### Key technical decisions

- **Two-tier model.** A cheap Haiku pass triages everything; the more expensive Sonnet pass runs only on queue-worthy items. This is the main cost lever and keeps the daily run at roughly **$3–5/month** for 80–150 items/day. The agent uses **no web-search tool** (content comes from feeds), so there is no per-search charge.
- **Dependency-light.** The script uses Node 20's built-in `fetch` and a tolerant, hand-rolled RSS/Atom parser — no new runtime dependencies beyond the `@anthropic-ai/sdk` already used by the research agent. (If feed coverage later needs a hardened parser, `rss-parser` can be added behind one `npm install`.)
- **Ingestion constraints honoured by design.** RSS/Atom headline metadata only (title, URL, source, date, excerpt); never fetches paywalled article bodies; no browser automation; no access-control bypass; no personal data.
- **Idempotent, additive migration.** `migration_build5.sql` follows builds 1–4 conventions (`IF NOT EXISTS`, `DROP CONSTRAINT IF EXISTS`) and is independent of every other table.

### Data model — `executive_signals`

Single table. Notable fields: `source_*`, `original_title`, `signal_title`, `excerpt`, `primary_pillar`, `secondary_pillar`, `classification_confidence`, `classification_reason`, `executive_relevance_score`, `why_it_matters`, `decision_question`, `suggested_tags`, `approval_status`, `approved_by`, `rejected_reason`, `published_slug`, `raw_metadata`.

Constraints worth knowing:

- `primary_pillar` / `secondary_pillar` are constrained to the **same six canonical pillar names** as the `insights` table (build 3) — no divergence in taxonomy.
- `approval_status ∈ {pending, approved, rejected, published}`; score constrained 1–5.
- **Unique `source_url`** (deduplication) and **unique `published_slug` where published**.

### Security / governance

- **RLS:** the anon (publishable) key can read **only** `approval_status = 'published'`. Pending/approved/rejected rows are invisible to the public.
- All writes — agent inserts and every admin action — go through server endpoints using the Supabase **secret** key, guarded by the existing `x-admin-key` header (same model as `/api/insights-*`).
- No auto-publish anywhere in the system; publishing is always an explicit manual action.

### Integration points (all existing infrastructure)

| Concern | Mechanism |
|---|---|
| Storage | Supabase (`mydxofjvpuurwwaohqys`), new table only |
| Admin API | Vercel serverless functions `api/signals-pending.js`, `api/signals-decision.js` |
| Scheduling | GitHub Actions `signal-agent.yml`, daily |
| Secrets | `ANTHROPIC_API_KEY`, `SUPABASE_SECRET_KEY` (Actions); `ADMIN_API_KEY` + secret (Vercel) |

### Scheduling — DST-safe

GitHub cron is UTC and ignores DST, so the workflow fires at **both** 05:00 and 06:00 UTC and a `Europe/London` time guard in the script lets exactly one run proceed — giving a stable **06:00 UK** slot through BST and GMT. Verified across both. Manual dispatches bypass the guard. The same guard makes a future move to Vercel Cron DST-safe too.

### Known limitations (architect view)

- 13 of ~47 configured sources are feed-verified and enabled; the rest are configured-and-disabled (see §4).
- Rejected items are retained for audit + dedup, so the table grows over time — a periodic prune of old `rejected` rows is a noted future improvement.
- No retry/backoff on transient feed/API errors within a run (a failed batch is logged and marked low-confidence reject).

---

## 3. For the design team

Three new UI surfaces were added. **No new visual design system was introduced** — all three reuse the existing tokens (`--navy`, `--teal`, `--amber`, `--off-white`, slate text tints) and the established type system (Playfair Display headings, DM Sans body, DM Mono labels). The admin view is a deliberate visual sibling of `/admin/approvals`.

### a. `/admin/signals` — editorial review queue (internal)

The working surface for the editorial team. Mirrors the approvals page styling and adds:

- **Filter bar** — status (defaults to Pending), pillar, source, minimum score.
- **Signal cards** — each shows status / pillar / score / confidence chips, the original article title + source link, and **inline-editable** fields: signal title, why-it-matters, decision question, primary/secondary pillar, score, and tags.
- **Actions** — Save edits · Approve · Publish · Reject. Left border colour encodes status (amber pending, teal approved/published, red rejected).

### b. `/signals.html` — public page

Card grid of **published** signals with pillar filter chips. Card anatomy: pillar eyebrow, relevance-score tag, Playfair title, why-it-matters, an italic amber-ruled **decision question**, tags, and source attribution. Includes a considered empty state (it shows nothing until the editorial team publishes).

### c. Homepage / pillar-page embed module (drop-in)

The live homepage, insights and pillar pages are **not in this workspace** (they live in the deployed repo and are edited via diffs), so rather than guess at their markup I produced a self-contained, paste-in "Latest Executive Signals" strip in `docs/builds/signals-homepage-embed.md`. It inherits the site's CSS variables, uses scoped `tair-sig-` classes to avoid clashes, reads published rows only, and hides itself when empty. A one-line switch filters it to a single pillar for pillar pages.

### Signal content model (useful for any future card design)

Every published signal carries: a sharpened **signal title** (not the raw headline), a 2–4 sentence **why-it-matters** (executive implication, not a summary), a single **decision question**, a 3–6 item **tag set**, a **pillar** (+ optional secondary), a **1–5 relevance score**, and source attribution.

### Where design input would help

1. **Homepage placement & treatment** of the signals strip (the embed is functional, not final design) — once the homepage source is available we can build a richer, on-brand feature.
2. **Pillar-page integration** — how a per-pillar signal feed should sit within existing pillar layouts.
3. **Signal card polish** on `/signals.html` — density, score visualisation, and how prominently the decision question should read.
4. **Empty / low-volume states** — early on there will be few or zero published signals; worth a deliberate treatment.

---

## 4. Source coverage

**13 enabled & feed-verified, spanning 7 of the 8 source groups:**

| Group | Enabled sources |
|---|---|
| Enterprise IT / CIO | CIO.com, Computer Weekly |
| Analyst / Advisory | Forrester, McKinsey, Everest Group |
| AI Labs / Research | OpenAI, Google DeepMind, NVIDIA |
| Telco / Service Provider | Light Reading, Telecom Ramblings |
| MSP / Channel | Channel Dive |
| CXO / CFO | Chief Executive |
| CHRO | HR Executive |

The remaining ~34 sources are configured but disabled: most (Deloitte, BCG, Accenture, IDC, Gartner, Forbes, HBR, etc.) timed out or were bot-protected through the verification path and should be confirmed from the first live run; the paywalled titles (FT, Economist, WSJ, Bloomberg) are intentionally disabled (RSS headline/excerpt only, editorial decision required). Notable find: **Channel Futures was sunset (Oct 2025)** — config now uses its successor **Channel Dive**.

---

## 5. Test status

Run end-to-end in mock mode against fixtures spanning all enabled groups (live feed-fetch and the Anthropic API run in GitHub Actions, which has the network and key the build sandbox lacks):

- Dedup correctly collapses URL duplicates (incl. tracking-param variants).
- Classification routes to canonical pillars; the keep/reject and 4–5 queue threshold behave as specified; a sponsored item is rejected.
- Stored-row shape validated field-by-field against the migration schema.
- All JavaScript passes `node --check`; the source config parses; the DST guard verified across BST and GMT.

---

## 6. Remaining work to complete the build

Everything still outstanding, grouped into three phases. **Phase A is the only thing blocking a live v1.** Phases B and C are the v2 (Decision Performance) evolution, gated on team sign-off.

### Phase A — Take v1 live *(blocking; mostly owner)*

| # | Item | Owner | Notes |
|---|---|---|---|
| A1 | Run `migration_build5.sql` in Supabase | Owner (credentialed) | Creates `executive_signals`. Idempotent. |
| A2 | Set `ANTHROPIC_API_KEY` + `SUPABASE_SECRET_KEY` (GitHub Actions); confirm `ADMIN_API_KEY` + secret in Vercel | Owner | Only two new secrets; admin endpoints need the Vercel pair. |
| A3 | Merge/push the v1 branch so the scheduled workflow registers | Owner | Schedule only runs from the default branch. |
| A4 | Dry-run dispatch (`dry_run=1`) → small live run (`max_items=20`) → review in `/admin/signals` | Owner + editorial | Confirms feed-fetch + API end-to-end before trusting the schedule. |
| A5 | Confirm & enable the remaining disabled feeds from first live-run logs | Build | ~34 feeds need a real-network fetch to verify (sandbox timed them out). |
| A6 | Local git housekeeping: delete stale empty `.git/index.lock` / `.git/HEAD.lock` | Owner | Cosmetic; the mount blocked deletion, commits were made via plumbing. |

Step-by-step for A1–A4 is in `docs/builds/executive-signal-agent-v1-deployment.md`.

### Phase B — v2 Decision Performance build *(gated on WP11 sign-off)*

The WP11 package (`docs/builds/executive-signal-agent-v2/`) is **design only**. Once the architecture/design teams approve, the build sequence is:

| # | Item | Owner | Source spec |
|---|---|---|---|
| B1 | Architecture & design review / sign-off of WP11 (D1–D6) | Architect + Design + Editorial | `…/00-overview.md` |
| B2 | Apply `migration_build6.sql` (the six new DP metadata fields) | Build → Owner runs | D2 |
| B3 | Wire the enhanced Tier-2 prompt + `buildRow()` fields into `run-signal-agent.js` | Build | D3 |
| B4 | Add the new fields to the `/admin/signals` review form + validation | Build | D2 / D3 |
| B5 | Rebuild the public **Decision Performance Signal Card** on `/signals.html` (two-zone, readout band; + dimension/persona filters) | Build + Design | D4 |
| B6 | Ship the **"Decision Performance Signals"** homepage module (rename + dimension rail + DPI CTA) | Build + Design | D5 |
| B7 | *(Optional)* Backfill v2 metadata onto already-published v1 signals | Build | D2 |

### Phase C — Constraint Intelligence Layer *(future; volume-gated)*

| # | Item | Owner | Trigger |
|---|---|---|---|
| C1 | Build the constraint-analytics view + internal `/admin/constraints` dashboard | Build | ~100–150 published signals |
| C2 | Public "Constraint Report" + self-vs-market DPI bridge | Build + Design + Strategy | After C1 proves out |

### Cross-cutting / hardening backlog *(any time)*

- Periodic prune of old `rejected` rows (table-growth control).
- Prompt-cache the static classification system prompt (further cost reduction).
- Add `rss-parser` only if a feed needs more robust parsing than the built-in parser.
- Add retry/backoff for transient feed/API errors within a run.
- Decide whether to enable the paywalled CXO titles (FT, Economist, WSJ, Bloomberg) — RSS headline/excerpt only; editorial call.

### One-line status

**v1 is build-complete and one owner session (Phase A) from going live. v2 is fully specified and awaiting sign-off to build (Phase B). The Constraint Intelligence Layer (Phase C) is architected and deferred until there is enough published-signal volume to mean anything.**

---

## 7. Constraints honoured

No auto-publish · no paywall scraping · no access-control bypass · no new visual design system · pillars not renamed · classified by pillar (not Decision Performance dimensions) · no personal data · no newsletter. Serves the six-pillar editorial model.
