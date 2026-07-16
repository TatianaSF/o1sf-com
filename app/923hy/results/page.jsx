import Link from "next/link";

import { programBasePath } from "../../../lib/program-content";

const deliverables = [
  ["Market thesis", "ICP, priority segment, tested assumptions and target-account lists."],
  ["Founder narrative", "U.S.-ready pitch deck, tested positioning and three one-minute pitches."],
  ["Conversation system", "Customer and investor messages, follow-up workflow and a meeting pipeline."],
  ["Operating metrics", "A North Star Metric with practical supporting measurements."],
  ["U.S. infrastructure path", "Guidance for Delaware C-Corporation, EIN and business-bank-account processes when relevant."],
  ["Execution roadmap", "A documented market-entry plan for the next 3, 6 and 12 months."],
];

const boundaries = [
  "Investment, a term sheet or due diligence",
  "Customers, revenue or product-market fit",
  "A specific investor or mentor meeting",
  "Company-formation or bank-account approval",
  "Visa or other U.S. entry authorization",
  "A successful U.S. market launch",
];

export const metadata = {
  title: "Expected Results — O1SF U.S. Market Entry",
  description: "Expected program deliverables, targets and non-guaranteed outcomes.",
};

export default function ResultsPage() {
  return (
    <>
      <section className="program-page-hero program-results-hero">
        <div className="program-shell program-results-hero-grid">
          <div>
            <p className="program-kicker">Expected results</p>
            <h1>Leave with evidence, working assets and a next-step roadmap.</h1>
          </div>
          <div className="program-result-principle">
            <span>Program success definition</span>
            <p>A founder finishes with a more structured, tested and documented approach to U.S. market entry—not with a promised business outcome.</p>
          </div>
        </div>
      </section>

      <section className="program-deliverables-section">
        <div className="program-shell">
          <div className="program-section-heading program-section-heading-wide">
            <span>Working deliverables</span>
            <h2>Concrete material you can keep using after the cohort.</h2>
          </div>
          <div className="program-deliverables-list">
            {deliverables.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="program-boundaries-section">
        <div className="program-shell program-boundaries-grid">
          <div>
            <p>Clear boundaries</p>
            <h2>Important outcomes the program does not guarantee.</h2>
            <p>These depend on participant execution, market response, government processes or third-party decisions.</p>
          </div>
          <ul>
            {boundaries.map((item) => <li key={item}><span aria-hidden="true">×</span>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="program-status-explainer">
        <div className="program-shell">
          <p className="program-kicker">How to read program claims</p>
          <div className="program-status-rail">
            <div><span className="is-guaranteed" /><strong>Guaranteed</strong><p>Controlled by O1SF and committed under signed terms.</p></div>
            <div><span className="is-target" /><strong>Target</strong><p>A measurable goal, not a promised result.</p></div>
            <div><span className="is-conditional" /><strong>Conditional</strong><p>Depends on relevance, readiness or third parties.</p></div>
            <div><span className="is-missing" /><strong>Not guaranteed</strong><p>An outcome O1SF cannot responsibly promise.</p></div>
          </div>
        </div>
      </section>

      <section className="program-next-section">
        <div className="program-shell program-next-inner">
          <div><p>Have a specific question?</p><h2>Get an answer with its source and status.</h2></div>
          <Link className="program-button program-button-primary" href={`${programBasePath}/guide`} prefetch={false}>Ask the AI Guide</Link>
        </div>
      </section>
    </>
  );
}
