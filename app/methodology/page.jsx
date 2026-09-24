import Link from "next/link";

import {
  JsonLd,
  PublicCta,
  PublicHero,
  PublicPage,
  PublicSection,
  publicContentStyles as styles,
} from "../../components/PublicContent";
import { getPublicPage } from "../../lib/public-pages";
import { buildPageMetadata, buildPublicPageJsonLd } from "../../lib/seo";

const page = getPublicPage("/methodology");
const breadcrumbs = [
  { href: "/", label: "O1SF", name: "O1SF", path: "/" },
  { href: "/methodology", label: "Methodology", name: "Methodology", path: "/methodology" },
];

export const metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  type: "website",
});

export default function MethodologyPage() {
  return (
    <PublicPage>
      <JsonLd data={buildPublicPageJsonLd({ ...page, breadcrumbs })} />
      <PublicHero
        breadcrumbs={breadcrumbs}
        eyebrow="Evidence-first methodology"
        lede="The O1SF method connects every strategic claim to an observable interaction. It helps a founder distinguish a confident story from a tested market signal."
        title="Turn each assumption into something the market can answer."
      />

      <PublicSection
        eyebrow="The loop"
        lead="A learning cycle is only complete when the evidence changes - or deliberately confirms - a decision. Conversation volume alone is not the goal."
        title="Six steps from hypothesis to action."
      >
        <ol className={styles.numberedList}>
          <li><div><strong>Name the assumption.</strong>Write a falsifiable claim about the customer, problem, buyer, channel, proof, or timing. Add the decision that would change if the claim is wrong.</div></li>
          <li><div><strong>Create a testable asset.</strong>Turn the claim into positioning, an interview prompt, an outreach message, a target list, a product narrative, or another concrete artifact.</div></li>
          <li><div><strong>Choose a relevant interaction.</strong>Match the asset to a person and context capable of producing useful evidence - not merely encouragement.</div></li>
          <li><div><strong>Record observation separately from interpretation.</strong>Capture what was said or done, then state what the team believes it means. Keep contradictions and unknowns visible.</div></li>
          <li><div><strong>Revise one decision.</strong>Change the target, message, proof, channel, offer, or next test. Avoid broad rewrites that make it impossible to know what created the difference.</div></li>
          <li><div><strong>Commit to the next measurable action.</strong>Assign an owner, time horizon, threshold, and stopping rule for the next 3-, 6-, or 12-month decision.</div></li>
        </ol>
      </PublicSection>

      <PublicSection
        eyebrow="Evidence quality"
        lead="Signals are not equal. The method ranks evidence by relevance and behavior so that polite interest does not silently become a forecast."
        title="Separate signal from enthusiasm."
        tone="surface"
      >
        <div className={styles.split}>
          <div className={styles.prose}>
            <h3>Stronger signals</h3>
            <ul>
              <li>A target customer describes the problem in their own language.</li>
              <li>A buyer explains the current workflow, budget, authority, and timing.</li>
              <li>A relevant person takes a costly next step: shares data, invites a stakeholder, tests an asset, or schedules a defined follow-up.</li>
              <li>Patterns repeat across independent conversations in the same segment.</li>
            </ul>
          </div>
          <div className={styles.prose}>
            <h3>Weaker signals</h3>
            <ul>
              <li>General praise without a concrete use case or next action.</li>
              <li>Feedback from people outside the target buying context.</li>
              <li>Introductions that do not progress to a relevant conversation.</li>
              <li>A single memorable opinion treated as a market pattern.</li>
            </ul>
          </div>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Evidence log"
        lead="A lightweight record makes the reasoning reviewable after the energy of a meeting or trip has faded."
        title="Make every conclusion traceable."
      >
        <div className={styles.prose}>
          <p>For each interaction, record the segment and role, the assumption tested, the prompt or asset used, the observation, the team’s interpretation, confidence level, contradiction, and next decision. Do not store unnecessary personal data.</p>
          <p>Review the log by segment and assumption - not by meeting count. A useful weekly synthesis names what became more likely, what became less likely, what remains unknown, and what the team will stop doing.</p>
          <p>Use the <Link href="/resources/customer-discovery-us">customer-discovery guide</Link> to plan interviews and the <Link href="/resources/us-go-to-market-plan">go-to-market guide</Link> to translate learning into time-bound decisions.</p>
        </div>
      </PublicSection>

      <PublicCta />
    </PublicPage>
  );
}
