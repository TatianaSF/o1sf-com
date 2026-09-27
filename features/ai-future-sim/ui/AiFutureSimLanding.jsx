"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import styles from "./AiFutureSim.module.css";
import { founderOrganizationScenario } from "../content/scenarios/founder-organization.scenario.js";
import { explainEndingForPlayer } from "../content/player-explanations.js";
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
import { canonicalFounderPaths } from "../fixtures/canonical-founder-paths.js";
import { getChoiceResourceCosts } from "./choice-costs.js";
import { ActionButton, Card, ChoiceCard, SelectionCard } from "./AiFutureSimPrimitives.jsx";

const scenario = founderOrganizationScenario;
const decisionLevels = scenario.levels.filter((level) => level.type === "decision");

function subscribePlaytestMode(callback) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
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

function StateSummary({ state }) {
  return (
    <Card className={styles.stateCard} aria-label="Current simulation state">
      <h2>Current state</h2>
      <dl className={styles.stateGrid}>
        {Object.entries(state.worldState).map(([key, value]) => (
          <div key={key}>
            <dt>{displayName(key)}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <h3 className={styles.stateLabel}>Resources</h3>
      <dl className={styles.stateGrid}>
        {Object.entries(state.resources).map(([key, value]) => (
          <div key={key}>
            <dt>{displayName(key)}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function ConsequenceCard({ consequence }) {
  return (
    <Card className={styles.consequenceCard} aria-label="A delayed consequence is now visible">
      <h2>{consequence.title}</h2>
      <p>{consequence.description}</p>
    </Card>
  );
}

function PlaytestPanel({ enabled, scenarioRecord, gameState, debugTransition, pathName }) {
  if (!enabled) return null;

  return (
    <aside className={styles.playtest} aria-label="AI Future Sim developer playtest diagnostics" data-playtest-mode="true">
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
  const playtestEnabled = useSyncExternalStore(subscribePlaytestMode, getPlaytestSnapshot, getPlaytestServerSnapshot);
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
      setErrorMessage(error instanceof Error ? error.message : "That action is unavailable.");
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
      setErrorMessage(error instanceof Error ? error.message : "That action is unavailable.");
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
      setErrorMessage(error instanceof Error ? error.message : "That action is unavailable.");
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
      setErrorMessage(error instanceof Error ? error.message : "That action is unavailable.");
    }
  }

  function applyNextFixtureChoice() {
    const choiceId = playtestPath?.choices[gameState.history.length];
    if (choiceId) selectDecision(choiceId);
  }

  const playtestPanel = <PlaytestPanel enabled={playtestEnabled} scenarioRecord={scenario} gameState={gameState} debugTransition={debugTransition} pathName={playtestPath?.name} />;

  if (!gameState) {
    return (
      <main className={styles.page} lang="en" data-product="ai-future-sim">
        <div className={styles.content}>
          <Card className={styles.heroCard}>
            <h1 className={styles.heroTitle}>AI Future Sim</h1>
            <p className={styles.heroDescription}>A deterministic simulation about building capable human and AI organizations.</p>
            <ActionButton type="button" onClick={() => transition(() => startScenario(scenario))}>Start simulation</ActionButton>
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
          <PlaytestPanel enabled={playtestEnabled} scenarioRecord={scenario} gameState={null} debugTransition={debugTransition} pathName={null} />
          <ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  if (gameState.stage === "role_selection") {
    return (
      <main className={styles.page} lang="en" data-product="ai-future-sim" data-scenario-id={scenario.id}>
        <div className={styles.content}>
          <header className={styles.screenHeader}>
            <h1 className={styles.screenTitle}>{scenario.title}</h1>
            <p className={styles.screenDescription}>Select your role</p>
          </header>
          <div className={styles.selectionList}>
            {scenario.roles.map((role) => (
              <SelectionCard key={role.id} type="button" data-role-id={role.id} title={role.title} description={role.description} onClick={() => transition(() => selectRole(scenario, gameState, role.id))} />
            ))}
          </div>
          {playtestPanel}<ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  if (gameState.stage === "mission_selection") {
    return (
      <main className={styles.page} lang="en" data-product="ai-future-sim" data-scenario-id={scenario.id} data-role-id={gameState.roleId}>
        <div className={styles.content}>
          <header className={styles.screenHeader}>
            <h1 className={styles.screenTitle}>Select your mission</h1>
          </header>
          <div className={styles.selectionList}>
            {scenario.missions.map((mission) => (
              <SelectionCard key={mission.id} type="button" data-mission-id={mission.id} title={mission.title} description={mission.description} onClick={() => transition(() => selectMission(scenario, gameState, mission.id))} />
            ))}
          </div>
          {playtestPanel}<ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  const level = readCurrentLevel(scenario, gameState);

  if (gameState.stage === "scenario_intro") {
    return (
      <main className={styles.page} lang="en" data-product="ai-future-sim" data-scenario-id={scenario.id} data-role-id={gameState.roleId} data-mission-id={gameState.missionId}>
        <div className={styles.content}>
          <header className={styles.screenHeader}>
            <h1 className={styles.screenTitle}>{level.title}</h1>
          </header>
          <Card>
            <p className={styles.screenDescription}>{scenario.introduction}</p>
            <p className={styles.stagePrompt}>{level.prompt}</p>
            <ActionButton type="button" onClick={() => transition(() => advanceStep(scenario, gameState))}>Begin first decision</ActionButton>
          </Card>
          {playtestPanel}<ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  if (gameState.stage === "decision" || gameState.stage === "level_ready") {
    const choices = getCurrentChoices(scenario, gameState);
    const decisionIndex = decisionLevels.findIndex((item) => item.id === level.id);
    return (
      <main className={styles.page} lang="en" data-product="ai-future-sim" data-scenario-id={scenario.id} data-role-id={gameState.roleId} data-mission-id={gameState.missionId} data-level-id={level.id}>
        <div className={styles.content}>
          <header className={styles.screenHeader}>
            <span className={styles.stageMeta}>Year {decisionIndex + 1} of {decisionLevels.length}</span>
            <h1 className={styles.stageTitle}>{level.title}</h1>
            <p className={styles.stagePrompt}>{level.prompt}</p>
          </header>
          {level.revealedConsequences.map((consequence) => <ConsequenceCard key={consequence.id} consequence={consequence} />)}
          <ol className={styles.choiceList}>
            {choices.map((choice, index) => {
              const authoredChoice = level.choices.find((item) => item.id === choice.id);
              const resourceCosts = getChoiceResourceCosts(authoredChoice);
              return <ChoiceCard key={choice.id} choice={choice} index={index} resourceCosts={resourceCosts} onSelect={selectDecision} lockId={`locked-${choice.id}`} />;
            })}
          </ol>
          {playtestEnabled && playtestPath && playtestPath.choices[gameState.history.length] && (
            <button className={styles.fixtureButton} type="button" onClick={applyNextFixtureChoice}>Apply next fixture choice: {playtestPath.choices[gameState.history.length]}</button>
          )}
          {gameState.stage === "level_ready" && <StateSummary state={gameState} />}
          {playtestPanel}<ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  if (gameState.stage === "step_complete") {
    return (
      <main className={styles.page} lang="en" data-product="ai-future-sim" data-scenario-id={scenario.id} data-role-id={gameState.roleId} data-mission-id={gameState.missionId} data-level-id={level.id} data-choice-id={gameState.lastChoice?.choiceId}>
        <div className={styles.content}>
          <header className={styles.screenHeader}>
            <span className={styles.stageMeta}>{level.title}</span>
            <h1 className={styles.screenTitle}>Decision recorded</h1>
          </header>
          <Card><p className={styles.resultText}>{gameState.lastChoice?.outcome}</p></Card>
          <StateSummary state={gameState} />
          <ActionButton type="button" onClick={advanceWithDiagnostics}>Advance to next step</ActionButton>
          {playtestPanel}<ErrorMessage message={errorMessage} />
        </div>
      </main>
    );
  }

  const playerEndingExplanation = explainEndingForPlayer(scenario, gameState);

  return (
    <main className={styles.page} lang="en" data-product="ai-future-sim" data-scenario-id={scenario.id} data-role-id={gameState.roleId} data-mission-id={gameState.missionId} data-ending-id={gameState.ending?.id}>
      <div className={styles.content}>
        <header className={styles.screenHeader}>
          <span className={styles.stageMeta}>{level.title}</span>
          <h1 className={styles.endingTitle}>{gameState.ending?.title ?? "Simulation path complete"}</h1>
          <p className={styles.endingDescription}>{gameState.ending?.description ?? "Your decisions and their effects are recorded in this local run."}</p>
        </header>
        <Card className={styles.endingWhy} aria-label="Why this future">
          <h2>Why this future?</h2>
          <ul>
            {playerEndingExplanation.reasons.map((reason, index) => <li key={`${playerEndingExplanation.endingId}-${index}`}>{reason}</li>)}
          </ul>
        </Card>
        {level.revealedConsequences.map((consequence) => <ConsequenceCard key={consequence.id} consequence={consequence} />)}
        <StateSummary state={gameState} />
        {playtestPanel}
      </div>
    </main>
  );
}
