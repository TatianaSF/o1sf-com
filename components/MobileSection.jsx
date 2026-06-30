export function MobileSection({ id, className, ariaLabel, children }) {
  return (
    <section id={id} className={`mobile-section ${className}`} aria-label={ariaLabel}>
      <div className="phone-topbar" aria-hidden="true">
        <span>O1SF</span>
        <span className="phone-menu-icon">
          <span />
          <span />
          <span />
        </span>
      </div>
      <div className="section-inner">{children}</div>
    </section>
  );
}
