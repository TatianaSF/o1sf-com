const stableIdPattern = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
const levelTypes = new Set(["narrative", "decision", "follow_up", "ending"]);
const comparisonOperators = new Set(["gte", "lte", "eq"]);

function entityName(type, id) {
  return `${type}:${typeof id === "string" && id ? id : "<missing>"}`;
}

/**
 * @param {unknown} scenario
 * @returns {{ valid: boolean, errors: Array<{code: string, sourceEntity: string, field: string, referencedId: string | null, reason: string}>, warnings: Array<{code: string, sourceEntity: string, field: string, referencedId: string | null, reason: string}>, graph: {startNodeId: string | null, reachableNodeIds: string[], unreachableNodeIds: string[], deadEndNodeIds: string[], terminalNodeIds: string[], cycles: string[][]}}}
 */
export function validateScenario(scenario) {
  const errors = [];
  const warnings = [];
  const graph = {
    startNodeId: null,
    reachableNodeIds: [],
    unreachableNodeIds: [],
    deadEndNodeIds: [],
    terminalNodeIds: [],
    cycles: [],
  };
  const report = (severity, code, sourceEntity, field, referencedId, reason) => {
    const issue = {
      code,
      sourceEntity,
      field,
      referencedId: referencedId == null ? null : String(referencedId),
      reason,
    };
    (severity === "warning" ? warnings : errors).push(issue);
  };

  if (!scenario || typeof scenario !== "object" || Array.isArray(scenario)) {
    report("error", "invalid_scenario", "scenario:<missing>", "scenario", null, "Scenario must be an object.");
    return { valid: false, errors, warnings, graph };
  }

  const data = /** @type {Record<string, any>} */ (scenario);
  const scenarioSource = entityName("scenario", data.id);
  const idNamespaces = new Map();
  const registerId = (id, namespace, sourceEntity, field = "id", displayText = null) => {
    if (typeof id !== "string" || !stableIdPattern.test(id)) {
      report("error", "invalid_id", sourceEntity, field, id, "ID must use lowercase snake_case letters and digits; display text is not an ID.");
      return false;
    }
    if (typeof displayText === "string" && id.toLowerCase() === displayText.trim().toLowerCase()) {
      report("error", "display_text_used_as_id", sourceEntity, field, id, "Machine IDs must not reuse display text.");
    }
    const namespaceIds = idNamespaces.get(namespace) ?? new Map();
    if (namespaceIds.has(id)) {
      report("error", "duplicate_id", sourceEntity, field, id, `ID is already used by ${namespaceIds.get(id)} in the ${namespace} namespace.`);
    } else {
      namespaceIds.set(id, sourceEntity);
    }
    idNamespaces.set(namespace, namespaceIds);
    return true;
  };
  const requireEnglish = (value, sourceEntity, field) => {
    if (typeof value !== "string" || value.trim().length === 0) {
      report("error", "missing_english_content", sourceEntity, field, null, "Required English production text is missing.");
    }
  };
  const requireArray = (value, sourceEntity, field) => {
    if (!Array.isArray(value)) {
      report("error", "missing_content_list", sourceEntity, field, null, "Expected an array in the scenario content contract.");
      return [];
    }
    return value;
  };

  registerId(data.id, "scenarios", scenarioSource, "id", data.title);
  if (!Number.isInteger(data.version) || data.version < 1) {
    report("error", "invalid_scenario_version", scenarioSource, "version", data.version, "Scenario version must be a positive integer for persistence and analytics compatibility.");
  }
  requireEnglish(data.title, scenarioSource, "title");
  requireEnglish(data.introduction, scenarioSource, "introduction");
  if (data.graphPolicy != null && (
    typeof data.graphPolicy !== "object" ||
    typeof data.graphPolicy.allowIntentionalCycles !== "boolean"
  )) {
    report("error", "invalid_graph_policy", scenarioSource, "graphPolicy.allowIntentionalCycles", data.graphPolicy?.allowIntentionalCycles, "Graph policy must explicitly use a boolean allowIntentionalCycles value.");
  }

  const world = data.initialWorldState;
  const resources = data.initialResources;
  const valueIds = (values, namespace, sourceEntity) => {
    if (!values || typeof values !== "object" || Array.isArray(values)) {
      report("error", "missing_value_definitions", sourceEntity, namespace, null, `Initial ${namespace} definitions must be an object.`);
      return new Set();
    }
    const ids = new Set();
    for (const [id, initialValue] of Object.entries(values)) {
      registerId(id, namespace, sourceEntity, `${namespace}.${id}`);
      ids.add(id);
      if (!Number.isFinite(initialValue) || initialValue < 0) {
        report("error", "invalid_initial_value", sourceEntity, `${namespace}.${id}`, id, "Initial values must be finite and non-negative.");
      }
    }
    if (ids.size === 0) {
      report("error", "empty_value_definitions", sourceEntity, namespace, null, `At least one ${namespace} definition is required.`);
    }
    return ids;
  };
  const worldIds = valueIds(world, "world_state", scenarioSource);
  const resourceIds = valueIds(resources, "resources", scenarioSource);

  const roles = requireArray(data.roles, scenarioSource, "roles");
  const roleIds = new Set();
  for (const role of roles) {
    const source = entityName("role", role?.id);
    registerId(role?.id, "roles", source, "id", role?.title);
    if (typeof role?.id === "string") roleIds.add(role.id);
    requireEnglish(role?.title, source, "title");
    requireEnglish(role?.description, source, "description");
  }
  if (roles.length === 0) report("error", "missing_roles", scenarioSource, "roles", null, "At least one role is required.");

  const missions = requireArray(data.missions, scenarioSource, "missions");
  const missionIds = new Set();
  for (const mission of missions) {
    const source = entityName("mission", mission?.id);
    registerId(mission?.id, "missions", source, "id", mission?.title);
    if (typeof mission?.id === "string") missionIds.add(mission.id);
    requireEnglish(mission?.title, source, "title");
    requireEnglish(mission?.description, source, "description");
    const missionRoleIds = requireArray(mission?.roleIds, source, "roleIds");
    for (const roleId of missionRoleIds) {
      if (!roleIds.has(roleId)) {
        report("error", "unknown_role_reference", source, "roleIds", roleId, "Mission refers to a role that is not declared in this scenario.");
      }
    }
  }
  if (missions.length === 0) report("error", "missing_missions", scenarioSource, "missions", null, "At least one mission is required.");

  const conditions = requireArray(data.conditions, scenarioSource, "conditions");
  const conditionsById = new Map();
  for (const condition of conditions) {
    const source = entityName("condition", condition?.id);
    registerId(condition?.id, "conditions", source, "id");
    if (typeof condition?.id === "string" && !conditionsById.has(condition.id)) conditionsById.set(condition.id, condition);
    if (condition?.target === "world_state") {
      report("error", "invalid_condition_target", source, "target", "world_state", "Use the supported condition target `world`.");
    } else if (condition?.target === "world" || condition?.target === "resources") {
      const ids = condition.target === "world" ? worldIds : resourceIds;
      if (!ids.has(condition.key)) {
        report("error", condition.target === "world" ? "unknown_world_state_reference" : "unknown_resource_reference", source, "key", condition.key, `Condition refers to an undeclared ${condition.target} value.`);
      }
      if (!comparisonOperators.has(condition.operator)) {
        report("error", "invalid_condition_operator", source, "operator", condition.operator, "Numeric conditions support only gte, lte, or eq.");
      }
      if (!Number.isFinite(condition.value)) {
        report("error", "invalid_condition_value", source, "value", condition.value, "Condition values must be finite numbers.");
      }
    } else if (condition?.target === "choice") {
      if (condition.operator !== "selected") {
        report("error", "invalid_condition_operator", source, "operator", condition.operator, "Choice prerequisites support only the selected operator.");
      }
    } else {
      report("error", "invalid_condition_target", source, "target", condition?.target, "Condition target is not supported by the current domain model.");
    }
  }

  const levels = requireArray(data.levels, scenarioSource, "levels");
  const levelIds = new Set();
  const levelsById = new Map();
  const choicesById = new Map();
  const levelEdges = new Map();
  const validTerminalIds = new Set();
  const allEffects = [];
  const allUnlocks = [];
  const allConsequences = [];
  const allEndingOutcomes = [];

  for (const level of levels) {
    const source = entityName("level", level?.id);
    registerId(level?.id, "levels", source, "id", level?.title);
    if (typeof level?.id === "string") {
      levelIds.add(level.id);
      if (!levelsById.has(level.id)) levelsById.set(level.id, level);
    }
    if (!levelTypes.has(level?.type)) {
      report("error", "invalid_level_type", source, "type", level?.type, "Level type must be narrative, decision, follow_up, or ending.");
    }
    if (level?.missionIds != null) {
      for (const missionId of requireArray(level.missionIds, source, "missionIds")) {
        if (!missionIds.has(missionId)) {
          report("error", "unknown_mission_reference", source, "missionIds", missionId, "Level refers to a mission that is not declared in this scenario.");
        }
      }
    }
    requireEnglish(level?.title, source, "title");
    if (level?.type !== "ending") requireEnglish(level?.prompt, source, "prompt");
    if (level?.type === "ending") {
      requireEnglish(level?.description, source, "description");
      const endings = requireArray(level?.endings, source, "endings");
      if (endings.length === 0) {
        report("error", "missing_ending_outcomes", source, "endings", null, "Ending nodes require at least one authored Future World outcome.");
      }
      let fallbackCount = 0;
      endings.forEach((ending, index) => {
        const endingSource = entityName("ending", ending?.id);
        registerId(ending?.id, "endings", endingSource, "id", ending?.title);
        requireEnglish(ending?.title, endingSource, "title");
        requireEnglish(ending?.description, endingSource, "description");
        const conditionIds = requireArray(ending?.conditionIds, endingSource, "conditionIds");
        if (conditionIds.length === 0) {
          fallbackCount += 1;
          if (index !== endings.length - 1) {
            report("error", "ending_fallback_order", endingSource, "conditionIds", null, "The unconditional ending outcome must be last so specific state-based outcomes take precedence.");
          }
        }
        allEndingOutcomes.push({ ending, source: endingSource });
      });
      if (endings.length > 0 && fallbackCount !== 1) {
        report("error", "ending_fallback_count", source, "endings", String(fallbackCount), "Ending nodes require exactly one unconditional fallback outcome.");
      }
    }
    const choices = requireArray(level?.choices ?? [], source, "choices");
    if (level?.type === "narrative" && choices.length !== 0) {
      report("error", "narrative_has_choices", source, "choices", null, "Narrative nodes cannot contain selectable choices.");
    }
    if (level?.type === "decision" && choices.length !== 7) {
      report("error", "decision_choice_count", source, "choices", String(choices.length), "Standard decision nodes must contain exactly seven choices.");
    }
    if (level?.type === "follow_up" && (choices.length < 1 || choices.length > 3)) {
      report("error", "follow_up_choice_count", source, "choices", String(choices.length), "Special follow-up nodes must contain between one and three choices.");
    }
    if (level?.type === "ending" && choices.length !== 0) {
      report("error", "ending_has_choices", source, "choices", null, "Ending nodes cannot contain selectable choices.");
    }

    if (level?.terminal === true && level.type !== "follow_up") {
      report("error", "invalid_terminal_node", source, "terminal", level.id, "Only follow-up nodes may currently declare terminal=true; endings are terminal by type.");
    }
    if (level?.type === "ending" || (level?.type === "follow_up" && level.terminal === true)) {
      validTerminalIds.add(level.id);
    }

    const choiceIds = new Set();
    for (const choice of choices) {
      const choiceSource = entityName("choice", choice?.id);
      registerId(choice?.id, "choices", choiceSource, "id", choice?.title);
      if (typeof choice?.id === "string") {
        choiceIds.add(choice.id);
        if (!choicesById.has(choice.id)) choicesById.set(choice.id, { choice, level });
      }
      requireEnglish(choice?.title, choiceSource, "title");
      requireEnglish(choice?.description, choiceSource, "description");
      requireEnglish(choice?.outcome, choiceSource, "outcome");
      if (choice?.missionIds != null) {
        for (const missionId of requireArray(choice.missionIds, choiceSource, "missionIds")) {
          if (!missionIds.has(missionId)) {
            report("error", "unknown_mission_reference", choiceSource, "missionIds", missionId, "Choice refers to a mission that is not declared in this scenario.");
          }
        }
      }

      const effects = requireArray(choice?.effects, choiceSource, "effects");
      if (effects.length === 0) {
        report("error", "missing_effects", choiceSource, "effects", null, "Every selectable choice must declare at least one explicit effect.");
      }
      for (const effect of effects) allEffects.push({ effect, source: choiceSource });

      if (choice?.unlock != null) {
        const unlockSource = entityName("unlock", choice.unlock.id);
        registerId(choice.unlock.id, "unlocks", unlockSource, "id");
        allUnlocks.push({ unlock: choice.unlock, source: unlockSource });
      }

      const consequences = requireArray(choice?.delayedConsequences ?? [], choiceSource, "delayedConsequences");
      for (const consequence of consequences) {
        const consequenceSource = entityName("delayed_consequence", consequence?.id);
        registerId(consequence?.id, "delayed_consequences", consequenceSource, "id", consequence?.title);
        allConsequences.push({ consequence, choice, source: consequenceSource });
        requireEnglish(consequence?.title, consequenceSource, "title");
        requireEnglish(consequence?.description, consequenceSource, "description");
        if (consequence?.originChoiceId !== choice?.id || !choiceIds.has(consequence?.originChoiceId)) {
          report("error", "invalid_consequence_origin", consequenceSource, "originChoiceId", consequence?.originChoiceId, "Delayed consequence must name its containing originating choice.");
        }
        const activation = consequence?.activation;
        if (!activation || activation.type !== "on_level_entry") {
          report("error", "invalid_consequence_activation", consequenceSource, "activation.type", activation?.type, "The current deterministic activation type is on_level_entry.");
        }
        if (activation?.type === "on_level_entry" && typeof activation.levelId !== "string") {
          report("error", "missing_consequence_target", consequenceSource, "activation.levelId", activation.levelId, "Delayed consequence requires a reveal level ID.");
        }
        const delayedEffects = requireArray(consequence?.effects, consequenceSource, "effects");
        if (delayedEffects.length === 0) {
          report("error", "missing_effects", consequenceSource, "effects", null, "Delayed consequences must declare at least one explicit effect.");
        }
        for (const effect of delayedEffects) allEffects.push({ effect, source: consequenceSource });
      }

      const targetId = choice?.nextLevelId ?? level?.nextLevelId;
      if (targetId != null) {
        const edges = levelEdges.get(level.id) ?? [];
        edges.push({ to: targetId, sourceEntity: choiceSource, field: choice?.nextLevelId ? "nextLevelId" : "level.nextLevelId" });
        levelEdges.set(level.id, edges);
      }
    }

    if (choices.length === 0 && typeof level?.nextLevelId === "string") {
      levelEdges.set(level.id, [{
        to: level.nextLevelId,
        sourceEntity: source,
        field: "nextLevelId",
      }]);
    }

    if (level?.type === "narrative" && typeof level.nextLevelId !== "string") {
      report("error", "missing_next_level", source, "nextLevelId", level.nextLevelId, "Narrative nodes require an explicit next-level reference.");
    }
    if (["decision", "follow_up"].includes(level?.type) && level.terminal !== true) {
      for (const choice of choices) {
        if (typeof (choice?.nextLevelId ?? level?.nextLevelId) !== "string") {
          report("error", "missing_next_level", entityName("choice", choice?.id), "nextLevelId", null, "Non-terminal choices require an explicit next-level transition.");
        }
      }
    }
    if (level?.terminal === true && (level.nextLevelId != null || choices.some((choice) => choice?.nextLevelId != null))) {
      report("error", "terminal_has_transition", source, "nextLevelId", level.nextLevelId, "Terminal nodes cannot transition to another level.");
    }
    if (level?.type === "ending" && level.nextLevelId != null) {
      report("error", "ending_has_transition", source, "nextLevelId", level.nextLevelId, "Ending nodes cannot transition to another level.");
    }
  }

  if (levels.length === 0) report("error", "missing_levels", scenarioSource, "levels", null, "At least one level is required.");

  for (const { effect, source } of allEffects) {
    const effectSource = entityName("effect", effect?.id);
    registerId(effect?.id, "effects", effectSource, "id");
    if (effect?.operation !== "add") {
      report("error", "invalid_effect_operation", effectSource, "operation", effect?.operation, "The current effect contract supports only the explicit add operation.");
    }
    if (!Number.isFinite(effect?.delta)) {
      report("error", "invalid_effect_value", effectSource, "delta", effect?.delta, "Effect values must be finite numbers.");
    }
    if (effect?.target === "world") {
      if (!worldIds.has(effect.key)) report("error", "unknown_world_state_reference", effectSource, "key", effect.key, `Effect from ${source} refers to an undeclared world-state dimension.`);
    } else if (effect?.target === "resources") {
      if (!resourceIds.has(effect.key)) report("error", "unknown_resource_reference", effectSource, "key", effect.key, `Effect from ${source} refers to an undeclared resource.`);
    } else {
      report("error", "invalid_effect_target", effectSource, "target", effect?.target, "Effect target must be world or resources.");
    }
  }

  for (const { unlock, source } of allUnlocks) {
    const conditionIds = requireArray(unlock?.conditionIds, source, "conditionIds");
    if (conditionIds.length === 0) {
      report("error", "empty_unlock", source, "conditionIds", null, "An unlock must reference at least one condition.");
    }
    for (const conditionId of conditionIds) {
      if (!conditionsById.has(conditionId)) {
        report("error", "unknown_condition_reference", source, "conditionIds", conditionId, "Unlock refers to an undeclared condition.");
      }
    }
  }

  for (const condition of conditions) {
    const source = entityName("condition", condition?.id);
    if (condition?.target === "choice" && !choicesById.has(condition.choiceId)) {
      report("error", "unknown_choice_reference", source, "choiceId", condition.choiceId, "Prerequisite refers to an undeclared choice.");
    }
  }

  for (const { consequence, source } of allConsequences) {
    const originChoice = choicesById.get(consequence?.originChoiceId);
    if (!originChoice || originChoice.choice.id !== consequence?.originChoiceId) {
      report("error", "unknown_choice_reference", source, "originChoiceId", consequence?.originChoiceId, "Delayed consequence refers to an undeclared originating choice.");
    }
    const activation = consequence?.activation;
    if (activation?.type === "on_level_entry" && !levelIds.has(activation.levelId)) {
      report("error", "missing_level_reference", source, "activation.levelId", activation.levelId, "Reveal target level is not declared in this scenario.");
    }
  }

  for (const { ending, source } of allEndingOutcomes) {
    const conditionIds = requireArray(ending?.conditionIds, source, "conditionIds");
    for (const conditionId of conditionIds) {
      if (!conditionsById.has(conditionId)) {
        report("error", "unknown_condition_reference", source, "conditionIds", conditionId, "Ending outcome refers to an undeclared condition.");
      }
    }
  }

  graph.startNodeId = typeof data.startLevelId === "string" ? data.startLevelId : null;
  if (!graph.startNodeId || !levelIds.has(graph.startNodeId)) {
    report("error", "missing_start_level", scenarioSource, "startLevelId", data.startLevelId, "Scenario start node must reference a declared level.");
  }

  for (const [from, edges] of levelEdges) {
    for (const edge of edges) {
      if (!levelIds.has(edge.to)) {
        report("error", "missing_level_reference", edge.sourceEntity, edge.field, edge.to, "Transition target level is not declared in this scenario.");
      }
    }
    levelEdges.set(from, [...new Map(edges.map((edge) => [edge.to, edge])).values()]);
  }

  const reachable = new Set();
  if (graph.startNodeId && levelsById.has(graph.startNodeId)) {
    const queue = [graph.startNodeId];
    while (queue.length) {
      const current = queue.shift();
      if (reachable.has(current)) continue;
      reachable.add(current);
      for (const edge of levelEdges.get(current) ?? []) {
        if (levelIds.has(edge.to)) queue.push(edge.to);
      }
    }
  }
  graph.reachableNodeIds = [...reachable];
  graph.unreachableNodeIds = levels
    .filter((level) => typeof level?.id === "string" && !reachable.has(level.id))
    .map((level) => level.id);
  for (const levelId of graph.unreachableNodeIds) {
    report("error", "unreachable_node", entityName("level", levelId), "id", levelId, "Level cannot be reached from the scenario start node.");
  }

  for (const level of levels) {
    const source = entityName("level", level?.id);
    const edges = levelEdges.get(level?.id) ?? [];
    const isTerminal = validTerminalIds.has(level?.id);
    if (!isTerminal && edges.length === 0) {
      graph.deadEndNodeIds.push(level.id);
      report("error", "dead_end_node", source, "nextLevelId", null, "Non-terminal level has no outgoing transition.");
    }
    for (const edge of edges) {
      if (validTerminalIds.has(edge.to)) graph.terminalNodeIds.push(edge.to);
    }
  }
  for (const terminalId of validTerminalIds) {
    if (reachable.has(terminalId) && !graph.terminalNodeIds.includes(terminalId)) graph.terminalNodeIds.push(terminalId);
  }
  graph.terminalNodeIds = [...new Set(graph.terminalNodeIds)];
  if (validTerminalIds.size === 0) {
    report("error", "missing_terminal_node", scenarioSource, "levels", null, "Scenario requires at least one ending or terminal follow-up node.");
  }

  const nodesLeadingToTerminal = new Set(validTerminalIds);
  let expandedTerminalPaths = true;
  while (expandedTerminalPaths) {
    expandedTerminalPaths = false;
    for (const [from, edges] of levelEdges) {
      if (!nodesLeadingToTerminal.has(from) && edges.some((edge) => nodesLeadingToTerminal.has(edge.to))) {
        nodesLeadingToTerminal.add(from);
        expandedTerminalPaths = true;
      }
    }
  }
  for (const levelId of reachable) {
    if (!nodesLeadingToTerminal.has(levelId)) {
      report("error", "no_terminal_path", entityName("level", levelId), "nextLevelId", null, "Reachable node has no path to a valid terminal node.");
    }
  }

  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  const cyclesSeen = new Set();
  const findCycles = (nodeId) => {
    if (visiting.has(nodeId)) {
      const start = stack.indexOf(nodeId);
      const cycle = [...stack.slice(start), nodeId];
      const key = [...cycle.slice(0, -1)].sort().join("|");
      if (!cyclesSeen.has(key)) {
        cyclesSeen.add(key);
        graph.cycles.push(cycle);
      }
      return;
    }
    if (visited.has(nodeId)) return;
    visiting.add(nodeId);
    stack.push(nodeId);
    for (const edge of levelEdges.get(nodeId) ?? []) {
      if (levelIds.has(edge.to)) findCycles(edge.to);
    }
    stack.pop();
    visiting.delete(nodeId);
    visited.add(nodeId);
  };
  for (const levelId of reachable) findCycles(levelId);
  for (const cycle of graph.cycles) {
    if (data.graphPolicy?.allowIntentionalCycles === true) {
      report("warning", "intentional_cycle", entityName("level", cycle[0]), "graphPolicy.allowIntentionalCycles", cycle.join(" -> "), "This cycle is explicitly allowed by scenario policy.");
    } else {
      report("error", "accidental_cycle", entityName("level", cycle[0]), "nextLevelId", cycle.join(" -> "), "Cycle is not declared intentional by scenario graph policy.");
    }
  }

  return { valid: errors.length === 0, errors, warnings, graph };
}

/** @param {unknown[]} scenarios */
export function validateScenarios(scenarios) {
  const results = scenarios.map(validateScenario);
  const errors = results.flatMap((result) => result.errors);
  const warnings = results.flatMap((result) => result.warnings);
  const scenarioIds = new Map();
  scenarios.forEach((scenario, index) => {
    const id = scenario && typeof scenario === "object"
      ? /** @type {Record<string, any>} */ (scenario).id
      : null;
    if (typeof id !== "string") return;
    if (scenarioIds.has(id)) {
      errors.push({
        code: "duplicate_scenario_id",
        sourceEntity: entityName("scenario", id),
        field: "id",
        referencedId: id,
        reason: `Scenario ID is already used at collection index ${scenarioIds.get(id)}.`,
      });
    } else {
      scenarioIds.set(id, index);
    }
  });
  return { valid: errors.length === 0, errors, warnings, results };
}
