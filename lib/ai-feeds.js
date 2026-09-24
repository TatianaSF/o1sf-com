import { publicPageIndex } from "./public-pages.js";
import { absoluteUrl, aiFeedPaths, siteConfig } from "./seo.js";

const latestPageModified = publicPageIndex.reduce(
  (latest, page) => (page.lastModified > latest ? page.lastModified : latest),
  publicPageIndex[0].lastModified,
);
const generatedAt = `${latestPageModified}T00:00:00.000Z`;

export function getPagesFeed() {
  return {
    type: "O1SFPublicPagesFeed",
    version: 2,
    generatedAt,
    site: siteConfig.url,
    project: {
      name: siteConfig.name,
      description: siteConfig.description,
      category: "U.S. market-entry program for international founders",
      locationContext: "San Francisco, CA",
    },
    pages: publicPageIndex.map((page) => ({
      type: page.type,
      title: page.title,
      description: page.description,
      url: absoluteUrl(page.path),
      dateModified: page.lastModified,
    })),
  };
}

export function getProfileFeed() {
  const pagesFeed = getPagesFeed();

  return {
    type: "PersonProfile",
    version: 2,
    generatedAt,
    name: siteConfig.author.name,
    alternateNames: siteConfig.author.alternateNames,
    role: siteConfig.author.role,
    canonicalUrl: siteConfig.author.url,
    sameAs: siteConfig.author.sameAs,
    description: siteConfig.author.description,
    image: absoluteUrl(siteConfig.author.image.url),
    language: siteConfig.language,
    locationContext: "San Francisco, CA",
    entityPage: absoluteUrl(siteConfig.entityPath),
    projects: [
      {
        type: "Service",
        name: "O1SF U.S. Market-Entry Program",
        alternateNames: ["O1SF", "TatianaSF O1SF"],
        url: siteConfig.url,
        description: siteConfig.description,
        repository: "https://github.com/TatianaSF/o1sf-com",
        builtWith: ["OpenAI Codex", "Next.js", "Hostinger"],
      },
    ],
    topics: siteConfig.keywords,
    aiReadableFeeds: Object.fromEntries(
      Object.entries(aiFeedPaths).map(([key, path]) => [key, absoluteUrl(path)]),
    ),
    preferredCrawlTargets: pagesFeed.pages.map((page) => page.url),
    pages: pagesFeed.pages,
  };
}
