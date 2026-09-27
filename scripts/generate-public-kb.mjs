import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const RAW_KNOWLEDGE_BASE_FILENAME =
  "v1.0_o1sf_us_market_entry_knowledge_base.json";
export const PUBLIC_KNOWLEDGE_BASE_FILENAME =
  "knowledge-base.v1.0.0.public.json";

export const forbiddenPublicKeys = new Set([
  "audience_tags",
  "change_log",
  "content_gaps",
  "evidence",
  "evidence_type",
  "excluded_candidates",
  "fact_status",
  "has_source_conflict",
  "inference_note",
  "internal_metadata",
  "is_published",
  "is_time_sensitive",
  "last_verified_date",
  "priority_score",
  "production_ready",
  "publication_block_reason",
  "publication_status",
  "review_note",
  "review_required",
  "source",
  "source_document",
  "source_document_date",
  "source_document_version",
  "source_excerpt",
  "sources",
  "validation",
  "validation_errors",
]);

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const defaultInputPath = path.join(
  projectRoot,
  "private-input",
  RAW_KNOWLEDGE_BASE_FILENAME,
);
const defaultOutputPath = path.join(
  projectRoot,
  "public",
  "ask_document",
  PUBLIC_KNOWLEDGE_BASE_FILENAME,
);

function fail(message) {
  throw new Error(`Knowledge base validation failed: ${message}`);
}

function requireCondition(condition, message) {
  if (!condition) fail(message);
}

function requireObject(value, label) {
  requireCondition(
    value && typeof value === "object" && !Array.isArray(value),
    `${label} must be an object.`,
  );
  return value;
}

function requireString(value, label) {
  requireCondition(
    typeof value === "string" && value.trim().length > 0,
    `${label} must be a non-empty string.`,
  );
  return value;
}

function requireStringArray(value, label) {
  requireCondition(Array.isArray(value), `${label} must be an array.`);
  value.forEach((item, index) => requireString(item, `${label}[${index}]`));
  return [...value];
}

function ensureUnique(values, label) {
  requireCondition(
    new Set(values).size === values.length,
    `${label} must contain unique values.`,
  );
}

function valuesById(record, label, idField) {
  requireObject(record, label);
  const values = Object.entries(record).map(([key, value]) => {
    requireObject(value, `${label}.${key}`);
    requireCondition(value[idField] === key, `${label}.${key}.${idField} must equal ${key}.`);
    return value;
  });
  return values.sort((first, second) =>
    String(first[idField]).localeCompare(String(second[idField]), "en"),
  );
}

function safeAction(action, questionId) {
  if (!action || !action.action_url) return undefined;

  requireObject(action, `questions.${questionId}.public_content.action`);
  const url = requireString(
    action.action_url,
    `questions.${questionId}.public_content.action.action_url`,
  );
  const isSafeHttps = /^https:\/\//i.test(url);
  const isSafeRelative = /^\/(?!\/)/.test(url);
  requireCondition(
    isSafeHttps || isSafeRelative,
    `questions.${questionId} has an unsafe action URL.`,
  );

  return {
    action_type: requireString(action.action_type, `questions.${questionId}.action_type`),
    action_label: requireString(action.action_label, `questions.${questionId}.action_label`),
    action_url: url,
  };
}

function collectForbiddenKeyPaths(value, currentPath = "$", findings = []) {
  if (!value || typeof value !== "object") return findings;

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectForbiddenKeyPaths(item, `${currentPath}[${index}]`, findings),
    );
    return findings;
  }

  Object.entries(value).forEach(([key, child]) => {
    const childPath = `${currentPath}.${key}`;
    if (forbiddenPublicKeys.has(key)) findings.push(childPath);
    collectForbiddenKeyPaths(child, childPath, findings);
  });
  return findings;
}

export function validatePublicKnowledgeBase(publicData) {
  requireObject(publicData, "public dataset");
  requireCondition(publicData.metadata?.total_questions === 300, "public total_questions must be 300.");
  requireCondition(publicData.metadata?.total_categories === 12, "public total_categories must be 12.");
  requireCondition(publicData.questions?.length === 300, "public questions must contain 300 records.");
  requireCondition(publicData.categories?.length === 12, "public categories must contain 12 records.");
  requireCondition(publicData.navigation?.nodes?.length === 300, "public navigation nodes must contain 300 records.");

  const forbiddenPaths = collectForbiddenKeyPaths(publicData);
  requireCondition(
    forbiddenPaths.length === 0,
    `public data contains excluded keys: ${forbiddenPaths.join(", ")}`,
  );

  return publicData;
}

export function buildPublicKnowledgeBase(rawData) {
  requireObject(rawData, "root");
  const metadata = requireObject(rawData.metadata, "metadata");
  const schema = requireObject(rawData.schema, "schema");
  const categories = valuesById(rawData.categories, "categories", "id").sort(
    (first, second) => first.display_order - second.display_order || first.id.localeCompare(second.id),
  );
  const questions = valuesById(rawData.questions, "questions", "id");
  const navigation = requireObject(rawData.navigation, "navigation");
  const nodes = valuesById(navigation.nodes, "navigation.nodes", "node_id");

  requireCondition(categories.length === 12, "exactly 12 categories are required.");
  requireCondition(questions.length === 300, "exactly 300 questions are required.");
  requireCondition(nodes.length === 300, "exactly 300 navigation nodes are required.");
  requireCondition(metadata.total_categories === 12, "metadata.total_categories must be 12.");
  requireCondition(metadata.total_questions === 300, "metadata.total_questions must be 300.");
  requireCondition(navigation.max_depth <= 4, "navigation.max_depth must not exceed 4.");

  ensureUnique(categories.map((category) => category.id), "category IDs");
  ensureUnique(questions.map((question) => question.id), "question IDs");
  ensureUnique(questions.map((question) => question.slug), "question slugs");
  ensureUnique(nodes.map((node) => node.node_id), "navigation node IDs");

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const nodeById = new Map(nodes.map((node) => [node.node_id, node]));
  const allowedNextCounts = new Set(schema.allowed_next_question_counts);
  const startCategoryIds = requireStringArray(
    navigation.start_category_ids,
    "navigation.start_category_ids",
  );

  requireCondition(startCategoryIds.length === 12, "all 12 start categories are required.");
  ensureUnique(startCategoryIds, "navigation.start_category_ids");
  startCategoryIds.forEach((categoryId) =>
    requireCondition(categoryById.has(categoryId), `start category ${categoryId} does not exist.`),
  );

  categories.forEach((category) => {
    requireString(category.title, `categories.${category.id}.title`);
    requireString(category.short_description, `categories.${category.id}.short_description`);
    const startNodeIds = requireStringArray(
      navigation.category_start_nodes?.[category.id],
      `navigation.category_start_nodes.${category.id}`,
    );
    requireCondition(startNodeIds.length === 4, `${category.id} must have four start nodes.`);
    requireCondition(
      JSON.stringify(startNodeIds) === JSON.stringify(category.start_node_ids),
      `${category.id} start_node_ids do not match navigation.category_start_nodes.`,
    );
    requireCondition(
      category.start_question_ids.length === 4,
      `${category.id} must have four start question IDs.`,
    );
    startNodeIds.forEach((nodeId, index) => {
      const node = nodeById.get(nodeId);
      requireCondition(node, `${category.id} start node ${nodeId} does not exist.`);
      requireCondition(node.category_id === category.id, `${nodeId} resolves to the wrong category.`);
      requireCondition(
        node.question_id === category.start_question_ids[index],
        `${nodeId} does not match ${category.start_question_ids[index]}.`,
      );
      requireCondition(questionById.has(node.question_id), `${nodeId} resolves to a missing question.`);
    });
  });

  questions.forEach((question) => {
    requireString(question.slug, `questions.${question.id}.slug`);
    requireCondition(
      categoryById.has(question.primary_category_id),
      `${question.id} references a missing primary category.`,
    );
    requireStringArray(question.related_category_ids, `questions.${question.id}.related_category_ids`).forEach(
      (categoryId) =>
        requireCondition(categoryById.has(categoryId), `${question.id} references missing ${categoryId}.`),
    );
    const content = requireObject(question.public_content, `questions.${question.id}.public_content`);
    requireString(content.question, `questions.${question.id}.public_content.question`);
    requireString(content.short_answer, `questions.${question.id}.public_content.short_answer`);
    requireString(content.detailed_answer, `questions.${question.id}.public_content.detailed_answer`);
    requireStringArray(content.aliases, `questions.${question.id}.public_content.aliases`);
    requireStringArray(content.keywords, `questions.${question.id}.public_content.keywords`);
    requireStringArray(
      content.search_terms_normalized,
      `questions.${question.id}.public_content.search_terms_normalized`,
    );
    const defaultNode = nodeById.get(question.default_node_id);
    requireCondition(defaultNode, `${question.id} has a missing default node.`);
    requireCondition(defaultNode.question_id === question.id, `${question.id} default node resolves to another question.`);
  });

  nodes.forEach((node) => {
    requireCondition(questionById.has(node.question_id), `${node.node_id} references a missing question.`);
    requireCondition(categoryById.has(node.category_id), `${node.node_id} references a missing category.`);
    requireCondition(Number.isInteger(node.depth) && node.depth >= 1 && node.depth <= 4, `${node.node_id} has invalid depth.`);
    requireCondition(node.node_id !== node.parent_node_id, `${node.node_id} references itself as parent.`);

    if (node.parent_node_id) {
      const parent = nodeById.get(node.parent_node_id);
      requireCondition(parent, `${node.node_id} references a missing parent node.`);
      requireCondition(parent.depth < node.depth, `${node.node_id} parent depth must be lower.`);
    }

    const nextNodeIds = requireStringArray(node.next_node_ids, `${node.node_id}.next_node_ids`);
    ensureUnique(nextNodeIds, `${node.node_id}.next_node_ids`);
    requireCondition(allowedNextCounts.has(nextNodeIds.length), `${node.node_id} has a disallowed related-question count.`);
    requireCondition(!nextNodeIds.includes(node.node_id), `${node.node_id} directly references itself.`);

    requireCondition(Array.isArray(node.next_questions), `${node.node_id}.next_questions must be an array.`);
    const orderedNextQuestions = [...node.next_questions].sort(
      (first, second) => first.display_order - second.display_order,
    );
    const orderedNextNodeIds = orderedNextQuestions.map((item) => item.node_id);
    requireCondition(
      JSON.stringify(nextNodeIds) === JSON.stringify(orderedNextNodeIds),
      `${node.node_id} next_node_ids and next_questions are inconsistent.`,
    );
    orderedNextQuestions.forEach((item) => {
      const nextNode = nodeById.get(item.node_id);
      requireCondition(nextNode, `${node.node_id} references missing next node ${item.node_id}.`);
      requireCondition(
        nextNode.question_id === item.question_id,
        `${node.node_id} next question ${item.question_id} does not match ${item.node_id}.`,
      );
      requireCondition(questionById.has(item.question_id), `${node.node_id} references a missing next question.`);
    });

    const visitedParents = new Set([node.node_id]);
    let currentNode = node;
    while (currentNode.parent_node_id) {
      requireCondition(
        !visitedParents.has(currentNode.parent_node_id),
        `${node.node_id} has a cycle in its parent chain.`,
      );
      visitedParents.add(currentNode.parent_node_id);
      currentNode = nodeById.get(currentNode.parent_node_id);
      requireCondition(currentNode, `${node.node_id} has a broken parent chain.`);
    }
  });

  const observedMaxDepth = Math.max(...nodes.map((node) => node.depth));
  requireCondition(observedMaxDepth <= 4, "observed navigation depth must not exceed 4.");
  requireCondition(observedMaxDepth === navigation.max_depth, "observed depth must match navigation.max_depth.");

  const publicQuestions = questions.map((question) => {
    const content = question.public_content;
    const action = safeAction(content.action, question.id);
    return {
      id: question.id,
      slug: question.slug,
      question_type: question.question_type,
      primary_category_id: question.primary_category_id,
      related_category_ids: [...question.related_category_ids],
      analytics_key: question.analytics_key,
      default_node_id: question.default_node_id,
      public_content: {
        question: content.question,
        short_answer: content.short_answer,
        detailed_answer: content.detailed_answer,
        aliases: [...content.aliases],
        keywords: [...content.keywords],
        search_terms_normalized: [...content.search_terms_normalized],
        ...(action ? { action } : {}),
      },
    };
  });

  const publicNodes = nodes.map((node) => ({
    node_id: node.node_id,
    question_id: node.question_id,
    category_id: node.category_id,
    path: node.path,
    depth: node.depth,
    parent_node_id: node.parent_node_id,
    breadcrumb_label: node.breadcrumb_label,
    next_node_ids: [...node.next_node_ids],
    next_questions: [...node.next_questions]
      .sort((first, second) => first.display_order - second.display_order)
      .map((item) => ({
        node_id: item.node_id,
        question_id: item.question_id,
        relation_type: item.relation_type,
        display_order: item.display_order,
      })),
    category_return_id: node.category_return_id,
  }));

  const publicData = {
    metadata: {
      knowledge_base_name: metadata.knowledge_base_name,
      version: metadata.version,
      schema_version: metadata.schema_version,
      language: metadata.language,
      total_questions: metadata.total_questions,
      total_categories: metadata.total_categories,
    },
    categories: categories.map((category) => ({
      id: category.id,
      code: category.code,
      title: category.title,
      slug: category.slug,
      short_description: category.short_description,
      display_order: category.display_order,
      question_count: category.question_count,
      start_question_ids: [...category.start_question_ids],
      start_node_ids: [...category.start_node_ids],
    })),
    questions: publicQuestions,
    navigation: {
      max_depth: navigation.max_depth,
      allowed_next_question_counts: [...navigation.allowed_next_question_counts],
      default_next_question_count: navigation.default_next_question_count,
      start_category_ids: [...navigation.start_category_ids],
      category_start_nodes: Object.fromEntries(
        categories.map((category) => [
          category.id,
          [...navigation.category_start_nodes[category.id]],
        ]),
      ),
      nodes: publicNodes,
    },
  };

  return validatePublicKnowledgeBase(publicData);
}

export async function generatePublicKnowledgeBase({
  inputPath = defaultInputPath,
  outputPath = defaultOutputPath,
} = {}) {
  let source;
  try {
    source = await readFile(inputPath, "utf8");
  } catch (error) {
    throw new Error(
      `Cannot read the private knowledge base input. Place ${RAW_KNOWLEDGE_BASE_FILENAME} in private-input/ or pass --input. (${error.code ?? "read error"})`,
    );
  }

  let rawData;
  try {
    rawData = JSON.parse(source);
  } catch (error) {
    throw new Error(`The private knowledge base input is not valid JSON. (${error.message})`);
  }

  const publicData = buildPublicKnowledgeBase(rawData);
  const output = `${JSON.stringify(publicData, null, 2)}\n`;
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");

  return {
    categories: publicData.categories.length,
    questions: publicData.questions.length,
    nodes: publicData.navigation.nodes.length,
    outputBytes: Buffer.byteLength(output),
    outputPath,
  };
}

function parseCliArguments(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--input") options.inputPath = path.resolve(argv[++index]);
    else if (argument === "--output") options.outputPath = path.resolve(argv[++index]);
    else fail(`unknown argument ${argument}.`);
  }
  return options;
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  try {
    const result = await generatePublicKnowledgeBase(parseCliArguments(process.argv.slice(2)));
    console.log(
      `Validated ${result.questions} questions, ${result.categories} categories, and ${result.nodes} navigation nodes.`,
    );
    console.log(`Wrote ${result.outputBytes} bytes to ${path.relative(projectRoot, result.outputPath)}.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
