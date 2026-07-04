-- ============================================================
-- Build 3 Migration — theAIReadyist
-- Feature: Six-Pillar Taxonomy (feature/six-pillar-taxonomy)
-- Run in: Supabase → SQL Editor
-- ============================================================

-- 1. Add pillar and lenses columns to insights
--    pillar: one of the six canonical pillar names (text, nullable for legacy rows)
--    lenses: cross-cutting lenses applied to this insight (jsonb array)
ALTER TABLE insights ADD COLUMN IF NOT EXISTS pillar  text;
ALTER TABLE insights ADD COLUMN IF NOT EXISTS lenses  jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 2. Add secondary_pillar for cross-pillar content (optional, nullable)
ALTER TABLE insights ADD COLUMN IF NOT EXISTS secondary_pillar text;

-- 3. Index for pillar-based filtering on the public insights page
CREATE INDEX IF NOT EXISTS insights_pillar_idx
  ON insights (pillar) WHERE status = 'published';

-- 4. Constrain pillar to the six canonical values (or null for legacy rows)
--    Pillars: Executive Operating Models | Decision Intelligence |
--             Agentic Governance | AI Economics |
--             Human Agency | Sovereign AI
--    NOTE (2026-06-22): Pillar 5 renamed from 'Human + AI Workforce' to 'Human Agency'.
--    If migration_build3 was already run with the old name, run migration_build4.sql
--    to update the constraint. See docs/builds/website-realignment-report.md.
ALTER TABLE insights ADD CONSTRAINT insights_pillar_check CHECK (
  pillar IS NULL OR pillar IN (
    'Executive Operating Models',
    'Decision Intelligence',
    'Agentic Governance',
    'AI Economics',
    'Human Agency',
    'Sovereign AI'
  )
);

-- 5. Also add pillar/lenses to the briefs.payload schema (informational comment only —
--    briefs.payload is jsonb; agent/run-agent.js writes pillar and lenses into it
--    automatically when the config includes those fields).

-- Done.
-- Note: Existing published insights have pillar = NULL.
--   They continue to display correctly — the public insights page
--   shows all published rows regardless of pillar assignment.
--   Backfill can be done manually via the approvals interface once
--   the six-pillar taxonomy is live.
