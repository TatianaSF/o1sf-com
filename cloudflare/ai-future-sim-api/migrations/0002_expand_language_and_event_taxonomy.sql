PRAGMA defer_foreign_keys = ON;

CREATE TABLE session_runs_v2 (
  session_run_id TEXT PRIMARY KEY NOT NULL,
  anonymous_session_id TEXT NOT NULL,
  scenario_id TEXT,
  role_id TEXT,
  mission_id TEXT,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ru')),
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TEXT NOT NULL,
  completed_at TEXT,
  metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata))
);

INSERT INTO session_runs_v2 (
  session_run_id, anonymous_session_id, scenario_id, role_id, mission_id,
  language, status, started_at, completed_at, metadata
)
SELECT
  session_run_id, anonymous_session_id, scenario_id, role_id, mission_id,
  language, status, started_at, completed_at, metadata
FROM session_runs;

CREATE TABLE analytics_events_v2 (
  event_id TEXT PRIMARY KEY NOT NULL,
  anonymous_session_id TEXT NOT NULL,
  session_run_id TEXT REFERENCES session_runs (session_run_id),
  event_name TEXT NOT NULL,
  scenario_id TEXT,
  level_id TEXT,
  choice_id TEXT,
  role_id TEXT,
  mission_id TEXT,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'ru')),
  occurred_at TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata))
);

INSERT INTO analytics_events_v2 (
  event_id, anonymous_session_id, session_run_id, event_name, scenario_id,
  level_id, choice_id, role_id, mission_id, language, occurred_at, metadata
)
SELECT
  event_id, anonymous_session_id, session_run_id, event_name, scenario_id,
  level_id, choice_id, role_id, mission_id, language, occurred_at, metadata
FROM analytics_events;

DROP TABLE analytics_events;
ALTER TABLE analytics_events_v2 RENAME TO analytics_events;
DROP TABLE session_runs;
ALTER TABLE session_runs_v2 RENAME TO session_runs;

CREATE INDEX session_runs_by_anonymous_session
  ON session_runs (anonymous_session_id, started_at DESC);

CREATE INDEX analytics_events_by_name_and_time
  ON analytics_events (event_name, occurred_at DESC);

CREATE INDEX analytics_events_by_session_and_time
  ON analytics_events (anonymous_session_id, occurred_at DESC);
