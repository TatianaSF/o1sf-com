"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  createKnowledgeBaseIndex,
  feedbackStorageKey,
  matchPreparedQuestions,
  nodeIdFromSearch,
  publicKnowledgeBaseUrl,
  resolveRelatedQuestions,
  resolveTranscript,
  transcriptStorageKey,
  validateRuntimeKnowledgeBase,
} from "../../lib/ask-document-chat.js";
import { trackAskDocumentEvent } from "../../lib/ask-document-events.js";
import { SiteSignature } from "../SiteSignature.jsx";
import { AskDocumentIcon } from "./AskDocumentIcon.jsx";
import styles from "./ask-document-chat.module.css";

let knowledgeBaseRequest;

function loadKnowledgeBase(force = false) {
  if (force) knowledgeBaseRequest = undefined;
  if (!knowledgeBaseRequest) {
    knowledgeBaseRequest = fetch(publicKnowledgeBaseUrl, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    }).then(async (response) => {
      if (!response.ok) throw new Error("The prepared answer data could not be loaded.");
      return validateRuntimeKnowledgeBase(await response.json());
    });
  }
  return knowledgeBaseRequest;
}

function historyUrl(nodeId) {
  const url = new URL(window.location.href);
  if (nodeId) url.searchParams.set("node", nodeId);
  else url.searchParams.delete("node");
  return `${url.pathname}${url.search}${url.hash}`;
}

function writeHistory({ categoryId, mode = "push", nodeId, nodeIds }) {
  window.history[mode === "replace" ? "replaceState" : "pushState"](
    {
      askDocumentChat: true,
      categoryId,
      nodeIds,
    },
    "",
    historyUrl(nodeId),
  );
}

function feedbackRecordKey(nodeId, questionId) {
  return `${nodeId}:${questionId}`;
}

function readFeedback() {
  try {
    const records = JSON.parse(window.localStorage.getItem(feedbackStorageKey) || "[]");
    if (!Array.isArray(records)) return {};
    return Object.fromEntries(
      records.flatMap((record) => {
        const valid =
          record &&
          typeof record.questionId === "string" &&
          typeof record.nodeId === "string" &&
          ["helpful", "not-helpful"].includes(record.rating) &&
          typeof record.timestamp === "string";
        return valid
          ? [[feedbackRecordKey(record.nodeId, record.questionId), record]]
          : [];
      }),
    );
  } catch {
    return {};
  }
}

function readStoredTranscript(index, currentNodeId) {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(transcriptStorageKey) || "null");
    if (!saved || !Array.isArray(saved.nodeIds) || saved.currentNodeId !== currentNodeId) {
      return [];
    }
    const transcript = resolveTranscript(saved.nodeIds, index);
    return transcript.at(-1)?.nodeId === currentNodeId ? transcript : [];
  } catch {
    return [];
  }
}

function DemoHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <SiteSignature
          className={styles.signature}
          showMadeWith={false}
          showProvenance={false}
        />
        <span className={styles.headerTitle}>Ask the document</span>
        <span className={styles.demoBadge}>Interactive Demo</span>
      </div>
    </header>
  );
}

function LoadingState() {
  return (
    <div className={styles.page}>
      <DemoHeader />
      <main className={styles.main} id="main-content">
        <section className={styles.hero}>
          <p className={styles.kicker}>Interactive Demo</p>
          <h1>Learn about the o1sf US Market Entry Program</h1>
          <p className={styles.heroLead}>Loading the prepared questions…</p>
        </section>
      </main>
    </div>
  );
}

function DataError({ onRetry }) {
  return (
    <div className={styles.page}>
      <DemoHeader />
      <main className={styles.main} id="main-content">
        <section className={styles.errorState} role="alert">
          <AskDocumentIcon name="help" />
          <h1>The prepared answers are not available.</h1>
          <p>Try loading the document again.</p>
          <button onClick={onRetry} type="button">Try again</button>
        </section>
      </main>
    </div>
  );
}

function TopicQuestions({ disabled, index, nodeIds, onSelect, visitedNodeIds }) {
  return (
    <div className={styles.startQuestions} aria-label="Starting questions">
      {nodeIds.map((nodeId, position) => {
        const node = index.nodeById.get(nodeId);
        const question = node ? index.questionById.get(node.question_id) : null;
        if (!node || !question) return null;
        const visited = visitedNodeIds.has(nodeId);
        return (
          <button
            className={styles.questionButton}
            disabled={disabled}
            key={nodeId}
            onClick={() => onSelect(nodeId, "topic", position + 1)}
            type="button"
          >
            <span className={styles.questionNumber} aria-hidden="true">{position + 1}</span>
            <span>{question.public_content.question}</span>
            {visited ? <small>Viewed</small> : null}
          </button>
        );
      })}
    </div>
  );
}

function FeedbackControls({ entry, feedback, onFeedback }) {
  const statusId = `feedback-${entry.entryId.replaceAll(":", "-")}`;
  return (
    <div className={styles.feedback}>
      <p>Was this helpful?</p>
      <div className={styles.feedbackButtons}>
        <button
          aria-describedby={statusId}
          aria-label="Mark this answer as helpful"
          aria-pressed={feedback?.rating === "helpful"}
          onClick={() => onFeedback(entry, "helpful")}
          type="button"
        >
          <AskDocumentIcon name="thumbsUp" />
          <span>Helpful</span>
        </button>
        <button
          aria-describedby={statusId}
          aria-label="Mark this answer as not helpful"
          aria-pressed={feedback?.rating === "not-helpful"}
          onClick={() => onFeedback(entry, "not-helpful")}
          type="button"
        >
          <AskDocumentIcon name="thumbsDown" />
          <span>Not helpful</span>
        </button>
      </div>
      <span className={styles.feedbackStatus} id={statusId} aria-live="polite">
        {feedback ? "Saved on this device. You can change your choice." : ""}
      </span>
    </div>
  );
}

function RelatedQuestions({ disabled, index, node, onSelect, visitedNodeIds }) {
  const related = resolveRelatedQuestions(node, index);
  if (!related.length) {
    return <p className={styles.noRelated}>Explore another topic to continue.</p>;
  }

  return (
    <section className={styles.related} aria-labelledby={`related-${node.node_id}`}>
      <h4 id={`related-${node.node_id}`}>Continue with a prepared question</h4>
      <div className={styles.relatedGrid}>
        {related.map(({ node: relatedNode, question }, position) => {
          const visited = visitedNodeIds.has(relatedNode.node_id);
          return (
            <button
              disabled={disabled}
              key={relatedNode.node_id}
              onClick={() => onSelect(relatedNode.node_id, "related", position + 1)}
              type="button"
            >
              <span>{question.public_content.question}</span>
              <span className={styles.relatedMeta}>
                {visited ? "Viewed · open again" : "Open prepared answer"}
                <AskDocumentIcon name="chevron" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TranscriptEntry({
  answerRef,
  disabled,
  entry,
  feedback,
  index,
  onAnswerAction,
  onFeedback,
  onSelect,
  visitedNodeIds,
}) {
  const node = index.nodeById.get(entry.nodeId);
  const question = node ? index.questionById.get(node.question_id) : null;
  if (!node || !question) return null;
  const content = question.public_content;

  return (
    <article className={styles.exchange}>
      <div className={styles.userMessage}>
        <span>You</span>
        <p>{content.question}</p>
      </div>

      <div className={styles.assistantRow}>
        <span className={styles.assistantMark} aria-hidden="true">O1</span>
        {entry.ready ? (
          <div className={styles.assistantMessage}>
            <p className={styles.preparedLabel}>Prepared answer</p>
            <h3 ref={answerRef} tabIndex="-1">{content.question}</h3>
            <p className={styles.shortAnswer}>{content.short_answer}</p>
            <p className={styles.detailedAnswer}>{content.detailed_answer}</p>
            {content.action?.action_url ? (
              <a
                className={styles.answerAction}
                href={content.action.action_url}
                onClick={() => onAnswerAction(entry, node)}
              >
                {content.action.action_label}
                <AskDocumentIcon name="arrow" />
              </a>
            ) : null}
            <FeedbackControls
              entry={entry}
              feedback={feedback}
              onFeedback={onFeedback}
            />
            <RelatedQuestions
              disabled={disabled}
              index={index}
              node={node}
              onSelect={onSelect}
              visitedNodeIds={visitedNodeIds}
            />
          </div>
        ) : (
          <div className={styles.typingState} role="status">
            <span className={styles.typingDots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Finding the prepared answer…</span>
          </div>
        )}
      </div>
    </article>
  );
}

function SearchPanel({
  category,
  data,
  disabled,
  index,
  onSearch,
  onSearchResultSelect,
  onSelect,
}) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const resultId = "prepared-search-result";

  const submitSearch = (event) => {
    event.preventDefault();
    const searchResult = matchPreparedQuestions(query, data);
    if (searchResult.type === "empty") {
      onSearch({ matchCount: 0, searchOutcome: "empty" });
      setResult({ type: "error", message: "Enter a question to search the prepared answers.", items: [] });
      return;
    }

    let items = searchResult.matches.flatMap(({ question }) => {
      const node = index.nodeById.get(question.default_node_id);
      return node ? [{ node, question }] : [];
    });
    if (searchResult.type === "fallback" && items.length === 0) {
      items = category.start_node_ids.slice(0, 4).flatMap((nodeId) => {
        const node = index.nodeById.get(nodeId);
        const question = node ? index.questionById.get(node.question_id) : null;
        return node && question ? [{ node, question }] : [];
      });
    }

    onSearch({ matchCount: items.length, searchOutcome: searchResult.type });

    setResult({
      type: searchResult.type,
      message:
        searchResult.type === "matches"
          ? "Choose the prepared question that best matches what you meant."
          : "This demo uses prepared answers. Try one of these related questions.",
      items,
    });
  };

  return (
    <section className={styles.searchPanel} aria-labelledby="custom-question-heading">
      <div>
        <h2 id="custom-question-heading">Ask in your own words</h2>
        <p>Your text stays in this browser and is matched to prepared questions only.</p>
      </div>
      <form onSubmit={submitSearch} noValidate>
        <label htmlFor="prepared-question-search">Your question</label>
        <div className={styles.searchField}>
          <AskDocumentIcon name="search" />
          <input
            aria-describedby={result ? resultId : undefined}
            aria-invalid={result?.type === "error"}
            autoComplete="off"
            disabled={disabled}
            id="prepared-question-search"
            maxLength={240}
            onChange={(event) => {
              setQuery(event.target.value);
              if (result?.type === "error") setResult(null);
            }}
            placeholder="For example: How much does the program cost?"
            type="search"
            value={query}
          />
          <button disabled={disabled} type="submit">Find questions</button>
        </div>
      </form>

      {result ? (
        <div
          className={styles.searchResults}
          id={resultId}
          role={result.type === "error" ? "alert" : "status"}
        >
          <p>{result.message}</p>
          {result.items.length ? (
            <div>
              {result.items.map(({ node, question }, position) => (
                <button
                  disabled={disabled}
                  key={node.node_id}
                  onClick={() => {
                    setQuery("");
                    setResult(null);
                    onSearchResultSelect({
                      nodeId: node.node_id,
                      position: position + 1,
                      searchOutcome: result.type,
                    });
                    onSelect(node.node_id, "search", position + 1);
                  }}
                  type="button"
                >
                  {question.public_content.question}
                  <AskDocumentIcon name="chevron" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export function AskDocumentChatDemo() {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [pendingEntryId, setPendingEntryId] = useState(null);
  const [feedbackByKey, setFeedbackByKey] = useState({});
  const [notice, setNotice] = useState("");
  const [liveMessage, setLiveMessage] = useState("");
  const [canUndo, setCanUndo] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const answerRefs = useRef(new Map());
  const answerViewTimersRef = useRef(new Map());
  const viewedAnswerEntryIdsRef = useRef(new Set());
  const assistantEngagedRef = useRef(false);
  const assistantReadyTrackedRef = useRef(false);
  const topicsExploredRef = useRef(new Set());
  const categoryHeadingRef = useRef(null);
  const entryCounterRef = useRef(0);
  const loadingTimerRef = useRef(null);
  const undoTimerRef = useRef(null);
  const undoStateRef = useRef(null);

  const index = useMemo(
    () => (data ? createKnowledgeBaseIndex(data) : null),
    [data],
  );

  const markAssistantEngaged = useCallback((interactionSource, properties = {}) => {
    if (assistantEngagedRef.current) return;
    assistantEngagedRef.current = true;
    trackAskDocumentEvent("assistant_engaged", {
      surface: "ask_document",
      interaction_source: interactionSource,
      ...properties,
    });
  }, []);

  useEffect(() => {
    let active = true;
    loadKnowledgeBase(loadAttempt > 0)
      .then((nextData) => {
        if (active) setData(nextData);
      })
      .catch(() => {
        if (active) {
          trackAskDocumentEvent("assistant_load_error", {
            surface: "ask_document",
            interaction_source: "knowledge_base",
            load_attempt: loadAttempt + 1,
          });
          setLoadError(true);
        }
      });
    return () => {
      active = false;
    };
  }, [loadAttempt]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  const focusAnswer = useCallback((entryId) => {
    window.setTimeout(() => {
      const answer = answerRefs.current.get(entryId);
      answer?.focus({ preventScroll: true });
      answer?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }, 0);
  }, [reducedMotion]);

  const latestReadyEntryId = transcript.at(-1)?.ready
    ? transcript.at(-1).entryId
    : null;

  useEffect(() => {
    if (latestReadyEntryId) focusAnswer(latestReadyEntryId);
  }, [focusAnswer, latestReadyEntryId]);

  useEffect(() => {
    if (!hydrated || !index || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const entryById = new Map(transcript.map((entry) => [entry.entryId, entry]));
    const answerViewTimers = answerViewTimersRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const observedEntry of entries) {
          const entryId = observedEntry.target.dataset.answerEntryId;
          const transcriptEntry = entryById.get(entryId);
          if (!entryId || !transcriptEntry || !transcriptEntry.ready) continue;

          if (observedEntry.isIntersecting && observedEntry.intersectionRatio >= 0.5) {
            if (
              viewedAnswerEntryIdsRef.current.has(entryId) ||
              answerViewTimers.has(entryId)
            ) {
              continue;
            }

            const timer = window.setTimeout(() => {
              answerViewTimers.delete(entryId);
              if (viewedAnswerEntryIdsRef.current.has(entryId)) return;
              viewedAnswerEntryIdsRef.current.add(entryId);

              const node = index.nodeById.get(transcriptEntry.nodeId);
              const transcriptDepth = transcript.findIndex((item) => item.entryId === entryId) + 1;
              trackAskDocumentEvent("answer_viewed", {
                surface: "ask_document",
                topic_id: node?.category_id,
                question_id: transcriptEntry.questionId,
                interaction_source: transcriptEntry.interactionSource ?? "restored",
                transcript_depth: transcriptDepth,
                answer_load_ms: transcriptEntry.answerLoadMs ?? 0,
              });

              if (viewedAnswerEntryIdsRef.current.size >= 2) {
                markAssistantEngaged("multiple_answers", {
                  topic_id: node?.category_id,
                  transcript_depth: transcriptDepth,
                });
              }
              observer.unobserve(observedEntry.target);
            }, 1000);
            answerViewTimers.set(entryId, timer);
          } else {
            window.clearTimeout(answerViewTimers.get(entryId));
            answerViewTimers.delete(entryId);
          }
        }
      },
      { threshold: [0, 0.5] },
    );

    for (const entry of transcript) {
      const answer = answerRefs.current.get(entry.entryId);
      if (entry.ready && answer && !viewedAnswerEntryIdsRef.current.has(entry.entryId)) {
        answer.dataset.answerEntryId = entry.entryId;
        observer.observe(answer);
      }
    }

    return () => {
      observer.disconnect();
      answerViewTimers.forEach((timer) => window.clearTimeout(timer));
      answerViewTimers.clear();
    };
  }, [hydrated, index, markAssistantEngaged, transcript]);

  useEffect(() => {
    if (!index || hydrated) return;
    const hydrationTimer = window.setTimeout(() => {
      const direct = nodeIdFromSearch(window.location.search, index);
      const defaultCategoryId = data.navigation.start_category_ids[0];
      let initialTranscript = [];
      let initialCategoryId = defaultCategoryId;
      let entryMode = "landing";

      if (direct.invalid) {
        entryMode = "invalid_link";
        setNotice("That question link is not available. Choose a prepared question below.");
        writeHistory({ categoryId: defaultCategoryId, mode: "replace", nodeId: null, nodeIds: [] });
      } else if (direct.nodeId) {
        initialTranscript = readStoredTranscript(index, direct.nodeId);
        entryMode = initialTranscript.length ? "restored" : "direct_link";
        if (!initialTranscript.length) initialTranscript = resolveTranscript([direct.nodeId], index);
        initialCategoryId = index.nodeById.get(direct.nodeId)?.category_id ?? defaultCategoryId;
      }

      initialTranscript = initialTranscript.map((entry) => ({
        ...entry,
        answerLoadMs: 0,
        interactionSource: entryMode,
      }));
      topicsExploredRef.current.add(initialCategoryId);

      setFeedbackByKey(readFeedback());
      setSelectedCategoryId(initialCategoryId);
      setTranscript(initialTranscript);
      setHydrated(true);
      writeHistory({
        categoryId: initialCategoryId,
        mode: "replace",
        nodeId: initialTranscript.at(-1)?.nodeId ?? null,
        nodeIds: initialTranscript.map((entry) => entry.nodeId),
      });
      if (initialTranscript.length) focusAnswer(initialTranscript.at(-1).entryId);
      if (!assistantReadyTrackedRef.current) {
        assistantReadyTrackedRef.current = true;
        trackAskDocumentEvent("assistant_ready", {
          surface: "ask_document",
          entry_mode: entryMode,
          topic_id: initialCategoryId,
          transcript_depth: initialTranscript.length,
        });
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, [data, focusAnswer, hydrated, index]);

  useEffect(() => {
    if (!hydrated || !selectedCategoryId) return;
    const nodeIds = transcript.map((entry) => entry.nodeId);
    try {
      window.sessionStorage.setItem(
        transcriptStorageKey,
        JSON.stringify({
          currentNodeId: nodeIds.at(-1) ?? null,
          nodeIds,
          selectedCategoryId,
        }),
      );
    } catch {
      // The conversation still works when session storage is unavailable.
    }
  }, [hydrated, selectedCategoryId, transcript]);

  useEffect(() => {
    if (!hydrated || !index) return undefined;
    const restoreHistory = (event) => {
      window.clearTimeout(loadingTimerRef.current);
      setPendingEntryId(null);
      const direct = nodeIdFromSearch(window.location.search, index);
      if (direct.invalid) {
        setTranscript([]);
        setNotice("That question link is not available. Choose a prepared question below.");
        return;
      }

      let restored = resolveTranscript(event.state?.nodeIds ?? [], index);
      if (direct.nodeId && restored.at(-1)?.nodeId !== direct.nodeId) {
        restored = resolveTranscript([direct.nodeId], index);
      }
      if (!direct.nodeId) restored = [];
      restored = restored.map((entry) => ({
        ...entry,
        answerLoadMs: 0,
        interactionSource: "browser_history",
      }));
      const categoryId = direct.nodeId
        ? index.nodeById.get(direct.nodeId)?.category_id
        : event.state?.categoryId;
      setTranscript(restored);
      if (index.categoryById.has(categoryId)) {
        topicsExploredRef.current.add(categoryId);
        setSelectedCategoryId(categoryId);
      }
      setNotice("");
      setLiveMessage(
        restored.length
          ? `Restored ${restored.length} prepared answer${restored.length === 1 ? "" : "s"}.`
          : "Returned to the starting questions.",
      );
      if (restored.length) focusAnswer(restored.at(-1).entryId);
    };
    window.addEventListener("popstate", restoreHistory);
    return () => window.removeEventListener("popstate", restoreHistory);
  }, [focusAnswer, hydrated, index]);

  useEffect(() => () => {
    window.clearTimeout(loadingTimerRef.current);
    window.clearTimeout(undoTimerRef.current);
    answerViewTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    answerViewTimersRef.current.clear();
  }, []);

  const selectQuestion = useCallback((nodeId, interactionSource = "topic", resultPosition) => {
    if (!index || pendingEntryId) return;
    const node = index.nodeById.get(nodeId);
    const question = node ? index.questionById.get(node.question_id) : null;
    if (!node || !question) {
      setNotice("That prepared question is not available. Choose another question.");
      return;
    }

    const repeatedSelection = transcript.some((item) => item.nodeId === nodeId);
    const entry = {
      entryId: `${nodeId}:${Date.now()}:${entryCounterRef.current += 1}`,
      nodeId,
      questionId: question.id,
      ready: reducedMotion,
      answerLoadMs: reducedMotion ? 0 : 750,
      interactionSource,
    };
    const nextTranscript = [...transcript, entry];
    const nextNodeIds = nextTranscript.map((item) => item.nodeId);
    topicsExploredRef.current.add(node.category_id);
    if (nextTranscript.length === 1) {
      trackAskDocumentEvent("assistant_started", {
        surface: "ask_document",
        topic_id: node.category_id,
        question_id: question.id,
        interaction_source: interactionSource,
      });
    }
    trackAskDocumentEvent("question_selected", {
      surface: "ask_document",
      topic_id: node.category_id,
      question_id: question.id,
      interaction_source: interactionSource,
      result_position: resultPosition,
      transcript_depth: nextTranscript.length,
      repeat_selection: repeatedSelection,
    });
    setNotice("");
    setCanUndo(false);
    setSelectedCategoryId(node.category_id);
    setTranscript(nextTranscript);
    writeHistory({
      categoryId: node.category_id,
      nodeId,
      nodeIds: nextNodeIds,
    });

    if (reducedMotion) {
      setLiveMessage(`Prepared answer ready for ${question.public_content.question}`);
      focusAnswer(entry.entryId);
      return;
    }

    setPendingEntryId(entry.entryId);
    setLiveMessage(`Finding the prepared answer for ${question.public_content.question}`);
    loadingTimerRef.current = window.setTimeout(() => {
      setTranscript((current) =>
        current.map((item) =>
          item.entryId === entry.entryId ? { ...item, ready: true } : item,
        ),
      );
      setPendingEntryId(null);
      setLiveMessage(`Prepared answer ready for ${question.public_content.question}`);
      focusAnswer(entry.entryId);
    }, 750);
  }, [focusAnswer, index, pendingEntryId, reducedMotion, transcript]);

  const submitFeedback = useCallback((entry, rating) => {
    const key = feedbackRecordKey(entry.nodeId, entry.questionId);
    const previousFeedback = feedbackByKey[key];
    const node = index?.nodeById.get(entry.nodeId);
    trackAskDocumentEvent("answer_feedback_submitted", {
      surface: "ask_document",
      topic_id: node?.category_id,
      question_id: entry.questionId,
      feedback_rating: rating.replace("-", "_"),
      feedback_changed: Boolean(previousFeedback && previousFeedback.rating !== rating),
      transcript_depth: transcript.findIndex((item) => item.entryId === entry.entryId) + 1,
    });
    markAssistantEngaged("feedback", {
      topic_id: node?.category_id,
      question_id: entry.questionId,
      transcript_depth: transcript.length,
    });

    const record = {
      questionId: entry.questionId,
      nodeId: entry.nodeId,
      rating,
      timestamp: new Date().toISOString(),
    };
    setFeedbackByKey((current) => {
      const next = { ...current, [key]: record };
      try {
        window.localStorage.setItem(feedbackStorageKey, JSON.stringify(Object.values(next)));
      } catch {
        // The selected state remains visible when local storage is unavailable.
      }
      return next;
    });
  }, [feedbackByKey, index, markAssistantEngaged, transcript]);

  const trackAssistantSearch = useCallback(({ matchCount, searchOutcome }) => {
    trackAskDocumentEvent("assistant_search", {
      surface: "ask_document",
      topic_id: selectedCategoryId,
      search_outcome: searchOutcome,
      match_count: matchCount,
      transcript_depth: transcript.length,
    });
  }, [selectedCategoryId, transcript.length]);

  const trackSearchResultSelection = useCallback(({ nodeId, position, searchOutcome }) => {
    const node = index?.nodeById.get(nodeId);
    const question = node ? index.questionById.get(node.question_id) : null;
    trackAskDocumentEvent("search_result_selected", {
      surface: "ask_document",
      topic_id: node?.category_id ?? selectedCategoryId,
      question_id: question?.id,
      interaction_source: "search",
      search_outcome: searchOutcome,
      result_position: position,
      transcript_depth: transcript.length + 1,
    });
    markAssistantEngaged("search_result", {
      topic_id: node?.category_id ?? selectedCategoryId,
      question_id: question?.id,
      transcript_depth: transcript.length + 1,
    });
  }, [index, markAssistantEngaged, selectedCategoryId, transcript.length]);

  const trackAnswerAction = useCallback((entry, node) => {
    trackAskDocumentEvent("answer_action_click", {
      surface: "ask_document",
      topic_id: node.category_id,
      question_id: entry.questionId,
      interaction_source: "prepared_answer",
      transcript_depth: transcript.findIndex((item) => item.entryId === entry.entryId) + 1,
    });
    markAssistantEngaged("answer_action", {
      topic_id: node.category_id,
      question_id: entry.questionId,
      transcript_depth: transcript.length,
    });
  }, [markAssistantEngaged, transcript]);

  const changeCategory = (event) => {
    const categoryId = event.target.value;
    if (!index?.categoryById.has(categoryId)) return;
    topicsExploredRef.current.add(categoryId);
    trackAskDocumentEvent("topic_selected", {
      surface: "ask_document",
      topic_id: categoryId,
      interaction_source: "topic_dropdown",
      transcript_depth: transcript.length,
    });
    setSelectedCategoryId(categoryId);
    setNotice(
      transcript.length
        ? "Topic changed. Your conversation is still below."
        : "",
    );
    window.setTimeout(() => {
      categoryHeadingRef.current?.focus({ preventScroll: true });
    }, 0);
  };

  const startOver = () => {
    if (!transcript.length || !selectedCategoryId) return;
    const viewedAnswers = transcript.filter((entry) =>
      viewedAnswerEntryIdsRef.current.has(entry.entryId),
    ).length;
    trackAskDocumentEvent("conversation_reset", {
      surface: "ask_document",
      topic_id: selectedCategoryId,
      transcript_depth: transcript.length,
      answers_viewed: viewedAnswers,
      topics_explored: topicsExploredRef.current.size,
    });
    window.clearTimeout(loadingTimerRef.current);
    window.clearTimeout(undoTimerRef.current);
    undoStateRef.current = { transcript, selectedCategoryId };
    setTranscript([]);
    setPendingEntryId(null);
    setCanUndo(true);
    setNotice("Conversation cleared.");
    writeHistory({ categoryId: selectedCategoryId, nodeId: null, nodeIds: [] });
    undoTimerRef.current = window.setTimeout(() => setCanUndo(false), 8000);
  };

  const undoStartOver = () => {
    const previous = undoStateRef.current;
    if (!previous) return;
    window.clearTimeout(undoTimerRef.current);
    const restored = previous.transcript.map((entry) => ({ ...entry, ready: true }));
    setSelectedCategoryId(previous.selectedCategoryId);
    setTranscript(restored);
    setCanUndo(false);
    setNotice("Conversation restored.");
    writeHistory({
      categoryId: previous.selectedCategoryId,
      nodeId: restored.at(-1)?.nodeId ?? null,
      nodeIds: restored.map((entry) => entry.nodeId),
    });
    if (restored.length) focusAnswer(restored.at(-1).entryId);
  };

  const retryLoad = () => {
    setData(null);
    setLoadError(false);
    setHydrated(false);
    setLoadAttempt((attempt) => attempt + 1);
  };

  if (loadError) {
    return <DataError onRetry={retryLoad} />;
  }
  if (!data || !index || !hydrated || !selectedCategoryId) return <LoadingState />;

  const category = index.categoryById.get(selectedCategoryId);
  if (!category) return <DataError onRetry={retryLoad} />;
  const startNodeIds = data.navigation.category_start_nodes[selectedCategoryId] ?? [];
  const visitedNodeIds = new Set(transcript.map((entry) => entry.nodeId));

  return (
    <div className={styles.page} data-has-transcript={transcript.length > 0 || undefined}>
      <a className={styles.skipLink} href="#main-content">Skip to main content</a>
      <DemoHeader />
      <main className={styles.main} id="main-content">
        <section className={styles.hero}>
          <p className={styles.kicker}>Interactive Demo</p>
          <h1>Learn about the o1sf US Market Entry Program</h1>
          <p className={styles.heroLead}>
            Choose prepared questions and build a conversation instead of reading everything at once.
          </p>
          <p className={styles.disclaimer}>
            Answers are prepared from a draft knowledge base. They are not generated by live AI, and they do not replace the signed participation agreement or legal advice.
          </p>
        </section>

        <section className={styles.topicPanel} aria-labelledby="topic-heading">
          <div className={styles.topicToolbar}>
            <div>
              <label htmlFor="topic-select">Explore other topics</label>
              <p>Changing topics keeps your conversation.</p>
            </div>
            <select id="topic-select" onChange={changeCategory} value={selectedCategoryId}>
              {data.categories.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </div>
          <div className={styles.topicIntro}>
            <p>Topic {category.display_order} of {data.categories.length}</p>
            <h2 ref={categoryHeadingRef} id="topic-heading" tabIndex="-1">{category.title}</h2>
            <p>{category.short_description}</p>
          </div>
          <TopicQuestions
            disabled={Boolean(pendingEntryId)}
            index={index}
            nodeIds={startNodeIds}
            onSelect={selectQuestion}
            visitedNodeIds={visitedNodeIds}
          />
        </section>

        {notice ? (
          <div className={styles.notice} role="status">
            <span>{notice}</span>
            {canUndo ? <button onClick={undoStartOver} type="button">Undo</button> : null}
          </div>
        ) : null}

        {transcript.length ? (
          <section className={styles.transcript} aria-labelledby="conversation-heading" aria-busy={Boolean(pendingEntryId)}>
            <div className={styles.transcriptHeading}>
              <div>
                <p>Your conversation</p>
                <h2 id="conversation-heading">Prepared answers</h2>
              </div>
              <button disabled={Boolean(pendingEntryId)} onClick={startOver} type="button">Start over</button>
            </div>
            <div className={styles.transcriptLog} role="log" aria-label="Conversation transcript">
              {transcript.map((entry) => (
                <TranscriptEntry
                  answerRef={(element) => {
                    if (element) answerRefs.current.set(entry.entryId, element);
                    else answerRefs.current.delete(entry.entryId);
                  }}
                  disabled={Boolean(pendingEntryId)}
                  entry={entry}
                  feedback={feedbackByKey[feedbackRecordKey(entry.nodeId, entry.questionId)]}
                  index={index}
                  key={entry.entryId}
                  onAnswerAction={trackAnswerAction}
                  onFeedback={submitFeedback}
                  onSelect={selectQuestion}
                  visitedNodeIds={visitedNodeIds}
                />
              ))}
            </div>
          </section>
        ) : null}

        <SearchPanel
          category={category}
          data={data}
          disabled={Boolean(pendingEntryId)}
          index={index}
          onSearch={trackAssistantSearch}
          onSearchResultSelect={trackSearchResultSelection}
          onSelect={selectQuestion}
        />

        <footer className={styles.demoFooter}>
          <p>Prepared local answers only. No live AI or answer API is used.</p>
        </footer>
      </main>
      <div className={styles.liveRegion} aria-live="polite" aria-atomic="true">{liveMessage}</div>
    </div>
  );
}
