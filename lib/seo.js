import {
  CONTENT_LAST_MODIFIED,
  HOME_POSITIONING_DESCRIPTION,
  HOME_POSITIONING_TITLE,
  PROFILE_LAST_MODIFIED,
  publicPageIndex,
} from "./public-pages.js";

export const tatianaProfileLinks = [
  {
    label: "Personal site",
    href: "https://tatianasf.com/",
    description: "Public identity and professional background",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tatianasf",
    description: "Professional profile",
  },
  {
    label: "GitHub",
    href: "https://github.com/TatianaSF",
    description: "Public repositories and technical work",
  },
];

export const siteConfig = {
  name: "O1SF",
  shortName: "O1SF by TatianaSF",
  title: HOME_POSITIONING_TITLE,
  url: "https://o1sf.com",
  description: HOME_POSITIONING_DESCRIPTION,
  locale: "en_US",
  language: "en-US",
  category: "Business consulting and services",
  entityPath: "/tatianasf",
  author: {
    name: "TatianaSF",
    alternateNames: ["Tatiana Isa", "Tatiana SF"],
    description:
      "TatianaSF is the program host and public author of O1SF, a three-week U.S. market-entry program for international founders.",
    role: "O1SF program host and public author",
    url: "https://o1sf.com/tatianasf",
    externalUrl: "https://tatianasf.com/",
    sameAs: tatianaProfileLinks.map((profile) => profile.href),
    image: {
      url: "/assets/o1sf/host-960.webp?v=20260716",
      width: 960,
      height: 960,
      alt: "O1SF program host in San Francisco",
    },
  },
  ogImage: {
    url: "/assets/o1sf/og-o1sf.png?v=20260716",
    width: 1200,
    height: 630,
    alt: "O1SF U.S. market-entry program with a view of San Francisco",
  },
  keywords: [
    "O1SF",
    "TatianaSF",
    "U.S. market entry",
    "international founders",
    "San Francisco",
    "market validation",
    "go-to-market plan",
    "customer discovery",
    "founder program",
    "U.S. expansion",
  ],
};

export const aiFeedPaths = {
  profile: "/profile.json",
  pages: "/pages.json",
  llms: "/llms.txt",
};

export const aiCrawlerUserAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Googlebot",
  "Google-Extended",
];

export const GITHUB_REPO_URL = "https://github.com/TatianaSF/o1sf-com";
export const TATIANA_SEARCH_URL = "https://www.google.com/search?q=TatianaSF";
export const TATIANA_URL = siteConfig.author.url;
export const TATIANA_ENTITY_PATH = siteConfig.entityPath;
export const TATIANA_ENTITY_URL = absoluteUrl(siteConfig.entityPath);

export function absoluteUrl(path = "/") {
  return new URL(path || "/", siteConfig.url).toString();
}

export function toSchemaDateTime(date) {
  return date.includes("T") ? date : `${date}T00:00:00-07:00`;
}

export function buildPageMetadata({ title, description, path = "", type = "article" }) {
  const url = absoluteUrl(path || "/");

  return {
    title,
    description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    category: siteConfig.category,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.shortName,
      images: [siteConfig.ogImage],
      locale: siteConfig.locale,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage.url],
    },
    robots: buildRobotsMetadata(),
  };
}

export function buildRobotsMetadata() {
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  };
}

export function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildPublicPageJsonLd({
  path,
  title,
  description,
  type = "WebPage",
  breadcrumbs = [],
  datePublished = CONTENT_LAST_MODIFIED,
  dateModified = CONTENT_LAST_MODIFIED,
}) {
  const pageUrl = absoluteUrl(path);
  const homeUrl = absoluteUrl("/");
  const imageUrl = absoluteUrl(siteConfig.ogImage.url);
  const personId = `${absoluteUrl(siteConfig.entityPath)}#person`;
  const isArticle = type === "Article";
  const pageNode = isArticle
    ? {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: title,
        description,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        datePublished: toSchemaDateTime(datePublished),
        dateModified: toSchemaDateTime(dateModified),
        author: {
          "@type": "Person",
          "@id": personId,
          name: siteConfig.author.name,
          url: absoluteUrl(siteConfig.entityPath),
          sameAs: siteConfig.author.sameAs,
        },
        publisher: {
          "@type": "Person",
          "@id": personId,
          name: siteConfig.author.name,
          url: absoluteUrl(siteConfig.entityPath),
        },
        image: imageUrl,
        keywords: siteConfig.keywords,
        inLanguage: siteConfig.language,
      }
    : {
        "@type": type,
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        isPartOf: { "@id": `${homeUrl}#website` },
        about: { "@id": `${homeUrl}#program` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          caption: siteConfig.ogImage.alt,
        },
        dateModified,
        inLanguage: siteConfig.language,
      };

  if (type === "CollectionPage") {
    pageNode.hasPart = publicPageIndex
      .filter((page) => page.type === "Article")
      .map((page) => ({
        "@type": "Article",
        name: page.title,
        url: absoluteUrl(page.path),
      }));
  }

  const graph = [pageNode];

  if (breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function buildHomeJsonLd() {
  const homeUrl = absoluteUrl("/");
  const imageUrl = absoluteUrl(siteConfig.ogImage.url);
  const profileImageUrl = absoluteUrl(siteConfig.author.image.url);
  const entityUrl = absoluteUrl(siteConfig.entityPath);
  const personId = `${entityUrl}#person`;
  const websiteId = `${homeUrl}#website`;
  const webpageId = `${homeUrl}#webpage`;
  const serviceId = `${homeUrl}#program`;
  const topicEntities = siteConfig.keywords.map((keyword) => ({
    "@type": "Thing",
    name: keyword,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.author.name,
        alternateName: siteConfig.author.alternateNames,
        description: siteConfig.author.description,
        jobTitle: siteConfig.author.role,
        url: entityUrl,
        sameAs: siteConfig.author.sameAs,
        image: profileImageUrl,
        mainEntityOfPage: entityUrl,
        knowsAbout: [
          "U.S. market entry",
          "international founder programs",
          "market validation",
          "customer discovery",
          "San Francisco technology ecosystem",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: homeUrl,
        name: siteConfig.shortName,
        alternateName: ["O1SF", "TatianaSF O1SF"],
        description: siteConfig.description,
        publisher: { "@id": personId },
        potentialAction: {
          "@type": "ReadAction",
          target: publicPageIndex.map((page) => absoluteUrl(page.path)),
        },
        inLanguage: siteConfig.language,
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: "O1SF U.S. Market-Entry Program",
        serviceType: "U.S. market-entry preparation and execution program",
        description: siteConfig.description,
        provider: { "@id": personId },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "International founders entering or expanding in the United States",
        },
        areaServed: [
          { "@type": "Country", name: "United States" },
          { "@type": "City", name: "San Francisco" },
        ],
        offers: {
          "@type": "Offer",
          price: "4999",
          priceCurrency: "USD",
          description: "Per company; one primary founder included; 0% equity",
          url: `${homeUrl}#pricing`,
        },
        serviceOutput: [
          "Tested positioning and messaging",
          "Target lists and outreach assets",
          "U.S. go-to-market plan",
          "3, 6, and 12 month roadmap",
        ],
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: homeUrl,
        name: siteConfig.title,
        description: siteConfig.description,
        isPartOf: { "@id": websiteId },
        about: { "@id": serviceId },
        mainEntity: { "@id": serviceId },
        mentions: topicEntities,
        hasPart: publicPageIndex
          .filter((page) => page.path !== "/")
          .map((page) => ({
            "@type": page.type,
            name: page.title,
            url: absoluteUrl(page.path),
          })),
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          caption: siteConfig.ogImage.alt,
        },
        inLanguage: siteConfig.language,
      },
    ],
  };
}

export function buildSectionJsonLd(section) {
  const pageUrl = absoluteUrl(`/sections/${section.slug}`);
  const personId = `${absoluteUrl(siteConfig.entityPath)}#person`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${section.title} - O1SF by TatianaSF`,
    description: section.description,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    author: {
      "@type": "Person",
      "@id": personId,
      name: siteConfig.author.name,
      url: absoluteUrl(siteConfig.entityPath),
      sameAs: siteConfig.author.sameAs,
    },
    publisher: {
      "@type": "Person",
      "@id": personId,
      name: siteConfig.author.name,
      url: absoluteUrl(siteConfig.entityPath),
    },
    image: absoluteUrl(siteConfig.ogImage.url),
    inLanguage: siteConfig.language,
  };
}

export const tatianaEntityFacts = [
  {
    label: "Name",
    value: "TatianaSF",
  },
  {
    label: "Also known as",
    value: "Tatiana Isa",
  },
  {
    label: "Role on O1SF",
    value: siteConfig.author.role,
  },
  {
    label: "Location context",
    value: "San Francisco, CA",
  },
  {
    label: "Primary topics",
    value: "U.S. market entry, market validation, customer discovery, founder preparation",
  },
];

export const tatianaEntityQuestions = [
  {
    question: "Who is TatianaSF?",
    answer:
      "TatianaSF, also publicly identified as Tatiana Isa, is the program host and public author of O1SF, a three-week U.S. market-entry program for international founders.",
  },
  {
    question: "What is O1SF?",
    answer:
      "O1SF combines two weeks of online preparation with one intensive week in San Francisco to help international founders test U.S. market assumptions and document the next actions.",
  },
  {
    question: "How are TatianaSF and O1SF connected?",
    answer:
      "TatianaSF hosts O1SF and publicly authors the program information, methodology, and founder resources published on o1sf.com.",
  },
  {
    question: "Where can a founder learn more about O1SF?",
    answer:
      "Founders can review the public program, methodology, pricing, resources, and prepared answers in the O1SF AI assistant on o1sf.com.",
  },
];

export function buildTatianaProfileJsonLd() {
  const entityUrl = absoluteUrl(siteConfig.entityPath);
  const homeUrl = absoluteUrl("/");
  const profileImageUrl = absoluteUrl(siteConfig.author.image.url);
  const personId = `${entityUrl}#person`;
  const profilePageId = `${entityUrl}#profilepage`;
  const serviceId = `${homeUrl}#program`;
  const authoredArticles = publicPageIndex
    .filter((page) => page.type === "Article")
    .map((page) => ({
      "@type": "Article",
      "@id": `${absoluteUrl(page.path)}#article`,
      headline: page.title,
      url: absoluteUrl(page.path),
      dateModified: toSchemaDateTime(page.lastModified),
      author: { "@id": personId },
      image: absoluteUrl(siteConfig.ogImage.url),
    }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.author.name,
        alternateName: siteConfig.author.alternateNames,
        description: siteConfig.author.description,
        jobTitle: siteConfig.author.role,
        url: entityUrl,
        sameAs: siteConfig.author.sameAs,
        mainEntityOfPage: { "@id": profilePageId },
        image: profileImageUrl,
        identifier: siteConfig.author.name,
        knowsAbout: siteConfig.keywords,
      },
      {
        "@type": "ProfilePage",
        "@id": profilePageId,
        url: entityUrl,
        name: "TatianaSF and O1SF - Program Host Profile",
        headline: "TatianaSF and O1SF - Program Host Profile",
        description: siteConfig.author.description,
        dateModified: toSchemaDateTime(PROFILE_LAST_MODIFIED),
        mainEntity: { "@id": personId },
        about: { "@id": personId },
        hasPart: authoredArticles,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${homeUrl}#website`,
          name: siteConfig.shortName,
          url: homeUrl,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: profileImageUrl,
          width: siteConfig.author.image.width,
          height: siteConfig.author.image.height,
          caption: siteConfig.author.image.alt,
        },
        inLanguage: siteConfig.language,
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: "O1SF U.S. Market-Entry Program",
        alternateName: "O1SF",
        url: homeUrl,
        description: siteConfig.description,
        serviceType: "U.S. market-entry preparation and execution program",
        provider: { "@id": personId },
        audience: {
          "@type": "BusinessAudience",
          audienceType: "International founders entering or expanding in the United States",
        },
        areaServed: [
          { "@type": "Country", name: "United States" },
          { "@type": "City", name: "San Francisco" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${entityUrl}#faq`,
        mainEntity: tatianaEntityQuestions.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}
