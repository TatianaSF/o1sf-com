# Founder v1 manual playtest checklist

Run `npm run dev`, open `/ai-future-sim?playtest=1`, select a canonical path, and advance one decision at a time. The path fixture selects choices through the production deterministic engine; it does not skip transitions. Debug output omits unrevealed consequence copy and shows only registered IDs until reveal.

For each path, review the questions below at every decision and ending:

- [ ] Is the situation clear?
- [ ] Are all seven options meaningfully distinct?
- [ ] Are locked options understandable?
- [ ] Do immediate effects make sense?
- [ ] Do delayed consequences feel causally connected?
- [ ] Does the next situation logically follow?
- [ ] Does the player retain meaningful agency?
- [ ] Does the ending feel earned?
- [ ] Can the player understand why the ending occurred?
- [ ] Is any choice obviously superior without a meaningful trade-off?

## Canonical paths

| Path | Fixture choices | Expected ending |
| --- | --- | --- |
| Automation-heavy | `automation-heavy` | `maximum_automation_organization` |
| Human + AI augmentation | `human-ai-augmentation` | `human_ai_organization` |
| Human capability investment | `human-capability-investment` | `human_capability_organization` |
| Growth-first | `growth-first` | `high_growth_dependence_organization` |
| Resilience and caution | `resilience-and-caution` | `resilient_hybrid_organization` |

Founder v1 gameplay semantics are frozen. Record copy-only observations separately from proposed gameplay changes; any material gameplay proposal belongs in a Founder v2 review.
