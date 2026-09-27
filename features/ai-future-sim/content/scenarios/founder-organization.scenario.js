/** @type {import("../../engine/domain.js").Scenario} */
export const founderOrganizationScenario = {
  "id": "founder_ai_organization",
  "version": 1,
  "startLevelId": "founder_briefing",
  "graphPolicy": {
    "allowIntentionalCycles": false
  },
  "title": "Build the smartest human + AI organization",
  "introduction": "Across six years, your small company will grow into a different kind of organization. Each choice changes what the team can do next.",
  "roles": [
    {
      "id": "company_founder",
      "title": "Founder",
      "description": "Set the organization's direction and allocate its scarce resources."
    }
  ],
  "missions": [
    {
      "id": "build_smart_human_ai_org",
      "title": "Build the smartest human + AI organization",
      "description": "Grow useful AI capability while deciding what people and the company should become.",
      "roleIds": [
        "company_founder"
      ]
    }
  ],
  "initialWorldState": {
    "ai_adoption": 0,
    "human_capability": 2,
    "productivity": 1,
    "employment_resilience": 8,
    "ai_dependence": 0,
    "organizational_trust": 2
  },
  "initialResources": {
    "capital": 20,
    "time": 12,
    "talent": 3
  },
  "conditions": [
    {
      "id": "condition_expert_capability",
      "target": "world",
      "key": "human_capability",
      "operator": "gte",
      "value": 3
    },
    {
      "id": "condition_expert_talent",
      "target": "resources",
      "key": "talent",
      "operator": "gte",
      "value": 1
    },
    {
      "id": "condition_ai_adoption",
      "target": "world",
      "key": "ai_adoption",
      "operator": "gte",
      "value": 2
    },
    {
      "id": "condition_human_review",
      "target": "world",
      "key": "human_capability",
      "operator": "gte",
      "value": 3
    },
    {
      "id": "condition_trusted_review",
      "target": "world",
      "key": "organizational_trust",
      "operator": "gte",
      "value": 3
    },
    {
      "id": "condition_dependence_one",
      "target": "world",
      "key": "ai_dependence",
      "operator": "gte",
      "value": 1
    },
    {
      "id": "condition_dependence_two",
      "target": "world",
      "key": "ai_dependence",
      "operator": "gte",
      "value": 2
    },
    {
      "id": "condition_advanced_automation",
      "target": "world",
      "key": "ai_adoption",
      "operator": "gte",
      "value": 4
    },
    {
      "id": "condition_first_automation",
      "target": "choice",
      "choiceId": "automate_back_office",
      "operator": "selected"
    },
    {
      "id": "condition_automation_scale_history",
      "target": "choice",
      "choiceId": "scale_automated_workflows",
      "operator": "selected"
    },
    {
      "id": "condition_expertise_history",
      "target": "choice",
      "choiceId": "hire_human_experts",
      "operator": "selected"
    },
    {
      "id": "condition_training_history",
      "target": "choice",
      "choiceId": "train_existing_team",
      "operator": "selected"
    },
    {
      "id": "condition_auto_ending_adoption",
      "target": "world",
      "key": "ai_adoption",
      "operator": "gte",
      "value": 6
    },
    {
      "id": "condition_auto_ending_dependence",
      "target": "world",
      "key": "ai_dependence",
      "operator": "gte",
      "value": 5
    },
    {
      "id": "condition_hybrid_ending_capability",
      "target": "world",
      "key": "human_capability",
      "operator": "gte",
      "value": 5
    },
    {
      "id": "condition_hybrid_ending_adoption",
      "target": "world",
      "key": "ai_adoption",
      "operator": "gte",
      "value": 3
    },
    {
      "id": "condition_hybrid_ending_trust",
      "target": "world",
      "key": "organizational_trust",
      "operator": "gte",
      "value": 3
    },
    {
      "id": "condition_human_ending_capability",
      "target": "world",
      "key": "human_capability",
      "operator": "gte",
      "value": 6
    },
    {
      "id": "condition_human_ending_adoption",
      "target": "world",
      "key": "ai_adoption",
      "operator": "lte",
      "value": 2
    },
    {
      "id": "condition_resilience_ending_trust",
      "target": "world",
      "key": "organizational_trust",
      "operator": "gte",
      "value": 5
    },
    {
      "id": "condition_resilience_ending_jobs",
      "target": "world",
      "key": "employment_resilience",
      "operator": "gte",
      "value": 5
    },
    {
      "id": "condition_resilience_ending_dependence",
      "target": "world",
      "key": "ai_dependence",
      "operator": "lte",
      "value": 3
    },
    {
      "id": "condition_growth_ending_productivity",
      "target": "world",
      "key": "productivity",
      "operator": "gte",
      "value": 8
    },
    {
      "id": "condition_growth_ending_dependence",
      "target": "world",
      "key": "ai_dependence",
      "operator": "gte",
      "value": 4
    }
  ],
  "levels": [
    {
      "id": "founder_briefing",
      "type": "narrative",
      "nextLevelId": "starting_point",
      "title": "A small team at an inflection point",
      "prompt": "Your first operating model will shape what the company can learn and deliver."
    },
    {
      "id": "starting_point",
      "type": "decision",
      "nextLevelId": "immediate_impact",
      "title": "Year 1 — Starting Point",
      "prompt": "The team is small, runway is limited, and AI tools are newly useful. Choose the capability you build first.",
      "choices": [
        {
          "id": "hire_human_experts",
          "title": "Hire human AI experts",
          "description": "Bring in people who can shape workflows and coach others.",
          "outcome": "Expertise and team resilience grow, at a significant cost in runway and hiring time.",
          "effects": [
            {
              "id": "hire_human_experts_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -4
            },
            {
              "id": "hire_human_experts_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -2
            },
            {
              "id": "hire_human_experts_effect_3",
              "operation": "add",
              "target": "resources",
              "key": "talent",
              "delta": -1
            },
            {
              "id": "hire_human_experts_effect_4",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 2
            },
            {
              "id": "hire_human_experts_effect_5",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            },
            {
              "id": "hire_human_experts_effect_6",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "expertise_compounds",
              "originChoiceId": "hire_human_experts",
              "activation": {
                "type": "on_level_entry",
                "levelId": "immediate_impact"
              },
              "title": "Expertise starts to spread",
              "description": "The new hires have begun turning individual skill into shared team practice.",
              "effects": [
                {
                  "id": "expertise_compounds_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "human_capability",
                  "delta": 1
                },
                {
                  "id": "expertise_compounds_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "automate_back_office",
          "title": "Automate back-office work",
          "description": "Use AI to reduce repetitive work and release near-term capacity.",
          "outcome": "Output rises quickly, while the company becomes more dependent on automated workflows.",
          "effects": [
            {
              "id": "automate_back_office_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -3
            },
            {
              "id": "automate_back_office_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "automate_back_office_effect_3",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 2
            },
            {
              "id": "automate_back_office_effect_4",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 2
            },
            {
              "id": "automate_back_office_effect_5",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": 1
            },
            {
              "id": "automate_back_office_effect_6",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": -1
            }
          ],
          "delayedConsequences": [
            {
              "id": "junior_pipeline_thins",
              "originChoiceId": "automate_back_office",
              "activation": {
                "type": "on_level_entry",
                "levelId": "immediate_impact"
              },
              "title": "A talent pipeline narrows",
              "description": "Some entry-level work disappeared before the team designed a new way for junior people to learn.",
              "effects": [
                {
                  "id": "junior_pipeline_thins_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": -1
                },
                {
                  "id": "junior_pipeline_thins_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "ai_dependence",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "train_existing_team",
          "title": "Train the existing team",
          "description": "Give current staff time to practice with AI on real work.",
          "outcome": "Human capability grows without adding headcount; delivery slows during training.",
          "effects": [
            {
              "id": "train_existing_team_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -3
            },
            {
              "id": "train_existing_team_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -2
            },
            {
              "id": "train_existing_team_effect_3",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 1
            },
            {
              "id": "train_existing_team_effect_4",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            },
            {
              "id": "train_existing_team_effect_5",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "peer_coaching_spreads",
              "originChoiceId": "train_existing_team",
              "activation": {
                "type": "on_level_entry",
                "levelId": "immediate_impact"
              },
              "title": "Peer coaching takes hold",
              "description": "People who practiced early are helping colleagues solve new tasks without waiting for a specialist.",
              "effects": [
                {
                  "id": "peer_coaching_spreads_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "human_capability",
                  "delta": 1
                },
                {
                  "id": "peer_coaching_spreads_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "customer_advisor_pilot",
          "title": "Pilot a customer AI advisor",
          "description": "Test a narrow customer-facing assistant with human escalation.",
          "outcome": "The company learns from customers and starts adoption with a contained pilot.",
          "effects": [
            {
              "id": "customer_advisor_pilot_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -3
            },
            {
              "id": "customer_advisor_pilot_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -2
            },
            {
              "id": "customer_advisor_pilot_effect_3",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 1
            },
            {
              "id": "customer_advisor_pilot_effect_4",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 1
            },
            {
              "id": "customer_advisor_pilot_effect_5",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "customer_feedback_arrives",
              "originChoiceId": "customer_advisor_pilot",
              "activation": {
                "type": "on_level_entry",
                "levelId": "immediate_impact"
              },
              "title": "Customer feedback changes the roadmap",
              "description": "Early users value the faster answers, but expect a clear route to a person.",
              "effects": [
                {
                  "id": "customer_feedback_arrives_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "ai_adoption",
                  "delta": 1
                },
                {
                  "id": "customer_feedback_arrives_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "shared_data_foundation",
          "title": "Build a shared data foundation",
          "description": "Clean and organize information used by both people and AI tools.",
          "outcome": "Work becomes easier to coordinate, though visible product gains take longer.",
          "effects": [
            {
              "id": "shared_data_foundation_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -3
            },
            {
              "id": "shared_data_foundation_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -2
            },
            {
              "id": "shared_data_foundation_effect_3",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 1
            },
            {
              "id": "shared_data_foundation_effect_4",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            },
            {
              "id": "shared_data_foundation_effect_5",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "shared_context_pays",
              "originChoiceId": "shared_data_foundation",
              "activation": {
                "type": "on_level_entry",
                "levelId": "immediate_impact"
              },
              "title": "Shared context reduces rework",
              "description": "Teams can find the same current information, lowering the cost of handoffs.",
              "effects": [
                {
                  "id": "shared_context_pays_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "productivity",
                  "delta": 1
                },
                {
                  "id": "shared_context_pays_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "redesign_flexible_work",
          "title": "Redesign work around flexibility",
          "description": "Let teams decide where AI helps and where human judgment stays central.",
          "outcome": "The organization gains flexibility and trust, while adoption remains gradual.",
          "effects": [
            {
              "id": "redesign_flexible_work_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "redesign_flexible_work_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "redesign_flexible_work_effect_3",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 1
            },
            {
              "id": "redesign_flexible_work_effect_4",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            },
            {
              "id": "redesign_flexible_work_effect_5",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "workload_balance_improves",
              "originChoiceId": "redesign_flexible_work",
              "activation": {
                "type": "on_level_entry",
                "levelId": "immediate_impact"
              },
              "title": "Teams adapt without a single playbook",
              "description": "Local experiments give the company more ways to respond when one workflow changes.",
              "effects": [
                {
                  "id": "workload_balance_improves_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": 1
                },
                {
                  "id": "workload_balance_improves_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "preserve_runway",
          "title": "Preserve runway and observe",
          "description": "Limit new tooling while mapping the work that matters most.",
          "outcome": "The company keeps options open and learns more slowly than early adopters.",
          "effects": [
            {
              "id": "preserve_runway_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "preserve_runway_effect_2",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            },
            {
              "id": "preserve_runway_effect_3",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "option_value_preserved",
              "originChoiceId": "preserve_runway",
              "activation": {
                "type": "on_level_entry",
                "levelId": "immediate_impact"
              },
              "title": "A clearer investment case emerges",
              "description": "The team now has a sharper view of where a focused AI investment could pay off.",
              "effects": [
                {
                  "id": "option_value_preserved_effect_1",
                  "operation": "add",
                  "target": "resources",
                  "key": "capital",
                  "delta": 1
                },
                {
                  "id": "option_value_preserved_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "immediate_impact",
      "type": "decision",
      "nextLevelId": "business_and_work",
      "title": "Year 2 — Immediate Impact",
      "prompt": "First results are visible. Decide whether to scale, deepen capability, or slow down to understand the effects.",
      "choices": [
        {
          "id": "form_human_ai_expert_team",
          "title": "Form a human-AI expert team",
          "description": "Pair AI specialists with experienced operators who own the work.",
          "outcome": "A cross-functional team can redesign tasks instead of automating them in isolation.",
          "effects": [
            {
              "id": "form_human_ai_expert_team_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -3
            },
            {
              "id": "form_human_ai_expert_team_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "form_human_ai_expert_team_effect_3",
              "operation": "add",
              "target": "resources",
              "key": "talent",
              "delta": -1
            },
            {
              "id": "form_human_ai_expert_team_effect_4",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 1
            },
            {
              "id": "form_human_ai_expert_team_effect_5",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 2
            },
            {
              "id": "form_human_ai_expert_team_effect_6",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "unlock": {
            "id": "unlock_expert_team",
            "conditionIds": [
              "condition_expert_capability",
              "condition_expert_talent"
            ]
          },
          "lockedReason": "Build human expertise and retain one talent unit first.",
          "delayedConsequences": [
            {
              "id": "expert_workflows_spread",
              "originChoiceId": "form_human_ai_expert_team",
              "activation": {
                "type": "on_level_entry",
                "levelId": "business_and_work"
              },
              "title": "Expert workflows spread",
              "description": "The team turns its first working patterns into practices other groups can reuse.",
              "effects": [
                {
                  "id": "expert_workflows_spread_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "human_capability",
                  "delta": 1
                },
                {
                  "id": "expert_workflows_spread_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "scale_automated_workflows",
          "title": "Scale automated workflows",
          "description": "Extend the proven back-office system across more routine work.",
          "outcome": "Throughput improves, with more work now relying on the same automated layer.",
          "effects": [
            {
              "id": "scale_automated_workflows_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -3
            },
            {
              "id": "scale_automated_workflows_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "scale_automated_workflows_effect_3",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 2
            },
            {
              "id": "scale_automated_workflows_effect_4",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 2
            },
            {
              "id": "scale_automated_workflows_effect_5",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": 1
            }
          ],
          "unlock": {
            "id": "unlock_automation_scale",
            "conditionIds": [
              "condition_ai_adoption"
            ]
          },
          "lockedReason": "Demonstrate initial AI adoption before scaling automation.",
          "delayedConsequences": [
            {
              "id": "workflow_dependency_deepens",
              "originChoiceId": "scale_automated_workflows",
              "activation": {
                "type": "on_level_entry",
                "levelId": "business_and_work"
              },
              "title": "Workflow dependency deepens",
              "description": "More teams depend on a system few people know how to repair by hand.",
              "effects": [
                {
                  "id": "workflow_dependency_deepens_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "ai_dependence",
                  "delta": 1
                },
                {
                  "id": "workflow_dependency_deepens_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": -1
                }
              ]
            }
          ]
        },
        {
          "id": "train_frontline_ai",
          "title": "Train frontline teams",
          "description": "Give customer and operations teams guided practice with AI tools.",
          "outcome": "Capability grows close to the work, at the cost of near-term delivery time.",
          "effects": [
            {
              "id": "train_frontline_ai_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "train_frontline_ai_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -2
            },
            {
              "id": "train_frontline_ai_effect_3",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 1
            },
            {
              "id": "train_frontline_ai_effect_4",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            },
            {
              "id": "train_frontline_ai_effect_5",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "frontline_fluency_grows",
              "originChoiceId": "train_frontline_ai",
              "activation": {
                "type": "on_level_entry",
                "levelId": "business_and_work"
              },
              "title": "Frontline fluency grows",
              "description": "People can now spot when an AI result needs context or a second look.",
              "effects": [
                {
                  "id": "frontline_fluency_grows_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "human_capability",
                  "delta": 1
                },
                {
                  "id": "frontline_fluency_grows_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "expand_customer_advisor",
          "title": "Expand the customer advisor",
          "description": "Bring the pilot to more customers and keep human escalation available.",
          "outcome": "The service reaches more people and generates a stronger feedback loop.",
          "effects": [
            {
              "id": "expand_customer_advisor_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -3
            },
            {
              "id": "expand_customer_advisor_effect_2",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 2
            },
            {
              "id": "expand_customer_advisor_effect_3",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 1
            },
            {
              "id": "expand_customer_advisor_effect_4",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "customer_service_expectations",
              "originChoiceId": "expand_customer_advisor",
              "activation": {
                "type": "on_level_entry",
                "levelId": "business_and_work"
              },
              "title": "Service expectations rise",
              "description": "Customers now expect quick answers and a reliable handoff when their case is unusual.",
              "effects": [
                {
                  "id": "customer_service_expectations_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                },
                {
                  "id": "customer_service_expectations_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "ai_dependence",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "audit_workflows",
          "title": "Audit workflows and failure points",
          "description": "Map where AI can fail and who can safely take over.",
          "outcome": "The company becomes more resilient, while expansion waits for evidence.",
          "effects": [
            {
              "id": "audit_workflows_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "audit_workflows_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "audit_workflows_effect_3",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            },
            {
              "id": "audit_workflows_effect_4",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            },
            {
              "id": "audit_workflows_effect_5",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": -1
            }
          ],
          "unlock": {
            "id": "unlock_workflow_audit",
            "conditionIds": [
              "condition_dependence_one"
            ]
          },
          "lockedReason": "Audit an operating dependency after the team has adopted an AI workflow.",
          "delayedConsequences": [
            {
              "id": "fallback_readiness",
              "originChoiceId": "audit_workflows",
              "activation": {
                "type": "on_level_entry",
                "levelId": "business_and_work"
              },
              "title": "Fallbacks are ready when needed",
              "description": "Teams have named owners and a manual route for the most important workflows.",
              "effects": [
                {
                  "id": "fallback_readiness_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "specialize_ai_operations",
          "title": "Create an AI operations group",
          "description": "Centralize quality, deployment, and tool support in a specialist group.",
          "outcome": "Consistency improves, but more teams must coordinate through a small function.",
          "effects": [
            {
              "id": "specialize_ai_operations_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "specialize_ai_operations_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "talent",
              "delta": -1
            },
            {
              "id": "specialize_ai_operations_effect_3",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 1
            },
            {
              "id": "specialize_ai_operations_effect_4",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 1
            },
            {
              "id": "specialize_ai_operations_effect_5",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "central_team_load",
              "originChoiceId": "specialize_ai_operations",
              "activation": {
                "type": "on_level_entry",
                "levelId": "business_and_work"
              },
              "title": "The central team becomes a bottleneck",
              "description": "Demand for shared AI support grows faster than the specialist group.",
              "effects": [
                {
                  "id": "central_team_load_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": -1
                },
                {
                  "id": "central_team_load_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "human_capability",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "defer_broad_rollout",
          "title": "Defer a broad rollout",
          "description": "Keep experiments small until the company has more evidence.",
          "outcome": "Risk stays contained and the company gives up some near-term scale.",
          "effects": [
            {
              "id": "defer_broad_rollout_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "defer_broad_rollout_effect_2",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            },
            {
              "id": "defer_broad_rollout_effect_3",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "measured_rollout_option",
              "originChoiceId": "defer_broad_rollout",
              "activation": {
                "type": "on_level_entry",
                "levelId": "business_and_work"
              },
              "title": "A measured rollout keeps options open",
              "description": "The team can now choose a narrower deployment based on observed needs.",
              "effects": [
                {
                  "id": "measured_rollout_option_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                },
                {
                  "id": "measured_rollout_option_effect_2",
                  "operation": "add",
                  "target": "resources",
                  "key": "capital",
                  "delta": 1
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "business_and_work",
      "type": "decision",
      "nextLevelId": "market_society_shift",
      "title": "Year 3 — Business & Work",
      "prompt": "AI has changed the shape of jobs. Decide who gains new responsibility and who absorbs the transition.",
      "choices": [
        {
          "id": "redesign_expert_teams",
          "title": "Redesign work with expert teams",
          "description": "Give mixed human-AI teams ownership of complete customer outcomes.",
          "outcome": "Experts gain broader judgment and teams can improve the whole workflow.",
          "effects": [
            {
              "id": "redesign_expert_teams_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "redesign_expert_teams_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "redesign_expert_teams_effect_3",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 1
            },
            {
              "id": "redesign_expert_teams_effect_4",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 2
            },
            {
              "id": "redesign_expert_teams_effect_5",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "unlock": {
            "id": "unlock_expert_work_redesign",
            "conditionIds": [
              "condition_expert_capability"
            ]
          },
          "lockedReason": "Build human capability before redesigning work around expert teams.",
          "delayedConsequences": [
            {
              "id": "expert_teams_build_resilience",
              "originChoiceId": "redesign_expert_teams",
              "activation": {
                "type": "on_level_entry",
                "levelId": "market_society_shift"
              },
              "title": "Expert teams make change easier to absorb",
              "description": "People can shift between tasks because more of the team understands the full service.",
              "effects": [
                {
                  "id": "expert_teams_build_resilience_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": 1
                },
                {
                  "id": "expert_teams_build_resilience_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "automate_customer_operations",
          "title": "Automate routine customer operations",
          "description": "Let AI resolve common requests and route exceptions to staff.",
          "outcome": "Service capacity grows, while fewer routine cases remain for people to learn from.",
          "effects": [
            {
              "id": "automate_customer_operations_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "automate_customer_operations_effect_2",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 1
            },
            {
              "id": "automate_customer_operations_effect_3",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 2
            },
            {
              "id": "automate_customer_operations_effect_4",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": 1
            },
            {
              "id": "automate_customer_operations_effect_5",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": -1
            }
          ],
          "unlock": {
            "id": "unlock_customer_automation",
            "conditionIds": [
              "condition_advanced_automation"
            ]
          },
          "lockedReason": "Establish reliable AI adoption before automating customer operations.",
          "delayedConsequences": [
            {
              "id": "junior_customer_path_closes",
              "originChoiceId": "automate_customer_operations",
              "activation": {
                "type": "on_level_entry",
                "levelId": "market_society_shift"
              },
              "title": "A junior learning path disappears",
              "description": "Fewer routine cases now reach new hires, so the team must create another way to learn the service.",
              "effects": [
                {
                  "id": "junior_customer_path_closes_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": -1
                },
                {
                  "id": "junior_customer_path_closes_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "ai_dependence",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "build_apprenticeship_ladder",
          "title": "Build an AI apprenticeship ladder",
          "description": "Pair junior staff with experienced reviewers on AI-assisted work.",
          "outcome": "Human capability compounds through practice, even as mentoring uses scarce time.",
          "effects": [
            {
              "id": "build_apprenticeship_ladder_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -2
            },
            {
              "id": "build_apprenticeship_ladder_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "talent",
              "delta": -1
            },
            {
              "id": "build_apprenticeship_ladder_effect_3",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 2
            },
            {
              "id": "build_apprenticeship_ladder_effect_4",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 2
            },
            {
              "id": "build_apprenticeship_ladder_effect_5",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "unlock": {
            "id": "unlock_apprenticeship",
            "conditionIds": [
              "condition_expert_capability"
            ]
          },
          "lockedReason": "Develop experienced practitioners before adding an apprenticeship ladder.",
          "delayedConsequences": [
            {
              "id": "apprenticeship_knowledge_spreads",
              "originChoiceId": "build_apprenticeship_ladder",
              "activation": {
                "type": "on_level_entry",
                "levelId": "market_society_shift"
              },
              "title": "Knowledge begins to travel",
              "description": "Junior staff can explain and improve the workflow instead of only following it.",
              "effects": [
                {
                  "id": "apprenticeship_knowledge_spreads_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "human_capability",
                  "delta": 1
                },
                {
                  "id": "apprenticeship_knowledge_spreads_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "retain_human_review",
          "title": "Keep human review at the customer edge",
          "description": "Route consequential or unusual cases to trained staff.",
          "outcome": "Trust and service resilience increase, though some efficiency remains unrealized.",
          "effects": [
            {
              "id": "retain_human_review_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -1
            },
            {
              "id": "retain_human_review_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "retain_human_review_effect_3",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 2
            },
            {
              "id": "retain_human_review_effect_4",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            },
            {
              "id": "retain_human_review_effect_5",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": -1
            }
          ],
          "unlock": {
            "id": "unlock_human_review",
            "conditionIds": [
              "condition_human_review",
              "condition_trusted_review",
              "condition_dependence_one"
            ]
          },
          "lockedReason": "Human review requires both trained capability and a trusted operating practice."
        },
        {
          "id": "give_teams_local_tools",
          "title": "Give teams local tool budgets",
          "description": "Let each group select tools for its own customers and tasks.",
          "outcome": "Local fit improves, but support and quality become less consistent.",
          "effects": [
            {
              "id": "give_teams_local_tools_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "give_teams_local_tools_effect_2",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 1
            },
            {
              "id": "give_teams_local_tools_effect_3",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 1
            },
            {
              "id": "give_teams_local_tools_effect_4",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            },
            {
              "id": "give_teams_local_tools_effect_5",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "tool_sprawl_cost",
              "originChoiceId": "give_teams_local_tools",
              "activation": {
                "type": "on_level_entry",
                "levelId": "market_society_shift"
              },
              "title": "Tool sprawl adds coordination work",
              "description": "Teams made useful local choices, but shared data and support now need attention.",
              "effects": [
                {
                  "id": "tool_sprawl_cost_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "productivity",
                  "delta": -1
                },
                {
                  "id": "tool_sprawl_cost_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": -1
                }
              ]
            }
          ]
        },
        {
          "id": "publish_service_standards",
          "title": "Publish service and review standards",
          "description": "Make clear where AI responds and how people handle exceptions.",
          "outcome": "Customers and staff know what to expect, with slower initial rollout.",
          "effects": [
            {
              "id": "publish_service_standards_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "publish_service_standards_effect_2",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 2
            },
            {
              "id": "publish_service_standards_effect_3",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "standards_enable_adoption",
              "originChoiceId": "publish_service_standards",
              "activation": {
                "type": "on_level_entry",
                "levelId": "market_society_shift"
              },
              "title": "Clear standards enable wider use",
              "description": "Teams can expand safely because escalation responsibilities are understood.",
              "effects": [
                {
                  "id": "standards_enable_adoption_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "ai_adoption",
                  "delta": 1
                },
                {
                  "id": "standards_enable_adoption_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "productivity",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "fund_job_transitions",
          "title": "Fund job transitions",
          "description": "Use budget for reskilling and internal moves as tasks change.",
          "outcome": "People retain a path into new roles, reducing short-term cash for expansion.",
          "effects": [
            {
              "id": "fund_job_transitions_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -3
            },
            {
              "id": "fund_job_transitions_effect_2",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 1
            },
            {
              "id": "fund_job_transitions_effect_3",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 2
            },
            {
              "id": "fund_job_transitions_effect_4",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "transition_network_forms",
              "originChoiceId": "fund_job_transitions",
              "activation": {
                "type": "on_level_entry",
                "levelId": "market_society_shift"
              },
              "title": "Internal mobility becomes credible",
              "description": "People can see routes from changing tasks into new responsibilities.",
              "effects": [
                {
                  "id": "transition_network_forms_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": 1
                },
                {
                  "id": "transition_network_forms_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "market_society_shift",
      "type": "decision",
      "nextLevelId": "second_order_effects",
      "title": "Year 4 — Market / Society Shift",
      "prompt": "Customers, competitors, and regulators have adapted. Choose how your organization will earn trust and reach.",
      "choices": [
        {
          "id": "publish_transparency_report",
          "title": "Publish a transparency report",
          "description": "Share where AI is used, how it is checked, and what remains human-led.",
          "outcome": "Trust grows and customers can make informed choices about the service.",
          "effects": [
            {
              "id": "publish_transparency_report_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -1
            },
            {
              "id": "publish_transparency_report_effect_2",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 2
            },
            {
              "id": "publish_transparency_report_effect_3",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "transparency_builds_confidence",
              "originChoiceId": "publish_transparency_report",
              "activation": {
                "type": "on_level_entry",
                "levelId": "second_order_effects"
              },
              "title": "Transparency builds confidence",
              "description": "Clear reporting makes later changes easier for staff and customers to evaluate.",
              "effects": [
                {
                  "id": "transparency_builds_confidence_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "scale_regulated_market",
          "title": "Enter a regulated market",
          "description": "Adapt proven AI workflows to a market with stricter assurance needs.",
          "outcome": "The company gains a new market path, but delivery requires more review.",
          "effects": [
            {
              "id": "scale_regulated_market_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -3
            },
            {
              "id": "scale_regulated_market_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "scale_regulated_market_effect_3",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 1
            },
            {
              "id": "scale_regulated_market_effect_4",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 1
            },
            {
              "id": "scale_regulated_market_effect_5",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "unlock": {
            "id": "unlock_regulated_market",
            "conditionIds": [
              "condition_trusted_review"
            ]
          },
          "lockedReason": "Earn trust in the operating model before entering a regulated market.",
          "delayedConsequences": [
            {
              "id": "assurance_capability_grows",
              "originChoiceId": "scale_regulated_market",
              "activation": {
                "type": "on_level_entry",
                "levelId": "second_order_effects"
              },
              "title": "Assurance becomes a market capability",
              "description": "Review practices developed for one market now help the whole organization.",
              "effects": [
                {
                  "id": "assurance_capability_grows_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "human_capability",
                  "delta": 1
                },
                {
                  "id": "assurance_capability_grows_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "open_tools_access",
          "title": "Open access to selected tools",
          "description": "Share a limited toolset with partners and smaller customers.",
          "outcome": "Access grows beyond the company, with less control over how the tools are used.",
          "effects": [
            {
              "id": "open_tools_access_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "open_tools_access_effect_2",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 2
            },
            {
              "id": "open_tools_access_effect_3",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 1
            },
            {
              "id": "open_tools_access_effect_4",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            },
            {
              "id": "open_tools_access_effect_5",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "ecosystem_support_demand",
              "originChoiceId": "open_tools_access",
              "activation": {
                "type": "on_level_entry",
                "levelId": "second_order_effects"
              },
              "title": "The ecosystem asks for support",
              "description": "Broader access brings more edge cases and a need for shared support standards.",
              "effects": [
                {
                  "id": "ecosystem_support_demand_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": -1
                },
                {
                  "id": "ecosystem_support_demand_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "ai_dependence",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "form_sector_coalition",
          "title": "Form a sector learning coalition",
          "description": "Work with peers on shared evaluation and workforce practices.",
          "outcome": "Collective knowledge improves, while some market advantage is shared.",
          "effects": [
            {
              "id": "form_sector_coalition_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -2
            },
            {
              "id": "form_sector_coalition_effect_2",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 1
            },
            {
              "id": "form_sector_coalition_effect_3",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 2
            },
            {
              "id": "form_sector_coalition_effect_4",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "shared_standards_travel",
              "originChoiceId": "form_sector_coalition",
              "activation": {
                "type": "on_level_entry",
                "levelId": "second_order_effects"
              },
              "title": "Shared standards travel across the sector",
              "description": "Partners can compare failures and improve practices faster than any one firm alone.",
              "effects": [
                {
                  "id": "shared_standards_travel_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                },
                {
                  "id": "shared_standards_travel_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "automate_supply_chain",
          "title": "Automate the supply chain",
          "description": "Connect forecasting, purchasing, and fulfillment through AI workflows.",
          "outcome": "Productivity and adoption rise, with more critical operations linked to automated decisions.",
          "effects": [
            {
              "id": "automate_supply_chain_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -3
            },
            {
              "id": "automate_supply_chain_effect_2",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 1
            },
            {
              "id": "automate_supply_chain_effect_3",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 2
            },
            {
              "id": "automate_supply_chain_effect_4",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": 1
            },
            {
              "id": "automate_supply_chain_effect_5",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": -1
            }
          ],
          "delayedConsequences": [
            {
              "id": "supply_chain_coupling",
              "originChoiceId": "automate_supply_chain",
              "activation": {
                "type": "on_level_entry",
                "levelId": "second_order_effects"
              },
              "title": "Supply chains become more coupled",
              "description": "A change in one automated forecast now affects more teams and partners.",
              "effects": [
                {
                  "id": "supply_chain_coupling_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "ai_dependence",
                  "delta": 1
                },
                {
                  "id": "supply_chain_coupling_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": -1
                }
              ]
            }
          ]
        },
        {
          "id": "train_partner_network",
          "title": "Train the partner network",
          "description": "Help suppliers and service partners use AI with shared review practices.",
          "outcome": "Capability and resilience improve across the network, at a cost in time and capital.",
          "effects": [
            {
              "id": "train_partner_network_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "train_partner_network_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "train_partner_network_effect_3",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 1
            },
            {
              "id": "train_partner_network_effect_4",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 2
            },
            {
              "id": "train_partner_network_effect_5",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "delayedConsequences": [
            {
              "id": "partner_capability_returns",
              "originChoiceId": "train_partner_network",
              "activation": {
                "type": "on_level_entry",
                "levelId": "second_order_effects"
              },
              "title": "Partner capability returns value",
              "description": "Trained partners resolve more exceptions without escalating every issue back to your team.",
              "effects": [
                {
                  "id": "partner_capability_returns_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "productivity",
                  "delta": 1
                },
                {
                  "id": "partner_capability_returns_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                }
              ]
            }
          ]
        },
        {
          "id": "focus_reliable_niche",
          "title": "Focus on a reliable niche",
          "description": "Serve fewer customers with a dependable human-AI service.",
          "outcome": "Reliability deepens while the company passes on some immediate market reach.",
          "effects": [
            {
              "id": "focus_reliable_niche_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "focus_reliable_niche_effect_2",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 1
            },
            {
              "id": "focus_reliable_niche_effect_3",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 2
            },
            {
              "id": "focus_reliable_niche_effect_4",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 2
            },
            {
              "id": "focus_reliable_niche_effect_5",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": -1
            }
          ],
          "unlock": {
            "id": "unlock_reliable_niche",
            "conditionIds": [
              "condition_dependence_one"
            ]
          },
          "lockedReason": "A reliability strategy needs an AI-dependent workflow to improve.",
          "delayedConsequences": [
            {
              "id": "reliability_reputation",
              "originChoiceId": "focus_reliable_niche",
              "activation": {
                "type": "on_level_entry",
                "levelId": "second_order_effects"
              },
              "title": "Reliability becomes part of the reputation",
              "description": "Customers value knowing when the service will pause and bring in a person.",
              "effects": [
                {
                  "id": "reliability_reputation_effect_1",
                  "operation": "add",
                  "target": "world",
                  "key": "organizational_trust",
                  "delta": 1
                },
                {
                  "id": "reliability_reputation_effect_2",
                  "operation": "add",
                  "target": "world",
                  "key": "employment_resilience",
                  "delta": 1
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "second_order_effects",
      "type": "decision",
      "nextLevelId": "future_world",
      "title": "Year 5 — Second-order Effects",
      "prompt": "The system now shapes how people learn, how the company handles failure, and who captures growth. Set the capability you will carry forward.",
      "choices": [
        {
          "id": "build_verification_fallbacks",
          "title": "Build human verification and fallbacks",
          "description": "Fund trained review and a manual route for critical work.",
          "outcome": "Dependence falls and resilience rises, using resources that could fund expansion.",
          "effects": [
            {
              "id": "build_verification_fallbacks_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "build_verification_fallbacks_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "build_verification_fallbacks_effect_3",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": -2
            },
            {
              "id": "build_verification_fallbacks_effect_4",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 2
            },
            {
              "id": "build_verification_fallbacks_effect_5",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "unlock": {
            "id": "unlock_verification_fallbacks",
            "conditionIds": [
              "condition_human_review",
              "condition_dependence_two"
            ]
          }
        },
        {
          "id": "fully_autonomous_operations",
          "title": "Make operations nearly autonomous",
          "description": "Move more routine decisions into monitored AI workflows.",
          "outcome": "Output and adoption rise, along with the cost of interruption or oversight failure.",
          "effects": [
            {
              "id": "fully_autonomous_operations_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "fully_autonomous_operations_effect_2",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 1
            },
            {
              "id": "fully_autonomous_operations_effect_3",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 2
            },
            {
              "id": "fully_autonomous_operations_effect_4",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": 2
            },
            {
              "id": "fully_autonomous_operations_effect_5",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": -1
            }
          ],
          "unlock": {
            "id": "unlock_autonomous_operations",
            "conditionIds": [
              "condition_advanced_automation",
              "condition_first_automation"
            ]
          },
          "lockedReason": "Establish broad adoption through an earlier automation decision first."
        },
        {
          "id": "create_expertise_guild",
          "title": "Create an internal expertise guild",
          "description": "Give experienced staff time to teach, review, and improve AI workflows.",
          "outcome": "Knowledge accumulates across teams instead of staying with a few specialists.",
          "effects": [
            {
              "id": "create_expertise_guild_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -2
            },
            {
              "id": "create_expertise_guild_effect_2",
              "operation": "add",
              "target": "resources",
              "key": "talent",
              "delta": -1
            },
            {
              "id": "create_expertise_guild_effect_3",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 2
            },
            {
              "id": "create_expertise_guild_effect_4",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            },
            {
              "id": "create_expertise_guild_effect_5",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ],
          "unlock": {
            "id": "unlock_expertise_guild",
            "conditionIds": [
              "condition_expert_capability"
            ]
          },
          "lockedReason": "Establish a base of experienced practitioners before forming the guild."
        },
        {
          "id": "invest_for_growth",
          "title": "Invest for another growth cycle",
          "description": "Use remaining capital to extend the product and its AI-enabled reach.",
          "outcome": "The company gains a growth option while taking on more dependence.",
          "effects": [
            {
              "id": "invest_for_growth_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -3
            },
            {
              "id": "invest_for_growth_effect_2",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 1
            },
            {
              "id": "invest_for_growth_effect_3",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 2
            },
            {
              "id": "invest_for_growth_effect_4",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": 1
            }
          ],
          "unlock": {
            "id": "unlock_growth_investment",
            "conditionIds": [
              "condition_ai_adoption"
            ]
          },
          "lockedReason": "Show a working adoption path before funding another growth cycle."
        },
        {
          "id": "create_knowledge_transfer",
          "title": "Document how the work gets done",
          "description": "Give every team a simple playbook for decisions, handoffs, and learning.",
          "outcome": "Shared documentation improves capability and resilience, even without a large specialist bench.",
          "effects": [
            {
              "id": "create_knowledge_transfer_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "time",
              "delta": -1
            },
            {
              "id": "create_knowledge_transfer_effect_2",
              "operation": "add",
              "target": "world",
              "key": "human_capability",
              "delta": 1
            },
            {
              "id": "create_knowledge_transfer_effect_3",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 1
            },
            {
              "id": "create_knowledge_transfer_effect_4",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            }
          ]
        },
        {
          "id": "build_redundant_network",
          "title": "Build a redundant partner network",
          "description": "Spread critical work across trained people and more than one system.",
          "outcome": "Resilience improves, although duplicate capacity is less efficient in the short term.",
          "effects": [
            {
              "id": "build_redundant_network_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "build_redundant_network_effect_2",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": 2
            },
            {
              "id": "build_redundant_network_effect_3",
              "operation": "add",
              "target": "world",
              "key": "organizational_trust",
              "delta": 1
            },
            {
              "id": "build_redundant_network_effect_4",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": -1
            }
          ],
          "unlock": {
            "id": "unlock_redundant_network",
            "conditionIds": [
              "condition_trusted_review",
              "condition_dependence_one"
            ]
          }
        },
        {
          "id": "accelerate_market_expansion",
          "title": "Accelerate market expansion",
          "description": "Prioritize the largest available market before competitors close the window.",
          "outcome": "Growth accelerates, but teams have less room to absorb surprises.",
          "effects": [
            {
              "id": "accelerate_market_expansion_effect_1",
              "operation": "add",
              "target": "resources",
              "key": "capital",
              "delta": -2
            },
            {
              "id": "accelerate_market_expansion_effect_2",
              "operation": "add",
              "target": "world",
              "key": "ai_adoption",
              "delta": 2
            },
            {
              "id": "accelerate_market_expansion_effect_3",
              "operation": "add",
              "target": "world",
              "key": "productivity",
              "delta": 2
            },
            {
              "id": "accelerate_market_expansion_effect_4",
              "operation": "add",
              "target": "world",
              "key": "ai_dependence",
              "delta": 1
            },
            {
              "id": "accelerate_market_expansion_effect_5",
              "operation": "add",
              "target": "world",
              "key": "employment_resilience",
              "delta": -1
            }
          ],
          "unlock": {
            "id": "unlock_market_expansion",
            "conditionIds": [
              "condition_ai_adoption"
            ]
          },
          "lockedReason": "Establish a working AI adoption path before accelerating expansion."
        }
      ]
    },
    {
      "id": "future_world",
      "type": "ending",
      "title": "Year 6 — Future World",
      "description": "The organization you built now faces a new set of choices. Its future reflects what it learned, scaled, and kept resilient.",
      "endings": [
        {
          "id": "maximum_automation_organization",
          "title": "Maximum Automation Organization",
          "description": "AI runs a large share of operations. The company moves quickly, while continuity depends on systems few people can replace.",
          "conditionIds": [
            "condition_auto_ending_adoption",
            "condition_auto_ending_dependence",
            "condition_first_automation",
            "condition_automation_scale_history"
          ],
          "playerReasons": [
            { "conditionId": "condition_auto_ending_adoption", "text": "AI now supports a broad share of the company’s work." },
            { "conditionId": "condition_auto_ending_dependence", "text": "Core operations rely heavily on automated workflows." },
            { "conditionId": "condition_first_automation", "text": "You made automation an early operating priority." },
            { "conditionId": "condition_automation_scale_history", "text": "You later extended automation across more workflows." }
          ]
        },
        {
          "id": "human_ai_organization",
          "title": "Human + AI Organization",
          "description": "Experienced teams and capable AI systems share responsibility. The organization can expand while people continue to shape the work.",
          "conditionIds": [
            "condition_hybrid_ending_capability",
            "condition_hybrid_ending_adoption",
            "condition_hybrid_ending_trust"
          ],
          "playerReasons": [
            { "conditionId": "condition_hybrid_ending_capability", "text": "People built the expertise to shape how AI is used." },
            { "conditionId": "condition_hybrid_ending_adoption", "text": "AI adoption became part of how the organization works." },
            { "conditionId": "condition_hybrid_ending_trust", "text": "Teams developed trust in their shared operating model." }
          ]
        },
        {
          "id": "human_capability_organization",
          "title": "Human Capability Organization",
          "description": "The company has invested deeply in judgment, teaching, and craft. AI adoption is selective, and people carry much of its adaptability.",
          "conditionIds": [
            "condition_human_ending_capability",
            "condition_human_ending_adoption"
          ],
          "playerReasons": [
            { "conditionId": "condition_human_ending_capability", "text": "The company invested deeply in human expertise." },
            { "conditionId": "condition_human_ending_adoption", "text": "AI remained a selective part of the work." }
          ]
        },
        {
          "id": "resilient_hybrid_organization",
          "title": "Resilient Hybrid Organization",
          "description": "Trusted teams can work with AI and continue when systems fail. Growth is measured against the organization's ability to recover.",
          "conditionIds": [
            "condition_resilience_ending_trust",
            "condition_resilience_ending_jobs",
            "condition_resilience_ending_dependence"
          ],
          "playerReasons": [
            { "conditionId": "condition_resilience_ending_trust", "text": "Teams built trust in how work gets done." },
            { "conditionId": "condition_resilience_ending_jobs", "text": "People and jobs remained resilient through change." },
            { "conditionId": "condition_resilience_ending_dependence", "text": "The organization kept alternatives to AI available." }
          ]
        },
        {
          "id": "high_growth_dependence_organization",
          "title": "High-Growth, High-Dependence Organization",
          "description": "The company has reached new scale through AI-enabled output. Its next challenge is making that growth durable.",
          "conditionIds": [
            "condition_growth_ending_productivity",
            "condition_growth_ending_dependence"
          ],
          "playerReasons": [
            { "conditionId": "condition_growth_ending_productivity", "text": "AI-enabled work increased the company’s productive output." },
            { "conditionId": "condition_growth_ending_dependence", "text": "That output now relies more heavily on automated systems." }
          ]
        },
        {
          "id": "adaptive_mixed_organization",
          "title": "Adaptive Mixed Organization",
          "description": "The company has taken a varied path. Its next advantage will come from learning which parts of that mix deserve to grow.",
          "conditionIds": [],
          "playerReasons": [
            { "conditionId": null, "text": "Your choices created a mixed organization without one defining strategy taking over." },
            { "conditionId": null, "text": "Its next opportunity is deciding which strengths deserve to grow." }
          ]
        }
      ]
    }
  ]
};

export default founderOrganizationScenario;
