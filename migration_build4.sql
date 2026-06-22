-- ============================================================
-- Build 4 Migration — theAIReadyist
-- Feature: Decision Performance Index MVP (feature/decision-performance-index-mvp)
-- Run in: Supabase → SQL Editor
-- ============================================================
--
-- Stores anonymous DPI assessment results to support future benchmarking.
-- NO personal data is collected. Writes are server-side only, via the
-- /api/dpi-submit serverless function using the Supabase secret key.
-- The public (anon) key has no access to this table.

-- 1. Results table
CREATE TABLE IF NOT EXISTS dpi_results (
  id                   text PRIMARY KEY,          -- DPI-<iso-timestamp>
  created_at           timestamptz NOT NULL DEFAULT now(),
  version              text NOT NULL DEFAULT '1.0',
  overall_score        numeric(5,1) NOT NULL,     -- 0.0 .. 100.0
  band                 text NOT NULL,             -- Reactive|Developing|Performing|Adaptive
  primary_constraint   text NOT NULL,             -- dimension name
  secondary_constraint text NOT NULL,             -- dimension name
  dimension_scores     jsonb NOT NULL DEFAULT '{}'::jsonb,
                        -- { "quality":75, "velocity":50, "accountability":..., ... }
  -- Optional, coarse benchmark dimensions. Nullable. Never personal data.
  industry             text,
  org_size             text,
  geography            text
);

-- 2. Constrain band to the four canonical performance bands
ALTER TABLE dpi_results ADD CONSTRAINT dpi_band_check CHECK (
  band IN ('Reactive', 'Developing', 'Performing', 'Adaptive')
);

-- 3. Constrain overall_score to the valid range
ALTER TABLE dpi_results ADD CONSTRAINT dpi_overall_range_check CHECK (
  overall_score >= 0 AND overall_score <= 100
);

-- 4. Constrain constraints to the six canonical dimension names
ALTER TABLE dpi_results ADD CONSTRAINT dpi_primary_constraint_check CHECK (
  primary_constraint IN (
    'Decision Quality', 'Decision Velocity', 'Decision Accountability',
    'Decision Capability', 'Decision Value', 'Decision Resilience'
  )
);
ALTER TABLE dpi_results ADD CONSTRAINT dpi_secondary_constraint_check CHECK (
  secondary_constraint IN (
    'Decision Quality', 'Decision Velocity', 'Decision Accountability',
    'Decision Capability', 'Decision Value', 'Decision Resilience'
  )
);

-- 5. Indexes for future benchmark queries
CREATE INDEX IF NOT EXISTS dpi_results_created_idx ON dpi_results (created_at DESC);
CREATE INDEX IF NOT EXISTS dpi_results_band_idx    ON dpi_results (band);
CREATE INDEX IF NOT EXISTS dpi_results_primary_idx ON dpi_results (primary_constraint);
-- Benchmark cohort lookups (industry / size / geography), nulls excluded
CREATE INDEX IF NOT EXISTS dpi_results_cohort_idx  ON dpi_results (industry, org_size, geography);

-- 6. RLS — lock the table down. All writes go through the server (secret key,
--    which bypasses RLS). No anon read or write. Aggregated benchmark figures
--    will be exposed later via a dedicated server endpoint or a SECURITY DEFINER
--    view, never by opening this table to the anon key.
ALTER TABLE dpi_results ENABLE ROW LEVEL SECURITY;
-- (No anon policies created on purpose — anon has no access.)

-- Done.
-- Note: existing builds (1–3) are unaffected. This table is additive.
