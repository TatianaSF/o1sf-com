import Link from "next/link";

import { Icon } from "../../components/Icon";
import { ProgramGuide } from "../../components/program/ProgramGuide";
import { programBasePath } from "../../lib/program-content";

const outcomeGroups = [
  {
    icon: "signal",
    title: "Message",
    summary: "Say what the company does, who should hear it and why it matters in the U.S.",
    detail: "Three one-minute pitches, tested positioning and a U.S.-ready pitch deck.",
  },
  {
    icon: "target",
    title: "Market",
    summary: "Choose the segment, customer profile and market assumptions that deserve focus.",
    detail: "ICP, target accounts, customer discovery and an individual go-to-market plan.",
  },
  {
    icon: "chat",
    title: "Pipeline",
    summary: "Turn strategy into messages, conversations and a repeatable follow-up system.",
    detail: "Customer and investor lists, outreach messages and a working meeting pipeline.",
  },
  {
    icon: "building",
    title: "Infrastructure",
    summary: "Prepare the practical path for operating in the U.S. when it fits the business.",
    detail: "Delaware C-Corporation, EIN and business-bank-account process support.",
  },
];

const timeline = [
  {
    label: "Online · Week 1",
    title: "Diagnose the market-entry problem",
    text: "Clarify the ICP, value proposition, positioning, target accounts and first outreach messages.",
  },
  {
    label: "Online · Week 2",
    title: "Prepare for real conversations",
    text: "Improve the pitch deck, select metrics, prepare customer and investor messages, and confirm the San Francisco plan.",
  },
  {
    label: "San Francisco",
    title: "Execute and learn from the market",
    text: "Run meetings, gather direct feedback, navigate the ecosystem and prepare for Demo Day.",
  },
  {
    label: "Final day",
    title: "Present at Demo Day",
    text: "Show progress, present the company and create new investor and ecosystem relationships.",
  },
];

const statuses = [
  ["Guaranteed", "Items O1SF controls and commits to provide under the signed terms."],
  ["Target", "Measurable goals O1SF works toward without promising the outcome."],
  ["Conditional", "Opportunities that depend on relevance, readiness, availability or third-party interest."],
  ["Not guaranteed", "Business outcomes and third-party actions that the program does not promise."],
];

export default function MarketEntryPage() {
  return (
    <>
      <section className="program-hero">
        <div className="program-shell program-hero-grid">
          <div className="program-hero-copy">
            <p className="program-kicker">Three-week U.S. Market Entry Program</p>
            <h1>Build a tested plan for entering the U.S. market.</h1>
            <p className="program-hero-lead">
              Move from an unclear U.S. market idea to a structured, tested and documented plan—through two online weeks and one intensive week in San Francisco.
            </p>
            <div className="program-hero-actions">
              <Link className="program-button program-button-primary" href={`${programBasePath}/apply`} prefetch={false}>
                Check program fit
              </Link>
              <Link className="program-button program-button-secondary" href={`${programBasePath}/program`} prefetch={false}>
                Explore the three weeks
              </Link>
            </div>
            <dl className="program-hero-facts">
              <div><dt>Format</dt><dd>2 weeks online + 1 week in San Francisco</dd></div>
              <div><dt>Cohort</dt><dd>9 startups</dd></div>
              <div><dt>Price</dt><dd>$4,999 per company · 0% equity</dd></div>
            </dl>
            <p className="program-hero-requirement">
              International founders must already have valid U.S. entry authorization for the in-person week.
            </p>
          </div>
          <div className="program-hero-guide">
            <ProgramGuide compact />
          </div>
        </div>
      </section>

      <section className="program-fit-section">
        <div className="program-shell program-split-section">
          <div className="program-section-heading">
            <span>Start with fit</span>
            <h2>Built for founders who are ready to test, not just discuss.</h2>
          </div>
          <div className="program-fit-columns">
            <div>
              <h3>The program may fit</h3>
              <ul className="program-check-list">
                <li>Founders at any stage, including idea-only teams</li>
                <li>B2B, B2C, service and scalable businesses</li>
                <li>Companies not yet registered in the United States</li>
                <li>Founders prepared for direct outreach and market feedback</li>
              </ul>
            </div>
            <div>
              <h3>Core participation requirements</h3>
              <ul className="program-check-list program-requirement-list">
                <li>Both online weeks and the San Francisco week</li>
                <li>Working English for sessions, outreach and pitches</li>
                <li>Valid U.S. entry authorization for international founders</li>
                <li>Willingness to revise the offer from real feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="program-outcomes-section">
        <div className="program-shell">
          <div className="program-outcomes-intro">
            <p>From uncertainty to an operating plan</p>
            <h2>Know what to say, who to say it to and what to do next.</h2>
            <p>The program is designed to turn market-entry assumptions into concrete assets and real-world feedback.</p>
          </div>
          <div className="program-outcome-list">
            {outcomeGroups.map((item, index) => (
              <article key={item.title}>
                <span className="program-outcome-number">{String(index + 1).padStart(2, "0")}</span>
                <Icon name={item.icon} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <span>{item.detail}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="program-outcome-note">
            <strong>Expected outcomes are not business guarantees.</strong>
            <p>Investment, customers, revenue, product-market fit, bank approval and market success depend on participant effort and third-party decisions.</p>
            <Link href={`${programBasePath}/results`} prefetch={false}>See results and limits <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="program-timeline-section">
        <div className="program-shell">
          <div className="program-section-heading program-section-heading-wide">
            <span>How the program works</span>
            <h2>Preparation first. Execution in San Francisco. A roadmap after.</h2>
          </div>
          <ol className="program-timeline">
            {timeline.map((item, index) => (
              <li key={item.title}>
                <div className="program-timeline-index"><span>{index + 1}</span></div>
                <div>
                  <p>{item.label}</p>
                  <h3>{item.title}</h3>
                  <span>{item.text}</span>
                </div>
              </li>
            ))}
          </ol>
          <Link className="program-inline-cta" href={`${programBasePath}/program`} prefetch={false}>
            See the full program structure <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="program-trust-section">
        <div className="program-shell program-trust-grid">
          <div className="program-trust-copy">
            <p>Trust is part of the product</p>
            <h2>Every material answer tells you what kind of claim it is.</h2>
            <p>O1SF separates controlled program commitments from goals, conditional opportunities and outcomes no accelerator can promise.</p>
            <Link className="program-button program-button-light" href={`${programBasePath}/guide`} prefetch={false}>
              Ask the AI Guide
            </Link>
          </div>
          <dl className="program-status-list">
            {statuses.map(([status, explanation]) => (
              <div key={status}>
                <dt><span aria-hidden="true" />{status}</dt>
                <dd>{explanation}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="program-investor-section">
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

      <section className="program-price-section">
        <div className="program-shell program-price-grid">
          <div className="program-price-primary">
            <p>Standard company price</p>
            <h2>$4,999</h2>
            <strong>One company · one primary founder · no equity</strong>
            <p>One paid additional founder may join for $2,500. During the pilot, no more than one additional founder is accepted per company unless approved in writing before invoicing.</p>
            <Link className="program-button program-button-primary" href={`${programBasePath}/pricing`} prefetch={false}>
              Review pricing details
            </Link>
          </div>
          <div className="program-price-details">
            <div>
              <h3>Included</h3>
              <p>Three-week program, guaranteed online sessions, mentor matching, go-to-market work, pitch preparation, Demo Day, coworking, recordings, transcripts and Slack community access.</p>
            </div>
            <div>
              <h3>Paid separately</h3>
              <p>Flights, housing, main meals, local transportation, visas, insurance, formation, registered-agent, banking and other third-party costs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="program-process-section">
        <div className="program-shell program-process-grid">
          <div className="program-section-heading">
            <span>How participation works</span>
            <h2>Four steps before a place is confirmed.</h2>
          </div>
          <ol>
            <li><span>1</span><div><strong>Application</strong><p>Founder, startup, product, business model and U.S. market goals.</p></div></li>
            <li><span>2</span><div><strong>20-minute interview</strong><p>Program fit, working English and readiness for the workload.</p></div></li>
            <li><span>3</span><div><strong>Required verification</strong><p>Identity, authority, entry documents, sanctions and payment-risk checks when applicable.</p></div></li>
            <li><span>4</span><div><strong>Final selection</strong><p>Applying or interviewing does not guarantee acceptance into the nine-startup cohort.</p></div></li>
          </ol>
          <div className="program-process-cta">
            <p>The official application URL, deadline and cohort dates are not currently confirmed.</p>
            <Link className="program-button program-button-primary" href={`${programBasePath}/apply`} prefetch={false}>
              Check program fit
            </Link>
          </div>
        </div>
      </section>

      <section className="program-standards-preview">
        <div className="program-shell">
          <div className="program-section-heading">
            <span>Know the boundaries first</span>
            <h2>Clear rules are part of the program design.</h2>
          </div>
          <div className="program-standards-preview-grid">
            <Link href={`${programBasePath}/privacy-security`} prefetch={false}>
              <span>01</span><h3>Privacy &amp; security</h3><p>What may be collected, how sensitive documents must be handled and when records should be deleted.</p>
            </Link>
            <Link href={`${programBasePath}/claims`} prefetch={false}>
              <span>02</span><h3>Claims &amp; promises</h3><p>What O1SF controls, what it targets and what no accelerator can guarantee.</p>
            </Link>
            <Link href={`${programBasePath}/requirements`} prefetch={false}>
              <span>03</span><h3>Participant requirements</h3><p>Eligibility, verification, travel readiness and conduct expected before acceptance.</p>
            </Link>
          </div>
          <Link className="program-inline-cta" href={`${programBasePath}/standards`} prefetch={false}>Read all program standards <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="program-final-section">
        <div className="program-shell">
          <div>
            <p>Still deciding?</p>
            <h2>Ask the program before you enter it.</h2>
          </div>
          <div>
            <p>The O1SF AI Guide answers from the available draft knowledge base, shows the claim status and refuses to invent missing dates, names, contacts or promises.</p>
            <Link className="program-button program-button-light" href={`${programBasePath}/guide`} prefetch={false}>
              Open O1SF AI Guide
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
