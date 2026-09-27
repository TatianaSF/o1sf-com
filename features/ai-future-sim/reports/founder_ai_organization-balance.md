# AI Future Sim Founder Balance Report

Generated deterministically from scenario `founder_ai_organization` version `1`.

## Reachable graph

- Complete decision paths: **4460**
- Decision-state visits: **1215**
- Decision nodes / authored choices: **5 / 35**
- Graph nodes / endings: **7 / 6**

## Ending distribution

| Ending | Paths | Share | Paths satisfying ending conditions |
| --- | --- | --- | --- |
| Maximum Automation Organization | 80 | 1.79% | 80 |
| Human + AI Organization | 1462 | 32.78% | 1463 |
| Human Capability Organization | 1122 | 25.16% | 1122 |
| Resilient Hybrid Organization | 1336 | 29.96% | 3740 |
| High-Growth, High-Dependence Organization | 132 | 2.96% | 212 |
| Adaptive Mixed Organization | 328 | 7.35% | 4460 |

Condition matches can overlap. The engine selects the first matching ending in authored priority order; the final entry is the fallback.

### Overlapping ending conditions

| Matching endings | Paths | Share |
| --- | --- | --- |
| human_ai_organization + resilient_hybrid_organization | 1282 | 28.74% |
| human_capability_organization + resilient_hybrid_organization | 1122 | 25.16% |
| high_growth_dependence_organization + maximum_automation_organization | 64 | 1.43% |
| high_growth_dependence_organization + human_ai_organization | 16 | 0.36% |
| human_ai_organization + maximum_automation_organization | 1 | 0.02% |

## Choice availability

| Decision | States | Min available | Mean available | States with fewer than 3 |
| --- | --- | --- | --- | --- |
| Year 1 — Starting Point | 1 | 7 | 7 | 0 |
| Year 2 — Immediate Impact | 7 | 4 | 4.86 | 0 |
| Year 3 — Business & Work | 34 | 3 | 4.62 | 0 |
| Year 4 — Market / Society Shift | 157 | 6 | 6.47 | 0 |
| Year 5 — Second-order Effects | 1016 | 1 | 4.39 | 239 |

### Per-choice frequencies

| Level ID | Choice ID | Available states | Locked states | Complete paths selecting choice |
| --- | --- | --- | --- | --- |
| starting_point | hire_human_experts | 1 | 0 | 643 |
| starting_point | automate_back_office | 1 | 0 | 1071 |
| starting_point | train_existing_team | 1 | 0 | 655 |
| starting_point | customer_advisor_pilot | 1 | 0 | 654 |
| starting_point | shared_data_foundation | 1 | 0 | 391 |
| starting_point | redesign_flexible_work | 1 | 0 | 655 |
| starting_point | preserve_runway | 1 | 0 | 391 |
| immediate_impact | form_human_ai_expert_team | 3 | 4 | 306 |
| immediate_impact | scale_automated_workflows | 2 | 5 | 299 |
| immediate_impact | train_frontline_ai | 7 | 0 | 920 |
| immediate_impact | expand_customer_advisor | 7 | 0 | 1145 |
| immediate_impact | audit_workflows | 1 | 6 | 107 |
| immediate_impact | specialize_ai_operations | 7 | 0 | 1060 |
| immediate_impact | defer_broad_rollout | 7 | 0 | 623 |
| business_and_work | redesign_expert_teams | 23 | 11 | 558 |
| business_and_work | automate_customer_operations | 4 | 30 | 142 |
| business_and_work | build_apprenticeship_ladder | 23 | 11 | 546 |
| business_and_work | retain_human_review | 5 | 29 | 160 |
| business_and_work | give_teams_local_tools | 34 | 0 | 1135 |
| business_and_work | publish_service_standards | 34 | 0 | 971 |
| business_and_work | fund_job_transitions | 34 | 0 | 948 |
| market_society_shift | publish_transparency_report | 157 | 0 | 551 |
| market_society_shift | scale_regulated_market | 155 | 2 | 671 |
| market_society_shift | open_tools_access | 157 | 0 | 914 |
| market_society_shift | form_sector_coalition | 157 | 0 | 593 |
| market_society_shift | automate_supply_chain | 157 | 0 | 836 |
| market_society_shift | train_partner_network | 157 | 0 | 593 |
| market_society_shift | focus_reliable_niche | 76 | 81 | 302 |
| second_order_effects | build_verification_fallbacks | 380 | 636 | 380 |
| second_order_effects | fully_autonomous_operations | 104 | 912 | 104 |
| second_order_effects | create_expertise_guild | 903 | 113 | 903 |
| second_order_effects | invest_for_growth | 705 | 311 | 705 |
| second_order_effects | create_knowledge_transfer | 1016 | 0 | 1016 |
| second_order_effects | build_redundant_network | 647 | 369 | 647 |
| second_order_effects | accelerate_market_expansion | 705 | 311 | 705 |

### Most common Year 5 option sets

| Available choice IDs | State visits |
| --- | --- |
| build_verification_fallbacks, create_expertise_guild, invest_for_growth, create_knowledge_transfer, build_redundant_network, accelerate_market_expansion | 273 |
| create_expertise_guild, create_knowledge_transfer | 226 |
| create_expertise_guild, invest_for_growth, create_knowledge_transfer, build_redundant_network, accelerate_market_expansion | 138 |
| create_expertise_guild, invest_for_growth, create_knowledge_transfer, accelerate_market_expansion | 123 |
| build_verification_fallbacks, fully_autonomous_operations, create_expertise_guild, invest_for_growth, create_knowledge_transfer, build_redundant_network, accelerate_market_expansion | 69 |
| invest_for_growth, create_knowledge_transfer, build_redundant_network, accelerate_market_expansion | 57 |
| create_expertise_guild, create_knowledge_transfer, build_redundant_network | 37 |
| build_verification_fallbacks, create_expertise_guild, create_knowledge_transfer, build_redundant_network | 34 |
| fully_autonomous_operations, invest_for_growth, create_knowledge_transfer, build_redundant_network, accelerate_market_expansion | 30 |
| create_knowledge_transfer | 11 |
| invest_for_growth, create_knowledge_transfer, accelerate_market_expansion | 7 |
| build_verification_fallbacks, invest_for_growth, create_knowledge_transfer, build_redundant_network, accelerate_market_expansion | 3 |
| fully_autonomous_operations, create_expertise_guild, invest_for_growth, create_knowledge_transfer, build_redundant_network, accelerate_market_expansion | 3 |
| create_knowledge_transfer, build_redundant_network | 2 |
| fully_autonomous_operations, invest_for_growth, create_knowledge_transfer, accelerate_market_expansion | 2 |
| build_verification_fallbacks, create_knowledge_transfer, build_redundant_network | 1 |

Single-choice states by only available option: `create_knowledge_transfer` (11).

## Delayed consequences

| Consequence ID | Origin choice | Reveal level | Paths revealed | Share | Condition crossings | Paths with later option changes | Paths with ending changes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| expertise_compounds | hire_human_experts | immediate_impact | 643 | 14.42% | 643 | 0 | 70 |
| junior_pipeline_thins | automate_back_office | immediate_impact | 1071 | 24.01% | 1071 | 482 | 122 |
| peer_coaching_spreads | train_existing_team | immediate_impact | 655 | 14.69% | 0 | 0 | 140 |
| customer_feedback_arrives | customer_advisor_pilot | immediate_impact | 654 | 14.66% | 654 | 654 | 68 |
| shared_context_pays | shared_data_foundation | immediate_impact | 391 | 8.77% | 0 | 0 | 8 |
| workload_balance_improves | redesign_flexible_work | immediate_impact | 655 | 14.69% | 0 | 0 | 0 |
| option_value_preserved | preserve_runway | immediate_impact | 391 | 8.77% | 0 | 0 | 0 |
| expert_workflows_spread | form_human_ai_expert_team | business_and_work | 306 | 6.86% | 208 | 0 | 33 |
| workflow_dependency_deepens | scale_automated_workflows | business_and_work | 299 | 6.70% | 299 | 51 | 57 |
| frontline_fluency_grows | train_frontline_ai | business_and_work | 920 | 20.63% | 208 | 0 | 216 |
| customer_service_expectations | expand_customer_advisor | business_and_work | 1145 | 25.67% | 973 | 910 | 91 |
| fallback_readiness | audit_workflows | business_and_work | 107 | 2.40% | 0 | 0 | 0 |
| central_team_load | specialize_ai_operations | business_and_work | 1060 | 23.77% | 930 | 676 | 214 |
| measured_rollout_option | defer_broad_rollout | business_and_work | 623 | 13.97% | 104 | 0 | 0 |
| expert_teams_build_resilience | redesign_expert_teams | market_society_shift | 558 | 12.51% | 86 | 0 | 1 |
| junior_customer_path_closes | automate_customer_operations | market_society_shift | 142 | 3.18% | 75 | 0 | 24 |
| apprenticeship_knowledge_spreads | build_apprenticeship_ladder | market_society_shift | 546 | 12.24% | 170 | 0 | 9 |
| tool_sprawl_cost | give_teams_local_tools | market_society_shift | 1135 | 25.45% | 209 | 33 | 52 |
| standards_enable_adoption | publish_service_standards | market_society_shift | 971 | 21.77% | 549 | 250 | 176 |
| transition_network_forms | fund_job_transitions | market_society_shift | 948 | 21.26% | 123 | 0 | 0 |
| transparency_builds_confidence | publish_transparency_report | second_order_effects | 551 | 12.35% | 10 | 0 | 0 |
| assurance_capability_grows | scale_regulated_market | second_order_effects | 671 | 15.04% | 378 | 139 | 134 |
| ecosystem_support_demand | open_tools_access | second_order_effects | 914 | 20.49% | 639 | 466 | 72 |
| shared_standards_travel | form_sector_coalition | second_order_effects | 593 | 13.30% | 14 | 0 | 0 |
| supply_chain_coupling | automate_supply_chain | second_order_effects | 836 | 18.74% | 573 | 396 | 68 |
| partner_capability_returns | train_partner_network | second_order_effects | 593 | 13.30% | 26 | 0 | 14 |
| reliability_reputation | focus_reliable_niche | second_order_effects | 302 | 6.77% | 10 | 0 | 0 |

Reveal counts are complete-path frequencies. A condition crossing means applying the delayed effect changed at least one declared condition from false to true or true to false at reveal time. Counterfactual later-option and ending counts remove only this consequence's effects while keeping the same decision history, then compare later option availability and the selected ending.

## Final state ranges

### World state

| Dimension | Min | Max | Mean |
| --- | --- | --- | --- |
| ai_adoption | 0 | 9 | 3.41 |
| human_capability | 2 | 13 | 5.41 |
| productivity | 1 | 11 | 4.71 |
| employment_resilience | 0 | 18 | 11.03 |
| ai_dependence | 0 | 10 | 1.89 |
| organizational_trust | 2 | 12 | 8.48 |

### Resources

| Resource | Min | Max | Mean |
| --- | --- | --- | --- |
| capital | 4 | 22 | 10.77 |
| time | 2 | 11 | 7.8 |
| talent | 0 | 3 | 2.22 |

## Ending priority boundary screen

A path is marked near a higher-priority ending when at least one failed numeric predicate is at most one point from its threshold. This is a review signal; multiple predicates and historical conditions can still prevent that ending.

| Higher priority | Selected ending | Paths | Near threshold | Minimum numeric gap |
| --- | --- | --- | --- | --- |
| maximum_automation_organization | human_capability_organization | 1122 | 0 (0.00%) | 2 |
| human_ai_organization | human_capability_organization | 1122 | 509 (45.37%) | 1 |
| maximum_automation_organization | human_ai_organization | 1449 | 316 (21.81%) | 1 |
| maximum_automation_organization | resilient_hybrid_organization | 1336 | 287 (21.48%) | 1 |
| human_ai_organization | resilient_hybrid_organization | 1336 | 702 (52.54%) | 1 |
| human_capability_organization | resilient_hybrid_organization | 1336 | 445 (33.31%) | 1 |
| maximum_automation_organization | adaptive_mixed_organization | 242 | 238 (98.35%) | 1 |
| human_ai_organization | adaptive_mixed_organization | 328 | 106 (32.32%) | 1 |
| human_capability_organization | adaptive_mixed_organization | 328 | 7 (2.13%) | 1 |
| resilient_hybrid_organization | adaptive_mixed_organization | 328 | 218 (66.46%) | 1 |
| high_growth_dependence_organization | adaptive_mixed_organization | 328 | 143 (43.60%) | 1 |
| maximum_automation_organization | high_growth_dependence_organization | 52 | 52 (100.00%) | 1 |
| human_ai_organization | high_growth_dependence_organization | 132 | 19 (14.39%) | 1 |
| human_capability_organization | high_growth_dependence_organization | 132 | 0 (0.00%) | 2 |
| resilient_hybrid_organization | high_growth_dependence_organization | 132 | 62 (46.97%) | 1 |

## Automated warnings

- **low_agency_state** (second_order_effects): Fewer than three choices are available in at least one reachable decision state.
- **low_downstream_consequence**: This infrequent consequence changes no later option availability or ending in the counterfactual path review.
