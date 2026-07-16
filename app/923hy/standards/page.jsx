import Link from "next/link";

import { programBasePath } from "../../../lib/program-content";
import { programPolicies } from "../../../lib/program-policies";

export const metadata = { title: "Program Standards — O1SF Draft Preview" };

export default function StandardsPage() {
  return (
    <>
      <section className="program-page-hero program-standards-hero">
        <div className="program-shell">
          <p className="program-kicker">Clear rules before commitment</p>
          <h1>Program standards</h1>
          <p>Privacy, public promises and participant requirements—written to make the boundaries of the program visible before applications open.</p>
        </div>
      </section>
      <section className="program-standards-grid-section">
        <div className="program-shell program-standards-grid">
          {programPolicies.map((policy, index) => (
            <Link key={policy.slug} href={`${programBasePath}/${policy.slug}`} prefetch={false}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{policy.eyebrow}</p>
              <h2>{policy.title}</h2>
              <strong>{policy.summary}</strong>
              <small>{policy.status}</small>
              <b>Read the standard <span aria-hidden="true">→</span></b>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
