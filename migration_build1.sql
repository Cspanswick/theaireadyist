ALTER TABLE briefs ADD COLUMN IF NOT EXISTS next_run_at     timestamptz;
ALTER TABLE briefs ADD COLUMN IF NOT EXISTS schedule_active boolean NOT NULL DEFAULT true;
CREATE TABLE IF NOT EXISTS runs (
  id            text PRIMARY KEY,
    brief_id      text REFERENCES briefs(id),
      scheduled_for timestamptz,
        started_at    timestamptz,
          completed_at  timestamptz,
            status        text NOT NULL,
              insight_id    text,
                error         text,
                  created_at    timestamptz NOT NULL DEFAULT now()
                  );
                  CREATE INDEX IF NOT EXISTS runs_brief_sched_idx ON runs (brief_id, scheduled_for DESC);
                  CREATE INDEX IF NOT EXISTS runs_created_idx     ON runs (created_at DESC);
                  ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
                  CREATE POLICY runs_anon_read ON runs FOR SELECT TO anon USING (true);
                  UPDATE briefs
                  SET payload = jsonb_set(
                        jsonb_set(payload, '{schedule,frequencyAmount}', '1'::jsonb, true),
                              '{schedule,frequencyUnit}', '"day"'::jsonb, true
                                  )
                                  WHERE (payload->'schedule'->>'frequencyAmount')::int > 1;