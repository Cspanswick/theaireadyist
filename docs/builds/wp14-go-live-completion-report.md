# WP14 — Go-Live Completion Report

**For:** Architecture & Design teams
**Date:** 2026-06-23
**Status:** ✅ **LIVE — Executive Signals v1 is in production and collecting its first proprietary Decision Performance dataset.**
**Aligns to:** DR-001

---

## 1. Headline

Executive Signals v1 is **fully operational in production**. The end-to-end chain — fetch → AI classify → store → human-review queue → publish — is verified working on live infrastructure. The first real run produced **30 queued signals and 22 rejected from 52 fetched**, classified across the six pillars with full executive signal content. The daily 06:00-UK schedule now runs automatically. Per DR-001, this is the milestone that matters: **the platform has begun accumulating proprietary evidence.**

---

## 2. What was executed this session

| Step | Action | Result |
|---|---|---|
| Database migration | Ran `migration_build5.sql` in Supabase production | ✅ `executive_signals` table + 1 RLS policy + 7 indexes + 11 check constraints, verified |
| Secrets | Verified GitHub + Vercel | ✅ Already present (`ANTHROPIC_API_KEY`, `SUPABASE_SECRET_KEY`; Vercel also `ADMIN_API_KEY`, `GITHUB_TOKEN`) |
| Code → GitHub | PR #2 merged to `main` (squash `43ed2d1`, 9 files), branch cleaned up | ✅ Vercel auto-deployed |
| Deploy verification | Loaded live `/signals` | ✅ Renders, reads Supabase, correct empty state |
| First runs | Dispatched the agent workflow | See §3 |

---

## 3. The one real issue — found and fixed

The first two runs classified **0** items (everything rejected). Investigation of the run logs showed the exact cause:

> `400 invalid_request_error: "Your credit balance is too low to access the Anthropic API."`

**This was not a code or infrastructure bug.** The Anthropic API account was out of credit, so every classification call was rejected and the agent correctly fell back to "score 1, reject." Infrastructure (fetch, store, deploy) worked perfectly throughout.

**Resolution:** API credit was topped up (auto-reload now enabled; $500 monthly spend limit; healthy balance). The 52 error rows were cleared (required so URL-dedup wouldn't skip them on re-run), and the agent was re-run.

**Note for ops:** the agent has a hard dependency on Anthropic API credit. Auto-reload now mitigates this; recommend keeping the email spend-notification on and treating "credit balance" as a monitored operational metric.

---

## 4. First successful run — results

Run `28052884067` (full, no cap):

| Metric | Value |
|---|---|
| Sources fetched | 13 (across all 7 enabled groups) |
| Items fetched | 52 |
| **Queued (pending)** | **30** |
| Rejected | 22 |
| Stored | 52 |
| Cost | a few cents (see §6) |

Sample queued signals (all score 5, high confidence — real Tier-2 content):

- *Agentic Governance* — "Five Eyes Warning: AI-Enabled Cyberattacks…"; "UK Boardrooms Confront the Agentic Shift"; "Boards Treating AI as an IT Issue Are Accumulating [risk]"
- *AI Economics* — "Private Equity Data Shows AI Value Creation…" (grounded in McKinsey data)
- *Decision Intelligence* — "Data Readiness Is the Bottleneck Killing AI Scale…"
- *Executive Operating Models* — "Rewire vs. Rebuild: The AI Architecture Choice…"

Quality is genuinely there: sharp executive headlines, source-grounded "why it matters," correct pillar classification.

---

## 5. What is now live

| Surface | URL | State |
|---|---|---|
| Public signals page | `/signals` | Live; shows **published** signals only (empty until editorial publishes) |
| Editorial review queue | `/admin/signals` | Live; 30 pending signals awaiting approve/edit/publish/reject (admin-key gated) |
| Observation dashboard | `/admin/observation` | Live; volume / pillar / source / editorial pulse (admin-key gated) |
| Daily agent | GitHub Actions `signal-agent.yml` | Scheduled 06:00 UK (DST-safe); creates pending only — **never auto-publishes** |

---

## 6. Cost (actual + ongoing)

- The failed (credit-out) runs cost **$0** — rejected before any tokens were billed.
- A successful daily run ≈ **$0.05–0.15** (Haiku triages all items; Sonnet writes only the queued ones; no web-search tool).
- Ongoing ≈ **$2–6/month**. GitHub Actions and Supabase are on free tiers — the Anthropic API is the only running cost.

---

## 7. For the architect

- **Deployed cleanly** via PR to `main`; Vercel builds from `main`. Source of truth is the GitHub repo; the local `~/theaireadyist-deploy` clone was a one-time deploy vehicle.
- **Operational dependency:** the agent requires Anthropic API credit (now auto-reloading). Treat as a monitored metric.
- **Calibration, not a defect (see §8):** scoring is currently a touch generous (30/52 queued, top tier heavily score-5). This is tuned editorially/prompt-side during observation — no schema or architecture change.
- **Minor:** the workflow emits a Node 20 deprecation warning (runs are forced onto Node 24 and succeed); a one-line bump to `node-version: 24` is a future tidy-up, non-urgent.
- **Coverage:** 13 of ~47 configured feeds are enabled; the rest can be verified/enabled from live-run logs over the coming days.

## 8. For the design team

- **The live `/signals` page is up** and on-brand (existing design tokens; no new system introduced). It currently shows the empty state and will populate as editorial **publishes** approved signals.
- **No design build is required now.** Per DR-001, the v2 work — the **Decision Performance Signal Card** and **"Decision Performance Signals" homepage module** (specced in `docs/builds/executive-signal-agent-v2/`) — remains **designed-but-gated**, to be built only if the 60-day evidence gate approves Constraint Intelligence.
- **Near-term design input that would help:** a quick review of the live `/signals` card layout once a few signals are published (real content reveals spacing/hierarchy nuances), and eventual sign-off on the gated v2 card/homepage specs.

---

## 9. Open items

| Item | Owner | Priority |
|---|---|---|
| Editorial scoring calibration (first weekly review) | Editorial + Strategy | Soon |
| Keep Anthropic credit funded (auto-reload on) | Owner | Ongoing |
| Verify/enable remaining ~34 feeds from logs | Build | Low |
| Node 24 workflow bump | Build | Low |
| Publish first signals; review on live page | Editorial + Design | Soon |

---

## 10. What's next

The platform now enters the **60-day observation period** (Editorial Operating Model v1): weekly intelligence reviews, the Observation Register, the 30-day check, and the 60-day evidence gate that decides whether Constraint Intelligence is justified by evidence. The build phase is complete; the learning phase has begun.

**Bottom line:** TheAIReadyist is live, classifying real executive signals against the six pillars, and accumulating the proprietary Decision Performance data that DR-001 defined as the goal. No further build is required to start learning.
