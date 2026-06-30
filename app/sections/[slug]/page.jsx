import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownBody } from "../../../components/MarkdownBody";
import { getCollection, getItem } from "../../../lib/content";
import { buildPageMetadata } from "../../../lib/seo";

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

  return (
    <main className="content-page">
      <header className="content-hero">
        <Link className="content-home-link" href="/">
          O1SF
        </Link>
        <p className="content-kicker">{section.eyebrow || String(section.order).padStart(2, "0")}</p>
        <h1>{section.title}</h1>
        <p>{section.description}</p>
      </header>
      <article className="markdown-shell glass-card">
        <MarkdownBody body={section.body} />
      </article>
    </main>
  );
}
