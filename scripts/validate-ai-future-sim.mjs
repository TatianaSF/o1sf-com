import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { validateScenarios } from "../features/ai-future-sim/content/validate-scenario.js";
import { validateLocaleCompleteness } from "../features/ai-future-sim/i18n/index.js";
import { scanAiFutureSimRuntime } from "./ai-future-sim-runtime-guard.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function loadAiFutureSimScenarios(root = projectRoot) {
  const scenarioDirectory = path.join(root, "features/ai-future-sim/content/scenarios");
  const files = (await readdir(scenarioDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".scenario.js"))
    .map((entry) => entry.name)
    .sort();
  const scenarios = [];
  const loadErrors = [];

  for (const fileName of files) {
    try {
      const moduleUrl = pathToFileURL(path.join(scenarioDirectory, fileName)).href;
      const scenarioModule = await import(moduleUrl);
      if (!scenarioModule.default) {
        loadErrors.push({
          code: "missing_default_scenario_export",
          sourceEntity: `file:${fileName}`,
          field: "default",
          referencedId: null,
          reason: "Scenario modules must default-export one scenario record.",
        });
      } else {
        scenarios.push(scenarioModule.default);
      }
    } catch (error) {
      loadErrors.push({
        code: "scenario_import_failed",
        sourceEntity: `file:${fileName}`,
        field: "module",
        referencedId: null,
        reason: error instanceof Error ? error.message : "Scenario module could not be loaded.",
      });
    }
  }

  if (files.length === 0) {
    loadErrors.push({
      code: "no_scenarios_found",
      sourceEntity: "scenario_collection",
      field: "content/scenarios",
      referencedId: null,
      reason: "Add scenario modules using the *.scenario.js naming convention.",
    });
  }

  return { scenarios, loadErrors };
}

export async function validateAiFutureSimProject(root = projectRoot) {
  const { scenarios, loadErrors } = await loadAiFutureSimScenarios(root);
  const content = validateScenarios(scenarios);
  const localizationErrors = scenarios.flatMap((scenario) => validateLocaleCompleteness(scenario).missing.map((field) => ({
    code: "missing_russian_localization",
    sourceEntity: `scenario:${scenario.id}`,
    field,
    referencedId: null,
    reason: "Every normal player-facing English string must have authored Russian copy for the hidden ?ru mode.",
  })));
  const runtimeGuard = await scanAiFutureSimRuntime(root);
  const runtimeErrors = runtimeGuard.violations.map((violation) => ({
    code: violation.code,
    sourceEntity: `file:${violation.filePath}`,
    field: "runtime_source",
    referencedId: violation.match,
    reason: violation.reason,
  }));
  const errors = [...loadErrors, ...content.errors, ...localizationErrors, ...runtimeErrors];
  return {
    valid: errors.length === 0,
    scenarios,
    content,
    localizationErrors,
    runtimeGuard,
    errors,
    warnings: content.warnings,
  };
}

function printIssues(label, issues) {
  for (const issue of issues) {
    const reference = issue.referencedId == null ? "" : ` ref=${issue.referencedId}`;
    console.error(`${label} ${issue.code} ${issue.sourceEntity}.${issue.field}${reference}: ${issue.reason}`);
  }
}

async function main() {
  const result = await validateAiFutureSimProject();
  if (!result.valid) {
    printIssues("ERROR", result.errors);
    printIssues("WARNING", result.warnings);
    process.exitCode = 1;
    return;
  }
  console.log(`Validated ${result.scenarios.length} AI Future Sim scenario(s).`);
  for (const scenarioResult of result.content.results) {
    console.log(
      `PASS ${scenarioResult.graph.startNodeId}: ${scenarioResult.graph.reachableNodeIds.length} reachable node(s), ` +
      `${scenarioResult.graph.terminalNodeIds.length} terminal node(s), ${scenarioResult.graph.cycles.length} cycle(s).`,
    );
  }
  console.log(`No-LLM runtime guard passed across ${result.runtimeGuard.scannedFiles} product source file(s).`);
  console.log("Hidden Russian player-copy completeness passed.");
  printIssues("WARNING", result.warnings);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
