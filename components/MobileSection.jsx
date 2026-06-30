export function MobileSection({ id, className, ariaLabel, children }) {
  return (
    <section id={id} className={`mobile-section ${className}`} aria-label={ariaLabel}>
      <div className="section-inner">{children}</div>
    </section>
  );
}
