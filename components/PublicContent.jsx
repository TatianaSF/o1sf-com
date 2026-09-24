import Link from "next/link";

import { TatianaLink } from "./TatianaLink";
import styles from "./public-content.module.css";

export function PublicPage({ children, article = false }) {
  const Component = article ? "article" : "main";
  return <Component className={styles.page}>{children}</Component>;
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol>
        {items.map((item, index) => (
          <li key={item.href}>
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PublicHero({ eyebrow, title, lede, breadcrumbs, children }) {
  return (
    <header className={styles.hero}>
      <div className={styles.shell}>
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.lede}>{lede}</p>
          {children}
        </div>
      </div>
    </header>
  );
}

export function PublicSection({ eyebrow, title, lead, children, tone = "white", id }) {
  const sectionClass = [styles.section, styles[`section_${tone}`]].filter(Boolean).join(" ");

  return (
    <section className={sectionClass} id={id}>
      <div className={styles.shell}>
        <div className={styles.sectionIntro}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h2>{title}</h2>
          {lead ? <p className={styles.sectionLead}>{lead}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function ArticleMeta({ updated = "July 16, 2026", readingTime }) {
  return (
    <div className={styles.articleMeta}>
      <span>
        By <TatianaLink />
      </span>
      <span>Updated {updated}</span>
      {readingTime ? <span>{readingTime} read</span> : null}
    </div>
  );
}

export function PublicCta({
  eyebrow = "Continue exploring",
  title = "From assumptions to 💲 paying customers.",
  text = "Review the evidence-first methodology, program structure, pricing, and prepared answers before drawing conclusions about fit. Paying customers and revenue are not guaranteed.",
  primaryHref = "/ask_document/",
  primaryLabel = "Explore the AI guide",
  secondaryHref = "/program",
  secondaryLabel = "Review the program",
}) {
  return (
    <section className={styles.cta}>
      <div className={`${styles.shell} ${styles.ctaInner}`}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className={styles.ctaActions}>
          <Link
            className={styles.primaryAction}
            data-analytics-cta-location="public_page"
            data-analytics-destination="ask_document"
            data-analytics-event="assistant_opened"
            data-analytics-surface="public_content"
            href={primaryHref}
            prefetch={false}
          >
            {primaryLabel}
            <span aria-hidden="true">→</span>
          </Link>
          <Link className={styles.secondaryAction} href={secondaryHref}>
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function JsonLd({ data }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
      type="application/ld+json"
    />
  );
}

export { styles as publicContentStyles };
