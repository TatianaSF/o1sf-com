import Link from "next/link";

import { FitCheck } from "../../../components/program/FitCheck";
import { programBasePath } from "../../../lib/program-content";

export const metadata = {
  title: "Check Program Fit — O1SF U.S. Market Entry",
  description: "An informational fit check for the O1SF U.S. Market Entry Program.",
};

export default function ApplyPage() {
  return (
    <>
      <section className="program-apply-hero">
        <div className="program-shell program-apply-hero-grid">
          <div>
            <p className="program-kicker">Before the application</p>
            <h1>Check whether the program’s core requirements match your situation.</h1>
          </div>
          <div>
            <p>This short check helps you spot practical blockers early. It does not collect data, submit an application or make an acceptance decision.</p>
            <Link href={`${programBasePath}/guide`} prefetch={false}>Ask a question instead <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
      <section className="program-apply-section">
        <div className="program-shell program-apply-grid">
          <FitCheck />
          <aside>
            <p>Current draft status</p>
            <h2>The application is not open on this preview.</h2>
            <p>The official application URL, deadline, cohort dates and locations are not yet confirmed. No payment should be sent from information on this draft page.</p>
            <dl>
              <div><dt>Cohort size</dt><dd>9 startups</dd></div>
              <div><dt>Interview</dt><dd>20 minutes</dd></div>
              <div><dt>Selection</dt><dd>Not guaranteed</dd></div>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
