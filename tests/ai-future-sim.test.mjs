import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  aiFutureSimEventNames,
  createAiFutureSimEvent,
} from "../features/ai-future-sim/analytics/events.js";
import {
  productionLanguage,
  resolveAiFutureSimLanguage,
  supportedLanguages,
} from "../features/ai-future-sim/config/language.js";

test("AI Future Sim production language is English and its taxonomy is complete", () => {
  assert.equal(productionLanguage, "en");
  assert.deepEqual(supportedLanguages, ["en", "ru"]);
  assert.equal(resolveAiFutureSimLanguage(), "en");
  assert.equal(resolveAiFutureSimLanguage({ mode: "production", developmentLanguage: "ru" }), "en");
  assert.equal(resolveAiFutureSimLanguage({ mode: "manual_development", developmentLanguage: "ru" }), "ru");
  assert.throws(() => resolveAiFutureSimLanguage({ mode: "automatic_locale" }), /Unsupported AI Future Sim language mode/);
  assert.deepEqual(aiFutureSimEventNames, [
    "game_started",
    "role_selected",
    "mission_selected",
    "level_viewed",
    "choice_selected",
    "game_completed",
  ]);
});

test("AI Future Sim events carry stable identifiers, language, and extensible metadata", () => {
  const event = createAiFutureSimEvent({
    eventId: "event-1",
    anonymousSessionId: "session-1",
    eventName: "choice_selected",
    choiceId: "choice-1",
    occurredAt: "2026-09-26T00:00:00.000Z",
    metadata: { source: "simulation" },
  });

  assert.equal(event.language, "en");
  assert.equal(event.choiceId, "choice-1");
  assert.deepEqual(event.metadata, { source: "simulation" });
  const versioned = createAiFutureSimEvent({
    eventId: "event-versioned",
    anonymousSessionId: "session-1",
    eventName: "game_started",
    scenarioId: "founder_ai_organization",
    scenarioVersion: 1,
  });
  assert.equal(versioned.scenarioVersion, 1);
  assert.throws(() => createAiFutureSimEvent({
    eventId: "event-missing-version",
    anonymousSessionId: "session-1",
    eventName: "game_started",
    scenarioId: "founder_ai_organization",
  }), /scenarioVersion must be a positive integer/);
  assert.equal(createAiFutureSimEvent({
    eventId: "event-ru",
    anonymousSessionId: "session-1",
    eventName: "game_started",
    languageMode: "manual_development",
    developmentLanguage: "ru",
  }).language, "ru");
  assert.equal(createAiFutureSimEvent({
    eventId: "event-production",
    anonymousSessionId: "session-1",
    eventName: "game_started",
    developmentLanguage: "ru",
  }).language, "en");
  assert.throws(() => createAiFutureSimEvent({
    eventId: "event-2",
    anonymousSessionId: "session-1",
    eventName: "unknown_event",
  }), /Unsupported AI Future Sim event/);
});

test("AI Future Sim route is thin and presents an English module mount marker", async () => {
  const [route, ui] = await Promise.all([
    readFile(new URL("../app/ai-future-sim/page.jsx", import.meta.url), "utf8"),
    readFile(new URL("../features/ai-future-sim/ui/AiFutureSimLanding.jsx", import.meta.url), "utf8"),
  ]);

  assert.match(route, /features\/ai-future-sim\/ui\/AiFutureSimLanding/);
  assert.match(ui, /lang="en"/);
  assert.match(ui, /data-product="ai-future-sim"/);
  assert.doesNotMatch(`${route}\n${ui}`, /lang=ru|\?lang=ru|\/ru\b/i);
});

test("D1 migration defines the initial session and analytics tables", async () => {
  const migration = await readFile(
    new URL("../cloudflare/ai-future-sim-api/migrations/0001_initial.sql", import.meta.url),
    "utf8",
  );

  assert.match(migration, /CREATE TABLE session_runs/);
  assert.match(migration, /CREATE TABLE analytics_events/);
  for (const field of ["event_id", "anonymous_session_id", "event_name", "scenario_id", "level_id", "choice_id", "role_id", "mission_id", "language", "occurred_at", "metadata"]) {
    assert.match(migration, new RegExp(`\\b${field}\\b`));
  }
});

test("versioned D1 correction supports manual-development language and app-owned event taxonomy", async () => {
  const migration = await readFile(
    new URL("../cloudflare/ai-future-sim-api/migrations/0002_expand_language_and_event_taxonomy.sql", import.meta.url),
    "utf8",
  );

  assert.match(migration, /language IN \('en', 'ru'\)/);
  assert.doesNotMatch(migration, /event_name TEXT NOT NULL CHECK/);
});

test("versioned D1 migration records scenario versions on sessions and events", async () => {
  const migration = await readFile(
    new URL("../cloudflare/ai-future-sim-api/migrations/0003_scenario_version.sql", import.meta.url),
    "utf8",
  );

  assert.match(migration, /ALTER TABLE session_runs[\s\S]*ADD COLUMN scenario_version INTEGER NOT NULL DEFAULT 1/);
  assert.match(migration, /ALTER TABLE analytics_events[\s\S]*ADD COLUMN scenario_version INTEGER NOT NULL DEFAULT 1/);
});
