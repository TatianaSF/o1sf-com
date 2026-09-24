import Link from "next/link";

import {
  ArticleMeta,
  JsonLd,
  PublicCta,
  PublicHero,
  PublicPage,
  PublicSection,
  publicContentStyles as styles,
} from "../../../components/PublicContent";
import { getPublicPage } from "../../../lib/public-pages";
import { buildPageMetadata, buildPublicPageJsonLd } from "../../../lib/seo";

const page = getPublicPage("/resources/us-go-to-market-plan");
const breadcrumbs = [
  { href: "/", label: "O1SF", name: "O1SF", path: "/" },
  { href: "/resources", label: "Resources", name: "Resources", path: "/resources" },
  { href: page.path, label: "Go-to-market plan", name: "U.S. Go-to-Market Plan", path: page.path },
];

export const metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  type: "article",
});

export default function GoToMarketPlanPage() {
  return (
    <PublicPage article>
      <JsonLd data={buildPublicPageJsonLd({ ...page, breadcrumbs })} />
      <PublicHero
        breadcrumbs={breadcrumbs}
        eyebrow="Practical guide"
        lede="A useful U.S. go-to-market plan is a sequence of testable decisions. It states the segment, motion, proof, owners, thresholds, and conditions that would make the team change course."
        title="Build a 3-, 6-, and 12-month U.S. go-to-market plan."
      >
        <ArticleMeta readingTime="10 min" />
      </PublicHero>

      <PublicSection eyebrow="Plan foundation" title="Start with five explicit choices.">
        <ol className={styles.numberedList}>
          <li><div><strong>Initial segment.</strong>Name the narrow customer profile, operating context, trigger, and exclusions.</div></li>
          <li><div><strong>Problem and value.</strong>State the current workflow, measurable consequence, proposed change, and proof still required.</div></li>
          <li><div><strong>Buying path.</strong>Map user, champion, buyer, reviewers, budget source, timing, and adoption friction.</div></li>
          <li><div><strong>Market motion.</strong>Choose the first acquisition and sales path based on the buyer and evidence - not on channel popularity.</div></li>
          <li><div><strong>Decision thresholds.</strong>Define the evidence that will trigger continue, revise, narrow, invest, or stop decisions.</div></li>
        </ol>
      </PublicSection>

      <PublicSection eyebrow="Months 0–3" title="Validate the wedge and buying context." tone="surface">
        <div className={styles.prose}>
          <p>The first horizon should reduce the largest uncertainties. Build a qualified account list, run discovery across the relevant buying roles, test one positioning direction at a time, and document objections and behavioral next steps.</p>
          <ul>
            <li><strong>Outputs:</strong> segment definition, evidence log, message variants, target list, buying map, and pilot or test criteria.</li>
            <li><strong>Metrics:</strong> relevant conversations, repeated problem pattern, qualified next-step rate, time to next step, and contradictions by segment.</li>
            <li><strong>Gate:</strong> decide whether the segment and problem are strong enough to justify a repeatable test.</li>
          </ul>
        </div>
      </PublicSection>

      <PublicSection eyebrow="Months 3–6" title="Test repeatability and delivery.">
        <div className={styles.prose}>
          <p>Use the strongest early evidence to test a defined motion. Standardize the qualification logic, outreach sequence, discovery process, proof asset, onboarding steps, and feedback review. Track where the process breaks.</p>
          <ul>
            <li><strong>Outputs:</strong> qualification rubric, sales stages, proof library, onboarding checklist, review cadence, and revised unit assumptions.</li>
            <li><strong>Metrics:</strong> stage conversion, cycle time, acquisition effort, implementation effort, activation behavior, retention signal, and reason-lost patterns.</li>
            <li><strong>Gate:</strong> decide whether to deepen this motion, change the segment, revise the offer, or stop scaling activity.</li>
          </ul>
        </div>
      </PublicSection>

      <PublicSection eyebrow="Months 6–12" title="Scale only what has earned confidence." tone="surface">
        <div className={styles.prose}>
          <p>Expand spend, hiring, partnerships, or geographic reach only after the team can explain which segment, message, channel, and delivery model repeatedly create value. Preserve the learning loop as volume grows.</p>
          <ul>
            <li><strong>Outputs:</strong> capacity plan, channel economics, operating dashboard, risk register, hiring triggers, and quarterly decision memo.</li>
            <li><strong>Metrics:</strong> cohort retention or repeat behavior, gross-margin assumptions, payback logic, forecast accuracy, delivery capacity, and concentration risk.</li>
            <li><strong>Gate:</strong> approve the next investment level, hold the current scope, or return to discovery.</li>
          </ul>
        </div>
      </PublicSection>

      <PublicSection eyebrow="Operating rhythm" title="Keep the roadmap connected to evidence.">
        <div className={styles.split}>
          <ul className={styles.checkList}>
            <li>Assign one owner and one review date to every critical assumption.</li>
            <li>Review leading evidence weekly and strategic gates monthly or quarterly.</li>
            <li>Record why a metric changed before prescribing a solution.</li>
            <li>Keep legal, privacy, tax, immigration, and regulatory work with qualified professionals.</li>
            <li>Document what the team will stop doing when a threshold is missed.</li>
          </ul>
          <aside className={styles.notice}>
            <strong>A roadmap is not a forecast</strong>
            <p>Use ranges and assumptions where the evidence is still weak. Do not turn interview interest, introductions, or unsigned intentions into revenue commitments.</p>
          </aside>
        </div>
        <div className={styles.prose}>
          <p>Before finalizing the plan, revisit the <Link href="/resources/us-market-entry-checklist">market-entry checklist</Link> and verify that the roadmap addresses the highest-risk unknowns rather than only the easiest activities.</p>
        </div>
      </PublicSection>

      <PublicCta />
    </PublicPage>
  );
}
