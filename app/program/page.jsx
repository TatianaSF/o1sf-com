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

const page = getPublicPage("/program");
const breadcrumbs = [
  { href: "/", label: "O1SF", name: "O1SF", path: "/" },
  { href: "/program", label: "Program", name: "Program", path: "/program" },
];

export const metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  type: "website",
});

export default function ProgramPage() {
  const jsonLd = buildPublicPageJsonLd({
    ...page,
    breadcrumbs,
  });

  return (
    <PublicPage>
      <JsonLd data={jsonLd} />
      <PublicHero
        breadcrumbs={breadcrumbs}
        eyebrow="Program structure"
        lede="Two online preparation weeks establish the hypothesis, target, and customer-facing assets. One intensive week in San Francisco puts those assets into real market interactions and turns the evidence into a next-step plan. Paying customers and revenue are not guaranteed."
        title="Three weeks to test an evidence-based path toward paying customers."
      />

      <PublicSection
        eyebrow="At a glance"
        lead="The format is deliberately small and execution-focused. Participation does not guarantee meetings, customers, partners, investment, visas, or any other market outcome."
        title="A compact working cohort."
      >
        <dl className={styles.factGrid}>
          <div>
            <dt>Format</dt>
            <dd>2 weeks online + 1 week in SF</dd>
          </div>
          <div>
            <dt>Cohort capacity</dt>
            <dd>Up to 9 startups</dd>
          </div>
          <div>
            <dt>Program fee</dt>
            <dd>$4,999 per company</dd>
          </div>
        </dl>
      </PublicSection>

      <PublicSection
        eyebrow="Sequence"
        lead="Each phase produces something that can be reviewed, used, and revised. The work is cumulative: later decisions should point back to evidence collected earlier."
        title="One learning loop, three phases."
        tone="surface"
      >
        <ol className={styles.numberedList}>
          <li>
            <div>
              <strong>Week 1 - frame the market-entry hypothesis.</strong>
              Define the U.S. customer, problem, buying context, proof points, and the assumptions that would most change the decision to enter.
            </div>
          </li>
          <li>
            <div>
              <strong>Week 2 - prepare assets and interactions.</strong>
              Build the working positioning, interview prompts, target-account criteria, outreach copy, and evidence log needed for focused conversations.
            </div>
          </li>
          <li>
            <div>
              <strong>Week 3 - test, synthesize, and decide.</strong>
              Use the San Francisco week for relevant market interactions where available, record what actually happened, revise the assumptions, and define the next 3, 6, and 12 months.
            </div>
          </li>
        </ol>
      </PublicSection>

      <PublicSection
        eyebrow="Working outputs"
        lead="The useful outcome is a traceable set of decisions and assets - not attendance alone. Exact outputs depend on the company’s stage, evidence, and access available during the program."
        title="Leave with work you can keep using."
      >
        <div className={styles.split}>
          <ul className={styles.checkList}>
            <li>Tested positioning and messaging revisions</li>
            <li>Defined customer and partner hypotheses</li>
            <li>Target-account and relevant-contact lists</li>
            <li>Customer-discovery and outreach assets</li>
            <li>Recorded market feedback and open questions</li>
            <li>A 3-, 6-, and 12-month U.S. action roadmap</li>
          </ul>
          <aside className={styles.notice}>
            <strong>Before making travel plans</strong>
            <p>
              Cohort dates, session times, venues, and an official application channel are not yet published. Review the current <Link href="/pricing">pricing and inclusions</Link> and the prepared answers in the <Link href="/ask_document/">O1SF AI guide</Link> for the information currently available.
            </p>
          </aside>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Good fit"
        lead="O1SF is designed for teams prepared to do the work, share relevant context, and change their plan when evidence contradicts an assumption."
        title="Who this format is built for."
        tone="surface"
      >
        <div className={styles.prose}>
          <p>
            The strongest fit is an international founder team with a real product or service, a specific U.S. growth question, and enough capacity to prepare before the San Francisco week. A team should be able to name its current target customer, explain what it already knows, and identify what remains uncertain.
          </p>
          <p>
            The format is less useful when the main need is immigration, legal, tax, fundraising, or company-formation advice; O1SF does not replace licensed professional counsel. It is also not a passive tour or a promise of introductions.
          </p>
          <p>
            Not sure whether the assumptions are ready to test? Start with the <Link href="/resources/us-market-entry-checklist">U.S. market-entry checklist</Link> or review the <Link href="/methodology">validation methodology</Link>.
          </p>
        </div>
      </PublicSection>

      <PublicCta secondaryHref="/pricing" secondaryLabel="Review pricing" />
    </PublicPage>
  );
}
