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

const page = getPublicPage("/resources/us-market-entry-checklist");
const breadcrumbs = [
  { href: "/", label: "O1SF", name: "O1SF", path: "/" },
  { href: "/resources", label: "Resources", name: "Resources", path: "/resources" },
  { href: page.path, label: "Market-entry checklist", name: "U.S. Market Entry Checklist", path: page.path },
];

export const metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  type: "article",
});

export default function MarketEntryChecklistPage() {
  return (
    <PublicPage article>
      <JsonLd data={buildPublicPageJsonLd({ ...page, breadcrumbs })} />
      <PublicHero
        breadcrumbs={breadcrumbs}
        eyebrow="Practical guide"
        lede="Use this checklist to expose the assumptions behind a U.S. expansion plan before committing heavily to travel, hiring, paid acquisition, or market infrastructure."
        title="A U.S. market-entry readiness checklist."
      >
        <ArticleMeta readingTime="8 min" />
      </PublicHero>

      <PublicSection
        eyebrow="How to use it"
        lead="Mark each item as evidenced, assumed, contradicted, or unknown. An honest unknown is more useful than a confident statement with no source."
        title="Score the decision, not the ambition."
      >
        <div className={styles.prose}>
          <p>Review the checklist with the people who own product, sales, delivery, and finance. For every “evidenced” item, link to the interview notes, product data, market source, signed document, or observable behavior that supports it.</p>
          <p>This is a strategic preparation tool. It is not a substitute for qualified legal, immigration, tax, accounting, privacy, or regulatory advice.</p>
        </div>
      </PublicSection>

      <PublicSection eyebrow="1. Customer and problem" title="Confirm whose problem you are entering." tone="surface">
        <ul className={styles.checkList}>
          <li>We can define a narrow initial U.S. customer segment by role, company characteristics, and operating context.</li>
          <li>People in that segment have described the problem in their own words.</li>
          <li>We know what they do today, what the current approach costs, and why it persists.</li>
          <li>We can distinguish a frequent, urgent problem from general interest.</li>
          <li>We know which assumption about the customer would most change our entry decision.</li>
        </ul>
      </PublicSection>

      <PublicSection eyebrow="2. Buying context" title="Map how a decision actually happens.">
        <ul className={styles.checkList}>
          <li>We can name the likely user, champion, economic buyer, technical reviewer, and blocker.</li>
          <li>We understand budget source, approval sequence, procurement friction, security review, and realistic timing.</li>
          <li>Our pricing hypothesis fits the value, purchasing motion, and cost of serving the segment.</li>
          <li>We know what proof a buyer needs before taking the next costly step.</li>
          <li>We have identified substitutes and the cost of doing nothing - not only direct competitors.</li>
        </ul>
      </PublicSection>

      <PublicSection eyebrow="3. Positioning and proof" title="Make the claim testable." tone="surface">
        <ul className={styles.checkList}>
          <li>Our message names the customer, problem, meaningful difference, and evidence without unsupported superlatives.</li>
          <li>We have a short version for outreach and a deeper version for a buying conversation.</li>
          <li>Claims about customers, outcomes, partners, logos, and market position have permission and supporting evidence.</li>
          <li>We know which proof is transferable to the U.S. context and which is not.</li>
          <li>The product, onboarding, support, and documentation can deliver the promise being tested.</li>
        </ul>
      </PublicSection>

      <PublicSection eyebrow="4. Market-learning plan" title="Define what the next month must teach you.">
        <ul className={styles.checkList}>
          <li>We have a prioritized list of target accounts and relevant roles, not a generic lead database.</li>
          <li>Each conversation is connected to a specific assumption and decision.</li>
          <li>We separate observations, interpretations, contradictions, and next actions in an evidence log.</li>
          <li>We have thresholds for continuing, revising, narrowing, or pausing the entry plan.</li>
          <li>Owners and review dates are assigned for every critical unknown.</li>
        </ul>
      </PublicSection>

      <PublicSection eyebrow="Decision gate" title="Summarize the gaps before committing." tone="surface">
        <div className={styles.prose}>
          <p>At the end, write a one-page decision memo: the initial segment, strongest evidence, biggest contradiction, three unresolved assumptions, next tests, spending or travel that should wait, and the date of the next go/no-go review.</p>
          <p>Then use the <Link href="/resources/customer-discovery-us">customer-discovery guide</Link> to test the highest-risk unknown and the <Link href="/resources/us-go-to-market-plan">go-to-market guide</Link> to sequence the resulting actions.</p>
        </div>
      </PublicSection>

      <PublicCta />
    </PublicPage>
  );
}
