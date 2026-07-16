"use client";

import { useMemo, useState } from "react";

import {
  guideAnswers,
  isRussianQuestion,
  matchGuideAnswer,
  quickQuestions,
} from "../../lib/program-content";

const defaultQuestion = "What results should I expect?";

export function ProgramGuide({ compact = false, initialQuestion = defaultQuestion }) {
  const [question, setQuestion] = useState(initialQuestion);
  const [submittedQuestion, setSubmittedQuestion] = useState(initialQuestion);
  const [error, setError] = useState("");
  const answer = useMemo(() => matchGuideAnswer(submittedQuestion), [submittedQuestion]);
  const language = isRussianQuestion(submittedQuestion) ? "ru" : "en";
  const visibleQuestions = compact ? quickQuestions.slice(0, 4) : quickQuestions;

  const askQuestion = (nextQuestion) => {
    const normalized = nextQuestion.trim();

    if (!normalized) {
      setError("Enter a question about the program before asking the guide.");
      return;
    }

    setError("");
    setQuestion(normalized);
    setSubmittedQuestion(normalized);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    askQuestion(question);
  };

  return (
    <section className={`program-guide ${compact ? "program-guide-compact" : ""}`} aria-label="O1SF AI Guide">
      <div className="program-guide-heading">
        <div className="program-guide-orbit" aria-hidden="true"><span /></div>
        <div>
          <p>O1SF AI Guide</p>
          <span>Knowledge Base v3.1 · Draft</span>
        </div>
      </div>

      <div className="program-guide-prompts" aria-label="Suggested questions">
        {visibleQuestions.map((item) => (
          <button key={item} type="button" onClick={() => askQuestion(item)}>
            {item}
          </button>
        ))}
      </div>

      <form className="program-guide-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor={compact ? "hero-guide-question" : "guide-question"}>Ask about the program</label>
        <div className="program-guide-field">
          <input
            id={compact ? "hero-guide-question" : "guide-question"}
            name="question"
            value={question}
            aria-describedby={error ? "guide-error" : undefined}
            aria-invalid={Boolean(error)}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="For example: What is included in the price?"
          />
          <button type="submit" aria-label="Ask the O1SF AI Guide">
            <span>Ask</span>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
        {error ? <p className="program-field-error" id="guide-error">{error}</p> : null}
      </form>

      <article className={`program-guide-answer program-answer-${answer.tone}`} aria-live="polite">
        <div className="program-answer-meta">
          <span className="program-status-dot" aria-hidden="true" />
          <strong>{answer.status}</strong>
        </div>
        <h2>{answer.title[language]}</h2>
        <p>{answer.body[language]}</p>
        <p className="program-answer-note">{answer.note[language]}</p>
        <footer>
          <span>Source</span>
          <strong>{answer.source}</strong>
        </footer>
      </article>

      {!compact ? (
        <div className="program-guide-index" aria-label="Available knowledge topics">
          <p>Available knowledge topics</p>
          <ul>
            {guideAnswers.map((item) => <li key={item.id}>{item.source.split(" · ")[0]}</li>)}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
