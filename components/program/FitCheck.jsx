"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { programBasePath } from "../../lib/program-content";

const fitQuestions = [
  {
    id: "market",
    question: "Are you planning to enter or expand in the U.S. market?",
    fail: "The program is designed specifically for founders entering or expanding in the U.S. market.",
  },
  {
    id: "schedule",
    question: "Can you participate in both online weeks and the in-person week in San Francisco?",
    fail: "Participation across all three weeks is a core program requirement.",
  },
  {
    id: "entry",
    question: "If you are an international founder, do you already have valid U.S. entry authorization?",
    fail: "International founders need a valid visa or other legal authorization for the San Francisco week before final acceptance and payment.",
    allowNotApplicable: true,
  },
  {
    id: "english",
    question: "Can you work, pitch and hold business conversations in English?",
    fail: "English is the main working language and interpretation is not included by default.",
  },
  {
    id: "execution",
    question: "Are you prepared to do direct outreach, market testing and revise your approach from feedback?",
    fail: "The program is execution-led and requires active outreach, testing and iteration.",
  },
];

export function FitCheck() {
  const [answers, setAnswers] = useState({});
  const answeredCount = Object.keys(answers).length;
  const failedItems = useMemo(
    () => fitQuestions.filter((item) => answers[item.id] === "no"),
    [answers],
  );
  const complete = answeredCount === fitQuestions.length;

  const setAnswer = (id, value) => {
    setAnswers((current) => ({ ...current, [id]: value }));
  };

  return (
    <section className="program-fit-check" aria-labelledby="fit-check-title">
      <div className="program-fit-progress">
        <span>{answeredCount} of {fitQuestions.length} answered</span>
        <div aria-hidden="true"><span style={{ transform: `scaleX(${answeredCount / fitQuestions.length})` }} /></div>
      </div>
      <h2 id="fit-check-title">Check the core participation requirements</h2>
      <p>This is an informational fit check, not an application or acceptance decision.</p>

      <div className="program-fit-list">
        {fitQuestions.map((item, index) => (
          <fieldset key={item.id}>
            <legend><span>{index + 1}</span>{item.question}</legend>
            <div>
              <button
                className={answers[item.id] === "yes" ? "is-selected" : ""}
                type="button"
                aria-pressed={answers[item.id] === "yes"}
                onClick={() => setAnswer(item.id, "yes")}
              >Yes</button>
              {item.allowNotApplicable ? (
                <button
                  className={answers[item.id] === "na" ? "is-selected" : ""}
                  type="button"
                  aria-pressed={answers[item.id] === "na"}
                  onClick={() => setAnswer(item.id, "na")}
                >Not applicable</button>
              ) : null}
              <button
                className={answers[item.id] === "no" ? "is-selected is-negative" : ""}
                type="button"
                aria-pressed={answers[item.id] === "no"}
                onClick={() => setAnswer(item.id, "no")}
              >No</button>
            </div>
          </fieldset>
        ))}
      </div>

      <div className="program-fit-result" aria-live="polite">
        {!complete ? (
          <p>Answer all five questions to see the relevant next step.</p>
        ) : failedItems.length ? (
          <>
            <strong>Some core requirements may not be met yet.</strong>
            <ul>{failedItems.map((item) => <li key={item.id}>{item.fail}</li>)}</ul>
            <Link className="program-button program-button-secondary" href={`${programBasePath}/guide`} prefetch={false}>
              Ask the AI Guide
            </Link>
          </>
        ) : (
          <>
            <strong>Your answers align with the core participation requirements.</strong>
            <p>The application URL, deadline and cohort dates are not currently confirmed. Completing this check does not guarantee acceptance.</p>
            <Link className="program-button program-button-primary" href={`${programBasePath}/guide`} prefetch={false}>
              Ask a question before applying
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
