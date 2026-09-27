/** Deterministic review paths; every choice is replayed through the game engine. */
export const canonicalFounderPaths = [
  {
    id: "automation-heavy",
    name: "automation-heavy",
    choices: ["automate_back_office", "scale_automated_workflows", "automate_customer_operations", "automate_supply_chain", "fully_autonomous_operations"],
    endingId: "maximum_automation_organization",
    reveals: ["junior_pipeline_thins", "workflow_dependency_deepens", "junior_customer_path_closes", "supply_chain_coupling"],
    resources: { capital: 7, time: 10, talent: 3 },
    worldState: { ai_adoption: 7, human_capability: 2, productivity: 11, employment_resilience: 0, ai_dependence: 10, organizational_trust: 2 },
  },
  {
    id: "human-ai-augmentation",
    name: "human-AI augmentation",
    choices: ["hire_human_experts", "form_human_ai_expert_team", "publish_service_standards", "open_tools_access", "create_expertise_guild"],
    endingId: "human_ai_organization",
    reveals: ["expertise_compounds", "expert_workflows_spread", "standards_enable_adoption", "ecosystem_support_demand"],
    resources: { capital: 11, time: 6, talent: 0 },
    worldState: { ai_adoption: 3, human_capability: 9, productivity: 5, employment_resilience: 10, ai_dependence: 2, organizational_trust: 10 },
  },
  {
    id: "human-capability-investment",
    name: "human capability investment",
    choices: ["train_existing_team", "train_frontline_ai", "build_apprenticeship_ladder", "form_sector_coalition", "create_expertise_guild"],
    endingId: "human_capability_organization",
    reveals: ["peer_coaching_spreads", "frontline_fluency_grows", "apprenticeship_knowledge_spreads", "shared_standards_travel"],
    resources: { capital: 15, time: 2, talent: 1 },
    worldState: { ai_adoption: 0, human_capability: 12, productivity: 1, employment_resilience: 18, ai_dependence: 0, organizational_trust: 9 },
  },
  {
    id: "growth-first",
    name: "growth-first",
    choices: ["customer_advisor_pilot", "expand_customer_advisor", "automate_customer_operations", "scale_regulated_market", "invest_for_growth"],
    endingId: "high_growth_dependence_organization",
    reveals: ["customer_feedback_arrives", "customer_service_expectations", "junior_customer_path_closes", "assurance_capability_grows"],
    resources: { capital: 6, time: 9, talent: 3 },
    worldState: { ai_adoption: 7, human_capability: 3, productivity: 8, employment_resilience: 6, ai_dependence: 4, organizational_trust: 8 },
  },
  {
    id: "resilience-and-caution",
    name: "resilience and caution",
    choices: ["redesign_flexible_work", "expand_customer_advisor", "retain_human_review", "publish_transparency_report", "create_expertise_guild"],
    endingId: "resilient_hybrid_organization",
    reveals: ["workload_balance_improves", "customer_service_expectations", "transparency_builds_confidence"],
    resources: { capital: 13, time: 8, talent: 2 },
    worldState: { ai_adoption: 2, human_capability: 5, productivity: 2, employment_resilience: 13, ai_dependence: 0, organizational_trust: 12 },
  },
];

