/** @typedef {import("./domain.js").Scenario} Scenario */
/** @typedef {import("./domain.js").GameSessionState} GameSessionState */
/** @typedef {import("./domain.js").Condition} Condition */
/** @typedef {import("./domain.js").Effect} Effect */
/** @typedef {import("./domain.js").ChoiceAvailability} ChoiceAvailability */

export class GameRuleError extends Error {
  /** @param {string} code @param {string} message */
  constructor(code, message) {
    super(message);
    this.name = "GameRuleError";
    this.code = code;
  }
}

function fail(code, message) {
  throw new GameRuleError(code, message);
}

function assertScenario(scenario) {
  if (
    !scenario ||
    typeof scenario.id !== "string" ||
    !Number.isInteger(scenario.version) ||
    scenario.version < 1 ||
    !Array.isArray(scenario.roles) ||
    !Array.isArray(scenario.missions) ||
    !Array.isArray(scenario.conditions) ||
    !Array.isArray(scenario.levels) ||
    scenario.levels.length === 0
  ) {
    fail("invalid_scenario", "Scenario content is incomplete.");
  }
}

/** @param {Scenario} scenario @param {GameSessionState} state */
function assertScenarioState(scenario, state) {
  assertScenario(scenario);
  if (!state || state.scenarioId !== scenario.id || state.scenarioVersion !== scenario.version) {
    fail("scenario_mismatch", "The game state does not belong to this scenario version.");
  }
}

/** @param {Scenario} scenario @returns {GameSessionState} */
export function startScenario(scenario) {
  assertScenario(scenario);
  return {
    scenarioId: scenario.id,
    scenarioVersion: scenario.version,
    stage: "role_selection",
    roleId: null,
    missionId: null,
    currentLevelIndex: Math.max(0, scenario.levels.findIndex((level) => level.id === scenario.startLevelId)),
    worldState: { ...scenario.initialWorldState },
    resources: { ...scenario.initialResources },
    history: [],
    ending: null,
    pendingConsequences: [],
    revealedConsequences: [],
    newlyRevealedConsequences: [],
    lastChoice: null,
  };
}

/** @param {Scenario} scenario @param {GameSessionState} state @param {string} roleId @returns {GameSessionState} */
export function selectRole(scenario, state, roleId) {
  assertScenarioState(scenario, state);
  if (state.stage !== "role_selection") {
    fail("invalid_transition", "A role can only be selected at the role-selection step.");
  }
  if (!scenario.roles.some((role) => role.id === roleId)) {
    fail("invalid_role", "That role is not available in this scenario.");
  }
  return { ...state, roleId, stage: "mission_selection" };
}

/** @param {Scenario} scenario @param {GameSessionState} state @param {string} missionId @returns {GameSessionState} */
export function selectMission(scenario, state, missionId) {
  assertScenarioState(scenario, state);
  if (state.stage !== "mission_selection") {
    fail("invalid_transition", "A mission can only be selected after a role.");
  }
  const mission = scenario.missions.find((candidate) => candidate.id === missionId);
  if (!mission || (mission.roleIds && !mission.roleIds.includes(state.roleId ?? ""))) {
    fail("invalid_mission", "That mission is not available for the selected role.");
  }
  const startIndex = scenario.levels.findIndex((level) => level.id === scenario.startLevelId);
  return {
    ...state,
    missionId,
    stage: "scenario_intro",
    currentLevelIndex: Math.max(0, startIndex),
  };
}

/** @param {Scenario} scenario @param {GameSessionState} state */
export function readCurrentLevel(scenario, state) {
  assertScenarioState(scenario, state);
  if (["role_selection", "mission_selection"].includes(state.stage)) {
    fail("level_not_ready", "Select a role and mission before reading the scenario.");
  }
  return {
    ...scenario.levels[state.currentLevelIndex],
    revealedConsequences: state.newlyRevealedConsequences,
  };
}

/** @param {GameSessionState} state @param {Condition} condition */
function meetsCondition(state, condition) {
  if (condition.target === "choice") {
    return condition.operator === "selected" && state.history.some((entry) => entry.choiceId === condition.choiceId);
  }
  const values = condition.target === "world" ? state.worldState : condition.target === "resources" ? state.resources : null;
  if (!values) return false;
  const actual = values[condition.key];
  if (!Number.isFinite(actual)) return false;
  if (condition.operator === "gte") return actual >= condition.value;
  if (condition.operator === "lte") return actual <= condition.value;
  if (condition.operator === "eq") return actual === condition.value;
  return false;
}

/** @param {Scenario} scenario @param {GameSessionState} state @param {string[]} conditionIds */
function meetsUnlock(scenario, state, conditionIds = []) {
  return conditionIds.every((conditionId) => {
    const condition = scenario.conditions.find((candidate) => candidate.id === conditionId);
    return Boolean(condition && meetsCondition(state, condition));
  });
}

/** @param {GameSessionState} state @param {Effect[]} effects */
function hasAffordableEffects(state, effects = []) {
  return effects.every((effect) => {
    if (effect.target !== "resources" || effect.delta >= 0) return true;
    return (state.resources[effect.key] ?? -1) + effect.delta >= 0;
  });
}

const lockMessages = Object.freeze({
  resources: Object.freeze({
    capital: "Requires more capital.",
    time: "Requires more time.",
    talent: "Requires more organizational capacity.",
  }),
  world: Object.freeze({
    ai_adoption: "Requires stronger AI adoption.",
    human_capability: "Requires stronger human expertise.",
    productivity: "Requires higher productivity.",
    employment_resilience: "Requires stronger employment resilience.",
    ai_dependence: "Requires greater AI dependence.",
    organizational_trust: "Requires stronger organizational trust.",
  }),
});

/** @param {Scenario} scenario @param {GameSessionState} state @param {import("./domain.js").Choice} choice */
function getLockReasons(scenario, state, choice) {
  const reasons = [];
  for (const conditionId of choice.unlock?.conditionIds ?? []) {
    const condition = scenario.conditions.find((candidate) => candidate.id === conditionId);
    if (!condition || meetsCondition(state, condition)) continue;
    const reason = {
      conditionId,
      target: condition.target,
      targetId: condition.target === "choice" ? condition.choiceId : condition.key,
      operator: condition.operator,
      requiredValue: condition.target === "choice" ? null : condition.value,
      actualValue: condition.target === "choice"
        ? state.history.some((entry) => entry.choiceId === condition.choiceId)
        : (condition.target === "world" ? state.worldState : state.resources)[condition.key],
      code: condition.target === "choice"
        ? "prerequisite_choice_not_taken"
        : condition.target === "world" && condition.key === "human_capability"
          ? "missing_capability"
          : condition.target === "resources"
            ? "insufficient_resource"
            : "unmet_world_state_threshold",
      message: condition.target === "choice"
        ? choice.lockedReason ?? "An earlier prerequisite decision was not selected."
        : lockMessages[condition.target]?.[condition.key] ?? "A required deterministic scenario condition has not been met.",
    };
    reasons.push(reason);
  }
  for (const effect of choice.effects) {
    if (effect.target !== "resources" || effect.delta >= 0) continue;
    const availableValue = state.resources[effect.key] ?? 0;
    const requiredValue = Math.abs(effect.delta);
    if (availableValue < requiredValue) {
      reasons.push({
        code: "insufficient_resource",
        conditionId: null,
        target: "resources",
        targetId: effect.key,
        operator: "gte",
        requiredValue,
        actualValue: availableValue,
        message: lockMessages.resources[effect.key] ?? "Requires more resources.",
      });
    }
  }
  return reasons;
}

/**
 * Lists choices with availability so locked options remain visible. For the
 * canonical organization-design step this returns the seven authored choices.
 * @param {Scenario} scenario
 * @param {GameSessionState} state
 * @returns {ChoiceAvailability[]}
 */
export function getCurrentChoices(scenario, state) {
  assertScenarioState(scenario, state);
  if (!["decision", "level_ready"].includes(state.stage)) {
    fail("choices_not_ready", "Choices are only available at a decision step.");
  }
  const level = scenario.levels[state.currentLevelIndex];
  return (level.choices ?? []).map((choice) => {
    const unlocked = meetsUnlock(scenario, state, choice.unlock?.conditionIds);
    const affordable = hasAffordableEffects(state, choice.effects);
    const available = unlocked && affordable;
    const lockReasons = available ? [] : getLockReasons(scenario, state, choice);
    const playerLockReasons = [...new Set(lockReasons.map((reason) => reason.message).filter(Boolean))];
    return {
      id: choice.id,
      title: choice.title,
      description: choice.description,
      outcome: choice.outcome,
      available,
      unlocked,
      affordable,
      lockReasonCode: lockReasons[0]?.code ?? null,
      lockReasons,
      lockedReason: available ? null : playerLockReasons.join(" ") || "This option is unavailable on the current path.",
    };
  });
}

/** @param {GameSessionState} state @param {Effect[]} effects */
function applyEffects(state, effects) {
  const next = { worldState: { ...state.worldState }, resources: { ...state.resources } };
  for (const effect of effects) {
    const target = effect.target === "world" ? next.worldState : effect.target === "resources" ? next.resources : null;
    if (!target || !Object.hasOwn(target, effect.key) || !Number.isFinite(effect.delta)) {
      fail("invalid_effect", `Effect references an unknown value: ${effect.key}.`);
    }
    const value = target[effect.key] + effect.delta;
    if (!Number.isFinite(value) || value < 0) {
      fail("insufficient_resources", `The effect would make ${effect.key} unavailable.`);
    }
    target[effect.key] = value;
  }
  return next;
}

/** @param {Scenario} scenario @param {GameSessionState} state @param {string} choiceId @returns {GameSessionState} */
export function selectChoice(scenario, state, choiceId) {
  assertScenarioState(scenario, state);
  if (!["decision", "level_ready"].includes(state.stage)) {
    fail("invalid_transition", "A choice can only be selected during a decision step.");
  }
  const level = scenario.levels[state.currentLevelIndex];
  const choice = (level.choices ?? []).find((candidate) => candidate.id === choiceId);
  if (!choice) fail("invalid_choice", "That choice is not part of the current level.");

  const availability = getCurrentChoices(scenario, state).find((item) => item.id === choiceId);
  if (!availability?.available) {
    fail("choice_locked", availability?.lockedReason ?? "That choice is unavailable.");
  }

  const changed = applyEffects(state, choice.effects);
  const delayed = (choice.delayedConsequences ?? []).map((consequence) => ({
    ...consequence,
    effects: consequence.effects.map((effect) => ({ ...effect })),
    sourceChoiceId: choice.id,
  }));

  return {
    ...state,
    ...changed,
    stage: "step_complete",
    history: [...state.history, { levelId: level.id, choiceId: choice.id }],
    pendingConsequences: [...state.pendingConsequences, ...delayed],
    newlyRevealedConsequences: [],
    lastChoice: {
      levelId: level.id,
      choiceId: choice.id,
      nextLevelId: choice.nextLevelId ?? level.nextLevelId ?? null,
      outcome: choice.outcome,
      effects: choice.effects.map((effect) => ({ ...effect })),
    },
  };
}

/** @param {Scenario} scenario @param {GameSessionState} state @returns {GameSessionState} */
export function advanceStep(scenario, state) {
  assertScenarioState(scenario, state);
  if (state.stage === "scenario_intro") {
    const currentLevel = scenario.levels[state.currentLevelIndex];
    const nextIndex = scenario.levels.findIndex((level) => level.id === currentLevel?.nextLevelId);
    if (nextIndex < 0) fail("no_next_level", "This scenario has no valid next level.");
    return { ...state, currentLevelIndex: nextIndex, stage: "decision", newlyRevealedConsequences: [] };
  }
  if (state.stage !== "step_complete") {
    fail("invalid_transition", "Advance only after reading the introduction or resolving a choice.");
  }

  const currentLevel = scenario.levels[state.currentLevelIndex];
  const nextLevelId = state.lastChoice?.nextLevelId ?? currentLevel?.nextLevelId ?? null;
  const nextIndex = scenario.levels.findIndex((level) => level.id === nextLevelId);
  const nextLevel = nextIndex >= 0 ? scenario.levels[nextIndex] : null;
  if (!nextLevelId) {
    return { ...state, stage: "completed", newlyRevealedConsequences: [] };
  }
  if (!nextLevel) fail("broken_transition", `Next level ${nextLevelId} does not exist.`);

  let resolved = { worldState: { ...state.worldState }, resources: { ...state.resources } };
  const newlyRevealedConsequences = [];
  const pendingConsequences = [];
  for (const consequence of state.pendingConsequences) {
    if (consequence.activation?.type === "on_level_entry" && consequence.activation.levelId === nextLevel.id) {
      resolved = applyEffects({ ...state, ...resolved }, consequence.effects);
      newlyRevealedConsequences.push(consequence);
    } else {
      pendingConsequences.push(consequence);
    }
  }

  const settledState = { ...state, ...resolved };
  if (nextLevel.type === "ending") {
    const ending = (nextLevel.endings ?? []).find((outcome) =>
      outcome.conditionIds.every((conditionId) => {
        const condition = scenario.conditions.find((candidate) => candidate.id === conditionId);
        return Boolean(condition && meetsCondition(settledState, condition));
      }),
    );
    if (!ending) fail("missing_ending_outcome", `No Future World outcome matched at ${nextLevel.id}.`);
    return {
      ...state,
      ...resolved,
      currentLevelIndex: nextIndex,
      stage: "completed",
      ending: { ...ending },
      pendingConsequences,
      newlyRevealedConsequences,
      revealedConsequences: [...state.revealedConsequences, ...newlyRevealedConsequences],
    };
  }

  return {
    ...state,
    ...resolved,
    currentLevelIndex: nextIndex,
    stage: "level_ready",
    pendingConsequences,
    newlyRevealedConsequences,
    revealedConsequences: [...state.revealedConsequences, ...newlyRevealedConsequences],
  };
}

/**
 * Explains the existing authored ending priority without changing resolution.
 * Only outcomes through the first match are marked as evaluated, matching the
 * resolver's ordered find/every behavior.
 * @param {Scenario} scenario
 * @param {GameSessionState} state
 */
export function explainEndingSelection(scenario, state) {
  assertScenarioState(scenario, state);
  if (state.stage !== "completed" || !state.ending) {
    fail("ending_not_selected", "Ending diagnostics require a completed game state.");
  }
  const level = scenario.levels[state.currentLevelIndex];
  if (level?.type !== "ending") fail("invalid_ending_node", "The completed state is not at an ending node.");

  const evaluationOrder = [];
  for (const [index, outcome] of (level.endings ?? []).entries()) {
    const testedConditions = [];
    let matched = true;
    for (const conditionId of outcome.conditionIds) {
      const condition = scenario.conditions.find((candidate) => candidate.id === conditionId);
      if (!condition) {
        matched = false;
        break;
      }
      const actualValue = condition.target === "choice"
        ? state.history.some((entry) => entry.choiceId === condition.choiceId)
        : (condition.target === "world" ? state.worldState : state.resources)[condition.key];
      const conditionMatched = meetsCondition(state, condition);
      testedConditions.push({
        id: condition.id,
        target: condition.target,
        targetId: condition.target === "choice" ? condition.choiceId : condition.key,
        operator: condition.operator,
        requiredValue: condition.target === "choice" ? true : condition.value,
        actualValue,
        matched: conditionMatched,
      });
      if (!conditionMatched) {
        matched = false;
        break;
      }
    }
    evaluationOrder.push({
      id: outcome.id,
      title: outcome.title,
      priority: index + 1,
      evaluated: true,
      matched,
      selected: outcome.id === state.ending.id,
      conditions: testedConditions,
    });
    if (matched) break;
  }

  const selected = evaluationOrder.find((outcome) => outcome.selected);
  if (!selected) fail("ending_explanation_mismatch", "The selected ending was not found in the authored priority trace.");
  const relevantWorldStateKeys = [...new Set((level.endings ?? []).flatMap((outcome) => outcome.conditionIds)
    .map((id) => scenario.conditions.find((condition) => condition.id === id))
    .filter((condition) => condition?.target === "world")
    .map((condition) => (condition && "key" in condition ? condition.key : null))
    .filter((key) => typeof key === "string"))];
  const otherMatchingEndingIds = (level.endings ?? [])
    .filter((outcome) => outcome.id !== state.ending.id && outcome.conditionIds.every((id) => {
      const condition = scenario.conditions.find((candidate) => candidate.id === id);
      return Boolean(condition && meetsCondition(state, condition));
    }))
    .map((outcome) => outcome.id);

  return {
    scenarioId: scenario.id,
    scenarioVersion: scenario.version,
    endingId: state.ending.id,
    endingTitle: state.ending.title,
    matchedConditions: selected.conditions,
    relevantFinalWorldState: Object.fromEntries(relevantWorldStateKeys.map((key) => [key, state.worldState[key]])),
    flags: state.flags ?? [],
    capabilities: state.capabilities ?? [],
    higherPriorityEvaluations: evaluationOrder.filter((outcome) => outcome.priority < selected.priority),
    evaluationOrder,
    otherMatchingEndingIds,
    fallbackUsed: selected.conditions.length === 0,
  };
}
