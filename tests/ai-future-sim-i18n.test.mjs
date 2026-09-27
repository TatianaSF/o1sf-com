import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { resolveAiFutureSimLanguageFromSearch } from "../features/ai-future-sim/config/language.js";
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
import {
  getLanguageBundle,
  getLocalizedEndingReasons,
  getLocalizedField,
  getLocalizedLockReason,
  getResourceLabel,
  getWorldStateLabel,
  validateLocaleCompleteness,
} from "../features/ai-future-sim/i18n/index.js";

function beginRun() {
  const started = startScenario(scenario);
  const role = selectRole(scenario, started, "company_founder");
  const mission = selectMission(scenario, role, "build_smart_human_ai_org");
  return advanceStep(scenario, mission);
}

function runPath(path, language) {
  let state = beginRun();
  const checkpoints = [];
  const displayedChoices = [];
  const displayedConsequences = [];
  for (const choiceId of path.choices) {
    const currentChoices = getCurrentChoices(scenario, state);
    checkpoints.push(currentChoices.map(({ id, available, unlocked, affordable, lockReasons }) => ({
      id,
      available,
      unlocked,
      affordable,
      lockReasons: lockReasons.map(({ code, conditionId, targetId }) => ({ code, conditionId, targetId })),
    })));
    const selected = currentChoices.find((choice) => choice.id === choiceId);
    assert.equal(selected?.available, true, `${path.name}: ${choiceId} is available`);
    displayedChoices.push(getLocalizedField(language, "choices", selected.id, "title", selected.title));
    state = advanceStep(scenario, selectChoice(scenario, state, choiceId));
    displayedConsequences.push(...state.newlyRevealedConsequences.map((consequence) =>
      getLocalizedField(language, "consequences", consequence.id, "title", consequence.title)
    ));
  }
  const displayedEnding = getLocalizedField(language, "endings", state.ending.id, "title", state.ending.title);
  return { state, checkpoints, displayedChoices, displayedConsequences, displayedEnding };
}

function playToYearFive(path) {
  let state = beginRun();
  path.choices.slice(0, 4).forEach((choiceId) => {
    state = advanceStep(scenario, selectChoice(scenario, state, choiceId));
  });
  return state;
}

test("English remains the default; only a bare ?ru flag selects Russian", () => {
  assert.equal(resolveAiFutureSimLanguageFromSearch(""), "en");
  assert.equal(resolveAiFutureSimLanguageFromSearch("?playtest=1"), "en");
  assert.equal(resolveAiFutureSimLanguageFromSearch("?lang=ru"), "en");
  assert.equal(resolveAiFutureSimLanguageFromSearch("?ru"), "ru");
  assert.equal(resolveAiFutureSimLanguageFromSearch("?ru&playtest=1"), "ru");
  assert.equal(resolveAiFutureSimLanguageFromSearch("?ru=1"), "en");
  assert.equal(resolveAiFutureSimLanguageFromSearch("?RU"), "en");
});

test("Russian player copy is complete for every stable Founder v1 ID", () => {
  assert.equal(scenario.id, "founder_ai_organization");
  assert.equal(scenario.version, 1);
  assert.deepEqual(validateLocaleCompleteness(scenario), { valid: true, missing: [] });
  assert.equal(Object.keys(getLanguageBundle("ru").choices).length, 35);
  assert.equal(Object.keys(getLanguageBundle("ru").consequences).length, 27);
  assert.equal(Object.keys(getLanguageBundle("ru").endings).length, 6);
});

test("representative product, mission, choice, stage, consequence, and ending copy is localized", () => {
  const russian = getLanguageBundle("ru");
  assert.equal(russian.ui.startSimulation, "Начать симуляцию");
  assert.equal(russian.roles.company_founder.title, "Основатель");
  assert.equal(russian.missions.build_smart_human_ai_org.title, "Построить самую разумную организацию людей и ИИ");
  assert.equal(russian.levels.starting_point.title, "Год 1 — Отправная точка");
  assert.equal(russian.choices.automate_back_office.title, "Автоматизировать внутренние процессы");
  assert.equal(russian.consequences.junior_pipeline_thins.title, "Путь для начинающих сужается");
  assert.equal(russian.endings.human_ai_organization.title, "Организация людей и ИИ");
  assert.notEqual(getLocalizedField("ru", "choices", "automate_back_office", "title", "Automate back-office work"), "Automate back-office work");
});

test("resource names and choice-cost labels are Russian while IDs stay unchanged", async () => {
  assert.equal(getResourceLabel("ru", "capital", "Capital"), "Капитал");
  assert.equal(getResourceLabel("ru", "time", "Time"), "Время");
  assert.equal(getResourceLabel("ru", "talent", "Organizational capacity"), "Организационный потенциал");
  assert.equal(getWorldStateLabel("ru", "ai_adoption", "ai adoption"), "Внедрение ИИ");
  const { getChoiceResourceCosts } = await import("../features/ai-future-sim/ui/choice-costs.js");
  const hire = scenario.levels.find((level) => level.id === "starting_point").choices.find((choice) => choice.id === "hire_human_experts");
  assert.deepEqual(getChoiceResourceCosts(hire, "ru"), [
    { resourceId: "capital", label: "Капитал", amount: 4 },
    { resourceId: "time", label: "Время", amount: 2 },
    { resourceId: "talent", label: "Организационный потенциал", amount: 1 },
  ]);
});

test("Russian lock reasons follow the exact deterministic condition that blocked the choice", () => {
  const automationYearFive = getCurrentChoices(scenario, playToYearFive(paths[0]));
  const humanCapabilityYearFive = getCurrentChoices(scenario, playToYearFive(paths[2]));
  const find = (choices, id) => choices.find((choice) => choice.id === id);

  const humanFallback = find(automationYearFive, "build_verification_fallbacks");
  assert.equal(humanFallback.lockReasons[0].conditionId, "condition_human_review");
  assert.match(getLocalizedLockReason(humanFallback, "ru"), /компетенции людей/);

  const dependenceFallback = find(humanCapabilityYearFive, "build_verification_fallbacks");
  assert.equal(dependenceFallback.lockReasons[0].conditionId, "condition_dependence_two");
  assert.match(getLocalizedLockReason(dependenceFallback, "ru"), /зависимость от ИИ/);

  const trustNetwork = find(automationYearFive, "build_redundant_network");
  assert.equal(trustNetwork.lockReasons[0].conditionId, "condition_trusted_review");
  assert.match(getLocalizedLockReason(trustNetwork, "ru"), /доверие/);

  const dependenceNetwork = find(humanCapabilityYearFive, "build_redundant_network");
  assert.equal(dependenceNetwork.lockReasons[0].conditionId, "condition_dependence_one");
  assert.match(getLocalizedLockReason(dependenceNetwork, "ru"), /зависимост.*ИИ/);
});

test("ending explanations are statically localized for all six resolved Future Worlds", () => {
  const found = new Map();
  function visit(state, depth) {
    if (depth === 5 || found.size === 6) return;
    for (const choice of getCurrentChoices(scenario, state).filter((item) => item.available)) {
      const next = advanceStep(scenario, selectChoice(scenario, state, choice.id));
      if (next.stage === "completed") found.set(next.ending.id, next);
      else visit(next, depth + 1);
      if (found.size === 6) return;
    }
  }
  visit(beginRun(), 0);
  assert.equal(found.size, 6);
  for (const [endingId, state] of found) {
    const reasons = getLocalizedEndingReasons(scenario, state, "ru");
    assert.ok(reasons.length >= 2 && reasons.length <= 4, endingId);
    assert.ok(reasons.every((reason) => /[А-Яа-яЁё]/u.test(reason)), endingId);
    assert.deepEqual(getLocalizedEndingReasons(scenario, state, "en"), getLocalizedEndingReasons(scenario, state, "en"));
  }
});

test("all five canonical Founder paths have identical gameplay state and availability in EN and RU", () => {
  for (const path of paths) {
    const english = runPath(path, "en");
    const russian = runPath(path, "ru");
    assert.deepEqual(russian.state, english.state, path.name);
    assert.deepEqual(russian.checkpoints, english.checkpoints, path.name);
    assert.notDeepEqual(russian.displayedChoices, english.displayedChoices, path.name);
    assert.notDeepEqual(russian.displayedConsequences, english.displayedConsequences, path.name);
    assert.notEqual(russian.displayedEnding, english.displayedEnding, path.name);
    assert.equal(russian.state.scenarioVersion, 1);
    assert.equal(russian.state.ending.id, english.state.ending.id);
    assert.ok(getLocalizedField("ru", "choices", path.choices[0], "title", "English title") !== "English title");
  }
});

test("hidden Russian mode adds no public switch and playtest diagnostics stay development-gated", async () => {
  const ui = await readFile(new URL("../features/ai-future-sim/ui/AiFutureSimLanding.jsx", import.meta.url), "utf8");
  const route = await readFile(new URL("../app/ai-future-sim/page.jsx", import.meta.url), "utf8");
  const config = await readFile(new URL("../features/ai-future-sim/config/language.js", import.meta.url), "utf8");
  assert.match(ui, /process\.env\.NODE_ENV === "development"/);
  assert.match(ui, /get\("playtest"\) === "1"/);
  assert.match(ui, /resolveAiFutureSimLanguageFromSearch\(window\.location\.search\)/);
  assert.doesNotMatch(ui, /language selector|language switch|onClick=.*setLanguage|>RU</i);
  assert.doesNotMatch(route, /\?ru|Russian|Русск/);
  assert.doesNotMatch(config, /navigator\.language|Accept-Language|Intl\.Locale/);
});
