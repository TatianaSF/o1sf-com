import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { explainEndingForPlayer } from "../features/ai-future-sim/content/player-explanations.js";
import { founderOrganizationScenario as scenario } from "../features/ai-future-sim/content/scenarios/founder-organization.scenario.js";
import { canonicalFounderPaths as paths } from "../features/ai-future-sim/fixtures/canonical-founder-paths.js";
import {
  advanceStep,
  getCurrentChoices,
  selectChoice,
  selectMission,
  selectRole,
  startScenario,
} from "../features/ai-future-sim/engine/index.js";
import { formatChoiceResourceCost, getChoiceResourceCosts } from "../features/ai-future-sim/ui/choice-costs.js";
import { analyzeScenarioBalance } from "../features/ai-future-sim/analysis/analyze-scenario.js";

const yearIds = ["starting_point", "immediate_impact", "business_and_work", "market_society_shift", "second_order_effects"];

function beginRun() {
  const started = startScenario(scenario);
  const role = selectRole(scenario, started, "company_founder");
  const mission = selectMission(scenario, role, "build_smart_human_ai_org");
  return advanceStep(scenario, mission);
}

function playToYearFive(path) {
  let state = beginRun();
  path.choices.slice(0, 4).forEach((choiceId) => {
    state = advanceStep(scenario, selectChoice(scenario, state, choiceId));
  });
  return state;
}

function findLockedChoice(pathName, choiceId) {
  const path = paths.find((candidate) => candidate.name === pathName);
  assert.ok(path, `Missing canonical fixture: ${pathName}`);
  return getCurrentChoices(scenario, playToYearFive(path)).find((choice) => choice.id === choiceId);
}

test("Year 5 lock copy reflects the conditions that actually block each choice", () => {
  const automationFallback = findLockedChoice("automation-heavy", "build_verification_fallbacks");
  assert.deepEqual(automationFallback.lockReasons.map((reason) => reason.conditionId), ["condition_human_review"]);
  assert.equal(automationFallback.lockedReason, "Requires stronger human expertise.");

  const capabilityFallback = findLockedChoice("human capability investment", "build_verification_fallbacks");
  assert.deepEqual(capabilityFallback.lockReasons.map((reason) => reason.conditionId), ["condition_dependence_two"]);
  assert.equal(capabilityFallback.lockedReason, "Requires greater AI dependence.");

  const automationNetwork = findLockedChoice("automation-heavy", "build_redundant_network");
  assert.deepEqual(automationNetwork.lockReasons.map((reason) => reason.conditionId), ["condition_trusted_review"]);
  assert.equal(automationNetwork.lockedReason, "Requires stronger organizational trust.");

  const capabilityNetwork = findLockedChoice("human capability investment", "build_redundant_network");
  assert.deepEqual(capabilityNetwork.lockReasons.map((reason) => reason.conditionId), ["condition_dependence_one"]);
  assert.equal(capabilityNetwork.lockedReason, "Requires greater AI dependence.");
});

test("pre-decision costs are derived from authored resource effects only", async () => {
  const hire = scenario.levels.find((level) => level.id === "starting_point").choices.find((choice) => choice.id === "hire_human_experts");
  assert.deepEqual(getChoiceResourceCosts(hire), [
    { resourceId: "capital", label: "Capital", amount: 4 },
    { resourceId: "time", label: "Time", amount: 2 },
    { resourceId: "talent", label: "Organizational capacity", amount: 1 },
  ]);
  assert.equal(formatChoiceResourceCost(hire), "Cost: Capital 4 · Time 2 · Organizational capacity 1");

  const resourceFree = {
    effects: [
      { target: "world", key: "productivity", delta: 3 },
      { target: "resources", key: "capital", delta: 2 },
    ],
  };
  assert.deepEqual(getChoiceResourceCosts(resourceFree), []);
  assert.equal(formatChoiceResourceCost(resourceFree), null);

  const [ui, primitives] = await Promise.all([
    readFile(new URL("../features/ai-future-sim/ui/AiFutureSimLanding.jsx", import.meta.url), "utf8"),
    readFile(new URL("../features/ai-future-sim/ui/AiFutureSimPrimitives.jsx", import.meta.url), "utf8"),
  ]);
  assert.match(ui, /getChoiceResourceCosts\(authoredChoice\)/);
  assert.match(primitives, /resourceCosts\.map\(\(\{ resourceId, label, amount \}\)/);
  assert.match(primitives, /className=\{styles\.costChip\}/);
  assert.doesNotMatch(primitives, /choice\.outcome|delayedConsequences|consequence\.title|consequence\.description/);
});

test("production ending explanations are authored, state-matched, and do not change resolution", async () => {
  assert.equal(scenario.version, 1);
  const endingCounts = new Map();
  const exampleExplanations = new Map();
  const decisionStates = [];
  const completedRuns = [];

  function visit(state, depth) {
    const level = scenario.levels[state.currentLevelIndex];
    const choices = getCurrentChoices(scenario, state);
    decisionStates.push({
      history: state.history.map((item) => item.choiceId),
      levelId: level.id,
      resources: state.resources,
      world: state.worldState,
      choices: choices.map((choice) => ({
        id: choice.id,
        available: choice.available,
        reasons: choice.lockReasons.map((reason) => ({
          code: reason.code,
          conditionId: reason.conditionId,
          targetId: reason.targetId,
          actualValue: reason.actualValue,
          requiredValue: reason.requiredValue,
        })),
      })),
    });

    for (const choice of choices.filter((candidate) => candidate.available)) {
      const next = advanceStep(scenario, selectChoice(scenario, state, choice.id));
      if (depth === yearIds.length - 1) {
        const endingId = next.ending.id;
        endingCounts.set(endingId, (endingCounts.get(endingId) ?? 0) + 1);
        completedRuns.push({
          history: next.history.map((item) => item.choiceId),
          resources: next.resources,
          world: next.worldState,
          endingId,
        });
        if (!exampleExplanations.has(endingId)) {
          const selectedEndingBefore = next.ending;
          const explanation = explainEndingForPlayer(scenario, next);
          assert.equal(next.ending, selectedEndingBefore);
          assert.equal(explanation.endingId, endingId);
          assert.ok(explanation.reasons.length >= 2 && explanation.reasons.length <= 4);
          assert.ok(explanation.reasons.every((reason) => !/condition_|threshold|\bgte\b|\blte\b/i.test(reason)));
          assert.deepEqual(explanation, explainEndingForPlayer(scenario, next));
          exampleExplanations.set(endingId, explanation);
        }
      } else {
        visit(next, depth + 1);
      }
    }
  }

  visit(beginRun(), 0);

  assert.equal(completedRuns.length, 4460);
  assert.equal(decisionStates.length, 1215);
  assert.equal(endingCounts.size, 6);
  assert.deepEqual(Object.fromEntries([...endingCounts].sort(([a], [b]) => a.localeCompare(b))), {
    adaptive_mixed_organization: 328,
    high_growth_dependence_organization: 132,
    human_ai_organization: 1462,
    human_capability_organization: 1122,
    maximum_automation_organization: 80,
    resilient_hybrid_organization: 1336,
  });
  assert.deepEqual(new Set(exampleExplanations.keys()), new Set(scenario.levels.at(-1).endings.map((ending) => ending.id)));
  assert.equal(new Set(scenario.levels.flatMap((level) => (level.choices ?? []).map((choice) => choice.id))).size, 35);
  assert.equal(scenario.levels.flatMap((level) => (level.choices ?? []).flatMap((choice) => choice.delayedConsequences ?? [])).length, 27);

  const approvedBaseline = JSON.parse(await readFile(new URL("../features/ai-future-sim/reports/founder_ai_organization-balance.json", import.meta.url), "utf8"));
  const currentAnalysis = analyzeScenarioBalance(scenario);
  for (const key of ["pathAnalysis", "endingDistribution", "choiceAvailability", "delayedConsequences", "finalWorldStateRanges", "finalResourceRanges"]) {
    assert.deepEqual(currentAnalysis[key], approvedBaseline[key], `Founder v1 ${key} must match its approved baseline`);
  }
  const withoutMessages = (value) => JSON.parse(JSON.stringify(value, (key, item) => key === "message" ? undefined : item));
  assert.deepEqual(
    withoutMessages(currentAnalysis.decisionStateAgency),
    withoutMessages(approvedBaseline.decisionStateAgency),
    "decision state availability and lock conditions must match the approved baseline; only their presentation copy may differ",
  );
});

test("choice costs and ending explanations stay separate from production debug diagnostics", async () => {
  const ui = await readFile(new URL("../features/ai-future-sim/ui/AiFutureSimLanding.jsx", import.meta.url), "utf8");
  const explanation = await readFile(new URL("../features/ai-future-sim/content/player-explanations.js", import.meta.url), "utf8");
  assert.match(ui, /process\.env\.NODE_ENV === "development"/);
  assert.match(ui, /get\("playtest"\) === "1"/);
  assert.match(ui, /<h2>Why this future\?<\/h2>/);
  assert.doesNotMatch(explanation, /evaluationOrder|higherPriorityEvaluations|relevantFinalWorldState/);
  assert.doesNotMatch(ui, /Cost:\s*(?:Capital|Time|Organizational capacity)\s+\d/);
});
