const ignoredSearchTokens = new Set([
  "a",
  "about",
  "an",
  "and",
  "are",
  "can",
  "could",
  "during",
  "do",
  "does",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "much",
  "my",
  "of",
  "o1sf",
  "on",
  "or",
  "program",
  "provide",
  "the",
  "this",
  "to",
  "what",
  "when",
  "where",
  "who",
  "why",
  "with",
  "would",
  "market",
  "entry",
  "us",
]);

const normalizedTokenAliases = new Map([
  ["cards", "card"],
  ["cancellation", "cancel"],
  ["cancelled", "cancel"],
  ["canceled", "cancel"],
  ["cost", "price"],
  ["costs", "price"],
  ["fees", "fee"],
  ["founders", "founder"],
  ["investors", "investor"],
  ["meetings", "meeting"],
  ["payments", "payment"],
  ["pricing", "price"],
  ["refunds", "refund"],
  ["weeks", "week"],
]);

export const publicKnowledgeBaseUrl =
  "/ask_document/knowledge-base.v1.0.0.public.json";

export const feedbackStorageKey =
  "o1sf:ask-document-feedback:v1.0.0";

export const transcriptStorageKey =
  "o1sf:ask-document-transcript:v1.0.0";

export function normalizePreparedQuestion(value = "") {
  const normalized = String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/[\u2010-\u2015-]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
  return normalized
    .split(" ")
    .map((token) => normalizedTokenAliases.get(token) ?? token)
    .join(" ");
}

function meaningfulTokens(value) {
  return new Set(
    normalizePreparedQuestion(value)
      .split(" ")
      .filter((token) => token.length > 1 && !ignoredSearchTokens.has(token)),
  );
}

function overlapCount(first, second) {
  let count = 0;
  first.forEach((token) => {
    if (second.has(token)) count += 1;
  });
  return count;
}

function tokenScore(queryTokens, candidate, weight, perToken) {
  const candidateTokens = meaningfulTokens(candidate);
  if (!candidateTokens.size || !queryTokens.size) return 0;
  const overlap = overlapCount(queryTokens, candidateTokens);
  if (!overlap) return 0;
  return (overlap / queryTokens.size) * weight + overlap * perToken;
}

function scorePreparedQuestion(normalizedQuery, queryTokens, question, categoryTitle) {
  const content = question.public_content;
  const normalizedQuestion = normalizePreparedQuestion(content.question);
  const normalizedAliases = content.aliases.map(normalizePreparedQuestion);
  const normalizedTerms = content.search_terms_normalized.map(normalizePreparedQuestion);

  if (normalizedQuery === normalizedQuestion) return 1000;
  if (normalizedAliases.includes(normalizedQuery)) return 950;
  if (normalizedTerms.includes(normalizedQuery)) return 900;

  let score = 0;
  if (
    normalizedQuery.length >= 5 &&
    (normalizedQuestion.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedQuestion))
  ) {
    score += 520;
  }

  score += tokenScore(queryTokens, content.question, 220, 18);
  score += Math.max(
    0,
    ...content.aliases.map((alias) => tokenScore(queryTokens, alias, 150, 12)),
  );
  score += Math.max(
    0,
    ...content.search_terms_normalized.map((term) =>
      tokenScore(queryTokens, term, 130, 10),
    ),
  );
  score += Math.max(
    0,
    ...content.keywords.map((keyword) =>
      tokenScore(queryTokens, keyword, 110, 10),
    ),
  );
  score += tokenScore(queryTokens, categoryTitle, 35, 4);

  return Math.round(score * 100) / 100;
}

export function matchPreparedQuestions(value, data, limit = 5) {
  const normalizedQuery = normalizePreparedQuestion(value);
  if (!normalizedQuery) return { type: "empty", matches: [] };

  const queryTokens = meaningfulTokens(normalizedQuery);
  const categoryById = new Map(
    data.categories.map((category) => [category.id, category]),
  );
  const ranked = data.questions
    .map((question) => ({
      question,
      score: scorePreparedQuestion(
        normalizedQuery,
        queryTokens,
        question,
        categoryById.get(question.primary_category_id)?.title ?? "",
      ),
    }))
    .filter((result) => result.score > 0)
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.question.id.localeCompare(second.question.id, "en"),
    );

  const bestScore = ranked[0]?.score ?? 0;
  const hasStrongMatch = bestScore >= 100;
  return {
    type: hasStrongMatch ? "matches" : "fallback",
    matches: ranked.slice(0, hasStrongMatch ? limit : Math.min(3, limit)),
  };
}

export function validateRuntimeKnowledgeBase(data) {
  const valid =
    data &&
    typeof data === "object" &&
    data.metadata?.total_questions === 300 &&
    data.metadata?.total_categories === 12 &&
    Array.isArray(data.categories) &&
    data.categories.length === 12 &&
    Array.isArray(data.questions) &&
    data.questions.length === 300 &&
    Array.isArray(data.navigation?.nodes) &&
    data.navigation.nodes.length === 300;

  if (!valid) throw new Error("The prepared answer data is not available.");
  return data;
}

export function createKnowledgeBaseIndex(data) {
  validateRuntimeKnowledgeBase(data);
  return {
    categoryById: new Map(
      data.categories.map((category) => [category.id, category]),
    ),
    nodeById: new Map(
      data.navigation.nodes.map((node) => [node.node_id, node]),
    ),
    questionById: new Map(
      data.questions.map((question) => [question.id, question]),
    ),
  };
}

export function resolveTranscript(nodeIds, index) {
  if (!Array.isArray(nodeIds)) return [];
  return nodeIds.flatMap((nodeId, transcriptIndex) => {
    const node = index.nodeById.get(nodeId);
    const question = node ? index.questionById.get(node.question_id) : null;
    if (!node || !question) return [];
    return [
      {
        entryId: `${node.node_id}:${transcriptIndex}`,
        nodeId: node.node_id,
        questionId: question.id,
        ready: true,
      },
    ];
  });
}

export function resolveRelatedQuestions(node, index) {
  if (!node) return [];
  const preferred = [...(node.next_questions ?? [])].sort(
    (first, second) => first.display_order - second.display_order,
  );
  const records = preferred.length
    ? preferred
    : (node.next_node_ids ?? []).map((nodeId, displayOrder) => ({
        node_id: nodeId,
        display_order: displayOrder + 1,
      }));

  return records.flatMap((record) => {
    if (record.node_id === node.node_id) return [];
    const relatedNode = index.nodeById.get(record.node_id);
    const question = relatedNode
      ? index.questionById.get(relatedNode.question_id)
      : null;
    if (!relatedNode || !question) return [];
    return [{ node: relatedNode, question }];
  });
}

export function nodeIdFromSearch(search, index) {
  const nodeId = new URLSearchParams(search).get("node");
  if (!nodeId) return { nodeId: null, invalid: false };
  return index.nodeById.has(nodeId)
    ? { nodeId, invalid: false }
    : { nodeId: null, invalid: true };
}
