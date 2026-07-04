-- ============================================================
-- Build 2 Migration — theAIReadyist
-- Run in: Supabase → SQL Editor
-- ============================================================

-- 1. Create insights table
--    Rows are inserted by agent/run-agent.js (status='draft').
--    Approved drafts move to status='published' via /api/insights-decision.
--    The public site reads only status='published' rows (enforced by RLS).
CREATE TABLE IF NOT EXISTS insights (
  id           text PRIMARY KEY,               -- INS-<iso-timestamp>
  slug         text NOT NULL,                  -- e.g. bfsi-agentic-ai-2026-06-22
  title        text,
  summary      text,
  sectors      jsonb,                          -- e.g. ["BFSI","Energy"]
  regions      jsonb,                          -- e.g. ["UK&Ireland","Europe"]
  status       text NOT NULL DEFAULT 'draft',  -- draft|published|rejected|superseded
  body         text,
  published_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS insights_status_pub_idx
  ON insights (status, published_at DESC);

-- Enforce at most one published row per canonical slug
CREATE UNIQUE INDEX IF NOT EXISTS insights_slug_published_uidx
  ON insights (slug) WHERE status = 'published';

-- 3. RLS — anon (publishable key) may read published rows only; all writes are server-side
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY insights_anon_read ON insights
  FOR SELECT TO anon USING (status = 'published');

-- Done.
-- Note: the runs.insight_id FK is informational only (no foreign key constraint).
-- Brief configs stored in briefs.payload are read by the agent via BRIEF_ID env var (Build 2).
