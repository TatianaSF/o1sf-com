import { ProgramGuide } from "../../../components/program/ProgramGuide";

export const metadata = {
  title: "AI Guide - O1SF U.S. Market Entry",
  description: "Ask questions about the draft O1SF U.S. Market Entry Program knowledge base.",
};

export default function GuidePage() {
  return (
    <section className="program-guide-page">
      <div className="program-shell program-guide-page-grid">
        <div className="program-guide-page-copy">
          <p className="program-kicker">Knowledge before commitment</p>
          <h1>Ask the program a direct question.</h1>
          <p>The guide answers only from the available v3.1 draft knowledge base. It shows the claim status, cites the relevant section and does not invent missing dates, links, names or promises.</p>
          <div className="program-guide-legend">
            <div><span className="is-guaranteed" /><p><strong>Controlled facts</strong>Program commitments and confirmed business terms.</p></div>
            <div><span className="is-conditional" /><p><strong>Conditional facts</strong>Opportunities that depend on fit or third parties.</p></div>
            <div><span className="is-missing" /><p><strong>Missing information</strong>Details that still require official confirmation.</p></div>
          </div>
        </div>
        <ProgramGuide />
      </div>
    </section>
  );
}
