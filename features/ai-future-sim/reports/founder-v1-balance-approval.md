# Founder Scenario v1 Balance Review

**Status:** approved canonical scenario, `founder_ai_organization` version `1`.

## Method

`npm run analyze:ai-future-sim` exhaustively traverses every currently legal five-decision history through the production deterministic engine. It writes the machine-readable JSON and this analysis data in `founder_ai_organization-balance.json` and a readable generated summary in `founder_ai_organization-balance.md`. The run is deterministic and currently covers 4,460 complete paths, 1,215 decision-state visits, 35 choices, 27 delayed consequences, and all six authored endings.

## Balance decisions

- The Human Capability ending previously accepted AI adoption `3`, while the Human + AI ending began at `3`. That made both outcomes match on 451 paths, with the earlier Human + AI outcome always winning. The Human Capability boundary is now `ai_adoption <= 2`; the Human + AI boundary remains `ai_adoption >= 3`. The raw overlap is removed, and the ending distribution is unchanged because those 451 paths already selected Human + AI.
- No effect magnitudes, resource costs, unlock prerequisites, or delayed-consequence effects were changed. Reviewing all 35 choice effect profiles showed real trade-offs across adoption, capability, productivity, employment resilience, dependence, trust, resources, and future access; no choice was an unambiguous improvement across those dimensions.
- Maximum Automation (80 paths, 1.79%) and High-Growth / High-Dependence (132 paths, 2.96%) are uncommon but reachable specialist outcomes. They require a coherent history and specific accumulated state. Their rates were not artificially raised.
- Year 5 has fewer than three available choices in 239 of 1,016 decision states (23.52%). Eleven states (1.08%) expose only `create_knowledge_transfer`. Exhaustive option-set inspection ties these cases to histories with low AI adoption and dependence plus depleted talent; the remaining universal knowledge-transfer action fits those histories. These are consequential specializations and limited cases, not broad accidental dead ends. The report retains them as an explicit balance watch item.
- The endings intentionally use authored priority. Resilient Hybrid is a broad state predicate that overlaps with more specific human capability, hybrid, and automation identities. The first matching ending wins; Adaptive Mixed is the unconditional fallback. The generated report records each overlap and priority resolution.
- Counterfactual consequence review found that `fallback_readiness` reveals on 107 paths (2.40%) and independently changes no later option availability or ending. It still changes the visible resilience state and its authored narrative, so it remains in v1 as a low-downstream-leverage watch item rather than being inflated to force an ending shift. The report measures option and ending changes for each of the 27 consequences.

## Canonical trajectory results

The tested automation-heavy, human-AI augmentation, human-capability investment, growth-first, and resilience/caution paths all reach their expected endings with distinct final state and resource vectors, unlocks, and delayed consequence reveals. Their exact outcomes remain asserted in `tests/ai-future-sim-full-paths.test.mjs`.

## Version rule

Founder v1 is the first approved canonical scenario. Once analytics or user sessions exist, material gameplay changes to decisions, effects, resources, conditions, unlocks, delayed consequences, or ending conditions must increment `version`. Non-semantic copy corrections may remain within the current version.
