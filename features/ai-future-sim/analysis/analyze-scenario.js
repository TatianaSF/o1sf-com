import {
  advanceStep,
  getCurrentChoices,
  selectChoice,
  selectMission,
  selectRole,
  startScenario,
} from "../engine/index.js";
/** @typedef {import("../engine/domain.js").GameSessionState} GameSessionState */
/** @typedef {import("../engine/domain.js").ChoiceAvailability} ChoiceAvailability */

const round = (value) => Math.round(value * 100) / 100;

function conditionMatches(condition, state) {
  if (condition.target === "choice") {
    return condition.operator === "selected" && state.history.some((entry) => entry.choiceId === condition.choiceId);
  }
  const values = condition.target === "world" ? state.worldState : condition.target === "resources" ? state.resources : null;
  const actual = values?.[condition.key];
  if (!Number.isFinite(actual)) return false;
  if (condition.operator === "gte") return actual >= condition.value;
  if (condition.operator === "lte") return actual <= condition.value;
  if (condition.operator === "eq") return actual === condition.value;
  return false;
}

function outcomeMatches(scenario, outcome, state) {
  return outcome.conditionIds.every((conditionId) => {
    const condition = scenario.conditions.find((item) => item.id === conditionId);
    return condition && conditionMatches(condition, state);
  });
}

function makeRangeAccumulator(keys) {
  return Object.fromEntries(keys.map((key) => [key, { min: Infinity, max: -Infinity, total: 0 }]));
}

function addRangeSample(ranges, values) {
  for (const [key, value] of Object.entries(values)) {
    const range = ranges[key];
    range.min = Math.min(range.min, value);
    range.max = Math.max(range.max, value);
    range.total += value;
  }
}

function finishRanges(ranges, sampleCount) {
  return Object.fromEntries(Object.entries(ranges).map(([key, value]) => [key, {
    min: value.min,
    max: value.max,
    mean: round(value.total / sampleCount),
  }]));
}

function truthMap(scenario, state) {
  return new Map(scenario.conditions.map((condition) => [condition.id, conditionMatches(condition, state)]));
}

function deltaProfiles(choice) {
  const world = {};
  const resources = {};
  for (const effect of choice.effects) {
    const target = effect.target === "world" ? world : resources;
    target[effect.key] = (target[effect.key] ?? 0) + effect.delta;
  }
  return { world, resources };
}

/**
 * Exhaustively walks every reachable legal choice history through the engine.
 * Each distinct choice prefix is a separate decision-state visit.
 * @param {any} scenario
 */
export function analyzeScenarioBalance(scenario) {
  const endingLevel = scenario.levels.find((level) => level.type === "ending");
  if (!endingLevel?.endings?.length) throw new Error("Balance analysis requires an ending node with authored outcomes.");
  const decisionLevels = scenario.levels.filter((level) => level.type === "decision");
  const choices = decisionLevels.flatMap((level) => level.choices.map((choice) => ({ level, choice })));
  const choiceMetrics = new Map(choices.map(({ level, choice }) => [choice.id, {
    id: choice.id,
    levelId: level.id,
    availableStateCount: 0,
    lockedStateCount: 0,
    unlockedStateCount: 0,
    unlockRuleMetStateCount: 0,
    unlockRuleBlockedStateCount: 0,
    affordableStateCount: 0,
    resourceBlockedStateCount: 0,
    selectedPathCount: 0,
    unlockRuleConditionIds: choice.unlock?.conditionIds ?? [],
    delayedConsequenceIds: (choice.delayedConsequences ?? []).map((item) => item.id),
    effectProfile: deltaProfiles(choice),
    authoredOutcome: choice.outcome,
  }]));
  const consequenceMetrics = new Map(choices.flatMap(({ level, choice }) =>
    (choice.delayedConsequences ?? []).map((consequence) => [consequence.id, {
      id: consequence.id,
      originChoiceId: choice.id,
      originLevelId: level.id,
      revealLevelId: consequence.activation.levelId,
      selectedPathCount: 0,
      activationPathCount: 0,
      revealPathCount: 0,
      conditionCrossingPathCount: 0,
      laterOptionChangedPathCount: 0,
      endingChangedPathCount: 0,
      laterChangedChoiceIds: new Set(),
      crossedConditionIds: new Set(),
      effects: consequence.effects.map(({ target, key, delta }) => ({ target, key, delta })),
      effectTotals: consequence.effects.map(({ target, key, delta }) => ({ target, key, totalDelta: 0 })),
    }]),
  ));
  const endingCounts = new Map(endingLevel.endings.map((ending) => [ending.id, 0]));
  const endingConditionMatchCounts = new Map(endingLevel.endings.map((ending) => [ending.id, 0]));
  const endingConditionOverlapCounts = new Map();
  const endingMatchSetCounts = new Map();
  const endingBoundaryCounts = new Map();
  const stateRanges = {
    world: makeRangeAccumulator(Object.keys(scenario.initialWorldState)),
    resources: makeRangeAccumulator(Object.keys(scenario.initialResources)),
  };
  const agencyByLevel = new Map(decisionLevels.map((level) => [level.id, {
    id: level.id,
    title: level.title,
    stateCount: 0,
    availableChoiceCountHistogram: {},
    minAvailableChoices: Infinity,
    totalAvailableChoices: 0,
    fewerThanThreeAvailableStateCount: 0,
    availableChoiceSetCounts: {},
    forcedChoiceCounts: {},
  }]));
  const lowAgencySamples = [];
  const lowAgencyStates = [];
  const forcedChoiceSamples = [];
  let decisionStateVisitCount = 0;
  let completePathCount = 0;

  /** @param {GameSessionState} state @param {string[]} selectedChoiceIds @param {string[]} registeredConsequenceIds @param {Array<{id: string, revealLevelId: string, effects: Array<{target: string, key: string, delta: number}>, crossedConditionIds: string[]}>} consequenceEvents @param {Array<{levelIndex: number, state: GameSessionState, availability: ChoiceAvailability[]}>} decisionSnapshots */
  function recordCompletePath(state, selectedChoiceIds, registeredConsequenceIds, consequenceEvents, decisionSnapshots) {
    completePathCount += 1;
    for (const choiceId of selectedChoiceIds) choiceMetrics.get(choiceId).selectedPathCount += 1;
    for (const consequenceId of registeredConsequenceIds) consequenceMetrics.get(consequenceId).selectedPathCount += 1;
    for (const event of consequenceEvents) {
      const metric = consequenceMetrics.get(event.id);
      metric.activationPathCount += 1;
      metric.revealPathCount += 1;
      for (const [index, effect] of metric.effectTotals.entries()) {
        effect.totalDelta += event.effects[index].delta;
      }
      if (event.crossedConditionIds.length > 0) {
        metric.conditionCrossingPathCount += 1;
        for (const conditionId of event.crossedConditionIds) metric.crossedConditionIds.add(conditionId);
      }
      const effectDeltas = new Map();
      for (const effect of event.effects) {
        const key = `${effect.target}.${effect.key}`;
        effectDeltas.set(key, (effectDeltas.get(key) ?? 0) + effect.delta);
      }
      const counterfactualState = (sourceState) => {
        const changed = { ...sourceState, worldState: { ...sourceState.worldState }, resources: { ...sourceState.resources } };
        for (const [key, delta] of effectDeltas) {
          const [target, dimension] = key.split(".");
          changed[target === "world" ? "worldState" : "resources"][dimension] -= delta;
        }
        return changed;
      };
      const revealIndex = scenario.levels.findIndex((level) => level.id === event.revealLevelId);
      const changedChoiceIds = new Set();
      for (const snapshot of decisionSnapshots) {
        if (snapshot.levelIndex < revealIndex) continue;
        const changed = counterfactualState(snapshot.state);
        const baselineChoices = new Map(snapshot.availability.map((choice) => [choice.id, choice.available]));
        for (const choice of getCurrentChoices(scenario, changed)) {
          if (baselineChoices.get(choice.id) !== choice.available) changedChoiceIds.add(choice.id);
        }
      }
      if (changedChoiceIds.size > 0) {
        metric.laterOptionChangedPathCount += 1;
        for (const choiceId of changedChoiceIds) metric.laterChangedChoiceIds.add(choiceId);
      }
      const withoutConsequence = counterfactualState(state);
      const counterfactualEnding = endingLevel.endings.find((outcome) => outcomeMatches(scenario, outcome, withoutConsequence));
      if (counterfactualEnding?.id !== state.ending.id) metric.endingChangedPathCount += 1;
    }

    const endingId = state.ending?.id;
    if (!endingCounts.has(endingId)) throw new Error(`Engine returned unknown ending ${endingId}.`);
    endingCounts.set(endingId, endingCounts.get(endingId) + 1);
    addRangeSample(stateRanges.world, state.worldState);
    addRangeSample(stateRanges.resources, state.resources);

    const matchingOutcomes = endingLevel.endings.filter((outcome) => outcomeMatches(scenario, outcome, state));
    const matchSet = matchingOutcomes.map((outcome) => outcome.id);
    const matchSetKey = matchSet.join("|") || "(fallback only)";
    endingMatchSetCounts.set(matchSetKey, (endingMatchSetCounts.get(matchSetKey) ?? 0) + 1);
    for (const outcome of matchingOutcomes) endingConditionMatchCounts.set(outcome.id, endingConditionMatchCounts.get(outcome.id) + 1);
    const conditionalMatches = matchingOutcomes.filter((outcome) => outcome.conditionIds.length > 0);
    for (let left = 0; left < conditionalMatches.length; left += 1) {
      for (let right = left + 1; right < conditionalMatches.length; right += 1) {
        const pair = [conditionalMatches[left].id, conditionalMatches[right].id].sort();
        const key = pair.join("|");
        endingConditionOverlapCounts.set(key, (endingConditionOverlapCounts.get(key) ?? 0) + 1);
      }
    }
    const selectedIndex = endingLevel.endings.findIndex((outcome) => outcome.id === endingId);
    for (const higherOutcome of endingLevel.endings.slice(0, selectedIndex)) {
      if (outcomeMatches(scenario, higherOutcome, state)) continue;
      const failedNumericConditions = higherOutcome.conditionIds
        .map((id) => scenario.conditions.find((condition) => condition.id === id))
        .filter((condition) => condition && condition.target !== "choice" && !conditionMatches(condition, state));
      if (failedNumericConditions.length === 0) continue;
      const minNumericDistance = Math.min(...failedNumericConditions.map((condition) =>
        Math.abs((condition.target === "world" ? state.worldState : state.resources)[condition.key] - condition.value),
      ));
      const key = `${higherOutcome.id}=>${endingId}`;
      const record = endingBoundaryCounts.get(key) ?? {
        higherPriorityEndingId: higherOutcome.id,
        selectedEndingId: endingId,
        pathCount: 0,
        nearThresholdPathCount: 0,
        minObservedNumericGap: Infinity,
      };
      record.pathCount += 1;
      record.minObservedNumericGap = Math.min(record.minObservedNumericGap, minNumericDistance);
      if (minNumericDistance <= 1) record.nearThresholdPathCount += 1;
      endingBoundaryCounts.set(key, record);
    }
  }

  /** @param {GameSessionState} state @param {string[]} selectedChoiceIds @param {string[]} registeredConsequenceIds @param {Array<{id: string, revealLevelId: string, effects: Array<{target: string, key: string, delta: number}>, crossedConditionIds: string[]}>} consequenceEvents @param {Array<{levelIndex: number, state: GameSessionState, availability: ChoiceAvailability[]}>} decisionSnapshots */
  function visit(state, selectedChoiceIds = [], registeredConsequenceIds = [], consequenceEvents = [], decisionSnapshots = []) {
    if (state.stage === "completed") {
      recordCompletePath(state, selectedChoiceIds, registeredConsequenceIds, consequenceEvents, decisionSnapshots);
      return;
    }
    const level = scenario.levels[state.currentLevelIndex];
    const levelMetric = agencyByLevel.get(level.id);
    if (!levelMetric) throw new Error(`Unexpected non-decision node ${level.id} in decision traversal.`);
    const availability = getCurrentChoices(scenario, state);
    const availableCount = availability.filter((choice) => choice.available).length;
    decisionStateVisitCount += 1;
    levelMetric.stateCount += 1;
    levelMetric.availableChoiceCountHistogram[availableCount] = (levelMetric.availableChoiceCountHistogram[availableCount] ?? 0) + 1;
    const availableSetKey = availability.filter((choice) => choice.available).map((choice) => choice.id).join(",");
    levelMetric.availableChoiceSetCounts[availableSetKey] = (levelMetric.availableChoiceSetCounts[availableSetKey] ?? 0) + 1;
    levelMetric.minAvailableChoices = Math.min(levelMetric.minAvailableChoices, availableCount);
    levelMetric.totalAvailableChoices += availableCount;
    if (availableCount < 3) {
      levelMetric.fewerThanThreeAvailableStateCount += 1;
      lowAgencyStates.push({
        stateId: `${level.id}:${state.history.map((entry) => entry.choiceId).join(">")}`,
        levelId: level.id,
        availableCount,
        history: state.history.map((entry) => ({ levelId: entry.levelId, choiceId: entry.choiceId })),
        resources: { ...state.resources },
        worldState: { ...state.worldState },
        availableChoices: availability.filter((choice) => choice.available).map((choice) => choice.id),
        lockedChoices: availability.filter((choice) => !choice.available).map((choice) => ({
          id: choice.id,
          title: choice.title,
          reasonCode: choice.lockReasonCode,
          reasons: choice.lockReasons,
          message: choice.lockedReason,
        })),
      });
      if (lowAgencySamples.length < 10) {
        lowAgencySamples.push({ levelId: level.id, availableCount, history: state.history.map((entry) => entry.choiceId) });
      }
      if (availableCount === 1) {
        const availableChoiceId = availability.find((choice) => choice.available)?.id;
        levelMetric.forcedChoiceCounts[availableChoiceId] = (levelMetric.forcedChoiceCounts[availableChoiceId] ?? 0) + 1;
        if (forcedChoiceSamples.length < 20) {
          forcedChoiceSamples.push({ levelId: level.id, availableChoiceId, history: state.history.map((entry) => entry.choiceId) });
        }
      }
    }

    for (const choiceAvailability of availability) {
      const metric = choiceMetrics.get(choiceAvailability.id);
      if (choiceAvailability.available) metric.availableStateCount += 1;
      else metric.lockedStateCount += 1;
      if (choiceAvailability.unlocked) metric.unlockedStateCount += 1;
      if (choiceAvailability.affordable) metric.affordableStateCount += 1;
      if (metric.unlockRuleConditionIds.length > 0) {
        if (choiceAvailability.unlocked) metric.unlockRuleMetStateCount += 1;
        else metric.unlockRuleBlockedStateCount += 1;
      }
      if (!choiceAvailability.affordable) metric.resourceBlockedStateCount += 1;
    }

    if (availableCount === 0) throw new Error(`Reachable decision state has no available choices at ${level.id}.`);
    for (const choiceAvailability of availability.filter((choice) => choice.available)) {
      const authoredChoice = level.choices.find((choice) => choice.id === choiceAvailability.id);
      const selected = selectChoice(scenario, state, authoredChoice.id);
      const beforeConsequences = truthMap(scenario, selected);
      const advanced = advanceStep(scenario, selected);
      const newEvents = advanced.newlyRevealedConsequences.map((consequence) => {
        const afterConsequences = truthMap(scenario, advanced);
        const crossedConditionIds = [...afterConsequences]
          .filter(([conditionId, after]) => beforeConsequences.get(conditionId) !== after)
          .map(([conditionId]) => conditionId);
      return { id: consequence.id, revealLevelId: scenario.levels[advanced.currentLevelIndex]?.id ?? "", effects: consequence.effects, crossedConditionIds };
      });
      visit(
        advanced,
        [...selectedChoiceIds, authoredChoice.id],
        [...registeredConsequenceIds, ...(authoredChoice.delayedConsequences ?? []).map((item) => item.id)],
        [...consequenceEvents, ...newEvents],
        [...decisionSnapshots, { levelIndex: state.currentLevelIndex, state, availability }],
      );
    }
  }

  let state = startScenario(scenario);
  state = selectRole(scenario, state, scenario.roles[0].id);
  state = selectMission(scenario, state, scenario.missions[0].id);
  state = advanceStep(scenario, state);
  visit(state);

  const total = completePathCount;
  const pct = (count, base = total) => base ? round((count / base) * 100) : 0;
  const endingDistribution = endingLevel.endings.map((outcome) => ({
    id: outcome.id,
    title: outcome.title,
    pathCount: endingCounts.get(outcome.id),
    pathPercent: pct(endingCounts.get(outcome.id)),
    conditionMatchPathCount: endingConditionMatchCounts.get(outcome.id),
    conditionMatchPercent: pct(endingConditionMatchCounts.get(outcome.id)),
    priority: endingLevel.endings.indexOf(outcome) + 1,
    conditionIds: outcome.conditionIds,
  }));
  const decisionStateAgency = [...agencyByLevel.values()].map((item) => ({
    ...item,
    mostCommonAvailableChoiceSets: Object.entries(item.availableChoiceSetCounts)
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 20)
      .map(([choiceIds, stateCount]) => ({ choiceIds: choiceIds ? choiceIds.split(",") : [], stateCount })),
    minAvailableChoices: Number.isFinite(item.minAvailableChoices) ? item.minAvailableChoices : 0,
    averageAvailableChoices: item.stateCount ? round(item.totalAvailableChoices / item.stateCount) : 0,
    fewerThanThreeAvailablePercent: pct(item.fewerThanThreeAvailableStateCount, item.stateCount),
  }));
  const choiceAvailability = choices.map(({ level, choice }) => {
    const metric = choiceMetrics.get(choice.id);
    const levelStates = agencyByLevel.get(level.id).stateCount;
    return {
      ...metric,
      availableStatePercent: pct(metric.availableStateCount, levelStates),
      lockedStatePercent: pct(metric.lockedStateCount, levelStates),
      unlockedStatePercent: pct(metric.unlockedStateCount, levelStates),
      unlockRuleMetPercent: metric.unlockRuleConditionIds.length ? pct(metric.unlockRuleMetStateCount, levelStates) : null,
      resourceBlockedPercent: pct(metric.resourceBlockedStateCount, levelStates),
      selectedPathPercent: pct(metric.selectedPathCount),
      choiceTitle: choice.title,
    };
  });
  const delayedConsequences = [...consequenceMetrics.values()].map((metric) => ({
    ...metric,
    activationPercent: pct(metric.activationPathCount),
    revealPercent: pct(metric.revealPathCount),
    conditionCrossingPercent: pct(metric.conditionCrossingPathCount),
    laterOptionChangedPercent: pct(metric.laterOptionChangedPathCount),
    endingChangedPercent: pct(metric.endingChangedPathCount),
    laterChangedChoiceIds: [...metric.laterChangedChoiceIds].sort(),
    crossedConditionIds: [...metric.crossedConditionIds].sort(),
    effectTotals: metric.effectTotals.map((item) => ({ ...item, averageDeltaPerReveal: metric.revealPathCount ? round(item.totalDelta / metric.revealPathCount) : 0 })),
  }));

  const warnings = [];
  for (const level of decisionStateAgency) {
    if (level.fewerThanThreeAvailableStateCount > 0) {
      warnings.push({ code: "low_agency_state", levelId: level.id, stateCount: level.fewerThanThreeAvailableStateCount, message: "Fewer than three choices are available in at least one reachable decision state." });
    }
  }
  for (const choice of choiceAvailability) {
    if (choice.selectedPathCount === 0) warnings.push({ code: "never_selected", choiceId: choice.id, levelId: choice.levelId, message: "This authored choice is never selected on a reachable complete path." });
  }
  for (const ending of endingDistribution) {
    if (ending.pathCount === 0) warnings.push({ code: "unreached_ending", endingId: ending.id, message: "This ending has no reachable complete path." });
  }
  for (const consequence of delayedConsequences) {
    if (consequence.revealPathCount === 0) warnings.push({ code: "unrevealed_consequence", consequenceId: consequence.id, message: "This delayed consequence is authored but never revealed on a reachable complete path." });
    else if (consequence.revealPercent < 5 && consequence.laterOptionChangedPathCount === 0 && consequence.endingChangedPathCount === 0) {
      warnings.push({ code: "low_downstream_consequence", consequenceId: consequence.id, message: "This infrequent consequence changes no later option availability or ending in the counterfactual path review." });
    }
  }

  return {
    reportVersion: 1,
    scenario: { id: scenario.id, version: scenario.version ?? null, title: scenario.title },
    pathAnalysis: {
      totalReachableCompletePaths: total,
      decisionStateVisitCount,
      decisionNodeCount: decisionLevels.length,
      choicesPerStandardDecision: 7,
      authoredChoiceCount: choices.length,
      graphNodeCount: scenario.levels.length,
      gameplayStageCount: 6,
      endingCount: endingLevel.endings.length,
    },
    endingDistribution,
    endingConditionOverlaps: [...endingConditionOverlapCounts.entries()]
      .map(([key, pathCount]) => ({ endingIds: key.split("|"), pathCount, pathPercent: pct(pathCount) }))
      .sort((left, right) => right.pathCount - left.pathCount || left.endingIds.join("|").localeCompare(right.endingIds.join("|"))),
    endingPriorityReview: {
      evaluationOrder: endingLevel.endings.map((outcome, index) => ({ id: outcome.id, title: outcome.title, priority: index + 1, fallback: outcome.conditionIds.length === 0, conditionIds: outcome.conditionIds })),
      prePriorityMatchSetDistribution: [...endingMatchSetCounts.entries()].map(([matchingEndingIds, pathCount]) => ({ matchingEndingIds: matchingEndingIds === "(fallback only)" ? [] : matchingEndingIds.split("|"), pathCount, pathPercent: pct(pathCount) })).sort((left, right) => right.pathCount - left.pathCount || left.matchingEndingIds.join("|").localeCompare(right.matchingEndingIds.join("|"))),
      multiMatchPathCount: [...endingMatchSetCounts.entries()].filter(([key]) => key !== "(fallback only)" && key.split("|").filter((id) => id !== endingLevel.endings.at(-1).id).length > 1).reduce((sum, [, count]) => sum + count, 0),
      selectedFallbackPathCount: endingCounts.get(endingLevel.endings.at(-1).id) ?? 0,
    },
    endingBoundaryReview: [...endingBoundaryCounts.values()].map((item) => ({
      ...item,
      minObservedNumericGap: Number.isFinite(item.minObservedNumericGap) ? item.minObservedNumericGap : null,
      nearThresholdPercent: pct(item.nearThresholdPathCount, item.pathCount),
    })),
    choiceAvailability,
    decisionStateAgency: { byLevel: decisionStateAgency, lowAgencySamples, forcedChoiceSamples, lowAgencyStates },
    delayedConsequences,
    finalWorldStateRanges: finishRanges(stateRanges.world, total),
    finalResourceRanges: finishRanges(stateRanges.resources, total),
    warnings,
  };
}
