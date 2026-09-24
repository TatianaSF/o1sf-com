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

const page = getPublicPage("/pricing");
const breadcrumbs = [
  { href: "/", label: "O1SF", name: "O1SF", path: "/" },
  { href: "/pricing", label: "Pricing", name: "Pricing", path: "/pricing" },
];

export const metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  type: "website",
});

export default function PricingPage() {
  return (
    <PublicPage>
      <JsonLd data={buildPublicPageJsonLd({ ...page, breadcrumbs })} />
      <PublicHero
        breadcrumbs={breadcrumbs}
        eyebrow="Pricing and scope"
        lede="The public program fee is stated plainly so a founder can evaluate the format before starting a conversation. Final obligations are governed only by executed program documents."
        title="$4,999 per company. 0% equity."
      />

      <PublicSection
        eyebrow="Fee structure"
        lead="One primary founder is included. An additional founder from the same company is $2,500, subject to program capacity and the final participation terms."
        title="A clear base price."
      >
        <dl className={styles.factGrid}>
          <div><dt>Primary company fee</dt><dd>$4,999</dd></div>
          <div><dt>Additional founder</dt><dd>$2,500</dd></div>
          <div><dt>Equity taken</dt><dd>0%</dd></div>
        </dl>
      </PublicSection>

      <PublicSection
        eyebrow="Included"
        lead="The program scope centers on preparation, market-facing work, synthesis, and a usable action plan."
        title="What the fee is intended to cover."
        tone="surface"
      >
        <ul className={styles.checkList}>
          <li>Two weeks of guided online preparation</li>
          <li>One intensive program week in San Francisco</li>
          <li>Positioning, messaging, target, and outreach working sessions</li>
          <li>Preparation for relevant market interactions</li>
          <li>Feedback capture and evidence synthesis</li>
          <li>A 3-, 6-, and 12-month U.S. action roadmap</li>
          <li>Warm introductions when relevant and available, without a guarantee</li>
        </ul>
      </PublicSection>

      <PublicSection
        eyebrow="Not included"
        lead="A realistic budget should account for costs outside the program fee."
        title="Plan separately for third-party expenses."
      >
        <div className={styles.split}>
          <ul className={styles.checkList}>
            <li>Flights, ground transportation, lodging, and meals</li>
            <li>Visa, immigration, legal, tax, accounting, or incorporation services</li>
            <li>Software, paid media, event tickets, and third-party vendor fees</li>
            <li>Investment, customer, partner, banking, or government outcomes</li>
          </ul>
          <aside className={styles.notice}>
            <strong>No payment is accepted on this website</strong>
            <p>An official payment channel, payment schedule, cancellation terms, and refund terms are not published here. Do not send funds based only on this page or an unverified message.</p>
          </aside>
        </div>
      </PublicSection>

      <PublicCta secondaryHref="/program" secondaryLabel="Review the program" />
    </PublicPage>
  );
}
