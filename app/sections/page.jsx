import Link from "next/link";

import { getCollection } from "../../lib/content";
import { buildPageMetadata } from "../../lib/seo";

export const metadata = buildPageMetadata({
  title: "Sections",
  description: "All public O1SF landing sections stored as Markdown content.",
  path: "/sections",
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
        <p>Public content blocks for the O1SF landing page.</p>
      </header>
      <div className="content-grid">
        {sections.map((section) => (
          <Link className="content-card" key={section.slug} href={`/sections/${section.slug}`}>
            <span>{section.eyebrow || String(section.order).padStart(2, "0")}</span>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
