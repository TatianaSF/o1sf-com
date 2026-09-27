import styles from "./AiFutureSim.module.css";

export function Card({ children, className = "", ...props }) {
  return <section className={`${styles.card} ${className}`} {...props}>{children}</section>;
}

export function ActionButton({ children, className = "", ...props }) {
  return <button className={`${styles.primaryButton} ${className}`} {...props}>{children}</button>;
}

export function SelectionCard({ title, description, className = "", ...props }) {
  return (
    <button className={`${styles.selectionCard} ${className}`} {...props}>
      <span className={styles.selectionCopy}>
        <strong className={styles.selectionTitle}>{title}</strong>
        <span className={styles.selectionDescription}>{description}</span>
      </span>
      <span className={styles.selectionArrow} aria-hidden="true">→</span>
    </button>
  );
}

export function ChoiceCard({ choice, index, resourceCosts, onSelect, lockId, language = "en", costLabel = "Cost", lockedLabel = "Locked" }) {
  return (
    <li className={styles.choiceItem}>
      <button
        className={`${styles.choiceCard} ${choice.available ? "" : styles.choiceLocked}`}
        type="button"
        data-choice-id={choice.id}
        aria-describedby={choice.available ? undefined : lockId}
        disabled={!choice.available}
        onClick={() => onSelect(choice.id)}
      >
        <span className={styles.choiceNumber} aria-hidden="true">{index + 1}</span>
        <span className={styles.choiceCopy}>
          <span className={styles.choiceTitle}>{choice.title}</span>
          <span className={styles.choiceDescription}>{choice.description}</span>
          {resourceCosts.length > 0 && (
            <span className={styles.costList} aria-label={`${costLabel}: ${resourceCosts.map(({ label, amount }) => `${label} ${amount}`).join(", ")}`} lang={language}>
              <span className={styles.costLabel}>{costLabel}</span>
              {resourceCosts.map(({ resourceId, label, amount }) => (
                <span className={styles.costChip} key={resourceId}>{label} <strong>{amount}</strong></span>
              ))}
            </span>
          )}
        </span>
        <span className={styles.choiceAffordance} aria-hidden="true">{choice.available ? "→" : lockedLabel}</span>
      </button>
      {!choice.available && <p className={styles.lockReason} id={lockId} lang={language}>{choice.lockedReason}</p>}
    </li>
  );
}
