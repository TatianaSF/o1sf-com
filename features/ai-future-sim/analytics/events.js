import { resolveAiFutureSimLanguage } from "../config/language.js";

export const aiFutureSimEventNames = Object.freeze([
  "game_started",
  "role_selected",
  "mission_selected",
  "level_viewed",
  "choice_selected",
  "game_completed",
]);

const supportedEventNames = new Set(aiFutureSimEventNames);

/**
 * @param {{eventId: string, anonymousSessionId: string, eventName: string, scenarioId?: string | null, scenarioVersion?: number | null, levelId?: string | null, choiceId?: string | null, roleId?: string | null, missionId?: string | null, languageMode?: string, developmentLanguage?: "en" | "ru", occurredAt?: string, metadata?: Record<string, unknown>}} input
 */
export function createAiFutureSimEvent({
  eventId,
  anonymousSessionId,
  eventName,
  scenarioId = null,
  scenarioVersion = null,
  levelId = null,
  choiceId = null,
  roleId = null,
  missionId = null,
  languageMode = "production",
  developmentLanguage,
  occurredAt = new Date().toISOString(),
  metadata = {},
}) {
  if (!supportedEventNames.has(eventName)) {
    throw new TypeError(`Unsupported AI Future Sim event: ${eventName}`);
  }
  if (!eventId || !anonymousSessionId) {
    throw new TypeError("eventId and anonymousSessionId are required");
  }
  if (scenarioId && (!Number.isInteger(scenarioVersion) || scenarioVersion < 1)) {
    throw new TypeError("scenarioVersion must be a positive integer when scenarioId is set");
  }
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    throw new TypeError("metadata must be an object");
  }
  const language = resolveAiFutureSimLanguage({ mode: languageMode, developmentLanguage });

  return {
    eventId,
    anonymousSessionId,
    eventName,
    scenarioId,
    scenarioVersion,
    levelId,
    choiceId,
    roleId,
    missionId,
    language,
    occurredAt,
    metadata,
  };
}
