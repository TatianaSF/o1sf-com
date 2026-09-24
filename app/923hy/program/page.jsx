import Link from "next/link";

import { programBasePath } from "../../../lib/program-content";

const weeks = [
  {
    number: "01",
    eyebrow: "Online · Week 1",
    title: "Define the market-entry thesis",
    summary: "Turn broad U.S. ambition into a focused set of assumptions that can be tested.",
    items: [
      "Ideal customer profile and priority segment",
      "Value proposition and U.S. positioning",
      "Target-account list and customer hypotheses",
      "First customer and investor outreach messages",
    ],
  },
  {
    number: "02",
    eyebrow: "Online · Week 2",
    title: "Build the conversation system",
    summary: "Prepare the story, evidence and working plan needed for productive U.S. conversations.",
    items: [
      "U.S.-ready pitch deck and three one-minute pitches",
      "North Star Metric and supporting metrics",
      "Meeting targets, scripts and follow-up workflow",
      "Individual San Francisco execution plan",
    ],
  },
  {
    number: "03",
    eyebrow: "In person · San Francisco",
    title: "Execute, learn and present",
    summary: "Use live market feedback to improve the plan and leave with a documented next chapter.",
    items: [
      "Customer, investor and ecosystem conversations",
      "Mentor matching based on company needs and availability",
      "Pitch iteration and Demo Day preparation",
      "A 3-, 6- and 12-month market-entry roadmap",
    ],
  },
];

export const metadata = {
  title: "Program Structure - O1SF U.S. Market Entry",
  description: "How the two online weeks and San Francisco week work together.",
};

export default function ProgramStructurePage() {
  return (
    <>
      <section className="program-page-hero program-page-hero-structure" id="program-overview">
        <div className="program-shell program-page-hero-grid">
          <div>
            <p className="program-kicker">Program structure</p>
            <h1>Three weeks built around one operating rhythm.</h1>
          </div>
          <div>
            <p className="program-page-lead">Prepare before arrival, test the plan in San Francisco and document the next 12 months while the evidence is still fresh.</p>
            <div className="program-page-callout"><strong>Guaranteed online minimum</strong><span>4 group meetings of at least 60 minutes and 2 company-level individual sessions of at least 30 minutes.</span></div>
          </div>
        </div>
      </section>

      <section className="program-week-section">
        <div className="program-shell">
          <ol className="program-week-list">
            {weeks.map((week) => (
              <li key={week.number}>
                <div className="program-week-number">{week.number}</div>
                <div className="program-week-copy">
                  <p>{week.eyebrow}</p>
                  <h2>{week.title}</h2>
                  <span>{week.summary}</span>
                </div>
                <ul>
                  {week.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="program-detail-band">
        <div className="program-shell program-detail-band-grid">
          <div>
            <p>What varies</p>
            <h2>Some opportunities depend on fit and third parties.</h2>
          </div>
          <div className="program-detail-columns">
            <div><strong>Conditional</strong><p>Specific mentors, introductions and meetings depend on relevance, readiness, interest and availability.</p></div>
            <div><strong>Pending</strong><p>Exact cohort dates, daily times, venues and the official application URL are not confirmed in the current draft.</p></div>
          </div>
        </div>
      </section>

      <section className="program-investor-section" id="investor-access">
        <div className="program-shell program-investor-grid">
          <div className="program-section-heading">
            <span>Investor access, clearly defined</span>
            <h2>Prepare for the room. Do not confuse access with an investment promise.</h2>
          </div>
          <div className="program-investor-flow">
            <div><span>Prepare</span><p>Pitch, target list, conversation strategy and follow-up system.</p></div>
            <div><span>Connect</span><p>Relevant meetings and introductions when interest and availability align.</p></div>
            <div><span>Present</span><p>Demo Day participation and an attendee summary when information may be shared.</p></div>
          </div>
          <aside>
            <strong>Not guaranteed</strong>
            <p>A specific investor meeting, written feedback, due diligence, a term sheet or investment.</p>
          </aside>
        </div>
      </section>

      <section className="program-next-section">
        <div className="program-shell program-next-inner">
          <div><p>Next</p><h2>See what you are working toward.</h2></div>
          <Link className="program-button program-button-primary" href={`${programBasePath}/results`} prefetch={false}>Review expected results</Link>
        </div>
      </section>
    </>
  );
}
