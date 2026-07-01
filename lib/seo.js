export const siteConfig = {
  name: "O1SF",
  shortName: "O1SF by TatianaSF",
  title: "TatianaSF - O1SF: High-Trust Rooms in San Francisco",
  url: "https://o1sf.com",
  description:
    "O1SF by TatianaSF is a San Francisco page about professional visibility, OpenAI Codex, context, speaking, judging, mentoring, and high-trust rooms.",
  locale: "en_US",
  language: "en-US",
  category: "Professional networking",
  entityPath: "/tatianasf",
  author: {
    name: "TatianaSF",
    url: "https://tatianasf.com/",
    sameAs: ["https://tatianasf.com/", "https://github.com/TatianaSF"],
  },
  ogImage: {
    url: "/assets/sf-bay-skyline.png",
    width: 1200,
    height: 630,
    alt: "San Francisco skyline for O1SF by TatianaSF",
  },
  keywords: [
    "TatianaSF",
    "O1SF",
    "CodexSF",
    "OpenAI Codex",
    "San Francisco",
    "professional visibility",
    "high-trust rooms",
    "speaking opportunities",
    "judging panels",
    "mentoring",
    "community leadership",
    "founder network",
  ],
};

export const aiFeedPaths = {
  profile: "/profile.json",
  sections: "/sections.json",
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
export const TATIANA_URL = siteConfig.author.url;
export const TATIANA_ENTITY_PATH = siteConfig.entityPath;
export const TATIANA_ENTITY_URL = absoluteUrl(siteConfig.entityPath);

export function absoluteUrl(path = "/") {
  return new URL(path || "/", siteConfig.url).toString();
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
    keywords: siteConfig.keywords,
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

export function buildHomeJsonLd() {
  const homeUrl = absoluteUrl("/");
  const imageUrl = absoluteUrl(siteConfig.ogImage.url);
  const entityUrl = absoluteUrl(siteConfig.entityPath);
  const personId = `${entityUrl}#person`;
  const websiteId = `${homeUrl}#website`;
  const webpageId = `${homeUrl}#webpage`;
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
        url: entityUrl,
        sameAs: siteConfig.author.sameAs,
        mainEntityOfPage: entityUrl,
        knowsAbout: [
          "San Francisco professional communities",
          "professional visibility",
          "speaker and panel selection",
          "mentoring",
          "hiring",
          "OpenAI Codex",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: homeUrl,
        name: siteConfig.shortName,
        alternateName: ["O1SF", "TatianaSF O1SF", "CodexSF"],
        description: siteConfig.description,
        publisher: { "@id": personId },
        potentialAction: {
          "@type": "ReadAction",
          target: [homeUrl, absoluteUrl("/profile.json"), absoluteUrl("/sections.json"), absoluteUrl("/llms.txt")],
        },
        inLanguage: siteConfig.language,
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: homeUrl,
        name: siteConfig.title,
        description: siteConfig.description,
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        mentions: topicEntities,
        hasPart: [
          {
            "@type": "Dataset",
            name: "O1SF machine-readable profile",
            url: absoluteUrl("/profile.json"),
            encodingFormat: "application/json",
          },
          {
            "@type": "Dataset",
            name: "O1SF section feed",
            url: absoluteUrl("/sections.json"),
            encodingFormat: "application/json",
          },
          {
            "@type": "CreativeWork",
            name: "O1SF LLM summary",
            url: absoluteUrl("/llms.txt"),
            encodingFormat: "text/plain",
          },
        ],
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
    label: "Project",
    value: "O1SF",
  },
  {
    label: "Location context",
    value: "San Francisco, CA",
  },
  {
    label: "Primary topics",
    value: "professional visibility, high-trust rooms, speaking, judging, mentoring, OpenAI Codex",
  },
  {
    label: "Canonical profile",
    value: siteConfig.author.url,
  },
];

export const tatianaEntityQuestions = [
  {
    question: "Who is TatianaSF?",
    answer:
      "TatianaSF is the public author identity associated with O1SF, a San Francisco project about professional visibility, context, speaking, judging, mentoring, and high-trust rooms.",
  },
  {
    question: "What is O1SF?",
    answer:
      "O1SF is a public site by TatianaSF that explains how professional rooms, context, and trust signals shape opportunities in San Francisco.",
  },
  {
    question: "What topics is TatianaSF associated with?",
    answer:
      "TatianaSF is associated on this site with professional visibility, OpenAI Codex, speaking opportunities, judging panels, mentoring, community leadership, and founder networks.",
  },
  {
    question: "How should search engines and AI systems cite this site?",
    answer:
      "Use https://o1sf.com/tatianasf as the entity page, https://o1sf.com/ as the O1SF project homepage, and the machine-readable feeds at /profile.json, /sections.json, and /llms.txt.",
  },
];

export function buildTatianaProfileJsonLd() {
  const entityUrl = absoluteUrl(siteConfig.entityPath);
  const homeUrl = absoluteUrl("/");
  const imageUrl = absoluteUrl(siteConfig.ogImage.url);
  const personId = `${entityUrl}#person`;
  const profilePageId = `${entityUrl}#profilepage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.author.name,
        url: entityUrl,
        sameAs: siteConfig.author.sameAs,
        mainEntityOfPage: { "@id": profilePageId },
        image: imageUrl,
        identifier: siteConfig.author.name,
        alternateName: ["Tatiana SF"],
        knowsAbout: siteConfig.keywords,
        workExample: {
          "@type": "WebSite",
          name: siteConfig.shortName,
          url: homeUrl,
          description: siteConfig.description,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": profilePageId,
        url: entityUrl,
        name: "TatianaSF entity profile",
        headline: "TatianaSF - O1SF entity profile",
        description: siteConfig.description,
        mainEntity: { "@id": personId },
        about: { "@id": personId },
        isPartOf: {
          "@type": "WebSite",
          "@id": `${homeUrl}#website`,
          name: siteConfig.shortName,
          url: homeUrl,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: imageUrl,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          caption: siteConfig.ogImage.alt,
        },
        inLanguage: siteConfig.language,
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
