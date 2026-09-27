# AI Future Sim architecture foundation

## Repository fit

O1SF.com uses Next.js App Router under `app/`, shared site UI under `components/`, shared data under `lib/`, Node tests under `tests/`, and a static export (`output: "export"`) to `out/`. The existing Apache rules serve extensionless static routes from exported `.html` files. There is also a root Vinext/Cloudflare experiment in `vite.config.js` and `worker/`; it wraps the app router and is not the production Next.js static-export path.

The feature therefore follows the requested `app/ai-future-sim/` and `features/ai-future-sim/` boundaries. The API is isolated at `cloudflare/ai-future-sim-api/`, rather than added to the root experimental Worker. This avoids changing the existing site's build or mixing this product API into the generic Vinext adapter.

## Product boundaries

- `app/ai-future-sim/page.jsx`: thin route and page metadata.
- `features/ai-future-sim/`: product UI, future engine/content/state/i18n/fixture boundaries, production language config, and analytics taxonomy/event shape.
- `cloudflare/ai-future-sim-api/`: independent Wrangler Worker project, local D1 binding, health endpoint, and versioned D1 schema.

## Static export constraint

The Next.js route is emitted as a static page. It cannot host request-time API handlers or server persistence. The separate Worker is the future dynamic API boundary and can evolve without removing static export from O1SF.com. No runtime calls, analytics transport, or persistence have been added to the page.

## Language contract

The root document and route use English. Product configuration fixes production language to `en`; it can resolve `ru` only when internal code explicitly supplies manual-development mode and a `ru` development language. The public UI does not call this mode and contains no Russian copy, locale detection, language selector, alternate route, or query parameter.

## Analytics and persistence

The feature taxonomy defines `game_started`, `role_selected`, `mission_selected`, `level_viewed`, `choice_selected`, and `game_completed`. Its event shape includes event and anonymous session IDs, applicable scenario/level/choice/role/mission IDs, language, timestamp, and extensible metadata. There is no transport yet; the taxonomy is independent of the site's existing Google Analytics integration.

Migration `0001_initial.sql` creates the initial `session_runs` and `analytics_events` tables. Since it was already applied locally, migration `0002_expand_language_and_event_taxonomy.sql` preserves migration history while allowing `en`/`ru` language records and removing the SQL event-name allowlist. Application code owns event taxonomy validation. D1 is the structured persistence layer. R2 remains reserved for future media/assets.

## Precomputed runtime and content validation

The shipped game must traverse only authored deterministic content. Runtime code must not call or embed a generative model, generate scenario content, complete missing content, or generate AI Advisor output. The framework-independent `content/validate-scenario.js` contract validates machine IDs, English production copy, condition/effect/unlock/consequence references, seven-choice decision nodes, and graph reachability/transitions/terminals/cycles. Add scenarios as default-exported `*.scenario.js` modules. `npm run validate:ai-future-sim` discovers and validates them and guards product runtime imports; both site build commands run this check before building.

## Founder graph strategy

The Founder experience uses five shared seven-choice decision nodes for Years 1–5. Every path converges on the same authored Year 6 Future World resolver while carrying forward its world state, resources, decision history, and revealed consequences. This keeps the content graph linear in authored nodes rather than creating a separate page for every choice history. The resolver checks its ordered, authored condition sets and returns one of six prewritten endings; the final unconditional outcome is the fallback. Choices, effects, unlocks, delayed consequences, and ending conditions remain content data, while the engine owns evaluation.

Founder is approved as scenario ID `founder_ai_organization`, version `1`. The deterministic exhaustive balance report is generated with `npm run analyze:ai-future-sim` and saved under `features/ai-future-sim/reports/`. Once analytics or user sessions exist, material gameplay changes to choices, effects, conditions, unlocks, delayed consequences, or ending rules require a version increment. Non-semantic copy and typo corrections may remain within the current version. The current ending order is intentional: the first matching authored outcome wins, with Adaptive Mixed as fallback.

## Founder v1 playtest and diagnostics

Founder v1 can be manually inspected in a local development server at `/ai-future-sim?playtest=1`. The query is effective only when `NODE_ENV` is `development`; production always renders normal gameplay. The developer path selector uses shared canonical fixtures and advances through the real engine one step at a time. The debug panel shows stable IDs, immediate authored effects, state before/after, registered consequence IDs, reveal details only once revealed, next-node availability/lock reasons, and the ending-priority trace. It does not show pending consequence titles or descriptions.

Unavailable choices expose machine-readable reason codes and condition details. `npm run analyze:ai-future-sim` writes the exhaustive Year 5 agency diagnostics, ending priority review, and delayed-consequence playtest reference beside the existing balance report. The Year 5 report includes every reachable state with fewer than three options and details each single-choice state. These are diagnostics only; no Founder v1 rules are changed by report generation. Use `features/ai-future-sim/fixtures/FOUNDER_V1_PLAYTEST_CHECKLIST.md` for manual review of the five canonical paths.

The engine's ending explainability function is a read-only trace of the existing authored priority resolver. It reports tested predicates, the selected outcome, higher-priority evaluations, any other matching outcomes, and fallback use without changing the ending logic.

The role, mission, Year 1–5 decisions, and Future World ending resolver are part of one validated scenario graph. The brief intro node precedes the six player-facing years; it is not counted as a gameplay year.

## Deferred work

The UI traverses the six-year Founder scenario locally and deterministically. Session persistence, analytics ingestion/query APIs, runtime generative AI, and production publication remain out of scope.
