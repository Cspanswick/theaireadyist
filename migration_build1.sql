-- ============================================================
-- Build 1 Migration — theAIReadyist
-- Run in: Supabase → SQL Editor
-- ============================================================

-- 1. Add two columns to briefs
ALTER TABLE briefs ADD COLUMN IF NOT EXISTS next_run_at     timestamptz;
ALTER TABLE briefs ADD COLUMN IF NOT EXISTS schedule_active boolean NOT NULL DEFAULT true;

-- 2. Create runs table (append-only, per execution history)
CREATE TABLE IF NOT EXISTS runs (
  id            text PRIMARY KEY,            -- RUN-<iso-timestamp>
  brief_id      text REFERENCES briefs(id),
  scheduled_for timestamptz,                 -- the daily slot this run was meant to fill
  started_at    timestamptz,
  completed_at  timestamptz,
  status        text NOT NULL,               -- running|complete|in_approvals|approved|rejected|failed
  insight_id    text,                        -- → insights.id; null if failed
  error         text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS runs_brief_sched_idx ON runs (brief_id, scheduled_for DESC);
CREATE INDEX IF NOT EXISTS runs_created_idx     ON runs (created_at DESC);

-- 3. RLS on runs — anon (publishable key) may READ, cannot write
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY runs_anon_read ON runs
  FOR SELECT TO anon USING (true);

-- 4. Normalise BRIEF-002 (and any brief) carrying sub-daily / multi-run cadence → once-per-day
UPDATE briefs
SET payload = jsonb_set(
      jsonb_set(payload, '{schedule,frequencyAmount}', '1'::jsonb, true),
      '{schedule,frequencyUnit}', '"day"'::jsonb, true
    )
WHERE (payload->'schedule'->>'frequencyAmount')::int > 1;

-- Done.
-- Note: next_run_at seeding for existing briefs will be handled by Build 2
-- (scheduler.js computes and sets it on first run). The dashboard correctly
-- shows "no upcoming runs" until next_run_at is populated.
