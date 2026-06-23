# Executive Signal Agent — v1 Build Notes

**Branch:** `feature/executive-signal-agent-v1`
**Date:** 2026-06-23
**Status:** Built, mock-tested. Not yet scheduled in production (see _Recommendations_).

The Executive Signal Agent is a **pillar-based executive signal engine** for theAIReadyist — not a generic AI news scraper. It gathers daily articles from approved enterprise IT, MSP, telco, analyst and executive-leadership sources, classifies them against the six pillars, scores them for executive relevance, and queues the best items for human approval. **Nothing is auto-published in v1.**

---

## Architecture

```
agent/configs/signal-sources.json     Source configuration (feeds, groups, enabled flags)
        │
        ▼
agent/run-signal-agent.js              Orchestrator (Node 20, dependency-light)
   1. Load config
   2. Fetch + parse RSS/Atom (headline metadata only)
   3. Dedupe by URL (within-run + against stored rows)
   4. Tier 1 triage  → Claude Haiku 4.5   (pillar, confidence, reason, score 1–5, keep/reject)
   5. Tier 2 signals → Claude Sonnet 4.6  (only items scoring 4–5: title, why-it-matters, decision question, tags)
   6. Store rows in Supabase `executive_signals`
        │
        ├── pending  (score 4–5, classified) ──► /admin/signals  (human approval)
        │                                              │ approve / edit / publish
        │                                              ▼
        │                                         /signals.html  (public, published only)
        └── rejected (everything else)          kept for audit + dedup memory
```

The two-tier model design keeps cost low: the cheap Haiku pass triages every item; the more expensive Sonnet pass only runs on items that clear the queue threshold (score ≥ 4).

### Components

| File | Role |
|---|---|
| `agent/configs/signal-sources.json` | Source list: name, group, feed URL, `enabled`, `verified`, region, notes |
| `agent/run-signal-agent.js` | Fetch → dedupe → classify → score → generate → store |
| `migration_build5.sql` | `executive_signals` table, constraints, indexes, RLS |
| `api/signals-pending.js` | `GET` pending/filtered signals for the admin view (x-admin-key) |
| `api/signals-decision.js` | `POST` approve / reject / publish / save-edits (x-admin-key) |
| `admin/signals/index.html` | Human review UI: filter, edit, approve, reject, publish |
| `signals.html` | Public page; reads `published` signals via the anon key only |
| `.github/workflows/signal-agent.yml` | Daily scheduled run (creates pending only) |

---

## Data model

Table `executive_signals` (migration_build5.sql). Key fields:

`id` · `created_at` · `retrieved_at` · `published_at` · `source_name` · `source_url` · `source_group` · `source_published_at` · `original_title` · `signal_title` · `excerpt` · `primary_pillar` · `secondary_pillar` · `classification_confidence` · `classification_reason` · `executive_relevance_score` · `why_it_matters` · `decision_question` · `suggested_tags` · `approval_status` · `approved_by` · `rejected_reason` · `published_slug` · `raw_metadata`

Constraints:

- `approval_status ∈ {pending, approved, rejected, published}`
- `primary_pillar` / `secondary_pillar` ∈ the six canonical pillar names (or null) — identical to the `insights` table constraint in `migration_build3.sql`.
- `executive_relevance_score` ∈ 1..5 (or null)
- **Unique** `source_url` (deduplication) and **unique** `published_slug` where published.

RLS: anon (publishable key) may read **only** `approval_status = 'published'`. All writes (agent inserts, admin actions) use the Supabase secret key server-side.

---

## Source configuration

`agent/configs/signal-sources.json`. Each source carries `group`, `feed_url`, `enabled`, `verified`, `default_region` and `notes`. Per-run defaults: `max_items_per_source` (25), `lookback_hours` (30), `user_agent`.

**v1 enabled & feed-verified (8 sources, 5 groups):**

| Source | Group | Feed |
|---|---|---|
| CIO.com | Enterprise IT / CIO | `cio.com/feed/` |
| Computer Weekly | Enterprise IT / CIO | `computerweekly.com/rss/All-Computer-Weekly-content.xml` |
| Forrester (Blogs) | Analyst / Advisory | `forrester.com/blogs/feed/` |
| OpenAI (Blog) | AI Labs / Research | `openai.com/blog/rss.xml` |
| Google DeepMind | AI Labs / Research | `deepmind.google/blog/rss.xml` |
| NVIDIA (Blog) | AI Labs / Research | `blogs.nvidia.com/feed/` |
| Light Reading | Telco / Service Provider | `lightreading.com/rss.xml` |
| Channel Dive | MSP / Channel | `channeldive.com/feeds/news/` |

The remaining ~35 sources from the brief (FT, Economist, WSJ, Forbes, Fortune, Bloomberg, KPMG, CFO Dive, SHRM, HR Executive, BCG, Accenture, Anthropic, Mistral, Stanford HAI, CRN, ChannelE2E, ChannelPro, Telecoms.com, Fierce Network, Telecom Ramblings, Gartner, IDC, ISG, Everest, Deloitte, PwC, Bain, EY, Korn Ferry, MIT SMR, HBR, McKinsey, etc.) are **configured but `enabled: false`**, each with best-known feed URLs and a note. Flip `enabled: true` after confirming the feed returns valid RSS/Atom.

**Notable findings during verification:**

- **Channel Futures was sunset (Oct 2025)** and now redirects to **Channel Dive** (Informa TechTarget). Config uses the Channel Dive feed.
- Paywalled titles (FT, Economist, WSJ, Bloomberg) are configured but disabled. RSS exposes headlines/excerpts only; the agent must never fetch full bodies. Enabling these is an editorial decision.
- Several feed URLs returned empty bodies during verification (ITPro, MIT SMR, CRN, Telecoms.com) and are left disabled pending confirmation.

---

## Classification logic

Tier 1 (Haiku) assigns, per item: exactly one `primary_pillar` (+ optional `secondary_pillar`), `classification_confidence` (high/medium/low), a short `classification_reason`, an `executive_relevance_score` (1–5), and `classification_status` (keep/reject).

Rules enforced in the system prompt:

- Classify against the **six pillars**, never against Decision Performance dimensions.
- Exactly one primary pillar; at most one secondary.
- If uncertain → `confidence: low` (flagged for manual review in the admin view).
- Don't force weak items into the taxonomy. Items not relevant to any pillar → reject, reason `not_relevant_to_pillars`.
- Reject vendor press releases / product launches with no executive implication, low-quality SEO, social posts, rumours, duplicates.

Prioritised signal types: CIO/CTO/COO/CFO implications, MSP leadership, telco/service-provider leadership, board-level risk & value, operating-model change, governance & accountability.

## Scoring logic

| Score | Meaning | Queued? |
|---|---|---|
| 5 | Board-level signal | Always |
| 4 | Strategic (material for C-suite/board/MSP/telco) | Yes |
| 3 | Important (monitoring) | No (only if daily volume is low — manual) |
| 2 | Relevant, low urgency | No |
| 1 | Interesting | No |

Only **4–5** enter the approval queue (`approval_status = 'pending'`) and receive Tier-2 signal generation. Everything else is stored as `rejected` with a `rejected_reason`, preserving an audit trail and dedup memory.

## Admin workflow

`/admin/signals` (mirrors the existing `/admin/approvals` styling; x-admin-key gated):

- Filter by status (pending default), pillar, source, minimum score.
- Inline-edit signal title, why-it-matters, decision question, tags, pillars, score.
- **Save edits**, **Approve**, **Publish** (→ visible on `/signals.html`), **Reject**.
- Human approval is mandatory; publishing is always an explicit manual action.

---

## Scheduling recommendation

`.github/workflows/signal-agent.yml` runs daily and creates pending signals only (no commit/push, no publishing). It also supports `workflow_dispatch` with `config`, `max_items`, and `dry_run` inputs.

**DST-safe scheduling (implemented).** GitHub Actions cron is always UTC and does not observe DST. To hold a strict **06:00 Europe/London** slot year-round, the workflow fires at **both** `0 5 * * *` and `0 6 * * *` (UTC), and `run-signal-agent.js` applies a time guard:

- For scheduled runs the workflow sets `RUN_AT_HOUR_LONDON=6`. The script computes the current `Europe/London` hour and **exits 0 unless it equals 6**, so exactly one of the two daily runs proceeds (05:00 UTC during BST, 06:00 UTC during GMT) and the other is a no-op.
- `workflow_dispatch` (manual) runs leave `RUN_AT_HOUR_LONDON` unset, so they always proceed regardless of time.

Verified across BST and GMT: in summer the 05:00 UTC run proceeds (06:00 London) and 06:00 UTC skips; in winter the 06:00 UTC run proceeds (06:00 London) and 05:00 UTC skips.

If scheduling later moves to **Vercel Cron** (the site already deploys serverless functions on Vercel), the same `RUN_AT_HOUR_LONDON` guard makes it DST-safe there too (Vercel Cron is also UTC).

Required secrets (GitHub → repo → Settings → Secrets): `ANTHROPIC_API_KEY`, `SUPABASE_SECRET_KEY`. See `docs/builds/executive-signal-agent-v1-deployment.md` for the full deployment runbook.

---

## Cost

Two-tier design (Haiku triage all items; Sonnet only on score 4–5). For a realistic 80–150 items/day after dedupe: roughly **$3–5/month**. The signal agent does **not** use Claude's web-search tool (content comes from RSS), so there is no per-search charge. Cost levers: `MAX_ITEMS`, `max_items_per_source`, `lookback_hours`, batch sizes (`TRIAGE_BATCH`, `SIGNAL_BATCH`), and the `QUEUE_THRESHOLD`.

---

## Known limitations

- Only 8 of ~50 sources are feed-verified and enabled. The rest need feed-URL confirmation.
- The hand-rolled RSS/Atom parser is tolerant but not a full XML parser; unusual feeds may yield thin excerpts. Fixable by adding `rss-parser` if needed (would require a workflow `npm install`).
- `lookback_hours` filtering relies on feed-provided dates; feeds without dates are always considered "recent" (kept, then deduped) — acceptable because dedup prevents re-queueing.
- Rejected items are stored (audit + dedup), so the table grows over time. A periodic prune of old `rejected` rows is a future improvement.
- No retry/backoff on transient feed or API errors within a run (a failed batch is marked low-confidence reject and logged).
- Classification quality depends on title + excerpt only (no full-text), by design (no paywall/full-fetch).

## Future improvements

- Verify and enable the remaining sources; add a small feed-health checker.
- Prompt-cache the (static) classification system prompt to cut input cost further.
- Editor backfill of `pillar` onto historical insights using the same classifier.
- Surface approved/published signals on the homepage, insights page, daily signal page and pillar pages (v1 stores and prepares; it does not wire these in).
- Optional weekly digest (explicitly out of scope for v1 — no newsletter functionality).
- DST-safe scheduling guard (see above).

---

## Constraints honoured

No auto-publish · no paywall scraping · no access-control bypass · no new visual design system (reuses existing tokens/fonts) · pillars not renamed · classified by pillars (not Decision Performance) · no personal data · no newsletter. Serves the six-pillar editorial model.
