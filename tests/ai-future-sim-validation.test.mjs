import assert from "node:assert/strict";
import test from "node:test";

import { invalidScenarioFixtures } from "../features/ai-future-sim/fixtures/invalid-scenarios.js";
import { founderOrganizationScenario } from "../features/ai-future-sim/content/scenarios/founder-organization.scenario.js";
import { validateScenario, validateScenarios } from "../features/ai-future-sim/content/validate-scenario.js";

test("canonical Founder scenario satisfies the content contract and graph contract", () => {
  const result = validateScenario(founderOrganizationScenario);
  assert.equal(result.valid, true, JSON.stringify(result.errors, null, 2));
  assert.deepEqual(result.errors, []);
  assert.equal(result.graph.startNodeId, "founder_briefing");
  assert.equal(result.graph.reachableNodeIds.length, 7);
  assert.deepEqual(new Set(result.graph.reachableNodeIds), new Set([
    "founder_briefing",
    "starting_point",
    "immediate_impact",
    "business_and_work",
    "market_society_shift",
    "second_order_effects",
    "future_world",
  ]));
  assert.deepEqual(result.graph.unreachableNodeIds, []);
  assert.deepEqual(result.graph.deadEndNodeIds, []);
  assert.deepEqual(result.graph.terminalNodeIds, ["future_world"]);
  assert.deepEqual(result.graph.cycles, []);
  assert.equal(founderOrganizationScenario.id, "founder_ai_organization");
  assert.equal(founderOrganizationScenario.version, 1);
  assert.equal(founderOrganizationScenario.levels.filter((level) => level.type === "decision").length, 5);
  assert.equal(founderOrganizationScenario.levels.find((level) => level.id === "future_world").endings.length, 6);
});

test("scenario versions must be stable positive integers", () => {
  const scenario = structuredClone(founderOrganizationScenario);
  scenario.version = 1.5;
  const result = validateScenario(scenario);
  assert.ok(result.errors.some((error) => error.code === "invalid_scenario_version"));
});

for (const fixture of invalidScenarioFixtures) {
  test(`invalid content fixture is rejected: ${fixture.name}`, () => {
    const result = validateScenario(fixture.scenario);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((error) => error.code === fixture.expectedCode), JSON.stringify(result.errors, null, 2));
    for (const error of result.errors) {
      assert.equal(typeof error.sourceEntity, "string");
      assert.equal(typeof error.field, "string");
      assert.equal(typeof error.reason, "string");
      assert.ok(Object.hasOwn(error, "referencedId"));
    }
  });
}

test("an explicitly allowed intentional cycle is distinguished from an accidental cycle", () => {
  const scenario = structuredClone(founderOrganizationScenario);
  scenario.graphPolicy.allowIntentionalCycles = true;
  scenario.levels[1].choices[0].nextLevelId = scenario.startLevelId;

  const result = validateScenario(scenario);
  assert.equal(result.valid, true, JSON.stringify(result.errors, null, 2));
  assert.equal(result.graph.cycles.length, 1);
  assert.ok(result.warnings.some((warning) => warning.code === "intentional_cycle"));
});

test("scenario collection rejects duplicate scenario analytics IDs", () => {
  const result = validateScenarios([
    founderOrganizationScenario,
    structuredClone(founderOrganizationScenario),
  ]);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.code === "duplicate_scenario_id"));
});
