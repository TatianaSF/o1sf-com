import Link from "next/link";

import { TatianaText } from "../../components/TatianaText";
import { getCollection } from "../../lib/content";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "O1SF Sections",
  description:
    "Read the public O1SF sections by TatianaSF about visibility, context, speaking, mentoring, panels, and high-trust rooms in San Francisco.",
  path: "/sections",
  type: "website",
});

export default function SectionsIndexPage() {
  const sections = getCollection("sections");

  return (
    <main className="content-page">
      <header className="content-hero">
        <Link className="content-home-link" href="/">
          O1SF
        </Link>
        <h1>Sections</h1>
        <p>
          <TatianaText text="Public content blocks for the O1SF landing page by TatianaSF." />
        </p>
      </header>
      <div className="content-grid">
        {sections.map((section) => (
          <article className="content-card" key={section.slug}>
            <Link className="content-card-link" href={`/sections/${section.slug}`} prefetch={false}>
              <span>{section.eyebrow || String(section.order).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
            </Link>
            <p>
              <TatianaText text={section.description} />
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
