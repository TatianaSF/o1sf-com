# Founder v1 Ending Priority Review

The production resolver selects the first matching authored condition set; the final Adaptive Mixed outcome is unconditional fallback.

Final states satisfying more than one conditional ending before priority: **2485**. Fallback selected: **328** paths. The unconditional fallback is excluded from the multi-match count.

## Evaluation order

| Priority | Ending ID | Conditions |
| ---: | --- | --- |
| 1 | maximum_automation_organization | condition_auto_ending_adoption, condition_auto_ending_dependence, condition_first_automation, condition_automation_scale_history |
| 2 | human_ai_organization | condition_hybrid_ending_capability, condition_hybrid_ending_adoption, condition_hybrid_ending_trust |
| 3 | human_capability_organization | condition_human_ending_capability, condition_human_ending_adoption |
| 4 | resilient_hybrid_organization | condition_resilience_ending_trust, condition_resilience_ending_jobs, condition_resilience_ending_dependence |
| 5 | high_growth_dependence_organization | condition_growth_ending_productivity, condition_growth_ending_dependence |
| 6 | adaptive_mixed_organization | fallback |

## Pre-priority condition match sets

| Matching outcomes | Paths | Share |
| --- | ---: | ---: |
| resilient_hybrid_organization + adaptive_mixed_organization | 1336 | 29.96% |
| human_ai_organization + resilient_hybrid_organization + adaptive_mixed_organization | 1282 | 28.74% |
| human_capability_organization + resilient_hybrid_organization + adaptive_mixed_organization | 1122 | 25.16% |
| adaptive_mixed_organization | 328 | 7.35% |
| human_ai_organization + adaptive_mixed_organization | 164 | 3.68% |
| high_growth_dependence_organization + adaptive_mixed_organization | 132 | 2.96% |
| maximum_automation_organization + high_growth_dependence_organization + adaptive_mixed_organization | 64 | 1.43% |
| human_ai_organization + high_growth_dependence_organization + adaptive_mixed_organization | 16 | 0.36% |
| maximum_automation_organization + adaptive_mixed_organization | 15 | 0.34% |
| maximum_automation_organization + human_ai_organization + adaptive_mixed_organization | 1 | 0.02% |

## Selected ending after priority resolution

| Ending ID | Selected paths | Share |
| --- | ---: | ---: |
| maximum_automation_organization | 80 | 1.79% |
| human_ai_organization | 1462 | 32.78% |
| human_capability_organization | 1122 | 25.16% |
| resilient_hybrid_organization | 1336 | 29.96% |
| high_growth_dependence_organization | 132 | 2.96% |
| adaptive_mixed_organization | 328 | 7.35% |
