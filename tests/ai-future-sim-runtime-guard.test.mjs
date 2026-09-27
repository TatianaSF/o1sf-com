import assert from "node:assert/strict";
import test from "node:test";

import {
  inspectAiFutureSimRuntimeSource,
  scanAiFutureSimRuntime,
} from "../scripts/ai-future-sim-runtime-guard.mjs";

test("current AI Future Sim runtime sources have no LLM or embedded-model dependency", async () => {
  const result = await scanAiFutureSimRuntime();
  assert.equal(result.valid, true, JSON.stringify(result.violations, null, 2));
  assert.ok(result.scannedFiles > 0);
});

test("runtime guard rejects model SDK imports and content-generation calls", () => {
  const samples = [
    'import OpenAI from "openai";',
    'import { generateText } from "ai";',
    'const result = await generateText({ model, prompt });',
    'fetch("https://api.openai.com/v1/responses");',
    'import { pipeline } from "@xenova/transformers";',
  ];

  for (const source of samples) {
    assert.ok(inspectAiFutureSimRuntimeSource(source).length > 0, source);
  }
});

test("runtime guard allows ordinary deterministic code and internal API paths", () => {
  const source = [
    'import { advanceStep } from "../engine/index.js";',
    'const response = await fetch("/api/ai-future-sim/session");',
    'const nextState = advanceStep(scenario, state);',
  ].join("\n");
  assert.deepEqual(inspectAiFutureSimRuntimeSource(source), []);
});
