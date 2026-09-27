/**
 * @typedef {Record<string, number>} WorldState
 * @typedef {Record<string, number>} ResourceState
 * @typedef {{ id: string, operation: "add", target: "world" | "resources", key: string, delta: number }} Effect
 * @typedef {{ id: string } & ({ target: "world" | "resources", key: string, operator: "gte" | "lte" | "eq", value: number } | { target: "choice", choiceId: string, operator: "selected" })} Condition
 * @typedef {{ type: "on_level_entry", levelId: string }} ConsequenceActivation
 * @typedef {{ id: string, originChoiceId: string, activation: ConsequenceActivation, title: string, description: string, effects: Effect[] }} DelayedConsequence
 * @typedef {{ id: string, title: string, description: string, unlock?: { id: string, conditionIds: string[] }, nextLevelId?: string, effects: Effect[], outcome: string, lockedReason?: string, delayedConsequences?: DelayedConsequence[] }} Choice
 * @typedef {{ code: string, conditionId: string | null, target: string, targetId: string, operator: string, requiredValue: number | null, actualValue: number | boolean, message: string }} ChoiceLockReason
 * @typedef {{ id: string, title: string, description: string, outcome: string, available: boolean, unlocked: boolean, affordable: boolean, lockReasonCode: string | null, lockReasons: ChoiceLockReason[], lockedReason: string | null }} ChoiceAvailability
 * @typedef {{ id: string, title: string, description: string }} Role
 * @typedef {{ id: string, title: string, description: string, roleIds?: string[] }} Mission
 * @typedef {{ id: string, title: string, description: string, conditionIds: string[], playerReasons?: Array<{ conditionId: string | null, text: string }> }} EndingOutcome
 * @typedef {{ id: string, type: "narrative" | "decision" | "follow_up" | "ending", title: string, prompt?: string, description?: string, missionIds?: string[], nextLevelId?: string, terminal?: boolean, choices?: Choice[], endings?: EndingOutcome[] }} Level
 * @typedef {{ id: string, version: number, startLevelId: string, title: string, introduction: string, roles: Role[], missions: Mission[], conditions: Condition[], levels: Level[], initialWorldState: WorldState, initialResources: ResourceState, graphPolicy?: { allowIntentionalCycles?: boolean } }} Scenario
 * @typedef {{ scenarioId: string, scenarioVersion: number, stage: "role_selection" | "mission_selection" | "scenario_intro" | "decision" | "step_complete" | "level_ready" | "completed", roleId: string | null, missionId: string | null, currentLevelIndex: number, worldState: WorldState, resources: ResourceState, history: Array<{ levelId: string, choiceId: string }>, ending: EndingOutcome | null, pendingConsequences: Array<DelayedConsequence & { sourceChoiceId: string }>, revealedConsequences: Array<DelayedConsequence & { sourceChoiceId: string }>, newlyRevealedConsequences: Array<DelayedConsequence & { sourceChoiceId: string }>, lastChoice: { levelId: string, choiceId: string, nextLevelId: string | null, outcome: string, effects: Effect[] } | null, flags?: string[], capabilities?: string[] }} GameSessionState
 */

export {};
