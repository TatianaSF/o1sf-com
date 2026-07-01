import Link from "next/link";

import { TatianaText } from "../../components/TatianaText";
import {
  buildPageMetadata,
  buildTatianaProfileJsonLd,
  serializeJsonLd,
  siteConfig,
  tatianaEntityFacts,
  tatianaEntityQuestions,
} from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "TatianaSF - O1SF Entity Profile",
  description:
    "TatianaSF is the public author identity associated with O1SF, a San Francisco project about professional visibility, OpenAI Codex, speaking, judging, mentoring, and high-trust rooms.",
  path: "/tatianasf",
  type: "profile",
});

export default function TatianaProfilePage() {
  const jsonLd = buildTatianaProfileJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main className="content-page entity-page">
        <header className="content-hero">
          <Link className="content-home-link" href="/">
            O1SF
          </Link>
          <p className="content-kicker">Entity profile</p>
          <h1>TatianaSF</h1>
          <p>
            TatianaSF is the public author identity associated with O1SF, a San Francisco
            project about professional visibility, context, speaking, judging, mentoring,
            and high-trust rooms.
          </p>
        </header>

        <section className="entity-summary glass-card" aria-labelledby="entity-summary-title">
          <div>
            <p className="content-kicker" id="entity-summary-title">
              Search entity
            </p>
            <h2>TatianaSF by O1SF</h2>
            <p>
              This page is the canonical O1SF profile page for the search phrase{" "}
              <strong>TatianaSF</strong>. It gives search engines and AI systems a concise,
              stable place to understand the relationship between TatianaSF, O1SF, and the
              public content on this site.
            </p>
          </div>
          <dl className="entity-facts">
            {tatianaEntityFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>
                  <TatianaText text={fact.value} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="content-grid entity-links" aria-label="Important TatianaSF links">
          <article className="content-card">
            <Link className="content-card-link" href="/">
              <span>Project</span>
              <h2>O1SF homepage</h2>
            </Link>
            <p>{siteConfig.description}</p>
          </article>
          <article className="content-card">
            <Link className="content-card-link" href="/sections">
              <span>Content</span>
              <h2>O1SF sections</h2>
            </Link>
            <p>Public content blocks about visibility, context, rooms, and outcomes.</p>
          </article>
          <article className="content-card">
            <a className="content-card-link" href={siteConfig.author.url} rel="noopener noreferrer">
              <span>Canonical profile</span>
              <h2>tatianasf.com</h2>
            </a>
            <p>External canonical profile listed as a sameAs source for TatianaSF.</p>
          </article>
        </section>

        <section className="markdown-shell entity-faq" aria-labelledby="entity-faq-title">
          <p className="content-kicker" id="entity-faq-title">
            Questions
          </p>
          {tatianaEntityQuestions.map((item) => (
            <article key={item.question}>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
