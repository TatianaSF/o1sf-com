import { brotliCompressSync, gzipSync } from "node:zlib";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

import {
  PUBLIC_KNOWLEDGE_BASE_FILENAME,
  RAW_KNOWLEDGE_BASE_FILENAME,
  validatePublicKnowledgeBase,
} from "./generate-public-kb.mjs";

const root = process.cwd();
const outputRoot = path.join(root, "out");
const routeRoot = path.join(outputRoot, "ask_document");
const routeIndex = path.join(routeRoot, "index.html");
const publicDataPath = path.join(routeRoot, PUBLIC_KNOWLEDGE_BASE_FILENAME);
const forbiddenMarkers = [
  RAW_KNOWLEDGE_BASE_FILENAME,
  '"internal_metadata"',
  '"publication_block_reason"',
  '"content_gaps"',
  '"excluded_candidates"',
  '"review_note"',
  '"review_required"',
  '"evidence_type"',
  '"source_excerpt"',
  '"source_document"',
];
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".txt",
  ".webmanifest",
  ".xml",
]);

await Promise.all([stat(routeIndex), stat(publicDataPath)]);
const routeHtml = await readFile(routeIndex, "utf8");
if (!/noindex/i.test(routeHtml) || !/nofollow/i.test(routeHtml)) {
  throw new Error("The Ask Document route is missing noindex, nofollow metadata.");
}

const publicBuffer = await readFile(publicDataPath);
const publicData = validatePublicKnowledgeBase(JSON.parse(publicBuffer.toString("utf8")));
const leaks = [];
const sourceMaps = [];

for await (const file of walk(outputRoot)) {
  const extension = path.extname(file).toLowerCase();
  if (extension === ".map") sourceMaps.push(path.relative(outputRoot, file));
  if (!textExtensions.has(extension)) continue;
  const body = await readFile(file, "utf8");
  forbiddenMarkers.forEach((marker) => {
    if (body.includes(marker)) {
      leaks.push(`${path.relative(outputRoot, file)} contains ${marker}`);
    }
  });
}

if (leaks.length) {
  throw new Error(`Build-output data leakage detected:\n${leaks.join("\n")}`);
}

console.log(
  `Verified ${publicData.questions.length} questions, ${publicData.categories.length} categories, and ${publicData.navigation.nodes.length} nodes in out/ask_document/.`,
);
console.log(
  `Public dataset sizes: ${publicBuffer.length} bytes raw, ${gzipSync(publicBuffer).length} bytes gzip, ${brotliCompressSync(publicBuffer).length} bytes Brotli.`,
);
console.log(`Source maps found in output: ${sourceMaps.length}.`);
console.log("No raw filename or excluded internal field markers were found in out/.");

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* walk(fullPath);
    else yield fullPath;
  }
}
