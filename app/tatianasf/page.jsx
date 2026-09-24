import Image from "next/image";
import Link from "next/link";

import {
  JsonLd,
  PublicCta,
  PublicHero,
  PublicPage,
  PublicSection,
  publicContentStyles as styles,
} from "../../components/PublicContent";
import { TatianaLink } from "../../components/TatianaLink";
import { TatianaText } from "../../components/TatianaText";
import { getPublicPage, resourceGuideIndex } from "../../lib/public-pages";
import {
  buildPageMetadata,
  buildTatianaProfileJsonLd,
  siteConfig,
  tatianaEntityFacts,
  tatianaEntityQuestions,
  tatianaProfileLinks,
} from "../../lib/seo";

const page = getPublicPage("/tatianasf");
const breadcrumbs = [
  { href: "/", label: "O1SF" },
  { href: "/tatianasf", label: "Program host" },
];

export const metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
  type: "profile",
});

export default function TatianaProfilePage() {
  return (
    <PublicPage>
      <JsonLd data={buildTatianaProfileJsonLd()} />
      <PublicHero
        breadcrumbs={breadcrumbs}
        eyebrow="O1SF program host and public author"
        lede={<TatianaText text="TatianaSF hosts and publicly authors O1SF, a three-week U.S. market-entry program for international founders. This site explains the format, methodology, pricing, and practical work founders can use to test U.S. market assumptions." />}
        title={<><TatianaLink className={styles.profileTitleLink} /> and O1SF</>}
      >
        <div className={styles.profileActions}>
          <Link className={styles.primaryBlueAction} href="/program">Review the O1SF program</Link>
          <Link className={styles.textAction} href="/resources">Browse founder resources</Link>
        </div>
      </PublicHero>

      <PublicSection
        eyebrow="Role"
        lead={<TatianaText text="On o1sf.com, TatianaSF is identified as the program host and public author. O1SF is the program; TatianaSF is the person responsible for its public explanation and educational resources." />}
        title="The public author behind O1SF."
      >
        <div className={styles.profileGrid}>
          <Image
            alt={siteConfig.author.image.alt}
            className={styles.photo}
            height={siteConfig.author.image.height}
            priority
            sizes="(max-width: 840px) calc(100vw - 48px), 420px"
            src={siteConfig.author.image.url}
            width={siteConfig.author.image.width}
          />
          <div>
            <dl className={styles.entityFacts}>
              {tatianaEntityFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd><TatianaText text={fact.value} /></dd>
                </div>
              ))}
            </dl>
            <div className={styles.identitySources}>
              <h3>Public identity sources</h3>
              <ul>
                {tatianaProfileLinks.map((profile) => (
                  <li key={profile.href}>
                    <a href={profile.href} rel="me noopener noreferrer" target="_blank">
                      <strong>{profile.label}</strong>
                      <span>{profile.description}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Primary program"
        lead={<TatianaText text="O1SF is the primary program documented on this site. It is hosted and publicly authored by TatianaSF for international founders evaluating or preparing a U.S. market entry." />}
        title="One program, one clear relationship."
        tone="surface"
      >
        <div className={styles.connectionGrid}>
          <div className={styles.connectionStatement}>
            <p>O1SF combines two online preparation weeks with one intensive week in San Francisco. Founders use the program to test positioning, customer, buyer, channel, and timing assumptions through concrete assets and relevant market interactions.</p>
            <p>Paying customers describe the direction of the work, not a guaranteed outcome. Meetings, introductions, customers, revenue, investment, visas, and other market results are not guaranteed.</p>
          </div>
          <dl className={styles.entityFacts}>
            <div>
              <dt>Program</dt>
              <dd><Link href="/">O1SF U.S. Market-Entry Program</Link></dd>
            </div>
            <div>
              <dt>Host and author</dt>
              <dd><TatianaLink /></dd>
            </div>
            <div>
              <dt>Audience</dt>
              <dd>International founders entering or expanding in the United States</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>Two weeks online and one intensive week in San Francisco</dd>
            </div>
          </dl>
        </div>
        <div className={styles.profileActions}>
          <Link className={styles.primaryBlueAction} href="/program">See the complete program</Link>
          <Link className={styles.textAction} href="/pricing">Review pricing and inclusions</Link>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Working approach"
        lead="The program approach emphasizes relevant market interaction, explicit assumptions, recorded feedback, and decisions that can be traced back to evidence."
        title="Clarity before confidence."
      >
        <ol className={styles.numberedList}>
          <li><div><strong>State the uncertain claim.</strong>Name the customer, problem, buyer, proof, channel, or timing assumption that matters to the market-entry decision.</div></li>
          <li><div><strong>Put a concrete asset into context.</strong>Use positioning, outreach, an interview prompt, a target list, or a workflow to make the assumption observable.</div></li>
          <li><div><strong>Revise the next action.</strong>Separate evidence from interpretation, preserve contradictions, and change the plan when the market gives a different answer.</div></li>
        </ol>
        <div className={styles.prose}>
          <p>Read the complete <Link href="/methodology">O1SF methodology</Link> or use the <Link href="/resources">founder resources</Link> before beginning a program conversation.</p>
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Published resources"
        lead={<TatianaText text="These practical O1SF guides are publicly attributed to TatianaSF. Each guide turns a broad market-entry question into a working decision or artifact." />}
        title="Founder guides connected to this profile."
        tone="surface"
      >
        <div className={styles.resourceGrid}>
          {resourceGuideIndex.map((guide, index) => (
            <Link className={styles.resourceCard} href={guide.path} key={guide.path}>
              <span>Guide {String(index + 1).padStart(2, "0")}</span>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
            </Link>
          ))}
        </div>
      </PublicSection>

      <PublicSection
        eyebrow="Questions"
        lead="Concise answers to the most common identity and program questions."
        title="About the host and O1SF."
      >
        <div className={styles.faqList}>
          {tatianaEntityQuestions.map((item) => (
            <article key={item.question}>
              <h3><TatianaText text={item.question} /></h3>
              <p><TatianaText text={item.answer} /></p>
            </article>
          ))}
        </div>
      </PublicSection>

      <PublicCta
        secondaryHref="/methodology"
        secondaryLabel="See the methodology"
        text="Use the public program materials and prepared answers to understand the format, evidence standard, pricing, and limitations."
        title="Review the O1SF program evidence."
      />
    </PublicPage>
  );
}
