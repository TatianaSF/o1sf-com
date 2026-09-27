import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultResultsDirectory = path.join(packageDirectory, "results");
const lockClasses = ["CLEAR", "PARTIALLY_CLEAR", "CONFUSING", "FEELS_ARBITRARY"];
const consequenceClasses = ["IMMEDIATE_CONNECTION", "CONNECTION_AFTER_READING", "WEAK_CONNECTION", "NO_CONNECTION"];
const endingClasses = ["STRONG", "PARTIAL", "WEAK", "RANDOM_FEELING"];
const replayIntents = ["YES", "MAYBE", "NO"];
const issueClasses = ["KEEP", "COPY", "UX", "GAMEPLAY", "FOUNDER_V2"];

function increment(map, value) {
  if (value === null || value === undefined || value === "") return;
  map.set(value, (map.get(value) ?? 0) + 1);
}

function incrementBoolean(map, value, label, participantId) {
  if (value === null || value === undefined || value === "") return;
  if (typeof value !== "boolean") throw new Error(`${participantId}: ${label} must be true, false, or null.`);
  increment(map, value);
}

function incrementEnum(map, value, allowed, label, participantId) {
  if (value === null || value === undefined || value === "") return;
  if (!allowed.includes(value)) throw new Error(`${participantId}: invalid ${label}: ${value}.`);
  increment(map, value);
}

function sortedEntries(map) {
  return [...map.entries()].sort(([left], [right]) => String(left).localeCompare(String(right)));
}

function renderCounts(title, map, allowedValues = []) {
  const keys = [...new Set([...allowedValues, ...map.keys()])];
  if (!keys.some((key) => map.has(key))) return `- ${title}: No responses recorded.`;
  return [`### ${title}`, "", ...keys.map((key) => `- ${key}: ${map.get(key) ?? 0}`)].join("\n");
}

function summarizeIssues(participants) {
  const grouped = new Map();
  for (const participant of participants) {
    for (const issue of participant.issues ?? []) {
      if (!issue.issue_key || !issue.level_id || !issue.observation || !issue.classification || !issue.severity || issue.participant_id !== participant.participant_id || !Array.isArray(issue.relevant_ids) || !Object.hasOwn(issue, "participant_quote") || !Object.hasOwn(issue, "participants_same_issue_count") || issue.participants_same_issue_count !== null) {
        throw new Error(`${participant.participant_id}: each issue requires its participant_id, issue_key, level_id, relevant_ids, observation, participant_quote, classification, severity, and a null participants_same_issue_count.`);
      }
      if (!issueClasses.includes(issue.classification)) {
        throw new Error(`${participant.participant_id}: invalid issue classification ${issue.classification}.`);
      }
      if (!["low", "medium", "high"].includes(issue.severity)) {
        throw new Error(`${participant.participant_id}: invalid issue severity ${issue.severity}.`);
      }
      const record = grouped.get(issue.issue_key) ?? { participants: new Set(), observations: [], classifications: new Set(), severities: new Set(), levels: new Set(), ids: new Set() };
      record.participants.add(participant.participant_id);
      record.observations.push({ participantId: participant.participant_id, observation: issue.observation, quote: issue.participant_quote ?? null });
      record.classifications.add(issue.classification);
      record.severities.add(issue.severity);
      if (issue.level_id) record.levels.add(issue.level_id);
      for (const id of issue.relevant_ids ?? []) record.ids.add(id);
      grouped.set(issue.issue_key, record);
    }
  }
  return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([issueKey, issue]) => {
    const count = issue.participants.size;
    const threshold = count >= 3 ? "strong candidate for change" : count === 2 ? "likely issue" : "observation";
    const participantsLabel = [...issue.participants].sort().join(", ");
    const observations = issue.observations.sort((a, b) => a.participantId.localeCompare(b.participantId))
      .map((item) => `${item.participantId}: ${item.observation}${item.quote ? ` (quote/paraphrase: ${item.quote})` : ""}`).join("; ");
    return `- \`${issueKey}\` — ${count} participant(s) (${participantsLabel}); **${threshold}**. Class: ${[...issue.classifications].sort().join(", ")}; severity: ${[...issue.severities].sort().join(", ")}; level(s): ${[...issue.levels].sort().join(", ") || "not recorded"}; ID(s): ${[...issue.ids].sort().join(", ") || "not recorded"}. Recorded observations: ${observations}`;
  });
}

export function aggregateParticipants(files) {
  const complete = files.filter((item) => item.status === "COMPLETED");
  const resourceCost = { noticed: new Map(), understood: new Map(), used: new Map(), misunderstood: new Map() };
  const costByLevel = new Map();
  const lockCounts = new Map();
  const locksByChoice = new Map();
  const delayedCounts = new Map();
  const delayedRemembered = new Map();
  const delayedById = new Map();
  const endingCounts = new Map();
  const replayCounts = new Map();
  const revisitCounts = new Map();

  for (const participant of complete) {
    for (const stage of participant.stages ?? []) {
      const cost = stage.resource_cost ?? {};
      incrementBoolean(resourceCost.noticed, cost.noticed, "resource_cost.noticed", participant.participant_id);
      incrementBoolean(resourceCost.understood, cost.understood_resource, "resource_cost.understood_resource", participant.participant_id);
      incrementBoolean(resourceCost.used, cost.used_in_decision, "resource_cost.used_in_decision", participant.participant_id);
      incrementBoolean(resourceCost.misunderstood, cost.misunderstood_meaning, "resource_cost.misunderstood_meaning", participant.participant_id);
      const stageCost = costByLevel.get(stage.level_id) ?? { noticed: new Map(), understood: new Map(), used: new Map(), misunderstood: new Map() };
      incrementBoolean(stageCost.noticed, cost.noticed, "resource_cost.noticed", participant.participant_id);
      incrementBoolean(stageCost.understood, cost.understood_resource, "resource_cost.understood_resource", participant.participant_id);
      incrementBoolean(stageCost.used, cost.used_in_decision, "resource_cost.used_in_decision", participant.participant_id);
      incrementBoolean(stageCost.misunderstood, cost.misunderstood_meaning, "resource_cost.misunderstood_meaning", participant.participant_id);
      if (stage.level_id) costByLevel.set(stage.level_id, stageCost);
      for (const lock of stage.locked_options ?? []) {
        incrementEnum(lockCounts, lock.classification, lockClasses, "lock classification", participant.participant_id);
        if (lock.choice_id && lock.classification) {
          const byChoice = locksByChoice.get(lock.choice_id) ?? new Map();
          increment(byChoice, lock.classification);
          locksByChoice.set(lock.choice_id, byChoice);
        }
      }
    }
    for (const consequence of participant.delayed_consequences ?? []) {
      incrementEnum(delayedCounts, consequence.classification, consequenceClasses, "delayed-consequence classification", participant.participant_id);
      incrementBoolean(delayedRemembered, consequence.remembered_origin_choice, "remembered_origin_choice", participant.participant_id);
      if (consequence.consequence_id) {
        const byId = delayedById.get(consequence.consequence_id) ?? { classifications: new Map(), remembered: new Map() };
        increment(byId.classifications, consequence.classification);
        incrementBoolean(byId.remembered, consequence.remembered_origin_choice, "remembered_origin_choice", participant.participant_id);
        delayedById.set(consequence.consequence_id, byId);
      }
    }
    incrementEnum(endingCounts, participant.ending?.comprehension_after_reading, endingClasses, "ending comprehension", participant.participant_id);
    incrementEnum(replayCounts, participant.replay?.intent, replayIntents, "replay intent", participant.participant_id);
    increment(revisitCounts, participant.replay?.choice_id_to_change);
  }

  const participantIds = complete.map((item) => item.participant_id).sort();
  const lines = [
    "# Founder v1 human playtest aggregate",
    "",
    `- Result files found: ${files.length}`,
    `- Completed participants included: ${complete.length}`,
    `- Incomplete files excluded: ${files.length - complete.length}`,
    `- Participant IDs included: ${participantIds.length ? participantIds.map((id) => `\`${id}\``).join(", ") : "None"}`,
    "",
  ];

  if (complete.length === 0) {
    lines.push("## Empty state", "", "No completed participant results were found. No feedback has been inferred or synthesized.", "", "Copy a file from `templates/` to `results/`, complete it during a session, set `status` to `COMPLETED`, then run the aggregator again.");
    return lines.join("\n");
  }

  lines.push("## Resource-cost comprehension", "", renderCounts("Cost noticed (true/false)", resourceCost.noticed, [true, false]), "", renderCounts("Resource understood (true/false)", resourceCost.understood, [true, false]), "", renderCounts("Cost used in decision (true/false)", resourceCost.used, [true, false]), "", renderCounts("Meaning misunderstood (true/false)", resourceCost.misunderstood, [true, false]), "", "### By decision stage", "");
  for (const [levelId, counts] of sortedEntries(costByLevel)) {
    lines.push(`#### \`${levelId}\``, "", renderCounts("Cost noticed", counts.noticed, [true, false]), "", renderCounts("Resource understood", counts.understood, [true, false]), "", renderCounts("Cost used in decision", counts.used, [true, false]), "", renderCounts("Meaning misunderstood", counts.misunderstood, [true, false]), "");
  }
  lines.push("## Lock comprehension", "", renderCounts("All encountered locks", lockCounts, lockClasses), "", "### By choice ID", "");
  if (locksByChoice.size === 0) lines.push("No lock classifications recorded.", "");
  for (const [choiceId, counts] of sortedEntries(locksByChoice)) lines.push(`#### \`${choiceId}\``, "", renderCounts("Classifications", counts, lockClasses), "");
  lines.push("## Delayed-consequence comprehension", "", renderCounts("All connection classifications", delayedCounts, consequenceClasses), "", renderCounts("Remembered originating choice (true/false)", delayedRemembered, [true, false]), "", "### By consequence ID", "");
  if (delayedById.size === 0) lines.push("No delayed-consequence classifications recorded.", "");
  for (const [consequenceId, counts] of sortedEntries(delayedById)) lines.push(`#### \`${consequenceId}\``, "", renderCounts("Connection classifications", counts.classifications, consequenceClasses), "", renderCounts("Remembered originating choice", counts.remembered, [true, false]), "");
  lines.push("## Ending comprehension", "", renderCounts("After-reading classification", endingCounts, endingClasses), "");
  lines.push("## Replay intent", "", renderCounts("Intent", replayCounts, replayIntents), "", "### Most requested decision to revisit", "");
  const topRevisit = sortedEntries(revisitCounts).sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
  if (!topRevisit.length) lines.push("No decision to revisit was recorded.");
  else {
    const topCount = topRevisit[0][1];
    for (const [choiceId, count] of topRevisit.filter(([, value]) => value === topCount)) lines.push(`- \`${choiceId}\`: ${count}`);
  }
  lines.push("", "## Repeated issues", "");
  const issues = summarizeIssues(complete);
  lines.push(...(issues.length ? issues : ["No issue entries were recorded."]));
  lines.push("", "Missing or null answers were excluded from response counts. Similar issue text was not merged; repeated problems are grouped only by the explicitly recorded `issue_key`.");
  return lines.join("\n");
}

async function readParticipantFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const files = [];
  const ids = new Set();
  for (const entry of entries.filter((item) => item.isFile() && /^participant_0[1-5]\.json$/i.test(item.name)).sort((a, b) => a.name.localeCompare(b.name))) {
    const filePath = path.join(directory, entry.name);
    let result;
    try {
      result = JSON.parse(await readFile(filePath, "utf8"));
    } catch (error) {
      throw new Error(`Cannot read ${filePath}: ${error.message}`);
    }
    if (!/^participant_0[1-5]$/.test(result.participant_id ?? "")) throw new Error(`${filePath}: participant_id must use participant_01 through participant_05 format.`);
    if (entry.name.toLowerCase() !== `${result.participant_id}.json`) throw new Error(`${filePath}: filename must match participant_id.`);
    if (ids.has(result.participant_id)) throw new Error(`Duplicate participant_id: ${result.participant_id}.`);
    if (!["NOT_STARTED", "IN_PROGRESS", "COMPLETED"].includes(result.status)) throw new Error(`${filePath}: status must be NOT_STARTED, IN_PROGRESS, or COMPLETED.`);
    ids.add(result.participant_id);
    files.push(result);
  }
  return files;
}

function parseArguments(args) {
  const options = { input: defaultResultsDirectory, output: null };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--input" && args[index + 1]) options.input = path.resolve(args[++index]);
    else if (args[index] === "--output" && args[index + 1]) options.output = path.resolve(args[++index]);
    else throw new Error(`Unknown or incomplete argument: ${args[index]}`);
  }
  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const files = await readParticipantFiles(options.input);
  const report = aggregateParticipants(files);
  if (options.output) await writeFile(options.output, `${report}\n`, "utf8");
  else process.stdout.write(`${report}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
