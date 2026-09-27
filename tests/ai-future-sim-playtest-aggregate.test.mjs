import assert from "node:assert/strict";
import test from "node:test";

import { aggregateParticipants } from "../features/ai-future-sim/playtest/aggregate.mjs";

test("empty playtest aggregation clearly reports no participant feedback", () => {
  const report = aggregateParticipants([]);
  assert.match(report, /Completed participants included: 0/);
  assert.match(report, /No completed participant results were found/);
  assert.match(report, /No feedback has been inferred or synthesized/);
});

test("aggregation counts only recorded responses and applies repeat thresholds by issue key", () => {
  const makeParticipant = (participantId, costNoticed, issue = true) => ({
    participant_id: participantId,
    status: "COMPLETED",
    stages: [{
      level_id: "starting_point",
      resource_cost: { noticed: costNoticed, understood_resource: true, used_in_decision: null, misunderstood_meaning: false },
      locked_options: [{ classification: "PARTIALLY_CLEAR" }],
    }],
    delayed_consequences: [{ classification: "CONNECTION_AFTER_READING", remembered_origin_choice: false }],
    ending: { comprehension_after_reading: "PARTIAL" },
    replay: { intent: "YES", choice_id_to_change: "automate_back_office" },
    issues: issue ? [{
      participant_id: participantId,
      issue_key: "lock:second_order_effects:build_verification_fallbacks",
      level_id: "second_order_effects",
      relevant_ids: ["build_verification_fallbacks"],
      observation: "The lock reason was hard to understand.",
      participant_quote: "I do not know what this requires.",
      classification: "COPY",
      severity: "medium",
      participants_same_issue_count: null,
    }] : [],
  });
  const report = aggregateParticipants([
    makeParticipant("participant_01", true),
    makeParticipant("participant_02", false),
    makeParticipant("participant_03", null, false),
  ]);

  assert.match(report, /Completed participants included: 3/);
  assert.match(report, /true: 1/);
  assert.match(report, /false: 1/);
  assert.match(report, /PARTIALLY_CLEAR: 3/);
  assert.match(report, /CONNECTION_AFTER_READING: 3/);
  assert.match(report, /PARTIAL: 3/);
  assert.match(report, /YES: 3/);
  assert.match(report, /automate_back_office.*3/);
  assert.match(report, /2 participant\(s\).*likely issue/);
  assert.match(report, /Missing or null answers were excluded/);
});

test("unanswered feedback is not converted into a negative response", () => {
  const report = aggregateParticipants([{
    participant_id: "participant_01",
    status: "COMPLETED",
    stages: [{ resource_cost: { noticed: null }, locked_options: [] }],
    delayed_consequences: [],
    ending: {},
    replay: {},
    issues: [],
  }]);
  assert.match(report, /Cost noticed \(true\/false\): No responses recorded/);
  assert.doesNotMatch(report, /Cost noticed \(true\/false\)[\s\S]*?- false: 1/);
});
