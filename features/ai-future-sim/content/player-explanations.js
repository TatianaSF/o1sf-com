import { explainEndingSelection } from "../engine/index.js";

/**
 * Builds a player-facing explanation only from authored copy tied to conditions
 * that matched the already selected ending. This does not participate in
 * ending resolution.
 * @param {import("../engine/domain.js").Scenario} scenario
 * @param {import("../engine/domain.js").GameSessionState} state
 * @returns {{ endingId: string, reasons: string[], summary: string }}
 */
export function explainEndingForPlayer(scenario, state) {
  const trace = explainEndingSelection(scenario, state);
  const endingLevel = scenario.levels[state.currentLevelIndex];
  const outcome = endingLevel.endings?.find((ending) => ending.id === trace.endingId);
  if (!outcome) throw new Error("The selected Future World has no authored player explanation.");

  const matchedConditionIds = new Set(trace.matchedConditions.map((condition) => condition.id));
  const reasons = (outcome.playerReasons ?? [])
    .filter((reason) => reason.conditionId === null ? trace.fallbackUsed : matchedConditionIds.has(reason.conditionId))
    .map((reason) => reason.text);

  if (reasons.length < 2 || reasons.length > 4) {
    throw new Error(`Future World ${outcome.id} must produce two to four player-facing reasons.`);
  }

  return {
    endingId: outcome.id,
    reasons,
    summary: reasons.join(" "),
  };
}
