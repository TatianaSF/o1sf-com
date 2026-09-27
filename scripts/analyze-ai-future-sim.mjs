import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { analyzeScenarioBalance } from "../features/ai-future-sim/analysis/analyze-scenario.js";
import { loadAiFutureSimScenarios } from "./validate-ai-future-sim.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function createYear5AgencyReport(report) {
  const year5 = report.decisionStateAgency.byLevel.find((level) => level.id === "second_order_effects");
  const states = report.decisionStateAgency.lowAgencyStates.filter((item) => item.levelId === "second_order_effects");
  const low = states.length;
  const forced = states.filter((item) => item.availableCount === 1);
  const display = (value) => Object.entries(value).map(([key, item]) => `${key}=${item}`).join(", ");
  const reasonDisplay = (choice) => choice.reasons.map((reason) => `${reason.code} (${reason.targetId}: ${reason.actualValue} ${reason.operator} ${reason.requiredValue ?? "required"}; ${reason.message})`).join("; ") || choice.message;
  const rows = states.map((state) => [
    state.stateId,
    state.history.map((entry) => entry.choiceId).join(" → "),
    state.availableCount,
    state.availableChoices.join(", "),
    state.lockedChoices.map((choice) => `${choice.id}: ${reasonDisplay(choice)}`).join(" | "),
    display(state.resources),
    display(state.worldState),
  ]);
  return [
    "# Founder v1 Year 5 Agency Diagnostics",
    "",
    `Scenario \`${report.scenario.id}\` version \`${report.scenario.version}\`; exhaustive deterministic traversal through the production engine.`,
    "",
    `Year 5 states: **${year5.stateCount}**. Fewer than three options: **${low}** (${(low / year5.stateCount * 100).toFixed(2)}%). Single-choice states: **${forced.length}**.`,
    "",
    "These states are diagnostics, not an automatic rebalance recommendation. Each row records the exact decision history, resources, world state, available options, and deterministic lock reasons.",
    "",
    "## All low-agency states",
    "",
    "| State | Decision history | Available count | Available choices | Locked choices and reasons | Resources | World state |",
    "| --- | --- | ---: | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row.map((cell) => String(cell).replaceAll("|", "\\|")).join(" | ")} |`),
    "",
    "## Single-choice states",
    "",
    forced.length ? forced.map((state, index) => [
      `### ${index + 1}. ${state.stateId}`,
      "",
      `History: ${state.history.map((entry) => `\`${entry.choiceId}\``).join(" → ")}`,
      `Only available: \`${state.availableChoices[0]}\`.`,
      `Resources: ${display(state.resources)}.`,
      `World state: ${display(state.worldState)}.`,
      "Locked:",
      ...state.lockedChoices.map((choice) => `- \`${choice.id}\`: ${reasonDisplay(choice)}`),
      "",
    ].join("\n")).join("\n") : "No single-choice states.",
    "",
  ].join("\n");
}

function createEndingPriorityReport(report) {
  const review = report.endingPriorityReview;
  const order = review.evaluationOrder.map((ending) => [ending.priority, ending.id, ending.fallback ? "fallback" : ending.conditionIds.join(", ")]);
  const matches = review.prePriorityMatchSetDistribution.map((item) => [item.matchingEndingIds.join(" + ") || "fallback only", item.pathCount, `${item.pathPercent.toFixed(2)}%`]);
  const selected = report.endingDistribution.map((ending) => [ending.id, ending.pathCount, `${ending.pathPercent.toFixed(2)}%`]);
  return [
    "# Founder v1 Ending Priority Review",
    "",
    "The production resolver selects the first matching authored condition set; the final Adaptive Mixed outcome is unconditional fallback.",
    "",
    `Final states satisfying more than one conditional ending before priority: **${review.multiMatchPathCount}**. Fallback selected: **${review.selectedFallbackPathCount}** paths. The unconditional fallback is excluded from the multi-match count.`,
    "",
    "## Evaluation order",
    "",
    "| Priority | Ending ID | Conditions |",
    "| ---: | --- | --- |",
    ...order.map((row) => `| ${row.join(" | ")} |`),
    "",
    "## Pre-priority condition match sets",
    "",
    "| Matching outcomes | Paths | Share |",
    "| --- | ---: | ---: |",
    ...matches.map((row) => `| ${row.join(" | ")} |`),
    "",
    "## Selected ending after priority resolution",
    "",
    "| Ending ID | Selected paths | Share |",
    "| --- | ---: | ---: |",
    ...selected.map((row) => `| ${row.join(" | ")} |`),
    "",
  ].join("\n");
}

function createDelayedConsequenceReport(report, scenario) {
  const choices = new Map(scenario.levels.flatMap((level) => (level.choices ?? []).map((choice) => [choice.id, { level, choice }])));
  const lines = [
    "# Founder v1 Delayed Consequence Playtest Reference",
    "",
    "Every reveal is authored and deterministic. Registration occurs when its originating choice is selected; user-facing reveal copy appears only on the authored reveal stage.",
    "",
  ];
  for (const metric of report.delayedConsequences) {
    const source = choices.get(metric.originChoiceId);
    const consequence = source.choice.delayedConsequences.find((item) => item.id === metric.id);
    const downstream = metric.laterOptionChangedPathCount > 0 || metric.endingChangedPathCount > 0
      ? "Changes later option availability or ending in at least one counterfactual path."
      : "No measured later option-availability or ending change in the counterfactual review.";
    let assessment = metric.laterOptionChangedPathCount > 0 || metric.endingChangedPathCount > 0
      ? "Meaningful downstream consequence; inspect its option and ending impact in the reported counterfactual counts."
      : metric.conditionCrossingPathCount > 0
        ? "Meaningful state consequence: it crosses at least one authored condition on some reveal paths, although measured option/ending changes are listed separately."
        : "Narrative/state consequence only in this traversal: no declared condition crossing or later option/ending change was measured.";
    if (metric.id === "fallback_readiness") {
      assessment = "Weak consequence in mechanical leverage, with a legible resilience narrative: auditing failure points and naming owners creates a manual fallback. It appears on 107 paths and changes displayed employment_resilience, but no later option or ending. Keep in v1; candidate for Founder v2 only if playtesters find the relationship inert.";
    }
    const frequencyFlag = metric.revealPercent < 5 ? "Low-frequency reveal: review whether its path is understandable." : metric.revealPercent >= 50 ? "Frequent reveal." : "No frequency anomaly by the 5% / 50% review markers.";
    const magnitudeFlag = metric.effects.some((effect) => Math.abs(effect.delta) >= 3) ? "Large per-reveal state delta (3 or more); verify it feels proportionate." : "No single effect delta reaches 3 state points.";
    lines.push(
      `## ${metric.id}`,
      "",
      `- Originating choice: \`${metric.originChoiceId}\` at ${source.level.title} (\`${metric.originLevelId}\`).`,
      `- Causal setup: ${source.choice.description} Outcome: ${source.choice.outcome}`,
      `- Registration: when \`${metric.originChoiceId}\` is selected at ${source.level.title}.`,
      `- Reveal: ${consequence.activation.levelId} (\`${metric.revealLevelId}\`); ${metric.revealPathCount} paths (${metric.revealPercent.toFixed(2)}%).`,
      `- Player-facing title: ${consequence.title}`,
      `- Player-facing text: ${consequence.description}`,
      `- State effects: ${consequence.effects.map((effect) => `${effect.target}.${effect.key} ${effect.delta > 0 ? "+" : ""}${effect.delta}`).join("; ")}.`,
      `- Later options changed: ${metric.laterOptionChangedPathCount} paths; endings changed: ${metric.endingChangedPathCount} paths. ${downstream}`,
      `- Frequency/magnitude screen: ${frequencyFlag} ${magnitudeFlag}`,
      `- Review: ${assessment}`,
      "",
    );
  }
  return lines.join("\n");
}

function createMarkdownReport(report) {
  const pct = (value) => `${value.toFixed(2)}%`;
  const rows = (headers, values) => [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...values.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
  const endingRows = report.endingDistribution.map((ending) => [ending.title, ending.pathCount, pct(ending.pathPercent), ending.conditionMatchPathCount]);
  const levelRows = report.decisionStateAgency.byLevel.map((level) => [level.title, level.stateCount, level.minAvailableChoices, level.averageAvailableChoices, level.fewerThanThreeAvailableStateCount]);
  const choiceRows = report.choiceAvailability.map((choice) => [choice.levelId, choice.id, choice.availableStateCount, choice.lockedStateCount, choice.selectedPathCount]);
  const rangeRows = (ranges) => Object.entries(ranges).map(([key, range]) => [key, range.min, range.max, range.mean]);
  const warnings = report.warnings.length
    ? report.warnings.map((warning) => `- **${warning.code}**${warning.levelId ? ` (${warning.levelId})` : ""}: ${warning.message}`).join("\n")
    : "No automated warnings.";

  return [
    `# AI Future Sim Founder Balance Report`,
    "",
    `Generated deterministically from scenario \`${report.scenario.id}\` version \`${report.scenario.version ?? "unversioned"}\`.`,
    "",
    "## Reachable graph",
    "",
    `- Complete decision paths: **${report.pathAnalysis.totalReachableCompletePaths}**` ,
    `- Decision-state visits: **${report.pathAnalysis.decisionStateVisitCount}**` ,
    `- Decision nodes / authored choices: **${report.pathAnalysis.decisionNodeCount} / ${report.pathAnalysis.authoredChoiceCount}**` ,
    `- Graph nodes / endings: **${report.pathAnalysis.graphNodeCount} / ${report.pathAnalysis.endingCount}**` ,
    "",
    "## Ending distribution",
    "",
    rows(["Ending", "Paths", "Share", "Paths satisfying ending conditions"], endingRows),
    "",
    "Condition matches can overlap. The engine selects the first matching ending in authored priority order; the final entry is the fallback.",
    "",
    "### Overlapping ending conditions",
    "",
    report.endingConditionOverlaps.length
      ? rows(["Matching endings", "Paths", "Share"], report.endingConditionOverlaps.map((item) => [item.endingIds.join(" + "), item.pathCount, pct(item.pathPercent)]))
      : "No outcome-condition overlaps were observed.",
    "",
    "## Choice availability",
    "",
    rows(["Decision", "States", "Min available", "Mean available", "States with fewer than 3"], levelRows),
    "",
    "### Per-choice frequencies",
    "",
    rows(["Level ID", "Choice ID", "Available states", "Locked states", "Complete paths selecting choice"], choiceRows),
    "",
    "### Most common Year 5 option sets",
    "",
    ...report.decisionStateAgency.byLevel.filter((level) => level.id === "second_order_effects").flatMap((level) => [
      rows(["Available choice IDs", "State visits"], level.mostCommonAvailableChoiceSets.map((item) => [item.choiceIds.join(", ") || "(none)", item.stateCount])),
      "",
      `Single-choice states by only available option: ${Object.entries(level.forcedChoiceCounts).map(([choiceId, count]) => `\`${choiceId}\` (${count})`).join(", ") || "none"}.`,
    ]),
    "",
    "## Delayed consequences",
    "",
    rows(["Consequence ID", "Origin choice", "Reveal level", "Paths revealed", "Share", "Condition crossings", "Paths with later option changes", "Paths with ending changes"], report.delayedConsequences.map((item) => [item.id, item.originChoiceId, item.revealLevelId, item.revealPathCount, pct(item.revealPercent), item.conditionCrossingPathCount, item.laterOptionChangedPathCount, item.endingChangedPathCount])),
    "",
    "Reveal counts are complete-path frequencies. A condition crossing means applying the delayed effect changed at least one declared condition from false to true or true to false at reveal time. Counterfactual later-option and ending counts remove only this consequence's effects while keeping the same decision history, then compare later option availability and the selected ending.",
    "",
    "## Final state ranges",
    "",
    "### World state",
    "",
    rows(["Dimension", "Min", "Max", "Mean"], rangeRows(report.finalWorldStateRanges)),
    "",
    "### Resources",
    "",
    rows(["Resource", "Min", "Max", "Mean"], rangeRows(report.finalResourceRanges)),
    "",
    "## Ending priority boundary screen",
    "",
    "A path is marked near a higher-priority ending when at least one failed numeric predicate is at most one point from its threshold. This is a review signal; multiple predicates and historical conditions can still prevent that ending.",
    "",
    rows(["Higher priority", "Selected ending", "Paths", "Near threshold", "Minimum numeric gap"], report.endingBoundaryReview.map((item) => [item.higherPriorityEndingId, item.selectedEndingId, item.pathCount, `${item.nearThresholdPathCount} (${pct(item.nearThresholdPercent)})`, item.minObservedNumericGap])),
    "",
    "## Automated warnings",
    "",
    warnings,
    "",
  ].join("\n");
}

export async function generateBalanceReports(root = projectRoot) {
  const { scenarios, loadErrors } = await loadAiFutureSimScenarios(root);
  if (loadErrors.length) throw new Error(loadErrors.map((error) => `${error.sourceEntity}: ${error.reason}`).join("\n"));
  const reports = scenarios.map(analyzeScenarioBalance);
  const outputDirectory = path.join(root, "features/ai-future-sim/reports");
  await mkdir(outputDirectory, { recursive: true });
  for (const report of reports) {
    const stem = report.scenario.id.replaceAll(/[^a-z0-9_-]/g, "_");
    await writeFile(path.join(outputDirectory, `${stem}-balance.json`), `${JSON.stringify(report, null, 2)}\n`, "utf8");
    await writeFile(path.join(outputDirectory, `${stem}-balance.md`), createMarkdownReport(report), "utf8");
    if (report.scenario.id === "founder_ai_organization") {
      await writeFile(path.join(outputDirectory, `${stem}-playtest-diagnostics.json`), `${JSON.stringify({ scenario: report.scenario, lowAgencyStateCount: report.decisionStateAgency.lowAgencyStates.length, lowAgencyStates: report.decisionStateAgency.lowAgencyStates }, null, 2)}\n`, "utf8");
      await writeFile(path.join(outputDirectory, `${stem}-year5-agency.md`), createYear5AgencyReport(report), "utf8");
      await writeFile(path.join(outputDirectory, `${stem}-ending-priority.md`), createEndingPriorityReport(report), "utf8");
      await writeFile(path.join(outputDirectory, `${stem}-delayed-consequences.md`), createDelayedConsequenceReport(report, scenarios.find((scenario) => scenario.id === report.scenario.id)), "utf8");
    }
  }
  return reports;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const reports = await generateBalanceReports();
  for (const report of reports) {
    console.log(`Analyzed ${report.scenario.id}: ${report.pathAnalysis.totalReachableCompletePaths} complete paths, ${report.endingDistribution.length} endings.`);
  }
}
