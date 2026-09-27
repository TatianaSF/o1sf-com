ALTER TABLE session_runs
  ADD COLUMN scenario_version INTEGER NOT NULL DEFAULT 1 CHECK (scenario_version >= 1);

ALTER TABLE analytics_events
  ADD COLUMN scenario_version INTEGER NOT NULL DEFAULT 1 CHECK (scenario_version >= 1);
