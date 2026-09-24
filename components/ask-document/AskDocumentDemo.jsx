"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  askDocumentQuestionById,
  askDocumentQuestionBySlug,
  askDocumentQuestions,
  askDocumentReadingHref,
} from "../../lib/ask-document-data.js";
import { trackAskDocumentEvent } from "../../lib/ask-document-events.js";
import { matchCustomQuestion } from "../../lib/ask-document-matcher.js";
import { AskDocumentIcon } from "./AskDocumentIcon.jsx";
import styles from "./ask-document.module.css";

const feedbackStorageKey = "o1sf:ask-document-feedback";

function readUrlState() {
  if (typeof window === "undefined") return { question: null, view: "list" };

  const url = new URL(window.location.href);
  const question = askDocumentQuestionBySlug.get(url.searchParams.get("question"));

  if (!question) return { question: null, view: "list" };
  return {
    question,
    view: url.searchParams.get("view") === "full" ? "full" : "preview",
  };
}

function writeUrlState(question, view, mode = "push") {
  const url = new URL(window.location.href);

  if (question) {
    url.searchParams.set("question", question.slug);
    if (view === "full") url.searchParams.set("view", "full");
    else url.searchParams.delete("view");
  } else {
    url.searchParams.delete("question");
    url.searchParams.delete("view");
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  const state = question ? { askDocument: true, question: question.slug, view } : { askDocument: true, view: "list" };
  window.history[mode === "replace" ? "replaceState" : "pushState"](state, "", nextUrl);
}

function CustomQuestionForm({ context, onMatch, inputRef }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const inputId = `custom-question-${context}`;
  const resultId = `${inputId}-result`;

  const submitQuestion = (event) => {
    event.preventDefault();
    const matchResult = matchCustomQuestion(value);

    if (matchResult.type === "empty") {
      setResult({ type: "error", message: "Enter a question about the program to continue." });
      return;
    }

    trackAskDocumentEvent("custom_question_submitted", {
      surface: "ask_document_legacy",
      search_outcome: matchResult.type,
      question_id: matchResult.match?.id,
      match_count: matchResult.match ? 1 : matchResult.suggestions.length,
    });

    if (matchResult.type === "match") {
      setResult(null);
      onMatch(matchResult.match, "custom");
      return;
    }

    if (matchResult.type === "suggestions") {
      setResult({
        type: "suggestions",
        message: "These prepared questions are the closest match:",
        suggestions: matchResult.suggestions,
      });
      return;
    }

    setResult({
      type: "fallback",
      message:
        "This interactive demo currently answers questions about the program topics below. Choose the closest question to continue.",
    });
  };

  return (
    <div className={`${styles.customQuestion} ${context === "list" ? styles.customQuestionSticky : ""}`}>
      <form onSubmit={submitQuestion} noValidate>
        <label className={styles.screenReaderOnly} htmlFor={inputId}>Ask your own question</label>
        <div className={styles.customQuestionField}>
          <AskDocumentIcon className={styles.fieldIcon} name="search" />
          <input
            ref={inputRef}
            id={inputId}
            value={value}
            aria-describedby={result ? resultId : undefined}
            aria-invalid={result?.type === "error"}
            autoComplete="off"
            enterKeyHint="send"
            maxLength={240}
            name="question"
            onChange={(event) => {
              setValue(event.target.value);
              if (result?.type === "error") setResult(null);
            }}
            placeholder="Ask your own question…"
            type="search"
          />
          <button aria-label="Match this question to the document" type="submit">
            <AskDocumentIcon name="send" />
          </button>
        </div>
      </form>

      {result ? (
        <div className={styles.customResult} id={resultId} role={result.type === "error" ? "alert" : "status"}>
          <p>{result.message}</p>
          {result.suggestions?.length ? (
            <div className={styles.customSuggestions}>
              {result.suggestions.map((question) => (
                <button key={question.id} onClick={() => onMatch(question, "custom-suggestion")} type="button">
                  {question.question}
                  <AskDocumentIcon name="chevron" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function QuestionGrid({ activeQuestionId, loading, onSelect }) {
  return (
    <div className={styles.questionGrid} aria-label="Prepared questions">
      {askDocumentQuestions.map((question, index) => {
        const selected = activeQuestionId === question.id;
        const isLoading = selected && loading;

        return (
          <button
            key={question.id}
            className={styles.questionCard}
            data-selected={selected || undefined}
            aria-pressed={selected}
            onClick={() => onSelect(question, "grid")}
            type="button"
          >
            <span className={styles.questionNumber} aria-hidden="true">
              {isLoading ? <span className={styles.spinner} /> : index + 1}
            </span>
            <span>{question.question}</span>
          </button>
        );
      })}
    </div>
  );
}

function LoadingAnswer({ question }) {
  return (
    <div className={styles.loadingAnswer} aria-live="polite" role="status">
      <div className={styles.loadingLabel}>
        <span className={styles.spinner} aria-hidden="true" />
        Finding the prepared answer…
      </div>
      <h2>{question.question}</h2>
      <div className={styles.skeletonLines} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function AnswerPreview({ question, onFullAnswer }) {
  return (
    <div className={styles.previewAnswer}>
      <span className={styles.previewStatus}>{question.status}</span>
      <h2>{question.question}</h2>
      <p>{question.shortAnswer}</p>
      <button className={styles.previewPrimary} onClick={onFullAnswer} type="button">
        Read full answer
        <AskDocumentIcon name="arrow" />
      </button>
      <p className={styles.previewSource}>Prepared locally from: {question.sourceSection}</p>
    </div>
  );
}

function SiteDataResetLink() {
  return (
    <footer className={styles.siteDataReset}>
      <p>Having trouble opening answers?</p>
      <a href="/clear-site-data">Clear this site&apos;s cache and saved data</a>
      <small>This affects only o1sf.com in this browser, then reloads the demo.</small>
    </footer>
  );
}

function DemoTopbar({ onBack, showBack = false }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarInner}>
        {showBack ? (
          <button className={styles.topbarIconButton} aria-label="Go back" onClick={onBack} type="button">
            <AskDocumentIcon name="back" />
          </button>
        ) : (
          <Link className={styles.brandMark} href="/" aria-label="O1SF home">O1</Link>
        )}
        <span className={styles.topbarTitle}>Document</span>
        <span className={styles.demoBadge}>Interactive Demo</span>
      </div>
    </header>
  );
}

function FullAnswer({ feedback, onBack, onCustomQuestion, onFeedback, onRelated, question, followUpInputRef }) {
  const headingRef = useRef(null);
  const relatedQuestions = question.relatedQuestionIds
    .map((id) => askDocumentQuestionById.get(id))
    .filter(Boolean);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [question.id]);

  const focusFollowUp = () => {
    followUpInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    followUpInputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className={styles.fullPage}>
      <DemoTopbar onBack={onBack} showBack />
      <main className={styles.fullAnswer}>
        <div className={styles.questionLabel}>Question</div>
        <h1 ref={headingRef} tabIndex="-1">{question.question}</h1>
        <p className={styles.answerIntro}>{question.intro}</p>

        <section className={styles.keyPoints} aria-labelledby="key-points-heading">
          <h2 className={styles.screenReaderOnly} id="key-points-heading">Key points</h2>
          {question.keyPoints.map((point, index) => (
            <div className={styles.keyPoint} key={point}>
              <span aria-hidden="true">{index + 1}</span>
              <p>{point}</p>
            </div>
          ))}
        </section>

        <aside className={styles.limitation} data-tone={question.statusTone}>
          <div>
            <AskDocumentIcon name="help" />
            <strong>{question.status}</strong>
          </div>
          <p>{question.limitations}</p>
        </aside>

        <div className={styles.answerActions}>
          <a
            aria-label="Read in the document"
            href={question.sourceHref}
            onClick={() => {
              const properties = {
                surface: "ask_document_legacy",
                question_id: question.id,
                section_id: question.sourceAnchor,
              };
              trackAskDocumentEvent("document_section_opened", properties);
              trackAskDocumentEvent("program_document_opened", properties);
            }}
          >
            <span><AskDocumentIcon name="document" />Read in the document</span>
            <AskDocumentIcon name="chevron" />
          </a>
          <button aria-label="Ask a follow-up question" onClick={focusFollowUp} type="button">
            <span><AskDocumentIcon name="sparkle" />Ask follow-up</span>
            <AskDocumentIcon name="chevron" />
          </button>
        </div>

        <section className={styles.feedback} aria-labelledby="feedback-heading">
          <p id="feedback-heading">Was this helpful?</p>
          <div>
            <button
              aria-label="This answer was helpful"
              aria-pressed={feedback === "helpful"}
              disabled={Boolean(feedback)}
              onClick={() => onFeedback("helpful")}
              type="button"
            >
              <AskDocumentIcon name="thumbsUp" />
            </button>
            <button
              aria-label="This answer was not helpful"
              aria-pressed={feedback === "not-helpful"}
              disabled={Boolean(feedback)}
              onClick={() => onFeedback("not-helpful")}
              type="button"
            >
              <AskDocumentIcon name="thumbsDown" />
            </button>
          </div>
          <span aria-live="polite">{feedback ? "Thanks - your feedback is saved on this device." : ""}</span>
        </section>

        <section className={styles.related} aria-labelledby="related-heading">
          <h2 id="related-heading">Related questions</h2>
          <div>
            {relatedQuestions.map((relatedQuestion) => (
              <button key={relatedQuestion.id} onClick={() => onRelated(relatedQuestion)} type="button">
                {relatedQuestion.question}
                <AskDocumentIcon name="chevron" />
              </button>
            ))}
          </div>
        </section>

        <CustomQuestionForm context="full" inputRef={followUpInputRef} onMatch={onCustomQuestion} />

        <a className={styles.continueReading} href={askDocumentReadingHref}>
          <AskDocumentIcon name="book" />
          Continue reading the program document
          <AskDocumentIcon name="chevron" />
        </a>

        <p className={styles.draftNotice}>
          This demo uses a draft knowledge base and prepared local answers. It is not a live AI service and does not replace signed legal terms.
        </p>

        <SiteDataResetLink />
      </main>
    </div>
  );
}

export function AskDocumentDemo() {
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [feedbackByQuestion, setFeedbackByQuestion] = useState({});
  const [phase, setPhase] = useState("list");
  const dialogRef = useRef(null);
  const followUpInputRef = useRef(null);
  const loadingTimerRef = useRef(null);
  const activeQuestion = activeQuestionId ? askDocumentQuestionById.get(activeQuestionId) : null;
  const dialogVisible = Boolean(activeQuestion) && (phase === "loading" || phase === "preview");

  const syncFromUrl = useCallback(() => {
    const urlState = readUrlState();
    window.clearTimeout(loadingTimerRef.current);
    setActiveQuestionId(urlState.question?.id ?? null);
    setPhase(urlState.view);
  }, []);

  useEffect(() => {
    const hydrateTimer = window.setTimeout(() => {
      syncFromUrl();
      try {
        const savedFeedback = JSON.parse(window.localStorage.getItem(feedbackStorageKey) || "{}");
        if (savedFeedback && typeof savedFeedback === "object") setFeedbackByQuestion(savedFeedback);
      } catch {
        // The demo remains usable when storage is unavailable or contains invalid data.
      }
    }, 0);

    trackAskDocumentEvent("ask_document_viewed", {
      surface: "ask_document_legacy",
      question_id: readUrlState().question?.id,
    });

    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      window.clearTimeout(hydrateTimer);
      window.clearTimeout(loadingTimerRef.current);
    };
  }, [syncFromUrl]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (dialogVisible && !dialog.open) dialog.showModal();
    if (!dialogVisible && dialog.open) dialog.close();
  }, [dialogVisible]);

  const openQuestion = useCallback((question, origin = "grid") => {
    window.clearTimeout(loadingTimerRef.current);
    setActiveQuestionId(question.id);
    setPhase("loading");
    writeUrlState(question, "preview");

    const properties = {
      surface: "ask_document_legacy",
      question_id: question.id,
      interaction_source: origin,
    };
    trackAskDocumentEvent("question_selected", properties);
    if (origin === "related") {
      trackAskDocumentEvent("related_question_selected", properties);
    }

    loadingTimerRef.current = window.setTimeout(() => {
      setPhase("preview");
      trackAskDocumentEvent("short_answer_opened", properties);
    }, 180);
  }, []);

  const closePreview = useCallback(() => {
    window.clearTimeout(loadingTimerRef.current);
    setActiveQuestionId(null);
    setPhase("list");
    writeUrlState(null, "list", "replace");
  }, []);

  const openFullAnswer = useCallback(() => {
    if (!activeQuestion) return;
    setPhase("full");
    writeUrlState(activeQuestion, "full");
    trackAskDocumentEvent("full_answer_opened", {
      surface: "ask_document_legacy",
      question_id: activeQuestion.id,
    });
  }, [activeQuestion]);

  const goBack = useCallback(() => {
    if (window.history.state?.askDocument) {
      window.history.back();
      return;
    }

    setActiveQuestionId(null);
    setPhase("list");
    writeUrlState(null, "list", "replace");
  }, []);

  const openRelated = useCallback((question) => openQuestion(question, "related"), [openQuestion]);

  const submitFeedback = useCallback((value) => {
    if (!activeQuestion || feedbackByQuestion[activeQuestion.id]) return;

    const nextFeedback = { ...feedbackByQuestion, [activeQuestion.id]: value };
    setFeedbackByQuestion(nextFeedback);
    try {
      window.localStorage.setItem(feedbackStorageKey, JSON.stringify(nextFeedback));
    } catch {
      // Component state still prevents accidental duplicate feedback in this session.
    }
    trackAskDocumentEvent("answer_feedback_submitted", {
      surface: "ask_document_legacy",
      question_id: activeQuestion.id,
      feedback_rating: value,
    });
  }, [activeQuestion, feedbackByQuestion]);

  if (phase === "full" && activeQuestion) {
    return (
      <FullAnswer
        feedback={feedbackByQuestion[activeQuestion.id]}
        followUpInputRef={followUpInputRef}
        onBack={goBack}
        onCustomQuestion={openQuestion}
        onFeedback={submitFeedback}
        onRelated={openRelated}
        question={activeQuestion}
      />
    );
  }

  return (
    <div className={styles.demoPage}>
      <DemoTopbar />
      <main className={styles.demoMain}>
        <section className={styles.readPanel} aria-labelledby="ask-document-title">
          <div className={styles.bookIcon}><AskDocumentIcon name="book" /></div>
          <div>
            <h1 id="ask-document-title">Read in-depth or ask questions</h1>
            <p>Explore the draft program information in full detail.</p>
            <p>Estimated reading time: <strong>25 min</strong></p>
          </div>
          <a href={askDocumentReadingHref}>
            Read in depth
            <AskDocumentIcon name="arrow" />
          </a>
        </section>

        <div className={styles.orDivider}><span>or</span></div>

        <section className={styles.askSection} aria-labelledby="prepared-questions-heading">
          <div className={styles.askHeading}>
            <AskDocumentIcon name="sparkle" />
            <div>
              <h2 id="prepared-questions-heading">Ask questions about this document</h2>
              <p>Choose a prepared question below or ask your own. Answers stay on this device.</p>
            </div>
          </div>

          <QuestionGrid
            activeQuestionId={activeQuestionId}
            loading={phase === "loading"}
            onSelect={openQuestion}
          />

          <CustomQuestionForm context="list" onMatch={openQuestion} />
        </section>

        <p className={styles.homeNotice}>
          Prepared local answers only - no live AI, API, database, or network request is used for answers.
        </p>

        <SiteDataResetLink />
      </main>

      <dialog
        ref={dialogRef}
        className={styles.answerDialog}
        aria-label="Prepared answer preview"
        onCancel={(event) => {
          event.preventDefault();
          closePreview();
        }}
      >
        <div className={styles.sheetHandle} aria-hidden="true" />
        <button className={styles.closeButton} aria-label="Close answer preview" autoFocus onClick={closePreview} type="button">
          <AskDocumentIcon name="close" />
        </button>
        <div>
          {phase === "loading" ? <LoadingAnswer question={activeQuestion} /> : null}
          {phase === "preview" ? <AnswerPreview onFullAnswer={openFullAnswer} question={activeQuestion} /> : null}
        </div>
      </dialog>

      <div className={styles.screenReaderOnly} aria-live="polite">
        {phase === "loading" ? `Loading the prepared answer for ${activeQuestion?.question}` : ""}
      </div>
    </div>
  );
}
