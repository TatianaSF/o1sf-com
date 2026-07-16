import Link from "next/link";

import { programBasePath } from "../../../lib/program-content";

const included = [
  "Full three-week program",
  "Guaranteed online group and individual sessions",
  "Mentor matching based on need and availability",
  "Go-to-market, positioning and pitch work",
  "Demo Day participation",
  "Coworking during the in-person week",
  "Program recordings and transcripts when provided",
  "Slack community access",
];

const separate = [
  "Flights and housing",
  "Main meals and local transportation",
  "Visas, entry documents and insurance",
  "Company formation and registered-agent fees",
  "Banking and other third-party costs",
  "Personal or company expenses outside listed inclusions",
];

export const metadata = {
  title: "Pricing — O1SF U.S. Market Entry",
  description: "Program price, inclusions, exclusions and draft payment policy.",
};

export default function PricingPage() {
  return (
    <>
      <section className="program-page-hero program-pricing-hero">
        <div className="program-shell program-pricing-hero-grid">
          <div>
            <p className="program-kicker">Simple company pricing</p>
            <h1>$4,999</h1>
            <p className="program-page-lead">One company, one primary founder and <strong>0% equity</strong>.</p>
          </div>
          <div className="program-pricing-companion">
            <span>Additional founder</span>
            <strong>$2,500</strong>
            <p>One paid additional founder may join during the pilot unless more are approved in writing before invoicing.</p>
          </div>
        </div>
      </section>

      <section className="program-inclusions-section">
        <div className="program-shell program-inclusions-grid">
          <div>
            <p>Included in the program price</p>
            <ul className="program-check-list">
              {included.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <p>Paid separately by the participant</p>
            <ul className="program-separate-list">
              {separate.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="program-payment-section">
        <div className="program-shell program-payment-grid">
          <div>
            <p className="program-kicker">Draft payment policy</p>
            <h2>Verify first. Sign second. Wire only after an official invoice.</h2>
          </div>
          <ol>
            <li><span>1</span><p>Receive written acceptance.</p></li>
            <li><span>2</span><p>Complete required identity and eligibility checks.</p></li>
            <li><span>3</span><p>Sign the Participation Agreement.</p></li>
            <li><span>4</span><p>Pay the verified U.S. dollar bank-wire invoice from OpenAISF Inc.</p></li>
          </ol>
          <aside>
            <strong>Wire-fraud protection</strong>
            <p>Cards, cash, checks, cryptocurrency and informal person-to-person payments are not accepted. Final bank details and payment contacts are not published in this draft.</p>
          </aside>
        </div>
      </section>

      <section className="program-refund-section">
        <div className="program-shell program-refund-grid">
          <div><p>Refund policy</p><h2>The signed agreement controls.</h2></div>
          <div>
            <p>The current business-policy draft permits cancellation at least 14 calendar days before the first required online session, subject to a $250 administration and bank-processing fee plus permitted documented deductions.</p>
            <p>Later cancellations have no contractual refund except where mandatory law requires otherwise. This draft is not legal advice.</p>
          </div>
        </div>
      </section>

      <section className="program-next-section">
        <div className="program-shell program-next-inner">
          <div><p>Before you decide</p><h2>Check the core participation requirements.</h2></div>
          <Link className="program-button program-button-primary" href={`${programBasePath}/apply`} prefetch={false}>Check program fit</Link>
        </div>
      </section>
    </>
  );
}
