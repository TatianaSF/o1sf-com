# AI Future Sim feature boundary

- `ui/` contains React presentation only. Keep game rules out of components.
- `engine/` will contain framework-independent simulation rules and transitions.
- `content/` will hold data-driven scenarios, levels, choices, roles, and missions.
- `state/` will define serializable run state and persistence boundaries.
- `analytics/` owns the product event taxonomy and event shape, independent of Google Analytics.
- `i18n/` will own future message catalogs. Production currently has English only; no locale detection or language controls are permitted.
- `config/` holds product defaults, including the production language contract.
- `fixtures/` holds deterministic development fixtures, never production content sources.
- `content/validate-scenario.js` validates the versioned content contract, graph, IDs, references, language requirements, unlocks, effects, and delayed consequences without React.

`engine/` contains deterministic, framework-independent run transitions. The canonical Founder scenario is data in `content/scenarios/`; `ui/AiFutureSimLanding.jsx` only renders the engine state and dispatches user actions. Its six player-facing years use five shared seven-choice decision nodes followed by one Future World resolver with six prewritten outcomes. Runs keep state in memory; there is no persistence, analytics transport, or localized catalog.

AI Future Sim is fully precomputed. Runtime code must never call or embed a model, generate or complete scenario content, or generate AI Advisor content. Add scenario files as `content/scenarios/*.scenario.js` with one default-exported record; the build validator discovers every matching file. `npm run validate:ai-future-sim` is also run by both site build commands.
