import Link from "next/link";

import { programBasePath } from "../../lib/program-content";

export function PolicyPage({ policy }) {
  return (
    <>
      <section className="program-page-hero program-policy-hero">
        <div className="program-shell">
          <p className="program-kicker">{policy.eyebrow}</p>
          <h1>{policy.title}</h1>
          <p>{policy.summary}</p>
          <div className="program-policy-meta">
            <span>{policy.status}</span>
            <span>Updated {policy.updated}</span>
          </div>
        </div>
      </section>

      <section className="program-policy-body">
        <div className="program-shell program-policy-layout">
          <aside className="program-policy-notice">
            <span>Important now</span>
            <p>{policy.notice}</p>
          </aside>
          <div className="program-policy-sections">
            {policy.sections.map((section, index) => (
              <section key={section.title} id={`section-${index + 1}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{section.title}</h2>
                  {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets && (
                    <ul className="program-check-list">
                      {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                    </ul>
                  )}
                </div>
              </section>
            ))}
            {policy.sources && (
              <section className="program-policy-sources">
                <span>REF</span>
                <div>
                  <h2>Reference framework</h2>
                  <p>These external resources inform the baseline. They do not replace the final program notice or legal review.</p>
                  <ul>
                    {policy.sources.map(([label, href]) => (
                      <li key={href}><a href={href} target="_blank" rel="noreferrer">{label} <span aria-hidden="true">↗</span></a></li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      <section className="program-policy-next">
        <div className="program-shell">
          <div><p>Program standards</p><h2>Read the rules before you decide.</h2></div>
          <Link className="program-button program-button-light" href={`${programBasePath}/standards`} prefetch={false}>View all standards</Link>
        </div>
      </section>
    </>
  );
}
