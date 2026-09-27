import { explainEndingSelection } from "../engine/index.js";
import { russianAiFutureSim } from "./ru.js";

const supportedBundles = Object.freeze({ ru: russianAiFutureSim });

/** @param {"en" | "ru"} language */
export function getLanguageBundle(language) {
  return language === "ru" ? supportedBundles.ru : null;
}

/** @param {"en" | "ru"} language @param {string} key @param {string} englishText */
export function getUiCopy(language, key, englishText) {
  if (language === "en") return englishText;
  const text = supportedBundles[language]?.ui[key];
  if (typeof text !== "string") throw new Error(`Missing ${language} UI copy: ${key}`);
  return text;
}

/** @param {"en" | "ru"} language @param {"title" | "introduction"} field @param {string} englishText */
export function getLocalizedScenarioField(language, field, englishText) {
  if (language === "en") return englishText;
  const text = supportedBundles[language]?.scenario[field];
  if (typeof text !== "string") throw new Error(`Missing ${language} scenario copy: ${field}`);
  return text;
}

/** @param {"en" | "ru"} language @param {string} collection @param {string} id @param {string} field @param {string} englishText */
export function getLocalizedField(language, collection, id, field, englishText) {
  if (language === "en") return englishText;
  const text = supportedBundles[language]?.[collection]?.[id]?.[field];
  if (typeof text !== "string") throw new Error(`Missing ${language} copy: ${collection}.${id}.${field}`);
  return text;
}

/** @param {"en" | "ru"} language @param {string} resourceId @param {string} englishText */
export function getResourceLabel(language, resourceId, englishText) {
  if (language === "en") return englishText;
  const label = supportedBundles[language]?.resources[resourceId];
  if (typeof label !== "string") throw new Error(`Missing ${language} resource label: ${resourceId}`);
  return label;
}

/** @param {"en" | "ru"} language @param {string} stateId @param {string} englishText */
export function getWorldStateLabel(language, stateId, englishText) {
  if (language === "en") return englishText;
  const label = supportedBundles[language]?.worldState[stateId];
  if (typeof label !== "string") throw new Error(`Missing ${language} world-state label: ${stateId}`);
  return label;
}

/**
 * Localizes the actual reasons returned by the deterministic engine. Each
 * message is selected from the failed condition or insufficient resource.
 * @param {import("../engine/domain.js").ChoiceAvailability} choice
 * @param {"en" | "ru"} language
 * @returns {string}
 */
export function getLocalizedLockReason(choice, language) {
  if (language === "en") return choice.lockedReason ?? "This option is unavailable on the current path.";
  const messages = [...new Set(choice.lockReasons.map((reason) => {
    if (reason.target === "choice") return supportedBundles.ru.choiceLocks[choice.id];
    if (reason.target === "resources" && reason.conditionId == null) return supportedBundles.ru.resourceLockReasons[reason.targetId];
    return supportedBundles.ru.lockConditions[reason.conditionId];
  }).filter((message) => typeof message === "string"))];
  return messages.join(" ") || supportedBundles.ru.ui.fallbackLock;
}

/** @param {import("../engine/domain.js").Scenario} scenario @param {import("../engine/domain.js").GameSessionState} state @param {"en" | "ru"} language */
export function getLocalizedEndingReasons(scenario, state, language) {
  const trace = explainEndingSelection(scenario, state);
  const outcome = scenario.levels[state.currentLevelIndex]?.endings?.find((ending) => ending.id === trace.endingId);
  if (!outcome) throw new Error("The selected Future World has no authored player explanation.");
  const matchedConditionIds = new Set(trace.matchedConditions.map((condition) => condition.id));
  const reasons = (outcome.playerReasons ?? []).filter((reason) =>
    reason.conditionId === null ? trace.fallbackUsed : matchedConditionIds.has(reason.conditionId)
  );
  if (language === "en") return reasons.map((reason) => reason.text);
  const localizedEnding = supportedBundles.ru.endings[outcome.id];
  return reasons.map((reason, index) => {
    const key = reason.conditionId ?? `${outcome.id}_fallback_${index + 1}`;
    const text = localizedEnding?.reasons[key];
    if (typeof text !== "string") throw new Error(`Missing Russian ending reason: ${outcome.id}.${key}`);
    return text;
  });
}

/** @param {import("../engine/domain.js").Scenario} scenario @param {typeof russianAiFutureSim} locale */
export function validateLocaleCompleteness(scenario, locale = russianAiFutureSim) {
  const missing = [];
  const need = (value, key) => {
    if (typeof value !== "string" || value.trim() === "") missing.push(key);
  };
  const fields = (source, translations, collection, fieldNames) => {
    for (const entity of source) {
      for (const field of fieldNames) {
        if (entity[field] !== undefined) need(translations?.[entity.id]?.[field], `${collection}.${entity.id}.${field}`);
      }
    }
  };

  for (const key of [
    "tagline", "startSimulation", "selectRole", "selectMission", "beginFirstDecision", "yearOf",
    "cost", "locked", "currentState", "resources", "decisionRecorded", "advanceNextStep", "futureWorld",
    "whyFuture", "consequenceVisible", "completedFallbackTitle", "completedFallbackDescription", "unavailableAction", "fallbackLock",
  ]) need(locale.ui?.[key], `ui.${key}`);

  need(locale.scenario?.title, "scenario.title");
  need(locale.scenario?.introduction, "scenario.introduction");
  fields(scenario.roles, locale.roles, "roles", ["title", "description"]);
  fields(scenario.missions, locale.missions, "missions", ["title", "description"]);
  fields(scenario.levels, locale.levels, "levels", ["title", "prompt", "description"]);

  for (const level of scenario.levels) {
    for (const choice of level.choices ?? []) {
      for (const field of ["title", "description", "outcome"]) need(locale.choices?.[choice.id]?.[field], `choices.${choice.id}.${field}`);
      if (choice.lockedReason !== undefined) need(locale.choiceLocks?.[choice.id], `choiceLocks.${choice.id}`);
      for (const consequence of choice.delayedConsequences ?? []) {
        need(locale.consequences?.[consequence.id]?.title, `consequences.${consequence.id}.title`);
        need(locale.consequences?.[consequence.id]?.description, `consequences.${consequence.id}.description`);
      }
    }
    for (const ending of level.endings ?? []) {
      need(locale.endings?.[ending.id]?.title, `endings.${ending.id}.title`);
      need(locale.endings?.[ending.id]?.description, `endings.${ending.id}.description`);
      for (const [index, reason] of (ending.playerReasons ?? []).entries()) {
        const key = reason.conditionId ?? `${ending.id}_fallback_${index + 1}`;
        need(locale.endings?.[ending.id]?.reasons?.[key], `endings.${ending.id}.reasons.${key}`);
      }
    }
  }
  for (const resourceId of Object.keys(scenario.initialResources)) need(locale.resources?.[resourceId], `resources.${resourceId}`);
  for (const stateId of Object.keys(scenario.initialWorldState)) need(locale.worldState?.[stateId], `worldState.${stateId}`);
  const lockConditionIds = new Set(scenario.levels.flatMap((level) => (level.choices ?? []).flatMap((choice) => choice.unlock?.conditionIds ?? [])));
  for (const conditionId of lockConditionIds) {
    const condition = scenario.conditions.find((item) => item.id === conditionId);
    if (condition?.target === "choice") continue;
    need(locale.lockConditions?.[conditionId], `lockConditions.${conditionId}`);
  }
  return { valid: missing.length === 0, missing };
}
