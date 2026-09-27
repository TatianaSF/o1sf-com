import assert from "node:assert/strict";
import test from "node:test";

import { analyzeScenarioBalance } from "../features/ai-future-sim/analysis/analyze-scenario.js";
import { founderOrganizationScenario as scenario } from "../features/ai-future-sim/content/scenarios/founder-organization.scenario.js";

test("Founder v1 exhaustive balance analysis is deterministic and covers every reachable path", () => {
  const first = analyzeScenarioBalance(scenario);
  const second = analyzeScenarioBalance(scenario);
  assert.deepEqual(second, first);
  assert.deepEqual(first.scenario, {
    id: "founder_ai_organization",
    version: 1,
    title: "Build the smartest human + AI organization",
  });
  assert.equal(first.pathAnalysis.totalReachableCompletePaths, 4460);
  assert.equal(first.pathAnalysis.decisionStateVisitCount, 1215);
  assert.equal(first.pathAnalysis.authoredChoiceCount, 35);
  assert.equal(first.pathAnalysis.graphNodeCount, 7);
  assert.equal(first.pathAnalysis.endingCount, 6);
  assert.equal(first.endingDistribution.reduce((sum, ending) => sum + ending.pathCount, 0), 4460);
  assert.deepEqual(first.endingDistribution.map(({ id, pathCount }) => [id, pathCount]), [
    ["maximum_automation_organization", 80],
    ["human_ai_organization", 1462],
    ["human_capability_organization", 1122],
    ["resilient_hybrid_organization", 1336],
    ["high_growth_dependence_organization", 132],
    ["adaptive_mixed_organization", 328],
  ]);
  for (const ending of first.endingDistribution) assert.ok(ending.pathCount > 0, `${ending.id} remains reachable`);
  for (const level of scenario.levels.filter((item) => item.type === "decision")) {
    const selectedPaths = first.choiceAvailability
      .filter((choice) => choice.levelId === level.id)
      .reduce((sum, choice) => sum + choice.selectedPathCount, 0);
    assert.equal(selectedPaths, 4460, `${level.id} selects exactly once on every complete path`);
  }
  assert.equal(first.delayedConsequences.length, 27);
  assert.ok(first.delayedConsequences.every((item) => item.selectedPathCount === item.revealPathCount));
  assert.equal(first.delayedConsequences.find((item) => item.id === "customer_feedback_arrives").laterOptionChangedPathCount, 654);
  assert.equal(first.delayedConsequences.find((item) => item.id === "peer_coaching_spreads").endingChangedPathCount, 140);
  assert.equal(first.decisionStateAgency.lowAgencyStates.length, 239);
  assert.equal(first.decisionStateAgency.lowAgencyStates.filter((item) => item.levelId === "second_order_effects").length, 239);
  assert.ok(first.decisionStateAgency.lowAgencyStates.every((item) => item.history.length === 4 && item.resources && item.worldState && item.availableChoices.length < 3 && item.lockedChoices.length > 0));
  assert.equal(first.endingPriorityReview.multiMatchPathCount, 2485);
  assert.equal(first.endingPriorityReview.selectedFallbackPathCount, 328);
  assert.equal(first.endingPriorityReview.evaluationOrder.length, 6);
});

test("analysis reports constrained option states and ending-condition overlaps explicitly", () => {
  const report = analyzeScenarioBalance(scenario);
  const yearFive = report.decisionStateAgency.byLevel.find((level) => level.id === "second_order_effects");
  assert.equal(yearFive.fewerThanThreeAvailableStateCount, 239);
  assert.equal(yearFive.availableChoiceCountHistogram[1], 11);
  assert.equal(yearFive.availableChoiceCountHistogram[2], 228);
  assert.deepEqual(yearFive.forcedChoiceCounts, { create_knowledge_transfer: 11 });
  assert.ok(report.endingConditionOverlaps.length > 0);
  assert.equal(report.endingConditionOverlaps.some(({ endingIds }) => endingIds.includes("human_ai_organization") && endingIds.includes("human_capability_organization")), false);
  assert.ok(report.endingDistribution.find((ending) => ending.id === "adaptive_mixed_organization").conditionMatchPathCount === 4460);
  assert.ok(report.warnings.some((warning) => warning.code === "low_agency_state" && warning.levelId === "second_order_effects"));
  const singleChoiceStates = report.decisionStateAgency.lowAgencyStates.filter((item) => item.levelId === "second_order_effects" && item.availableCount === 1);
  assert.equal(singleChoiceStates.length, 11);
  assert.ok(singleChoiceStates.every((item) => item.availableChoices[0] === "create_knowledge_transfer"));
  assert.ok(singleChoiceStates.every((item) => item.lockedChoices.every((choice) => choice.reasons.length > 0)));
  const fallback = report.delayedConsequences.find((item) => item.id === "fallback_readiness");
  assert.equal(fallback.revealPathCount, 107);
  assert.equal(fallback.laterOptionChangedPathCount, 0);
  assert.equal(fallback.endingChangedPathCount, 0);
});
