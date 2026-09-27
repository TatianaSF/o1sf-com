import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const runtimeFileExtensions = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const forbiddenPatterns = [
  {
    code: "llm_sdk_import",
    pattern: /\b(?:from|import|require)\s*(?:\(\s*)?["'](?:openai|@openai\/[^"']+|@anthropic-ai\/[^"']+|anthropic|ai|@ai-sdk\/[^"']+|@cloudflare\/ai|ollama|@huggingface\/[^"']+|@xenova\/transformers|onnxruntime-node)(?:\/[^"']*)?["']/i,
    reason: "AI Future Sim runtime code cannot import a model or generative-AI SDK.",
  },
  {
    code: "runtime_generation_call",
    pattern: /\b(?:generateText|generateObject|streamText|streamObject|generateContent|generateCompletion|createChatCompletion|generateImage|embedMany)\s*\(/,
    reason: "AI Future Sim runtime cannot generate content or call a model generation API.",
  },
  {
    code: "model_provider_endpoint",
    pattern: /https?:\/\/(?:api\.openai\.com|api\.anthropic\.com|generativelanguage\.googleapis\.com|api\.cohere\.ai|api\.mistral\.ai|api\.together\.xyz|api\.groq\.com)(?:[/:"'`]|\b)/i,
    reason: "AI Future Sim runtime cannot call a hosted model provider endpoint.",
  },
  {
    code: "embedded_model_import",
    pattern: /\b(?:from|import|require)\s*(?:\(\s*)?["'](?:@tensorflow\/|@huggingface\/|@xenova\/|onnxruntime(?:-web|-node)?|transformers\.js)(?:[^"']*)["']/i,
    reason: "AI Future Sim runtime must not embed or execute a client-side model.",
  },
];

export function inspectAiFutureSimRuntimeSource(source, filePath = "<source>") {
  return forbiddenPatterns.flatMap(({ code, pattern, reason }) => {
    const match = pattern.exec(source);
    return match ? [{ code, filePath, match: match[0], reason }] : [];
  });
}

async function collectRuntimeFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectRuntimeFiles(fullPath));
    else if (entry.isFile() && runtimeFileExtensions.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

export async function scanAiFutureSimRuntime(projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")) {
  const sourceRoots = [
    "features/ai-future-sim",
    "app/ai-future-sim",
    "cloudflare/ai-future-sim-api/src",
  ];
  const sourceFiles = (await Promise.all(sourceRoots.flatMap((relativePath) =>
    collectRuntimeFiles(path.join(projectRoot, relativePath)),
  ))).flat();
  const violations = [];
  for (const filePath of sourceFiles) {
    const source = await readFile(filePath, "utf8");
    violations.push(...inspectAiFutureSimRuntimeSource(source, path.relative(projectRoot, filePath)));
  }
  return { valid: violations.length === 0, scannedFiles: sourceFiles.length, violations };
}
