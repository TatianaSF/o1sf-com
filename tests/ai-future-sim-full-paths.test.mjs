import assert from "node:assert/strict";
import test from "node:test";

import { founderOrganizationScenario as scenario } from "../features/ai-future-sim/content/scenarios/founder-organization.scenario.js";
import { canonicalFounderPaths as paths } from "../features/ai-future-sim/fixtures/canonical-founder-paths.js";
import {
  advanceStep,
  getCurrentChoices,
  readCurrentLevel,
  selectChoice,
  selectMission,
  selectRole,
  startScenario,
} from "../features/ai-future-sim/engine/index.js";

const levels = ["starting_point", "immediate_impact", "business_and_work", "market_society_shift", "second_order_effects"];

function beginRun() {
  const started = startScenario(scenario);
  const role = selectRole(scenario, started, "company_founder");
  const mission = selectMission(scenario, role, "build_smart_human_ai_org");
  return advanceStep(scenario, mission);
}

function replay(path, inspect = false) {
  let state = beginRun();
  const revealed = [];
  const checkpoints = [];
  path.choices.forEach((choiceId, index) => {
    assert.equal(readCurrentLevel(scenario, state).id, levels[index]);
    const available = getCurrentChoices(scenario, state);
    assert.equal(available.length, 7, `${path.name}: ${levels[index]} must expose seven choices`);
    const selected = available.find((choice) => choice.id === choiceId);
    assert.ok(selected, `${path.name}: ${choiceId} exists at ${levels[index]}`);
    assert.equal(selected.available, true, `${path.name}: ${choiceId} is available at ${levels[index]} (${selected.lockedReason})`);
    if (inspect) checkpoints.push({ levelId: levels[index], choices: available });
    state = advanceStep(scenario, selectChoice(scenario, state, choiceId));
    revealed.push(...state.newlyRevealedConsequences.map((item) => item.id));
  });
  return { state, revealed, checkpoints };
}

for (const path of paths) {
  test(`complete deterministic Founder path: ${path.name}`, () => {
    const first = replay(path, true);
    const second = replay(path);
    const { state, revealed, checkpoints } = first;
    assert.equal(state.stage, "completed");
    assert.equal(state.ending?.id, path.endingId);
    assert.deepEqual(second.state, state, "the same decisions must replay to identical state");
    assert.deepEqual(second.revealed, revealed);
    assert.deepEqual(state.resources, path.resources);
    assert.deepEqual(state.worldState, path.worldState);
    for (const consequenceId of path.reveals) assert.ok(revealed.includes(consequenceId), `${path.name} reveals ${consequenceId}`);
    assert.ok(revealed.length >= 3, `${path.name} should reveal delayed causal effects`);
    assert.ok(Object.values(state.resources).every((value) => Number.isFinite(value) && value >= 0));
    assert.ok(Object.values(state.worldState).every((value) => Number.isFinite(value) && value >= 0));
    assert.equal(checkpoints.length, 5);
  });
}

test("prior decisions change later unlocks and locks", () => {
  const automation = replay(paths[0], true);
  const augmentation = replay(paths[1], true);
  const cautious = replay(paths[4], true);

  const automationOptions = automation.checkpoints[1].choices;
  assert.equal(automationOptions.find((choice) => choice.id === "scale_automated_workflows").available, true);
  assert.equal(automationOptions.find((choice) => choice.id === "form_human_ai_expert_team").available, false);

  const expertOptions = augmentation.checkpoints[1].choices;
  assert.equal(expertOptions.find((choice) => choice.id === "form_human_ai_expert_team").available, true);
  assert.equal(expertOptions.find((choice) => choice.id === "scale_automated_workflows").available, false);

  const cautiousFinalOptions = cautious.checkpoints[4].choices;
  assert.equal(cautiousFinalOptions.find((choice) => choice.id === "create_expertise_guild").available, true);
  assert.equal(cautiousFinalOptions.find((choice) => choice.id === "build_verification_fallbacks").available, false);
  assert.equal(cautiousFinalOptions.find((choice) => choice.id === "fully_autonomous_operations").available, false);
});

test("every reachable legal five-decision history completes in a prewritten Future World", () => {
  const endingCounts = new Map();
  let completedHistories = 0;
  function visit(state, depth) {
    if (depth === levels.length) {
      assert.equal(state.stage, "completed");
      assert.ok(state.ending);
      endingCounts.set(state.ending.id, (endingCounts.get(state.ending.id) ?? 0) + 1);
      completedHistories += 1;
      return;
    }
    const available = getCurrentChoices(scenario, state).filter((choice) => choice.available);
    assert.ok(available.length > 0, `No legal choice at ${readCurrentLevel(scenario, state).id}`);
    for (const choice of available) {
      const next = advanceStep(scenario, selectChoice(scenario, state, choice.id));
      assert.ok(Object.values(next.worldState).every((value) => value >= 0));
      assert.ok(Object.values(next.resources).every((value) => value >= 0));
      visit(next, depth + 1);
    }
  }

  visit(beginRun(), 0);
  assert.ok(completedHistories > 0);
  const expectedEndingIds = scenario.levels.find((level) => level.id === "future_world").endings.map((ending) => ending.id);
  assert.deepEqual(new Set(endingCounts.keys()), new Set(expectedEndingIds));
});
