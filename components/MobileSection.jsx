export function MobileSection({ id, className, ariaLabel, progress, children }) {
  return (
    <section id={id} className={`mobile-section ${className}`} aria-label={ariaLabel}>
      <div className="phone-topbar" aria-hidden="true">
        <span>O1SF</span>
        {progress ? <span className="phone-progress">{progress}</span> : null}
      </div>
      <div className="section-inner">{children}</div>
    </section>
  );
}
