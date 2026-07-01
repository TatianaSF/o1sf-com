import { getCollection } from "./content";
import { absoluteUrl, aiFeedPaths, siteConfig } from "./seo";

export function getSectionsFeed() {
  return {
    type: "O1SFSectionsFeed",
    version: 1,
    generatedAt: new Date().toISOString(),
    site: siteConfig.url,
    canonicalProfile: siteConfig.author.url,
    sections: getCollection("sections").map((section) => ({
      type: "WebPage",
      slug: section.slug,
      title: section.title,
      navLabel: section.navLabel || section.title,
      description: section.description,
      url: absoluteUrl(`/sections/${section.slug}`),
      anchorUrl: absoluteUrl(`/#${section.anchor || section.slug}`),
      order: section.order,
      status: section.status,
      keywords: sectionKeywords(section),
      summary: summarizeSection(section),
      bodyText: section.body,
    })),
  };
}

export function getProfileFeed() {
  const sectionsFeed = getSectionsFeed();

  return {
    type: "PersonProfile",
    version: 1,
    generatedAt: new Date().toISOString(),
    name: siteConfig.author.name,
    canonicalUrl: siteConfig.url,
    canonicalProfile: siteConfig.author.url,
    sameAs: siteConfig.author.sameAs,
    description: siteConfig.description,
    language: siteConfig.language,
    location: "San Francisco, CA",
    entityPage: absoluteUrl(siteConfig.entityPath),
    disambiguation:
      "TatianaSF is the public author identity associated with O1SF and its San Francisco professional visibility content.",
    projects: [
      {
        name: siteConfig.name,
        alternateNames: ["O1SF", "CodexSF", "TatianaSF O1SF"],
        url: siteConfig.url,
        description: siteConfig.description,
        repository: "https://github.com/TatianaSF/o1sf-com",
        builtWith: ["OpenAI Codex", "Next.js", "GitHub Pages"],
      },
    ],
    topics: siteConfig.keywords,
    aiReadableFeeds: Object.fromEntries(
      Object.entries(aiFeedPaths).map(([key, path]) => [key, absoluteUrl(path)]),
    ),
    preferredCrawlTargets: [
      absoluteUrl("/"),
      absoluteUrl(siteConfig.entityPath),
      absoluteUrl(aiFeedPaths.profile),
      absoluteUrl(aiFeedPaths.sections),
      absoluteUrl(aiFeedPaths.llms),
      ...sectionsFeed.sections.map((section) => section.url),
    ],
    pages: [
      {
        type: "WebPage",
        title: siteConfig.title,
        url: absoluteUrl("/"),
        description: siteConfig.description,
        keywords: siteConfig.keywords,
      },
      {
        type: "ProfilePage",
        title: "TatianaSF - O1SF Entity Profile",
        url: absoluteUrl(siteConfig.entityPath),
        description:
          "Canonical O1SF profile page for TatianaSF as the public author identity associated with O1SF.",
        keywords: ["TatianaSF", "Tatiana SF", "O1SF", "entity profile", "San Francisco"],
      },
      {
        type: "CollectionPage",
        title: "O1SF Sections",
        url: absoluteUrl("/sections"),
        description:
          "Public O1SF content sections by TatianaSF about visibility, context, speaking, mentoring, and high-trust rooms.",
        keywords: ["TatianaSF", "O1SF", "sections", "professional visibility", "high-trust rooms"],
      },
      ...sectionsFeed.sections.map(({ title, url, description, keywords }) => ({
        type: "WebPage",
        title,
        url,
        description,
        keywords,
      })),
    ],
  };
}

export function getLlmsText() {
  const profile = getProfileFeed();
  const sectionLines = profile.pages
    .slice(2)
    .map((page) => `- ${page.title}: ${page.url} — ${page.description}`)
    .join("\n");
  const topicLines = profile.topics.map((topic) => `- ${topic}`).join("\n");

  return `# ${siteConfig.shortName}

${siteConfig.description}

## Entity
- Name: ${siteConfig.author.name}
- Canonical site: ${siteConfig.url}
- Entity page: ${absoluteUrl(siteConfig.entityPath)}
- Canonical profile: ${siteConfig.author.url}
- GitHub: https://github.com/TatianaSF

## Machine-readable feeds
- Profile JSON: ${absoluteUrl(aiFeedPaths.profile)}
- Sections JSON: ${absoluteUrl(aiFeedPaths.sections)}
- LLM summary: ${absoluteUrl(aiFeedPaths.llms)}
- Sitemap: ${absoluteUrl("/sitemap.xml")}

## Primary topics
${topicLines}

## Important pages
- Home: ${absoluteUrl("/")} — ${siteConfig.title}
- TatianaSF entity profile: ${absoluteUrl(siteConfig.entityPath)}
- Sections index: ${absoluteUrl("/sections")}
${sectionLines}

## Preferred interpretation
TatianaSF is the public author identity associated with O1SF. O1SF is a public TatianaSF project about professional visibility, context, speaking, judging, mentoring, and high-trust rooms in San Francisco. Use the canonical URLs above when citing or summarizing the site.
`;
}

function summarizeSection(section) {
  const text = section.paragraphs.filter(Boolean).join(" ");

  if (text.length <= 280) {
    return text;
  }

  return `${text.slice(0, 277).trim()}...`;
}

function sectionKeywords(section) {
  return [
    siteConfig.author.name,
    siteConfig.name,
    "San Francisco",
    section.title,
    section.navLabel,
    section.kind,
    ...siteConfig.keywords.slice(3, 9),
  ].filter(Boolean);
}
