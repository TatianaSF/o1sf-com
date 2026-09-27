import { founderOrganizationScenario } from "../content/scenarios/founder-organization.scenario.js";

function copyScenario() {
  return structuredClone(founderOrganizationScenario);
}

function firstDecision(scenario) {
  return scenario.levels.find((level) => level.id === "starting_point");
}

function firstChoice(scenario) {
  return firstDecision(scenario).choices[0];
}

function automationChoice(scenario) {
  return firstDecision(scenario).choices.find((choice) => choice.id === "automate_back_office");
}

export const invalidScenarioFixtures = [
  {
    name: "duplicate ID",
    expectedCode: "duplicate_id",
    scenario: (() => {
      const scenario = copyScenario();
      scenario.roles.push({ ...scenario.roles[0] });
      return scenario;
    })(),
  },
  {
    name: "unknown role reference",
    expectedCode: "unknown_role_reference",
    scenario: (() => {
      const scenario = copyScenario();
      scenario.missions[0].roleIds = ["missing_role"];
      return scenario;
    })(),
  },
  {
    name: "unknown mission reference",
    expectedCode: "unknown_mission_reference",
    scenario: (() => {
      const scenario = copyScenario();
      scenario.levels[1].missionIds = ["missing_mission"];
      return scenario;
    })(),
  },
  {
    name: "missing target level",
    expectedCode: "missing_level_reference",
    scenario: (() => {
      const scenario = copyScenario();
      scenario.levels[0].nextLevelId = "missing_level";
      return scenario;
    })(),
  },
  {
    name: "decision with six choices",
    expectedCode: "decision_choice_count",
    scenario: (() => {
      const scenario = copyScenario();
      firstDecision(scenario).choices.pop();
      return scenario;
    })(),
  },
  {
    name: "decision with eight choices",
    expectedCode: "decision_choice_count",
    scenario: (() => {
      const scenario = copyScenario();
      const extra = structuredClone(firstDecision(scenario).choices[0]);
      extra.id = "extra_decision_choice";
      extra.effects.forEach((effect, index) => { effect.id = `extra_choice_effect_${index + 1}`; });
      firstDecision(scenario).choices.push(extra);
      return scenario;
    })(),
  },
  {
    name: "invalid effect target",
    expectedCode: "invalid_effect_target",
    scenario: (() => {
      const scenario = copyScenario();
      firstChoice(scenario).effects[0].target = "actor";
      return scenario;
    })(),
  },
  {
    name: "invalid resource reference",
    expectedCode: "unknown_resource_reference",
    scenario: (() => {
      const scenario = copyScenario();
      firstChoice(scenario).effects[0].key = "unlisted_budget";
      return scenario;
    })(),
  },
  {
    name: "broken unlock condition",
    expectedCode: "unknown_condition_reference",
    scenario: (() => {
      const scenario = copyScenario();
      scenario.levels[2].choices[0].unlock.conditionIds.push("missing_condition");
      return scenario;
    })(),
  },
  {
    name: "delayed consequence with missing reveal target",
    expectedCode: "missing_level_reference",
    scenario: (() => {
      const scenario = copyScenario();
      automationChoice(scenario).delayedConsequences[0].activation.levelId = "missing_reveal_level";
      return scenario;
    })(),
  },
  {
    name: "unreachable node",
    expectedCode: "unreachable_node",
    scenario: (() => {
      const scenario = copyScenario();
      scenario.levels.push({
        id: "orphan_ending",
        type: "ending",
        title: "An unreachable ending",
        description: "This ending cannot be reached from the start.",
      });
      return scenario;
    })(),
  },
  {
    name: "accidental cycle",
    expectedCode: "accidental_cycle",
    scenario: (() => {
      const scenario = copyScenario();
      scenario.levels[0].nextLevelId = scenario.levels[0].id;
      return scenario;
    })(),
  },
  {
    name: "missing required English content",
    expectedCode: "missing_english_content",
    scenario: (() => {
      const scenario = copyScenario();
      scenario.title = "  ";
      return scenario;
    })(),
  },
  {
    name: "invalid analytics identifier",
    expectedCode: "invalid_id",
    scenario: (() => {
      const scenario = copyScenario();
      firstChoice(scenario).id = "Choose Human Experts";
      return scenario;
    })(),
  },
  {
    name: "unknown choice prerequisite",
    expectedCode: "unknown_choice_reference",
    scenario: (() => {
      const scenario = copyScenario();
      scenario.conditions.push({ id: "condition_unknown_choice", target: "choice", choiceId: "missing_choice", operator: "selected" });
      scenario.levels[2].choices[0].unlock.conditionIds.push("condition_unknown_choice");
      return scenario;
    })(),
  },
  {
    name: "choice without effects",
    expectedCode: "missing_effects",
    scenario: (() => {
      const scenario = copyScenario();
      firstChoice(scenario).effects = [];
      return scenario;
    })(),
  },
  {
    name: "ending with an unknown state condition",
    expectedCode: "unknown_condition_reference",
    scenario: (() => {
      const scenario = copyScenario();
      scenario.levels.find((level) => level.id === "future_world").endings[0].conditionIds.push("missing_ending_condition");
      return scenario;
    })(),
  },
  {
    name: "ending without a fallback outcome",
    expectedCode: "ending_fallback_count",
    scenario: (() => {
      const scenario = copyScenario();
      const ending = scenario.levels.find((level) => level.id === "future_world").endings.at(-1);
      ending.conditionIds = ["condition_auto_ending_adoption"];
      return scenario;
    })(),
  },
];
