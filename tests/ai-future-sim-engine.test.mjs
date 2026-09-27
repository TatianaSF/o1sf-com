import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { founderOrganizationScenario as scenario } from "../features/ai-future-sim/content/scenarios/founder-organization.scenario.js";
import {
  advanceStep,
  explainEndingSelection,
  GameRuleError,
  getCurrentChoices,
  readCurrentLevel,
  selectChoice,
  selectMission,
  selectRole,
  startScenario,
} from "../features/ai-future-sim/engine/index.js";

function beginDecision() {
  const started = startScenario(scenario);
  const roleSelected = selectRole(scenario, started, "company_founder");
  const missionSelected = selectMission(scenario, roleSelected, "build_smart_human_ai_org");
  return advanceStep(scenario, missionSelected);
}

function playFounderPath(choiceId) {
  const start = startScenario(scenario);
  const role = selectRole(scenario, start, "company_founder");
  const mission = selectMission(scenario, role, "build_smart_human_ai_org");
  const decision = advanceStep(scenario, mission);
  const selected = selectChoice(scenario, decision, choiceId);
  return advanceStep(scenario, selected);
}

test("scenario starts in role selection and rejects invalid role or mission transitions", () => {
  const start = startScenario(scenario);
  assert.equal(start.stage, "role_selection");
  assert.equal(start.scenarioVersion, 1);
  assert.throws(() => selectMission(scenario, start, "build_smart_human_ai_org"), (error) => error.code === "invalid_transition");
  assert.throws(() => selectRole(scenario, start, "unknown_role"), (error) => error.code === "invalid_role");
  const role = selectRole(scenario, start, "company_founder");
  assert.equal(role.stage, "mission_selection");
  assert.throws(() => selectMission(scenario, role, "unknown_mission"), (error) => error.code === "invalid_mission");
  assert.equal(selectMission(scenario, role, "build_smart_human_ai_org").stage, "scenario_intro");
});

test("canonical Founder decision has exactly seven stable, available choices", () => {
  const decision = beginDecision();
  const choices = getCurrentChoices(scenario, decision);
  assert.equal(readCurrentLevel(scenario, decision).id, "starting_point");
  assert.equal(choices.length, 7);
  assert.ok(choices.every((choice) => choice.available));
  assert.ok(choices.every((choice) => /^[a-z][a-z0-9_]*$/.test(choice.id)));
});

test("selecting an invalid or unaffordable choice is rejected without mutating input state", () => {
  const decision = beginDecision();
  const before = structuredClone(decision);
  assert.throws(() => selectChoice(scenario, decision, "not_a_choice"), (error) => error.code === "invalid_choice");
  assert.deepEqual(decision, before);

  const poorState = { ...decision, resources: { ...decision.resources, capital: 0 } };
  const hireChoice = getCurrentChoices(scenario, poorState).find((choice) => choice.id === "hire_human_experts");
  assert.equal(hireChoice.available, false);
  assert.equal(hireChoice.lockReasonCode, "insufficient_resource");
  assert.match(hireChoice.lockedReason, /capital/i);
  assert.throws(() => selectChoice(scenario, poorState, "hire_human_experts"), (error) => error.code === "choice_locked");
  assert.equal(poorState.resources.capital, 0);
});

test("choice applies explicit world and resource effects", () => {
  const decision = beginDecision();
  const result = selectChoice(scenario, decision, "hire_human_experts");

  assert.equal(result.stage, "step_complete");
  assert.equal(result.resources.capital, 16);
  assert.equal(result.resources.time, 10);
  assert.equal(result.resources.talent, 2);
  assert.equal(result.worldState.human_capability, 4);
  assert.equal(result.worldState.productivity, 1);
  assert.equal(decision.resources.capital, 20);
});

test("earlier expertise investment unlocks the human-AI expert team while other options remain locked", () => {
  const followUp = playFounderPath("hire_human_experts");
  const choices = getCurrentChoices(scenario, followUp);
  const expertTeam = choices.find((choice) => choice.id === "form_human_ai_expert_team");
  const automatedScale = choices.find((choice) => choice.id === "scale_automated_workflows");

  assert.equal(followUp.stage, "level_ready");
  assert.equal(expertTeam.available, true);
  assert.equal(automatedScale.available, false);
  assert.match(automatedScale.lockedReason, /adoption/i);
});

test("automation path leaves the expert team locked and enables the adoption-dependent option", () => {
  const followUp = playFounderPath("automate_back_office");
  const choices = getCurrentChoices(scenario, followUp);

  const expertTeam = choices.find((choice) => choice.id === "form_human_ai_expert_team");
  assert.equal(expertTeam.available, false);
  assert.equal(expertTeam.lockReasonCode, "missing_capability");
  assert.equal(expertTeam.lockReasons[0].targetId, "human_capability");
  assert.equal(expertTeam.lockReasons[0].actualValue, 2);
  assert.equal(expertTeam.lockReasons[0].requiredValue, 3);
  assert.match(expertTeam.lockedReason, /human expertise/i);
  assert.equal(choices.find((choice) => choice.id === "scale_automated_workflows").available, true);
});

test("delayed consequence stays hidden at choice time and resolves deterministically at its target level", () => {
  const decision = beginDecision();
  const selected = selectChoice(scenario, decision, "automate_back_office");

  assert.equal(selected.worldState.ai_dependence, 1);
  assert.equal(selected.pendingConsequences.length, 1);
  assert.equal(selected.newlyRevealedConsequences.length, 0);
  assert.equal(readCurrentLevel(scenario, selected).revealedConsequences.length, 0);

  const advanced = advanceStep(scenario, selected);
  assert.equal(readCurrentLevel(scenario, advanced).id, "immediate_impact");
  assert.equal(advanced.worldState.ai_dependence, 2);
  assert.equal(advanced.pendingConsequences.length, 0);
  assert.equal(advanced.newlyRevealedConsequences[0].id, "junior_pipeline_thins");
  assert.equal(advanced.revealedConsequences.length, 1);
});

test("same canonical decisions produce byte-for-byte equivalent serializable state", () => {
  assert.deepEqual(playFounderPath("hire_human_experts"), playFounderPath("hire_human_experts"));
});

test("scenario content and stable analytics identifiers are independent from UI copy", async () => {
  const ui = await readFile(new URL("../features/ai-future-sim/ui/AiFutureSimLanding.jsx", import.meta.url), "utf8");
  const allIds = [
    scenario.id,
    ...scenario.roles.map((item) => item.id),
    ...scenario.missions.map((item) => item.id),
    ...scenario.levels.flatMap((level) => [
      level.id,
      ...(level.choices ?? []).map((choice) => choice.id),
      ...(level.endings ?? []).map((ending) => ending.id),
    ]),
  ];

  assert.equal(new Set(allIds).size, allIds.length);
  assert.ok(allIds.every((id) => /^[a-z][a-z0-9_]*$/.test(id)));
  assert.doesNotMatch(ui, /Hire human AI experts|Automate back-office work quickly|Form a human-AI expert team/);
});

test("invalid transition and mismatched scenario are rejected with safe domain errors", () => {
  const start = startScenario(scenario);
  assert.throws(() => advanceStep(scenario, start), (error) => error instanceof GameRuleError && error.code === "invalid_transition");
  assert.throws(() => selectRole({ ...scenario, id: "other_scenario" }, start, "company_founder"), (error) => error.code === "scenario_mismatch");
  assert.throws(() => selectRole({ ...scenario, version: 2 }, start, "company_founder"), (error) => error.code === "scenario_mismatch");
});

test("canonical Founder fixture runs from its introduction into the first seven-choice level", () => {
  let state = startScenario(scenario);
  state = selectRole(scenario, state, "company_founder");
  state = selectMission(scenario, state, "build_smart_human_ai_org");
  assert.equal(readCurrentLevel(scenario, state).id, "founder_briefing");
  state = advanceStep(scenario, state);
  assert.equal(getCurrentChoices(scenario, state).length, 7);
  state = selectChoice(scenario, state, "hire_human_experts");
  assert.equal(state.stage, "step_complete");
  state = advanceStep(scenario, state);
  assert.equal(readCurrentLevel(scenario, state).id, "immediate_impact");
  assert.equal(getCurrentChoices(scenario, state).find((choice) => choice.id === "form_human_ai_expert_team").available, true);
});

test("ending diagnostics trace priority and explain the selected authored outcome", () => {
  let state = startScenario(scenario);
  state = selectRole(scenario, state, "company_founder");
  state = selectMission(scenario, state, "build_smart_human_ai_org");
  state = advanceStep(scenario, state);
  for (const choiceId of ["automate_back_office", "scale_automated_workflows", "automate_customer_operations", "automate_supply_chain", "fully_autonomous_operations"]) {
    state = advanceStep(scenario, selectChoice(scenario, state, choiceId));
  }
  const explanation = explainEndingSelection(scenario, state);
  assert.equal(explanation.scenarioVersion, 1);
  assert.equal(explanation.endingId, "maximum_automation_organization");
  assert.equal(explanation.evaluationOrder[0].matched, true);
  assert.equal(explanation.evaluationOrder[0].selected, true);
  assert.equal(explanation.higherPriorityEvaluations.length, 0);
  assert.equal(explanation.fallbackUsed, false);
  assert.deepEqual(explanation.relevantFinalWorldState, {
    ai_adoption: 7,
    ai_dependence: 10,
    human_capability: 2,
    organizational_trust: 2,
    employment_resilience: 0,
    productivity: 11,
  });
});

test("manual playtest mode is explicitly gated to development and never previews hidden consequence copy", async () => {
  const ui = await readFile(new URL("../features/ai-future-sim/ui/AiFutureSimLanding.jsx", import.meta.url), "utf8");
  assert.match(ui, /process\.env\.NODE_ENV === "development"/);
  assert.match(ui, /get\("playtest"\) === "1"/);
  assert.match(ui, /registeredConsequenceIds: \(choice\.delayedConsequences \?\? \[\]\)\.map\(\(item\) => item\.id\)/);
  assert.match(ui, /revealedConsequences: revealed/);
  assert.doesNotMatch(ui, /pendingConsequences\.map\(\(item\) => \(\{[^}]*title|pendingConsequences\.map\(\(item\) => \(\{[^}]*description/s);
});
