-- ============================================================
-- Build 6 Migration — theAIReadyist
-- Feature: Research Candidate Workflow (WP15)
-- Run in: Supabase → SQL Editor
-- ============================================================
--
-- A lightweight, human-curated backlog bridging Executive Signals
-- (what is happening) to the Research Agent (why it matters).
-- Rows are created only by an explicit human action in /admin/signals
-- ("Publish + Research Candidate"). No automation.
--
-- Admin-only: all access is server-side via the Supabase secret key
-- (x-admin-key guarded endpoints). The anon key has NO access.

CREATE TABLE IF NOT EXISTS research_candidates (
  id                text PRIMARY KEY,                 -- RQ-001, RQ-002 …
  created_at        timestamptz NOT NULL DEFAULT now(),
  signal_id         text,                             -- → executive_signals.id (informational)
  signal_url        text,
  signal_title      text,
  pillar            text,                             -- one of the six canonical pillars (or null)
  candidate_topic   text NOT NULL,                    -- short working title
  editorial_notes   text,
  status            text NOT NULL DEFAULT 'new',      -- new|reviewing|research_started|completed|archived
  research_brief_id text,                             -- → briefs.id once research is launched
  created_by        text
);

ALTER TABLE research_candidates DROP CONSTRAINT IF EXISTS rc_status_check;
ALTER TABLE research_candidates ADD CONSTRAINT rc_status_check CHECK (
  status IN ('new','reviewing','research_started','completed','archived')
);

ALTER TABLE research_candidates DROP CONSTRAINT IF EXISTS rc_pillar_check;
ALTER TABLE research_candidates ADD CONSTRAINT rc_pillar_check CHECK (
  pillar IS NULL OR pillar IN (
    'Executive Operating Models','Decision Intelligence','Agentic Governance',
    'AI Economics','Human Agency','Sovereign AI'
  )
);

CREATE INDEX IF NOT EXISTS rc_status_idx ON research_candidates (status, created_at DESC);
CREATE INDEX IF NOT EXISTS rc_pillar_idx ON research_candidates (pillar);
CREATE INDEX IF NOT EXISTS rc_signal_idx ON research_candidates (signal_id);

-- RLS: internal backlog. No anon access; all reads/writes are server-side (secret key).
ALTER TABLE research_candidates ENABLE ROW LEVEL SECURITY;

-- Done. Additive; affects no existing table.
