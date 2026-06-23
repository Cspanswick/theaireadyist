-- ============================================================
-- Build 5 Migration — theAIReadyist
-- Feature: Executive Signal Agent v1 (feature/executive-signal-agent-v1)
-- Run in: Supabase → SQL Editor
-- ============================================================
--
-- Stores pillar-classified executive signals produced by
-- agent/run-signal-agent.js. Rows are written server-side only
-- (Supabase secret key, which bypasses RLS).
--
-- approval_status lifecycle:
--   pending   → awaiting human approval (scores 4–5, classified to a pillar)
--   approved  → approved by an admin, not yet surfaced publicly
--   rejected  → agent-filtered or admin-rejected (kept for audit + dedup memory)
--   published → approved AND made visible on the public site
--
-- NOTHING IS AUTO-PUBLISHED. The public (anon) key may read only
-- rows with approval_status = 'published'.
-- NO personal data is collected.

-- 1. Signals table
CREATE TABLE IF NOT EXISTS executive_signals (
  id                        text PRIMARY KEY,              -- SIG-<iso-timestamp>-<rand>
  created_at                timestamptz NOT NULL DEFAULT now(),
  retrieved_at              timestamptz,                   -- when the agent fetched it
  published_at              timestamptz,                   -- article publish date if available
  source_name               text NOT NULL,
  source_url                text NOT NULL,
  source_group              text,                          -- e.g. "Enterprise IT / CIO"
  source_published_at       timestamptz,
  original_title            text,
  signal_title              text,                          -- sharpened executive headline
  excerpt                   text,
  primary_pillar            text,                          -- one of the six canonical pillars
  secondary_pillar          text,                          -- optional second pillar
  classification_confidence text,                          -- high | medium | low
  classification_reason     text,
  executive_relevance_score smallint,                      -- 1..5
  why_it_matters            text,
  decision_question         text,
  suggested_tags            jsonb NOT NULL DEFAULT '[]'::jsonb,
  approval_status           text NOT NULL DEFAULT 'pending',
  approved_by               text,
  rejected_reason           text,
  published_slug            text,
  raw_metadata              jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- 2. Deduplication: at most one signal per source URL
CREATE UNIQUE INDEX IF NOT EXISTS exec_signals_source_url_uidx
  ON executive_signals (source_url);

-- 3. Indexes for the admin review workflow (filter by status / pillar / source / score)
CREATE INDEX IF NOT EXISTS exec_signals_status_idx
  ON executive_signals (approval_status, created_at DESC);
CREATE INDEX IF NOT EXISTS exec_signals_pillar_idx
  ON executive_signals (primary_pillar);
CREATE INDEX IF NOT EXISTS exec_signals_source_idx
  ON executive_signals (source_name);
CREATE INDEX IF NOT EXISTS exec_signals_score_idx
  ON executive_signals (executive_relevance_score DESC);

-- At most one published row per slug
CREATE UNIQUE INDEX IF NOT EXISTS exec_signals_slug_published_uidx
  ON executive_signals (published_slug) WHERE approval_status = 'published';

-- 4. Constrain approval_status to the four canonical states
ALTER TABLE executive_signals
  DROP CONSTRAINT IF EXISTS exec_signals_status_check;
ALTER TABLE executive_signals ADD CONSTRAINT exec_signals_status_check CHECK (
  approval_status IN ('pending', 'approved', 'rejected', 'published')
);

-- 5. Constrain pillars to the six canonical values (or null)
--    Must match the names used in migration_build3 (insights table).
ALTER TABLE executive_signals
  DROP CONSTRAINT IF EXISTS exec_signals_primary_pillar_check;
ALTER TABLE executive_signals ADD CONSTRAINT exec_signals_primary_pillar_check CHECK (
  primary_pillar IS NULL OR primary_pillar IN (
    'Executive Operating Models',
    'Decision Intelligence',
    'Agentic Governance',
    'AI Economics',
    'Human Agency',
    'Sovereign AI'
  )
);
ALTER TABLE executive_signals
  DROP CONSTRAINT IF EXISTS exec_signals_secondary_pillar_check;
ALTER TABLE executive_signals ADD CONSTRAINT exec_signals_secondary_pillar_check CHECK (
  secondary_pillar IS NULL OR secondary_pillar IN (
    'Executive Operating Models',
    'Decision Intelligence',
    'Agentic Governance',
    'AI Economics',
    'Human Agency',
    'Sovereign AI'
  )
);

-- 6. Constrain relevance score to 1..5 (or null for unscored)
ALTER TABLE executive_signals
  DROP CONSTRAINT IF EXISTS exec_signals_score_check;
ALTER TABLE executive_signals ADD CONSTRAINT exec_signals_score_check CHECK (
  executive_relevance_score IS NULL OR (executive_relevance_score BETWEEN 1 AND 5)
);

-- 7. RLS — anon (publishable key) may read PUBLISHED signals only.
--    All writes (agent inserts, admin approve/reject/edit) are server-side
--    via the secret key, which bypasses RLS.
ALTER TABLE executive_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS exec_signals_anon_read ON executive_signals;
CREATE POLICY exec_signals_anon_read ON executive_signals
  FOR SELECT TO anon USING (approval_status = 'published');

-- Done.
-- Note: pending/approved/rejected rows are invisible to the anon key.
--   The admin review view (/admin/signals) reads pending rows via the
--   server endpoint /api/signals-pending (secret key, x-admin-key guarded).
