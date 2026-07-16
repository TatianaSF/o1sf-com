import Link from "next/link";

import { programBasePath } from "../../../lib/program-content";

const contributions = [
  ["Mentor founders", "Share practical expertise matched to a company’s market-entry problem."],
  ["Join a panel", "Help founders understand how investors evaluate readiness and evidence."],
  ["Lead a workshop", "Teach a focused topic in U.S. sales, positioning, fundraising or operations."],
  ["Open the ecosystem", "Make relevant introductions when mutual fit and permission are clear."],
  ["Support Demo Day", "Contribute perspective, visibility or operational support to the final event."],
];

export const metadata = {
  title: "Partners — O1SF U.S. Market Entry",
  description: "Draft partnership and mentor opportunities for the O1SF program.",
};

export default function PartnersPage() {
  return (
    <>
      <section className="program-page-hero program-partners-hero">
        <div className="program-shell program-page-hero-grid">
          <div><p className="program-kicker">Partnerships and support</p><h1>Help founders meet the U.S. market with better questions.</h1></div>
          <div><p className="program-page-lead">O1SF is exploring focused contributions from operators, investors, mentors and ecosystem organizations.</p><p className="program-partner-note">A formal sponsorship package and official contact channel are not confirmed in the current draft.</p></div>
        </div>
      </section>

      <section className="program-contribution-section">
        <div className="program-shell">
          <div className="program-section-heading"><span>Ways to contribute</span><h2>Useful participation is specific, relevant and founder-centered.</h2></div>
          <div className="program-contribution-list">
            {contributions.map(([title, text], index) => <article key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="program-partner-criteria">
        <div className="program-shell program-partner-criteria-grid">
          <div><p>Partnership principle</p><h2>No implied endorsement and no invented commitments.</h2></div>
          <div><p>Names, logos, quotes, sponsorship levels and promised contributions should appear only after written confirmation. Mentor and investor participation remains conditional on relevance and availability.</p><Link className="program-button program-button-light" href={`${programBasePath}/guide`} prefetch={false}>Ask about partnerships</Link></div>
        </div>
      </section>
    </>
  );
}
