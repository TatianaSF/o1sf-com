"use client";

import { useEffect, useMemo, useState } from "react";
import { messages } from "./messages";
import { buildHandoff } from "./workflow";
import styles from "./TatianaAssistant.module.css";

const budgetChoices = (t) => [...t.budgets];

export default function TatianaAssistant() {
  const [ru, setRu] = useState(false);
  const [history, setHistory] = useState([]);
  const [state, setState] = useState({});
  const [step, setStep] = useState({ id: "start", choices: [] });
  const [copyStatus, setCopyStatus] = useState("idle");
  const t = useMemo(() => messages[ru ? "ru" : "en"], [ru]);
  useEffect(() => setRu(new URLSearchParams(window.location.search).has("ru")), []);
  const push = (answer, next, patch = {}) => { setHistory((h) => [...h, { answer, step }]); setState((s) => ({ ...s, ...patch })); setStep(next); };
  const resetFrom = (index) => { const item = history[index]; setHistory(history.slice(0, index)); setStep(item.step); setState({}); };
  const final = (answer, patch) => { const nextState = { ...state, ...patch }; setState(nextState); setHistory((h) => [...h, { answer, step }]); setStep({ id: "final", choices: [] }); };
  const choose = (key) => {
    if (step.id === "start") return push(t.choices[key], { id: key === "active" ? "activeEvent" : key === "sponsor" ? "sponsorBudget" : key === "hire" ? "hireBudget" : key === "partnership" ? "partnershipType" : "attendEnd", choices: key === "active" ? ["commercial", "codex"] : key === "sponsor" || key === "hire" ? ["yes", "notYet"] : key === "partnership" ? ["partnershipChoices"] : [] }, { category: key });
    if (step.id === "activeEvent") return push(t[key], { id: key === "codex" ? "codexNote" : "role", choices: key === "codex" ? ["continueRole"] : ["roleChoices"] }, { eventType: t[key] });
    if (step.id === "codexNote") return push(t.codexNote, { id: "role", choices: ["roleChoices"] });
    if (step.id === "role") return push(key, { id: "budgetStatus", choices: ["yes", "notYet"] }, { role: key });
    if (["sponsorBudget", "hireBudget", "paidBudget"].includes(step.id)) return key === "notYet" ? push(t.notYet, { id: "noBudget", choices: ["findEvents"] }) : push(t.yes, { id: "budget", choices: ["budgets"] }, { approved: true });
    if (step.id === "budget") return key === "$50,000+" && state.category === "active" ? final(key, { budget: key }) : push(key, { id: key === "Less than $5,000" || key === "Меньше $5,000" ? "lowerBudget" : "final", choices: key === "Less than $5,000" || key === "Меньше $5,000" ? ["lowerBudgets"] : [] }, { budget: key });
    if (step.id === "lowerBudget") return final(key, { budget: key });
    if (step.id === "budgetStatus") return key === "notYet" ? push(t.notYet, { id: "noBudget", choices: ["findEvents"] }) : push(t.yes, { id: "budget", choices: ["budgets"] }, { approved: true });
    if (step.id === "partnershipType") return key === "We can offer future commissions" || key === "Мы можем предложить будущие комиссии" ? push(key, { id: "paidBudget", choices: ["yes", "notYet"] }, { partnershipType: key }) : push(key, { id: "budget", choices: ["budgets"] }, { partnershipType: key, approved: true });
    if (step.id === "findEvents") window.open("https://www.google.com/search?q=TatianaSF+lu.ma", "_blank", "noopener,noreferrer");
  };
  const copyMessage = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
    window.setTimeout(() => setCopyStatus("idle"), 2000);
  };
  const text = step.id === "start" ? t.start : step.id === "activeEvent" ? t.activeEvent : step.id === "codexNote" ? t.codexNote : step.id === "role" ? t.role : step.id === "budgetStatus" ? t.budgetStatus : step.id === "sponsorBudget" ? t.sponsorBudget : step.id === "hireBudget" ? t.hireBudget : step.id === "budget" ? t.budget : step.id === "lowerBudget" ? t.lowerBudget : step.id === "partnershipType" ? `${t.partnershipNote} ${t.partnershipType}` : step.id === "paidBudget" ? `${t.commissionNote} ${t.paidBudget}` : step.id === "noBudget" ? t.noBudget : step.id === "final" ? buildHandoff(state, t) : step.id === "attendEnd" ? t.findEvents : "";
  const choices = step.id === "start" ? Object.keys(t.choices) : step.id === "activeEvent" ? ["commercial", "codex"] : step.id === "codexNote" ? ["continueRole"] : step.id === "role" ? t.roles : step.id === "budgetStatus" || ["sponsorBudget", "hireBudget", "paidBudget"].includes(step.id) ? ["yes", "notYet"] : step.id === "budget" ? budgetChoices(t) : step.id === "lowerBudget" ? t.lowerBudgets : step.id === "partnershipType" ? t.partnershipChoices : step.id === "noBudget" || step.id === "attendEnd" ? ["findEvents"] : [];
  const label = (choice) => choice === "continueRole" ? (ru ? "Продолжить" : "Continue") : choice;
  return <main className={styles.shell}><section className={styles.card}><header className={styles.header}><div className={styles.eyebrow}>TatianaSF Assistant</div><h1 className={styles.title}>A focused conversation</h1></header><div className={styles.conversation}>{history.map((item, i) => <div className={styles.history} key={`${item.answer}-${i}`}><div className={styles.user}>{item.answer}</div><button className={`${styles.action} ${styles.change}`} onClick={() => resetFrom(i)}>{t.change}</button></div>)}<div className={step.id === "final" ? `${styles.bubble} ${styles.handoff}` : styles.bubble}>{text}</div>{step.id === "final" && <><p className={styles.guidance}>{t.copyGuidance}</p><button className={styles.action} onClick={copyMessage} aria-live="polite">{copyStatus === "copied" ? t.copied : copyStatus === "failed" ? t.copyFailed : t.copy}</button><a className={styles.action} href="https://www.linkedin.com/in/TatianaSF" target="_blank" rel="noreferrer">{t.linkedin}</a></>}{choices.length > 0 && <div className={styles.choices}>{choices.map((key) => <button className={styles.choice} key={key} onClick={() => choose(key)}>{step.id === "role" ? key : label(t.choices[key] || t[key] || key)}</button>)}</div>}</div><footer className={styles.footer}>Choose a reply to continue.</footer></section></main>;
}
