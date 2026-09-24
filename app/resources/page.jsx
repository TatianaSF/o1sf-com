import Link from "next/link";

import {
  JsonLd,
  PublicCta,
  PublicHero,
  PublicPage,
  PublicSection,
  publicContentStyles as styles,
} from "../../components/PublicContent";
import { getPublicPage, resourceGuideIndex } from "../../lib/public-pages";
import { buildPageMetadata, buildPublicPageJsonLd } from "../../lib/seo";

const page = getPublicPage("/resources");
const breadcrumbs = [
  { href: "/", label: "O1SF", name: "O1SF", path: "/" },
  { href: "/resources", label: "Resources", name: "Resources", path: "/resources" },
];

export const metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  type: "website",
});

export default function ResourcesPage() {
  return (
    <PublicPage>
      <JsonLd data={buildPublicPageJsonLd({ ...page, breadcrumbs })} />
      <PublicHero
        breadcrumbs={breadcrumbs}
        eyebrow="Founder resources"
        lede="Use these practical guides to identify fragile assumptions, run more useful U.S. customer conversations, and convert what you learn into time-bound decisions."
        title="Prepare before the market answers."
      />

      <PublicSection
        eyebrow="Guides"
        lead="Each guide is designed to produce a working artifact. They are educational resources, not legal, tax, immigration, accounting, or investment advice."
        title="Three places to start."
      >
        <div className={styles.resourceGrid}>
          {resourceGuideIndex.map((guide, index) => (
            <Link className={styles.resourceCard} href={guide.path} key={guide.path}>
              <span>Guide {String(index + 1).padStart(2, "0")}</span>
              <h3>{guide.title.replace(" | O1SF", "")}</h3>
              <p>{guide.description}</p>
            </Link>
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Suggested order"
        lead="Start with readiness, move into conversations, then build the plan. If evidence changes the target segment, return to the first guide and revise the assumptions."
        title="Use the resources as a loop."
        tone="surface"
      >
        <ol className={styles.numberedList}>
          <li><div><strong>Audit readiness.</strong>Identify the assumptions that could invalidate or delay U.S. market entry.</div></li>
          <li><div><strong>Run discovery.</strong>Collect relevant behavioral and buying-context evidence without pitching too early.</div></li>
          <li><div><strong>Build the roadmap.</strong>Translate evidence into owners, thresholds, sequencing, and explicit stop-or-continue decisions.</div></li>
        </ol>
      </PublicSection>

      <PublicCta secondaryHref="/methodology" secondaryLabel="See the methodology" />
    </PublicPage>
  );
}
