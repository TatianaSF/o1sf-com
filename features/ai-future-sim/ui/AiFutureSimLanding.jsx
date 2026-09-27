"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import styles from "./AiFutureSim.module.css";
import { founderOrganizationScenario } from "../content/scenarios/founder-organization.scenario.js";
import {
  advanceStep,
  explainEndingSelection,
  getCurrentChoices,
  readCurrentLevel,
  selectChoice,
  selectMission,
  selectRole,
  startScenario,
} from "../engine/index.js";
import { resolveAiFutureSimLanguageFromSearch } from "../config/language.js";
import { canonicalFounderPaths } from "../fixtures/canonical-founder-paths.js";
import {
  getLocalizedEndingReasons,
  getLocalizedField,
  getLocalizedLockReason,
  getLocalizedScenarioField,
  getResourceLabel,
  getWorldStateLabel,
  getUiCopy,
} from "../i18n/index.js";
import { getChoiceResourceCosts } from "./choice-costs.js";
import { ActionButton, Card, ChoiceCard, SelectionCard } from "./AiFutureSimPrimitives.jsx";

const scenario = founderOrganizationScenario;
const decisionLevels = scenario.levels.filter((level) => level.type === "decision");

function subscribeQueryState(callback) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function getLanguageSnapshot() {
  return resolveAiFutureSimLanguageFromSearch(window.location.search);
}

function getLanguageServerSnapshot() {
  return "en";
}

function getPlaytestSnapshot() {
  return process.env.NODE_ENV === "development" && new URLSearchParams(window.location.search).get("playtest") === "1";
}

function getPlaytestServerSnapshot() {
  return false;
}

function stateChanges(before, after) {
  return Object.fromEntries(Object.keys(after).map((key) => [key, after[key] - before[key]]).filter(([, delta]) => delta !== 0));
}

function displayName(identifier) {
  return identifier.replaceAll("_", " ");
}

function localizedError(error, language) {
  return language === "ru"
    ? getUiCopy(language, "unavailableAction", "That action is unavailable.")
    : error instanceof Error ? error.message : "That action is unavailable.";
}

function StateSummary({ state, language }) {
  return (
    <Card className={styles.stateCard} aria-label={getUiCopy(language, "currentState", "Current simulation state")}>
      <h2>{getUiCopy(language, "currentState", "Current state")}</h2>
      <dl className={styles.stateGrid}>
        {Object.entries(state.worldState).map(([key, value]) => (
          <div key={key}>
            <dt>{getWorldStateLabel(language, key, displayName(key))}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <h3 className={styles.stateLabel}>{getUiCopy(language, "resources", "Resources")}</h3>
      <dl className={styles.stateGrid}>
        {Object.entries(state.resources).map(([key, value]) => (
          <div key={key}>
            <dt>{getResourceLabel(language, key, displayName(key))}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function ConsequenceCard({ consequence, language }) {
  return (
    <Card className={styles.consequenceCard} aria-label={getUiCopy(language, "consequenceVisible", "A delayed consequence is now visible")}>
      <h2>{getLocalizedField(language, "consequences", consequence.id, "title", consequence.title)}</h2>
      <p>{getLocalizedField(language, "consequences", consequence.id, "description", consequence.description)}</p>
    </Card>
  );
}

function PlaytestPanel({ enabled, scenarioRecord, gameState, debugTransition, pathName }) {
  if (!enabled) return null;

  return (
    <aside className={styles.playtest} lang="en" aria-label="AI Future Sim developer playtest diagnostics" data-playtest-mode="true">
      <h2>Developer playtest</h2>
      <p>Scenario: {scenarioRecord.id} v{scenarioRecord.version}</p>
      {pathName && <p>Replay path: {pathName}</p>}
      {gameState && <pre>{JSON.stringify(debugTransition ?? {
        scenarioId: scenarioRecord.id,
        scenarioVersion: scenarioRecord.version,
        levelId: scenarioRecord.levels[gameState.currentLevelIndex]?.id ?? null,
        selectedChoiceId: null,
      }, null, 2)}</pre>}
      {gameState?.stage === "completed" && <pre>{JSON.stringify(explainEndingSelection(scenarioRecord, gameState), null, 2)}</pre>}
    </aside>
  );
}

function ErrorMessage({ message }) {
  return message ? <p className={styles.error} role="alert">{message}</p> : null;
}

export default function AiFutureSimLanding() {
  const [gameState, setGameState] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const language = useSyncExternalStore(subscribeQueryState, getLanguageSnapshot, getLanguageServerSnapshot);
  const playtestEnabled = useSyncExternalStore(subscribeQueryState, getPlaytestSnapshot, getPlaytestServerSnapshot);
  const [playtestPath, setPlaytestPath] = useState(null);
  const [debugTransition, setDebugTransition] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [gameState?.stage, gameState?.currentLevelIndex]);

  function transition(action) {
    try {
      setGameState(action());
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(localizedError(error, language));
    }
  }

  function beginCanonicalPath(path) {
    try {
      let state = startScenario(scenario);
      state = selectRole(scenario, state, scenario.roles[0].id);
      state = selectMission(scenario, state, scenario.missions[0].id);
      setGameState(state);
      setPlaytestPath(path);
      setDebugTransition(null);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(localizedError(error, language));
    }
  }

  function selectDecision(choiceId) {
    try {
      const level = scenario.levels[gameState.currentLevelIndex];
      const choice = level.choices.find((item) => item.id === choiceId);
      const beforeChoices = getCurrentChoices(scenario, gameState);
      const next = selectChoice(scenario, gameState, choiceId);
      setGameState(next);
      setDebugTransition({
        scenarioId: scenario.id,
        scenarioVersion: scenario.version,
        levelId: level.id,
        selectedChoiceId: choice.id,
        effects: choice.effects,
        before: { resources: gameState.resources, worldState: gameState.worldState },
        after: { resources: next.resources, worldState: next.worldState },
        resourceChanges: stateChanges(gameState.resources, next.resources),
        worldStateChanges: stateChanges(gameState.worldState, next.worldState),
        flagsAdded: [],
        flagsRemoved: [],
        capabilitiesAdded: [],
        capabilitiesRemoved: [],
        registeredConsequenceIds: (choice.delayedConsequences ?? []).map((item) => item.id),
        revealedConsequences: [],
        choicesUnlockedBeforeDecision: beforeChoices.filter((item) => item.available).map((item) => item.id),
        choicesLockedBeforeDecision: beforeChoices.filter((item) => !item.available).map((item) => ({ id: item.id, reasons: item.lockReasons })),
        nextNodeId: choice.nextLevelId ?? level.nextLevelId ?? null,
      });
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(localizedError(error, language));
    }
  }

  function advanceWithDiagnostics() {
    try {
      const next = advanceStep(scenario, gameState);
      let nextNodeChoices = null;
      if (["decision", "level_ready"].includes(next.stage)) {
        const choices = getCurrentChoices(scenario, next);
        nextNodeChoices = {
          available: choices.filter((choice) => choice.available).map((choice) => choice.id),
          locked: choices.filter((choice) => !choice.available).map((choice) => ({ id: choice.id, reasons: choice.lockReasons })),
        };
      }
      const revealed = next.newlyRevealedConsequences.map(({ id, title, description, effects }) => ({ id, title, description, effects }));
      const pending = next.pendingConsequences.map((item) => item.id);
      setDebugTransition((current) => current ? {
        ...current,
        revealedConsequences: revealed,
        pendingConsequenceIds: pending,
        nextNodeChoices,
        nextNodeId: scenario.levels[next.currentLevelIndex]?.id ?? null,
        stateAfterAdvance: { resources: next.resources, worldState: next.worldState },
      } : current);
      setGameState(next);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(localizedError(error, language));
    }
  }

  function applyNextFixtureChoice() {
    const choiceId = playtestPath?.choices[gameState.history.length];
    if (choiceId) selectDecision(choiceId);
  }

  const playtestPanel = <PlaytestPanel enabled={playtestEnabled} scenarioRecord={scenario} gameState={gameState} debugTransition={debugTransition} pathName={playtestPath?.name} />;
  const scenarioTitle = getLocalizedScenarioField(language, "title", scenario.title);

  if (!gameState) {
    return (
      <main className={styles.page} lang={language} data-locale={language} data-product="ai-future-sim">
        <div className={styles.content}>
          <Card className={styles.heroCard}>
            <h1 className={styles.heroTitle}>AI Future Sim</h1>
            <p className={styles.heroDescription}>{getUiCopy(language, "tagline", "A deterministic simulation about building capable human and AI organizations.")}</p>
            <ActionButton type="button" onClick={() => transition(() => startScenario(scenario))}>{getUiCopy(language, "startSimulation", "Start simulation")}</ActionButton>
          </Card>
          {playtestEnabled && <Card aria-label="Canonical playtest paths">
            <div className={styles.screenHeader}>
              <h2 className={styles.screenTitle}>Replay a canonical path</h2>
            </div>
            <div className={styles.selectionList}>
              {canonicalFounderPaths.map((path) => (
                <SelectionCard key={path.id} type="button" title={path.name} description="Replay this deterministic path step by step." onClick={() => beginCanonicalPath(path)} />
              ))}
            </div>
          </Card>}
          {playtestPanel}
          <ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  if (gameState.stage === "role_selection") {
    return (
      <main className={styles.page} lang={language} data-locale={language} data-product="ai-future-sim" data-scenario-id={scenario.id}>
        <div className={styles.content}>
          <header className={styles.screenHeader}>
            <h1 className={styles.screenTitle}>{scenarioTitle}</h1>
            <p className={styles.screenDescription}>{getUiCopy(language, "selectRole", "Select your role")}</p>
          </header>
          <div className={styles.selectionList}>
            {scenario.roles.map((role) => (
              <SelectionCard key={role.id} type="button" data-role-id={role.id} title={getLocalizedField(language, "roles", role.id, "title", role.title)} description={getLocalizedField(language, "roles", role.id, "description", role.description)} onClick={() => transition(() => selectRole(scenario, gameState, role.id))} />
            ))}
          </div>
          {playtestPanel}<ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  if (gameState.stage === "mission_selection") {
    return (
      <main className={styles.page} lang={language} data-locale={language} data-product="ai-future-sim" data-scenario-id={scenario.id} data-role-id={gameState.roleId}>
        <div className={styles.content}>
          <header className={styles.screenHeader}>
            <h1 className={styles.screenTitle}>{getUiCopy(language, "selectMission", "Select your mission")}</h1>
          </header>
          <div className={styles.selectionList}>
            {scenario.missions.map((mission) => (
              <SelectionCard key={mission.id} type="button" data-mission-id={mission.id} title={getLocalizedField(language, "missions", mission.id, "title", mission.title)} description={getLocalizedField(language, "missions", mission.id, "description", mission.description)} onClick={() => transition(() => selectMission(scenario, gameState, mission.id))} />
            ))}
          </div>
          {playtestPanel}<ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  const level = readCurrentLevel(scenario, gameState);
  const levelTitle = getLocalizedField(language, "levels", level.id, "title", level.title);

  if (gameState.stage === "scenario_intro") {
    return (
      <main className={styles.page} lang={language} data-locale={language} data-product="ai-future-sim" data-scenario-id={scenario.id} data-role-id={gameState.roleId} data-mission-id={gameState.missionId}>
        <div className={styles.content}>
          <header className={styles.screenHeader}>
            <h1 className={styles.screenTitle}>{levelTitle}</h1>
          </header>
          <Card>
            <p className={styles.screenDescription}>{getLocalizedScenarioField(language, "introduction", scenario.introduction)}</p>
            <p className={styles.stagePrompt}>{getLocalizedField(language, "levels", level.id, "prompt", level.prompt)}</p>
            <ActionButton type="button" onClick={() => transition(() => advanceStep(scenario, gameState))}>{getUiCopy(language, "beginFirstDecision", "Begin first decision")}</ActionButton>
          </Card>
          {playtestPanel}<ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  if (gameState.stage === "decision" || gameState.stage === "level_ready") {
    const choices = getCurrentChoices(scenario, gameState);
    const decisionIndex = decisionLevels.findIndex((item) => item.id === level.id);
    const localizedYear = getUiCopy(language, "yearOf", "Year {year} of {total}")
      .replace("{year}", String(decisionIndex + 1))
      .replace("{total}", String(decisionLevels.length));
    return (
      <main className={styles.page} lang={language} data-locale={language} data-product="ai-future-sim" data-scenario-id={scenario.id} data-role-id={gameState.roleId} data-mission-id={gameState.missionId} data-level-id={level.id}>
        <div className={styles.content}>
          <header className={styles.screenHeader}>
            <span className={styles.stageMeta}>{localizedYear}</span>
            <h1 className={styles.stageTitle}>{levelTitle}</h1>
            <p className={styles.stagePrompt}>{getLocalizedField(language, "levels", level.id, "prompt", level.prompt)}</p>
          </header>
          {level.revealedConsequences.map((consequence) => <ConsequenceCard key={consequence.id} consequence={consequence} language={language} />)}
          <ol className={styles.choiceList}>
            {choices.map((choice, index) => {
              const authoredChoice = level.choices.find((item) => item.id === choice.id);
              const localizedChoice = {
                ...choice,
                title: getLocalizedField(language, "choices", choice.id, "title", choice.title),
                description: getLocalizedField(language, "choices", choice.id, "description", choice.description),
                lockedReason: choice.available ? null : getLocalizedLockReason(choice, language),
              };
              const resourceCosts = getChoiceResourceCosts(authoredChoice, language);
              return <ChoiceCard key={choice.id} choice={localizedChoice} index={index} resourceCosts={resourceCosts} onSelect={selectDecision} lockId={`locked-${choice.id}`} language={language} costLabel={getUiCopy(language, "cost", "Cost")} lockedLabel={getUiCopy(language, "locked", "Locked")} />;
            })}
          </ol>
          {playtestEnabled && playtestPath && playtestPath.choices[gameState.history.length] && (
            <button className={styles.fixtureButton} type="button" onClick={applyNextFixtureChoice}>Apply next fixture choice: {playtestPath.choices[gameState.history.length]}</button>
          )}
          {gameState.stage === "level_ready" && <StateSummary state={gameState} language={language} />}
          {playtestPanel}<ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  if (gameState.stage === "step_complete") {
    const choiceCopy = getLocalizedField(language, "choices", gameState.lastChoice?.choiceId, "outcome", gameState.lastChoice?.outcome ?? "That decision has been recorded.");
    return (
      <main className={styles.page} lang={language} data-locale={language} data-product="ai-future-sim" data-scenario-id={scenario.id} data-role-id={gameState.roleId} data-mission-id={gameState.missionId} data-level-id={level.id} data-choice-id={gameState.lastChoice?.choiceId}>
        <div className={styles.content}>
          <header className={styles.screenHeader}>
            <span className={styles.stageMeta}>{levelTitle}</span>
            <h1 className={styles.screenTitle}>{getUiCopy(language, "decisionRecorded", "Decision recorded")}</h1>
          </header>
          <Card><p className={styles.resultText}>{choiceCopy}</p></Card>
          <StateSummary state={gameState} language={language} />
          <ActionButton type="button" onClick={advanceWithDiagnostics}>{getUiCopy(language, "advanceNextStep", "Advance to next step")}</ActionButton>
          {playtestPanel}<ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  const endingId = gameState.ending?.id;
  const endingTitle = getLocalizedField(language, "endings", endingId, "title", gameState.ending?.title ?? getUiCopy(language, "completedFallbackTitle", "Simulation path complete"));
  const endingDescription = getLocalizedField(language, "endings", endingId, "description", gameState.ending?.description ?? getUiCopy(language, "completedFallbackDescription", "Your decisions and their effects are recorded in this local run."));
  const playerEndingReasons = getLocalizedEndingReasons(scenario, gameState, language);

  return (
    <main className={styles.page} lang={language} data-locale={language} data-product="ai-future-sim" data-scenario-id={scenario.id} data-role-id={gameState.roleId} data-mission-id={gameState.missionId} data-ending-id={endingId}>
      <div className={styles.content}>
        <header className={styles.screenHeader}>
          <span className={styles.stageMeta}>{getLocalizedField(language, "levels", level.id, "title", level.title)}</span>
          <h1 className={styles.endingTitle}>{endingTitle}</h1>
          <p className={styles.endingDescription}>{endingDescription}</p>
        </header>
        <Card className={styles.endingWhy} aria-label={getUiCopy(language, "whyFuture", "Why this future")}>
          <h2>{getUiCopy(language, "whyFuture", "Why this future?")}</h2>
          <ul>
            {playerEndingReasons.map((reason, index) => <li key={`${endingId}-${index}`}>{reason}</li>)}
          </ul>
        </Card>
        {level.revealedConsequences.map((consequence) => <ConsequenceCard key={consequence.id} consequence={consequence} language={language} />)}
        <StateSummary state={gameState} language={language} />
        {playtestPanel}
      </div>
    </main>
  );
}
