CREATE TABLE session_runs (
  session_run_id TEXT PRIMARY KEY NOT NULL,
  anonymous_session_id TEXT NOT NULL,
  scenario_id TEXT,
  role_id TEXT,
  mission_id TEXT,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language = 'en'),
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TEXT NOT NULL,
  completed_at TEXT,
  metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata))
);

CREATE INDEX session_runs_by_anonymous_session
  ON session_runs (anonymous_session_id, started_at DESC);

CREATE TABLE analytics_events (
  event_id TEXT PRIMARY KEY NOT NULL,
  anonymous_session_id TEXT NOT NULL,
  session_run_id TEXT REFERENCES session_runs (session_run_id),
  event_name TEXT NOT NULL CHECK (event_name IN (
    'game_started',
    'role_selected',
    'mission_selected',
    'level_viewed',
    'choice_selected',
    'game_completed'
  )),
  scenario_id TEXT,
  level_id TEXT,
  choice_id TEXT,
  role_id TEXT,
  mission_id TEXT,
  language TEXT NOT NULL DEFAULT 'en' CHECK (language = 'en'),
  occurred_at TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata))
);

CREATE INDEX analytics_events_by_name_and_time
  ON analytics_events (event_name, occurred_at DESC);

CREATE INDEX analytics_events_by_session_and_time
  ON analytics_events (anonymous_session_id, occurred_at DESC);
