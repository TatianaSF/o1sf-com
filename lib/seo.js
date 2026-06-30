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

export const GITHUB_REPO_URL = "https://github.com/TatianaSF/o1sf-com";
export const TATIANA_URL = "https://www.google.com/search?q=TatianaSF";

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
  const personId = `${homeUrl}#tatianasf`;
  const websiteId = `${homeUrl}#website`;
  const webpageId = `${homeUrl}#webpage`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.author.name,
        url: siteConfig.author.url,
        sameAs: siteConfig.author.sameAs,
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

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${section.title} - O1SF by TatianaSF`,
    description: section.description,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
      sameAs: siteConfig.author.sameAs,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    image: absoluteUrl(siteConfig.ogImage.url),
    inLanguage: siteConfig.language,
  };
}
