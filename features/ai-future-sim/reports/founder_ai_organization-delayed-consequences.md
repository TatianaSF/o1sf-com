# Founder v1 Delayed Consequence Playtest Reference

Every reveal is authored and deterministic. Registration occurs when its originating choice is selected; user-facing reveal copy appears only on the authored reveal stage.

## expertise_compounds

- Originating choice: `hire_human_experts` at Year 1 — Starting Point (`starting_point`).
- Causal setup: Bring in people who can shape workflows and coach others. Outcome: Expertise and team resilience grow, at a significant cost in runway and hiring time.
- Registration: when `hire_human_experts` is selected at Year 1 — Starting Point.
- Reveal: immediate_impact (`immediate_impact`); 643 paths (14.42%).
- Player-facing title: Expertise starts to spread
- Player-facing text: The new hires have begun turning individual skill into shared team practice.
- State effects: world.human_capability +1; world.organizational_trust +1.
- Later options changed: 0 paths; endings changed: 70 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## junior_pipeline_thins

- Originating choice: `automate_back_office` at Year 1 — Starting Point (`starting_point`).
- Causal setup: Use AI to reduce repetitive work and release near-term capacity. Outcome: Output rises quickly, while the company becomes more dependent on automated workflows.
- Registration: when `automate_back_office` is selected at Year 1 — Starting Point.
- Reveal: immediate_impact (`immediate_impact`); 1071 paths (24.01%).
- Player-facing title: A talent pipeline narrows
- Player-facing text: Some entry-level work disappeared before the team designed a new way for junior people to learn.
- State effects: world.employment_resilience -1; world.ai_dependence +1.
- Later options changed: 482 paths; endings changed: 122 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## peer_coaching_spreads

- Originating choice: `train_existing_team` at Year 1 — Starting Point (`starting_point`).
- Causal setup: Give current staff time to practice with AI on real work. Outcome: Human capability grows without adding headcount; delivery slows during training.
- Registration: when `train_existing_team` is selected at Year 1 — Starting Point.
- Reveal: immediate_impact (`immediate_impact`); 655 paths (14.69%).
- Player-facing title: Peer coaching takes hold
- Player-facing text: People who practiced early are helping colleagues solve new tasks without waiting for a specialist.
- State effects: world.human_capability +1; world.employment_resilience +1.
- Later options changed: 0 paths; endings changed: 140 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## customer_feedback_arrives

- Originating choice: `customer_advisor_pilot` at Year 1 — Starting Point (`starting_point`).
- Causal setup: Test a narrow customer-facing assistant with human escalation. Outcome: The company learns from customers and starts adoption with a contained pilot.
- Registration: when `customer_advisor_pilot` is selected at Year 1 — Starting Point.
- Reveal: immediate_impact (`immediate_impact`); 654 paths (14.66%).
- Player-facing title: Customer feedback changes the roadmap
- Player-facing text: Early users value the faster answers, but expect a clear route to a person.
- State effects: world.ai_adoption +1; world.organizational_trust +1.
- Later options changed: 654 paths; endings changed: 68 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## shared_context_pays

- Originating choice: `shared_data_foundation` at Year 1 — Starting Point (`starting_point`).
- Causal setup: Clean and organize information used by both people and AI tools. Outcome: Work becomes easier to coordinate, though visible product gains take longer.
- Registration: when `shared_data_foundation` is selected at Year 1 — Starting Point.
- Reveal: immediate_impact (`immediate_impact`); 391 paths (8.77%).
- Player-facing title: Shared context reduces rework
- Player-facing text: Teams can find the same current information, lowering the cost of handoffs.
- State effects: world.productivity +1; world.organizational_trust +1.
- Later options changed: 0 paths; endings changed: 8 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## workload_balance_improves

- Originating choice: `redesign_flexible_work` at Year 1 — Starting Point (`starting_point`).
- Causal setup: Let teams decide where AI helps and where human judgment stays central. Outcome: The organization gains flexibility and trust, while adoption remains gradual.
- Registration: when `redesign_flexible_work` is selected at Year 1 — Starting Point.
- Reveal: immediate_impact (`immediate_impact`); 655 paths (14.69%).
- Player-facing title: Teams adapt without a single playbook
- Player-facing text: Local experiments give the company more ways to respond when one workflow changes.
- State effects: world.employment_resilience +1; world.organizational_trust +1.
- Later options changed: 0 paths; endings changed: 0 paths. No measured later option-availability or ending change in the counterfactual review.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Narrative/state consequence only in this traversal: no declared condition crossing or later option/ending change was measured.

## option_value_preserved

- Originating choice: `preserve_runway` at Year 1 — Starting Point (`starting_point`).
- Causal setup: Limit new tooling while mapping the work that matters most. Outcome: The company keeps options open and learns more slowly than early adopters.
- Registration: when `preserve_runway` is selected at Year 1 — Starting Point.
- Reveal: immediate_impact (`immediate_impact`); 391 paths (8.77%).
- Player-facing title: A clearer investment case emerges
- Player-facing text: The team now has a sharper view of where a focused AI investment could pay off.
- State effects: resources.capital +1; world.organizational_trust +1.
- Later options changed: 0 paths; endings changed: 0 paths. No measured later option-availability or ending change in the counterfactual review.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Narrative/state consequence only in this traversal: no declared condition crossing or later option/ending change was measured.

## expert_workflows_spread

- Originating choice: `form_human_ai_expert_team` at Year 2 — Immediate Impact (`immediate_impact`).
- Causal setup: Pair AI specialists with experienced operators who own the work. Outcome: A cross-functional team can redesign tasks instead of automating them in isolation.
- Registration: when `form_human_ai_expert_team` is selected at Year 2 — Immediate Impact.
- Reveal: business_and_work (`business_and_work`); 306 paths (6.86%).
- Player-facing title: Expert workflows spread
- Player-facing text: The team turns its first working patterns into practices other groups can reuse.
- State effects: world.human_capability +1; world.organizational_trust +1.
- Later options changed: 0 paths; endings changed: 33 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## workflow_dependency_deepens

- Originating choice: `scale_automated_workflows` at Year 2 — Immediate Impact (`immediate_impact`).
- Causal setup: Extend the proven back-office system across more routine work. Outcome: Throughput improves, with more work now relying on the same automated layer.
- Registration: when `scale_automated_workflows` is selected at Year 2 — Immediate Impact.
- Reveal: business_and_work (`business_and_work`); 299 paths (6.70%).
- Player-facing title: Workflow dependency deepens
- Player-facing text: More teams depend on a system few people know how to repair by hand.
- State effects: world.ai_dependence +1; world.employment_resilience -1.
- Later options changed: 51 paths; endings changed: 57 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## frontline_fluency_grows

- Originating choice: `train_frontline_ai` at Year 2 — Immediate Impact (`immediate_impact`).
- Causal setup: Give customer and operations teams guided practice with AI tools. Outcome: Capability grows close to the work, at the cost of near-term delivery time.
- Registration: when `train_frontline_ai` is selected at Year 2 — Immediate Impact.
- Reveal: business_and_work (`business_and_work`); 920 paths (20.63%).
- Player-facing title: Frontline fluency grows
- Player-facing text: People can now spot when an AI result needs context or a second look.
- State effects: world.human_capability +1; world.employment_resilience +1.
- Later options changed: 0 paths; endings changed: 216 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## customer_service_expectations

- Originating choice: `expand_customer_advisor` at Year 2 — Immediate Impact (`immediate_impact`).
- Causal setup: Bring the pilot to more customers and keep human escalation available. Outcome: The service reaches more people and generates a stronger feedback loop.
- Registration: when `expand_customer_advisor` is selected at Year 2 — Immediate Impact.
- Reveal: business_and_work (`business_and_work`); 1145 paths (25.67%).
- Player-facing title: Service expectations rise
- Player-facing text: Customers now expect quick answers and a reliable handoff when their case is unusual.
- State effects: world.organizational_trust +1; world.ai_dependence +1.
- Later options changed: 910 paths; endings changed: 91 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## fallback_readiness

- Originating choice: `audit_workflows` at Year 2 — Immediate Impact (`immediate_impact`).
- Causal setup: Map where AI can fail and who can safely take over. Outcome: The company becomes more resilient, while expansion waits for evidence.
- Registration: when `audit_workflows` is selected at Year 2 — Immediate Impact.
- Reveal: business_and_work (`business_and_work`); 107 paths (2.40%).
- Player-facing title: Fallbacks are ready when needed
- Player-facing text: Teams have named owners and a manual route for the most important workflows.
- State effects: world.employment_resilience +1.
- Later options changed: 0 paths; endings changed: 0 paths. No measured later option-availability or ending change in the counterfactual review.
- Frequency/magnitude screen: Low-frequency reveal: review whether its path is understandable. No single effect delta reaches 3 state points.
- Review: Weak consequence in mechanical leverage, with a legible resilience narrative: auditing failure points and naming owners creates a manual fallback. It appears on 107 paths and changes displayed employment_resilience, but no later option or ending. Keep in v1; candidate for Founder v2 only if playtesters find the relationship inert.

## central_team_load

- Originating choice: `specialize_ai_operations` at Year 2 — Immediate Impact (`immediate_impact`).
- Causal setup: Centralize quality, deployment, and tool support in a specialist group. Outcome: Consistency improves, but more teams must coordinate through a small function.
- Registration: when `specialize_ai_operations` is selected at Year 2 — Immediate Impact.
- Reveal: business_and_work (`business_and_work`); 1060 paths (23.77%).
- Player-facing title: The central team becomes a bottleneck
- Player-facing text: Demand for shared AI support grows faster than the specialist group.
- State effects: world.employment_resilience -1; world.human_capability +1.
- Later options changed: 676 paths; endings changed: 214 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## measured_rollout_option

- Originating choice: `defer_broad_rollout` at Year 2 — Immediate Impact (`immediate_impact`).
- Causal setup: Keep experiments small until the company has more evidence. Outcome: Risk stays contained and the company gives up some near-term scale.
- Registration: when `defer_broad_rollout` is selected at Year 2 — Immediate Impact.
- Reveal: business_and_work (`business_and_work`); 623 paths (13.97%).
- Player-facing title: A measured rollout keeps options open
- Player-facing text: The team can now choose a narrower deployment based on observed needs.
- State effects: world.organizational_trust +1; resources.capital +1.
- Later options changed: 0 paths; endings changed: 0 paths. No measured later option-availability or ending change in the counterfactual review.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful state consequence: it crosses at least one authored condition on some reveal paths, although measured option/ending changes are listed separately.

## expert_teams_build_resilience

- Originating choice: `redesign_expert_teams` at Year 3 — Business & Work (`business_and_work`).
- Causal setup: Give mixed human-AI teams ownership of complete customer outcomes. Outcome: Experts gain broader judgment and teams can improve the whole workflow.
- Registration: when `redesign_expert_teams` is selected at Year 3 — Business & Work.
- Reveal: market_society_shift (`market_society_shift`); 558 paths (12.51%).
- Player-facing title: Expert teams make change easier to absorb
- Player-facing text: People can shift between tasks because more of the team understands the full service.
- State effects: world.employment_resilience +1; world.organizational_trust +1.
- Later options changed: 0 paths; endings changed: 1 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## junior_customer_path_closes

- Originating choice: `automate_customer_operations` at Year 3 — Business & Work (`business_and_work`).
- Causal setup: Let AI resolve common requests and route exceptions to staff. Outcome: Service capacity grows, while fewer routine cases remain for people to learn from.
- Registration: when `automate_customer_operations` is selected at Year 3 — Business & Work.
- Reveal: market_society_shift (`market_society_shift`); 142 paths (3.18%).
- Player-facing title: A junior learning path disappears
- Player-facing text: Fewer routine cases now reach new hires, so the team must create another way to learn the service.
- State effects: world.employment_resilience -1; world.ai_dependence +1.
- Later options changed: 0 paths; endings changed: 24 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: Low-frequency reveal: review whether its path is understandable. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## apprenticeship_knowledge_spreads

- Originating choice: `build_apprenticeship_ladder` at Year 3 — Business & Work (`business_and_work`).
- Causal setup: Pair junior staff with experienced reviewers on AI-assisted work. Outcome: Human capability compounds through practice, even as mentoring uses scarce time.
- Registration: when `build_apprenticeship_ladder` is selected at Year 3 — Business & Work.
- Reveal: market_society_shift (`market_society_shift`); 546 paths (12.24%).
- Player-facing title: Knowledge begins to travel
- Player-facing text: Junior staff can explain and improve the workflow instead of only following it.
- State effects: world.human_capability +1; world.employment_resilience +1.
- Later options changed: 0 paths; endings changed: 9 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## tool_sprawl_cost

- Originating choice: `give_teams_local_tools` at Year 3 — Business & Work (`business_and_work`).
- Causal setup: Let each group select tools for its own customers and tasks. Outcome: Local fit improves, but support and quality become less consistent.
- Registration: when `give_teams_local_tools` is selected at Year 3 — Business & Work.
- Reveal: market_society_shift (`market_society_shift`); 1135 paths (25.45%).
- Player-facing title: Tool sprawl adds coordination work
- Player-facing text: Teams made useful local choices, but shared data and support now need attention.
- State effects: world.productivity -1; world.organizational_trust -1.
- Later options changed: 33 paths; endings changed: 52 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## standards_enable_adoption

- Originating choice: `publish_service_standards` at Year 3 — Business & Work (`business_and_work`).
- Causal setup: Make clear where AI responds and how people handle exceptions. Outcome: Customers and staff know what to expect, with slower initial rollout.
- Registration: when `publish_service_standards` is selected at Year 3 — Business & Work.
- Reveal: market_society_shift (`market_society_shift`); 971 paths (21.77%).
- Player-facing title: Clear standards enable wider use
- Player-facing text: Teams can expand safely because escalation responsibilities are understood.
- State effects: world.ai_adoption +1; world.productivity +1.
- Later options changed: 250 paths; endings changed: 176 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## transition_network_forms

- Originating choice: `fund_job_transitions` at Year 3 — Business & Work (`business_and_work`).
- Causal setup: Use budget for reskilling and internal moves as tasks change. Outcome: People retain a path into new roles, reducing short-term cash for expansion.
- Registration: when `fund_job_transitions` is selected at Year 3 — Business & Work.
- Reveal: market_society_shift (`market_society_shift`); 948 paths (21.26%).
- Player-facing title: Internal mobility becomes credible
- Player-facing text: People can see routes from changing tasks into new responsibilities.
- State effects: world.employment_resilience +1; world.organizational_trust +1.
- Later options changed: 0 paths; endings changed: 0 paths. No measured later option-availability or ending change in the counterfactual review.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful state consequence: it crosses at least one authored condition on some reveal paths, although measured option/ending changes are listed separately.

## transparency_builds_confidence

- Originating choice: `publish_transparency_report` at Year 4 — Market / Society Shift (`market_society_shift`).
- Causal setup: Share where AI is used, how it is checked, and what remains human-led. Outcome: Trust grows and customers can make informed choices about the service.
- Registration: when `publish_transparency_report` is selected at Year 4 — Market / Society Shift.
- Reveal: second_order_effects (`second_order_effects`); 551 paths (12.35%).
- Player-facing title: Transparency builds confidence
- Player-facing text: Clear reporting makes later changes easier for staff and customers to evaluate.
- State effects: world.organizational_trust +1.
- Later options changed: 0 paths; endings changed: 0 paths. No measured later option-availability or ending change in the counterfactual review.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful state consequence: it crosses at least one authored condition on some reveal paths, although measured option/ending changes are listed separately.

## assurance_capability_grows

- Originating choice: `scale_regulated_market` at Year 4 — Market / Society Shift (`market_society_shift`).
- Causal setup: Adapt proven AI workflows to a market with stricter assurance needs. Outcome: The company gains a new market path, but delivery requires more review.
- Registration: when `scale_regulated_market` is selected at Year 4 — Market / Society Shift.
- Reveal: second_order_effects (`second_order_effects`); 671 paths (15.04%).
- Player-facing title: Assurance becomes a market capability
- Player-facing text: Review practices developed for one market now help the whole organization.
- State effects: world.human_capability +1; world.organizational_trust +1.
- Later options changed: 139 paths; endings changed: 134 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## ecosystem_support_demand

- Originating choice: `open_tools_access` at Year 4 — Market / Society Shift (`market_society_shift`).
- Causal setup: Share a limited toolset with partners and smaller customers. Outcome: Access grows beyond the company, with less control over how the tools are used.
- Registration: when `open_tools_access` is selected at Year 4 — Market / Society Shift.
- Reveal: second_order_effects (`second_order_effects`); 914 paths (20.49%).
- Player-facing title: The ecosystem asks for support
- Player-facing text: Broader access brings more edge cases and a need for shared support standards.
- State effects: world.employment_resilience -1; world.ai_dependence +1.
- Later options changed: 466 paths; endings changed: 72 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## shared_standards_travel

- Originating choice: `form_sector_coalition` at Year 4 — Market / Society Shift (`market_society_shift`).
- Causal setup: Work with peers on shared evaluation and workforce practices. Outcome: Collective knowledge improves, while some market advantage is shared.
- Registration: when `form_sector_coalition` is selected at Year 4 — Market / Society Shift.
- Reveal: second_order_effects (`second_order_effects`); 593 paths (13.30%).
- Player-facing title: Shared standards travel across the sector
- Player-facing text: Partners can compare failures and improve practices faster than any one firm alone.
- State effects: world.organizational_trust +1; world.employment_resilience +1.
- Later options changed: 0 paths; endings changed: 0 paths. No measured later option-availability or ending change in the counterfactual review.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful state consequence: it crosses at least one authored condition on some reveal paths, although measured option/ending changes are listed separately.

## supply_chain_coupling

- Originating choice: `automate_supply_chain` at Year 4 — Market / Society Shift (`market_society_shift`).
- Causal setup: Connect forecasting, purchasing, and fulfillment through AI workflows. Outcome: Productivity and adoption rise, with more critical operations linked to automated decisions.
- Registration: when `automate_supply_chain` is selected at Year 4 — Market / Society Shift.
- Reveal: second_order_effects (`second_order_effects`); 836 paths (18.74%).
- Player-facing title: Supply chains become more coupled
- Player-facing text: A change in one automated forecast now affects more teams and partners.
- State effects: world.ai_dependence +1; world.employment_resilience -1.
- Later options changed: 396 paths; endings changed: 68 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## partner_capability_returns

- Originating choice: `train_partner_network` at Year 4 — Market / Society Shift (`market_society_shift`).
- Causal setup: Help suppliers and service partners use AI with shared review practices. Outcome: Capability and resilience improve across the network, at a cost in time and capital.
- Registration: when `train_partner_network` is selected at Year 4 — Market / Society Shift.
- Reveal: second_order_effects (`second_order_effects`); 593 paths (13.30%).
- Player-facing title: Partner capability returns value
- Player-facing text: Trained partners resolve more exceptions without escalating every issue back to your team.
- State effects: world.productivity +1; world.organizational_trust +1.
- Later options changed: 0 paths; endings changed: 14 paths. Changes later option availability or ending in at least one counterfactual path.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts.

## reliability_reputation

- Originating choice: `focus_reliable_niche` at Year 4 — Market / Society Shift (`market_society_shift`).
- Causal setup: Serve fewer customers with a dependable human-AI service. Outcome: Reliability deepens while the company passes on some immediate market reach.
- Registration: when `focus_reliable_niche` is selected at Year 4 — Market / Society Shift.
- Reveal: second_order_effects (`second_order_effects`); 302 paths (6.77%).
- Player-facing title: Reliability becomes part of the reputation
- Player-facing text: Customers value knowing when the service will pause and bring in a person.
- State effects: world.organizational_trust +1; world.employment_resilience +1.
- Later options changed: 0 paths; endings changed: 0 paths. No measured later option-availability or ending change in the counterfactual review.
- Frequency/magnitude screen: No frequency anomaly by the 5% / 50% review markers. No single effect delta reaches 3 state points.
- Review: Meaningful state consequence: it crosses at least one authored condition on some reveal paths, although measured option/ending changes are listed separately.
