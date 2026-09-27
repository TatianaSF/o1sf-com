# AI Future Sim MVP Release Candidate

**Product:** AI Future Sim  
**MVP:** Phase 1 Modern Card-Based  
**Scenario:** `founder_ai_organization`  
**Scenario version:** `1`  
**Status:** MVP release candidate; local verification complete; deployment not performed  
**Purpose:** First online human testing and Lean Startup validation

## Freeze boundary

The current Phase 1 interface is the MVP design. It includes the mobile-first product shell, role and mission cards, seven card-based choices, data-derived resource cost chips, visible locked-choice reasons, consequence/result cards, the Future World ending, and a development-only playtest panel. The normal public route is `/ai-future-sim`; normal gameplay is deterministic and does not require a backend. No Phase 2 or Phase 3 work is included in this candidate.

Founder remains version `1`. The graph, choices, effects, resources, conditions, locks, unlocks, delayed consequences, endings, ending priority, analytics identifiers, and canonical paths are frozen.

## MVP source-file scope

### A. Required route and runtime

- `app/ai-future-sim/page.jsx` — thin public route mount.
- `features/ai-future-sim/ui/AiFutureSimLanding.jsx` — product flow and presentation orchestration.
- `features/ai-future-sim/ui/AiFutureSimPrimitives.jsx` — card and button primitives.
- `features/ai-future-sim/ui/AiFutureSim.module.css` — scoped product styling and responsive rules.
- `features/ai-future-sim/ui/choice-costs.js` — resource-cost labels derived from scenario effects.
- `features/ai-future-sim/engine/domain.js` and `features/ai-future-sim/engine/index.js` — deterministic game state and transitions.
- `features/ai-future-sim/content/scenarios/founder-organization.scenario.js` — authored Founder v1 content.
- `features/ai-future-sim/content/player-explanations.js` — deterministic player-facing ending explanations.
- `features/ai-future-sim/config/language.js` — English production-language contract.
- `features/ai-future-sim/fixtures/canonical-founder-paths.js` — currently imported by the UI for the development playtest panel; it is a development fixture, but the module is a runtime bundle dependency in the current implementation.
- Shared app shell files are part of the complete O1SF static export: `app/layout.jsx`, `components/SiteChrome.jsx`, `components/SiteHeader.jsx`, `components/SiteFooter.jsx`, and `app/globals.css`.
- Static/build integration: `next.config.js`, `package.json`, and `public/.htaccess`. The current Hostinger rule serves exported `route.html` files at extensionless paths.

The content validator is a build verification dependency: `features/ai-future-sim/content/validate-scenario.js`, `scripts/validate-ai-future-sim.mjs`, and `scripts/ai-future-sim-runtime-guard.mjs`.

### B. Developer-only verification and playtest material

- `features/ai-future-sim/analysis/analyze-scenario.js`
- `features/ai-future-sim/fixtures/FOUNDER_V1_PLAYTEST_CHECKLIST.md` and other validation fixtures
- `features/ai-future-sim/playtest/` — moderator material, participant templates, result aggregator, and final report template; participant results do not belong in scenario content.
- `features/ai-future-sim/reports/` — approval, balance, diagnostics, autonomous playtest, and this release-candidate documentation.
- `scripts/analyze-ai-future-sim.mjs`
- `tests/ai-future-sim*.test.mjs`
- `cloudflare/ai-future-sim-api/` — future Worker boundary and D1 migrations; not required to run or serve this MVP.

The playtest panel is gated by `NODE_ENV === "development"` as well as the `playtest=1` query. The production static artifact was opened with `/ai-future-sim?playtest=1`; no playtest panel or internal diagnostics appeared. The normal production route does not require D1, a Worker, or another backend.

### C. Existing working-tree changes outside this feature

At verification time, the base commit was `a0370c46d1ac249119ee72595ab13907404e36d6` on `main`. The MVP route, feature, Worker boundary, validator/analyzer scripts, and AI Future Sim tests were untracked; the checked-in base commit does not contain this release candidate.

The same working tree also contains unrelated edits to O1SF pages and shared shell, analytics/SEO/program data, root styles/layout, package manifests, public `.htaccess`, and the public-safety script; untracked site routes, docs/configuration, media assets, generated Ask Document data, and domain-check exports are also present. These files were not changed as part of the MVP freeze. The exact full inventory remains the output of `git status --short` in the workspace; these unrelated changes must not be silently bundled as if they were part of the AI Future Sim release.

Because this is a whole-site static export, the current dirty tree does not isolate the AI Future Sim candidate from those O1SF changes. No commit, tag, staging, cleanup, or deployment was performed.

## Verification record

- Founder version: `1`.
- Exhaustive deterministic analysis: 4,460 complete paths; 1,215 decision-state visits; 35 choices; 27 delayed consequences; 6 endings.
- Ending path counts: Maximum Automation `80`; Human + AI `1,462`; Human Capability `1,122`; Resilient Hybrid `1,336`; High-Growth / High-Dependence `132`; Adaptive Mixed `328`.
- Five canonical path tests remain present and passed.
- Normal UI automation-heavy journey completed through the real route and engine to Maximum Automation Organization.
- Responsive snapshots used viewport overrides at 360 px, 390 px, and 430 px; no clipped choice or cost control was observed. The 1365 × 900 desktop override produced a screenshot cropped by the browser capture surface, so the full desktop composition could not be confirmed from that image.
- Static export route artifact: `out/ai-future-sim.html` (20,737 bytes at build time), with route prefetch artifacts under `out/ai-future-sim/`.
- Production build, test, lint, typecheck, public-safety, scenario validation, and no-LLM guard passed.
- No source gameplay or UI files were modified during this freeze task. Only release-readiness documentation was added.

The MVP is verified as a local release candidate. Deployment readiness remains subject to the Step 2 checklist in `features/ai-future-sim/reports/ai-future-sim-mvp-step2-checklist.md`.
