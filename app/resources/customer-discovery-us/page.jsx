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

const page = getPublicPage("/resources/customer-discovery-us");
const breadcrumbs = [
  { href: "/", label: "O1SF", name: "O1SF", path: "/" },
  { href: "/resources", label: "Resources", name: "Resources", path: "/resources" },
  { href: page.path, label: "Customer discovery", name: "Customer Discovery in the U.S.", path: page.path },
];

export const metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  type: "article",
});

export default function CustomerDiscoveryPage() {
  return (
    <PublicPage article>
      <JsonLd data={buildPublicPageJsonLd({ ...page, breadcrumbs })} />
      <PublicHero
        breadcrumbs={breadcrumbs}
        eyebrow="Practical guide"
        lede="Customer discovery should reduce uncertainty about a decision. It is not a compliment-collection exercise and it should not begin with a long product pitch."
        title="Run U.S. customer discovery that changes the plan."
      >
        <ArticleMeta readingTime="9 min" />
      </PublicHero>

      <PublicSection eyebrow="Before outreach" title="Choose one uncertainty at a time.">
        <div className={styles.prose}>
          <p>Write a claim such as: “Operations leaders at U.S. logistics companies with 100–500 employees lose enough time to this workflow that a director can sponsor a paid pilot this quarter.” The claim names a segment, problem, consequence, buyer, behavior, and timing.</p>
          <p>Next, write the decision it informs. For example: continue targeting this segment, narrow it, change the buyer, revise the value proposition, or pause paid acquisition. Without a decision, interviews tend to produce interesting but unusable notes.</p>
        </div>
      </PublicSection>

      <PublicSection eyebrow="Sampling" title="Recruit for relevance, not convenience." tone="surface">
        <ul className={styles.checkList}>
          <li>Define the role, company profile, workflow, and trigger that make someone relevant.</li>
          <li>Include users, buyers, implementers, and blockers when the buying process involves different people.</li>
          <li>Track why each participant fits the sample and where they differ.</li>
          <li>Do not treat mentors, investors, friends, or general experts as customer evidence unless they are in the actual buying context.</li>
          <li>Look for repeated patterns within a segment before combining feedback across segments.</li>
        </ul>
      </PublicSection>

      <PublicSection eyebrow="Interview flow" title="Ask about behavior before opinion.">
        <ol className={styles.numberedList}>
          <li><div><strong>Set context.</strong>Explain that the purpose is learning, not selling, and ask permission before recording.</div></li>
          <li><div><strong>Reconstruct a recent example.</strong>Ask when the problem last occurred, what triggered it, who was involved, and what happened next.</div></li>
          <li><div><strong>Map the current workaround.</strong>Understand tools, people, time, budget, risk, switching cost, and why the process has not changed.</div></li>
          <li><div><strong>Explore the buying path.</strong>Ask who owns the outcome, who approves change, what evidence is required, and what competing priorities delay action.</div></li>
          <li><div><strong>Test a focused asset.</strong>Only after understanding the context, show one positioning statement, workflow, or offer and observe where it creates confusion or relevance.</div></li>
          <li><div><strong>Ask for a behavioral next step.</strong>A follow-up with a stakeholder, a data review, or a defined test is more informative than “Would you use this?”</div></li>
        </ol>
      </PublicSection>

      <PublicSection eyebrow="Question prompts" title="Use prompts that reveal constraints." tone="surface">
        <div className={styles.prose}>
          <ul>
            <li>“Walk me through the last time this happened.”</li>
            <li>“What did you try, and what made that approach acceptable?”</li>
            <li>“Who notices the impact first, and who owns the budget?”</li>
            <li>“What has to be true for this to become a priority this quarter?”</li>
            <li>“What evidence would your team need before testing a new approach?”</li>
            <li>“What would make this impossible to adopt?”</li>
          </ul>
          <p>Avoid leading questions, hypothetical pricing questions without context, and multiple ideas in one prompt. Silence is useful; it gives the participant room to describe the real workflow.</p>
        </div>
      </PublicSection>

      <PublicSection eyebrow="Synthesis" title="Convert notes into a decision.">
        <div className={styles.prose}>
          <p>Within 24 hours, separate direct observations from the team’s interpretation. Tag evidence by segment, assumption, buying role, strength, and contradiction. Compare patterns across independent conversations.</p>
          <p>End each review with four statements: what we believe now, what evidence changed that belief, what remains uncertain, and what we will test next. Use the <Link href="/methodology">O1SF methodology</Link> for the full learning loop and the <Link href="/resources/us-go-to-market-plan">go-to-market guide</Link> to place the next test on a roadmap.</p>
        </div>
      </PublicSection>

      <PublicCta />
    </PublicPage>
  );
}
