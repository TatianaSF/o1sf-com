import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownBody } from "../../../components/MarkdownBody";
import { TatianaText } from "../../../components/TatianaText";
import { getCollection, getItem } from "../../../lib/content";
import { buildPageMetadata, buildSectionJsonLd, serializeJsonLd } from "../../../lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCollection("sections").map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const section = getItem("sections", slug);

  if (!section) {
    return {};
  }

  return buildPageMetadata({
    title: section.title,
    description: section.description,
    path: `/sections/${section.slug}`,
  });
}

export default async function SectionPage({ params }) {
  const { slug } = await params;
  const section = getItem("sections", slug);

  if (!section) {
    notFound();
  }

  const jsonLd = buildSectionJsonLd(section);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <main className="content-page">
        <header className="content-hero">
          <Link className="content-home-link" href="/">
            O1SF
          </Link>
          <p className="content-kicker">{section.eyebrow || String(section.order).padStart(2, "0")}</p>
          <h1>{section.title}</h1>
          <p>
            <TatianaText text={section.description} />
          </p>
        </header>
        <article className="markdown-shell glass-card">
          <MarkdownBody body={section.body} />
        </article>
      </main>
    </>
  );
}
