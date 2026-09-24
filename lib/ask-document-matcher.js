import { askDocumentQuestions } from "./ask-document-data.js";

const ignoredTokens = new Set([
  "a",
  "about",
  "an",
  "and",
  "are",
  "can",
  "do",
  "does",
  "for",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "this",
  "to",
  "what",
  "with",
]);

export function normalizeCustomQuestion(value) {
  return value
    .toLocaleLowerCase("en-US")
    .replace(/\$/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function meaningfulTokens(value) {
  return new Set(
    normalizeCustomQuestion(value)
      .split(" ")
      .filter((token) => token.length > 1 && !ignoredTokens.has(token)),
  );
}

function intersectionSize(first, second) {
  let count = 0;
  first.forEach((value) => {
    if (second.has(value)) count += 1;
  });
  return count;
}

function scoreQuestion(normalizedQuery, queryTokens, question) {
  const normalizedPreparedQuestion = normalizeCustomQuestion(question.question);
  if (normalizedQuery === normalizedPreparedQuestion) {
    return { question, score: 100, exact: true };
  }

  let score = 0;
  let exactPhrase = false;

  question.keywords.forEach((keyword) => {
    const normalizedKeyword = normalizeCustomQuestion(keyword);
    const keywordTokens = meaningfulTokens(keyword);

    if (normalizedKeyword && normalizedQuery.includes(normalizedKeyword)) {
      exactPhrase = true;
      score += keywordTokens.size > 1 ? 10 + keywordTokens.size * 2 : 6;
      return;
    }

    const overlap = intersectionSize(queryTokens, keywordTokens);
    score += overlap * 2;
  });

  const questionTokens = meaningfulTokens(question.question);
  score += intersectionSize(queryTokens, questionTokens);

  return { question, score, exact: exactPhrase };
}

export function matchCustomQuestion(value) {
  const normalizedQuery = normalizeCustomQuestion(value);
  if (!normalizedQuery) {
    return { type: "empty", match: null, suggestions: [] };
  }

  const queryTokens = meaningfulTokens(normalizedQuery);
  const ranked = askDocumentQuestions
    .map((question) => scoreQuestion(normalizedQuery, queryTokens, question))
    .sort((first, second) => second.score - first.score);

  const [best, next] = ranked;
  const hasClearLead = best.score - (next?.score ?? 0) >= 2;
  const highConfidence =
    best.score >= 10 ||
    (best.score >= 7 && (best.exact || hasClearLead));

  if (highConfidence) {
    return {
      type: "match",
      match: best.question,
      confidence: best.score,
      suggestions: [],
    };
  }

  const suggestions = ranked
    .filter((result) => result.score >= 3)
    .slice(0, 3)
    .map((result) => result.question);

  if (suggestions.length) {
    return { type: "suggestions", match: null, suggestions };
  }

  return { type: "fallback", match: null, suggestions: [] };
}

