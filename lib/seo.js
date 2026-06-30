export const siteConfig = {
  name: "O1SF",
  url: "https://o1sf.com",
  description: "O1SF landing page for professional visibility, context, and high-trust rooms in San Francisco.",
};

export const GITHUB_REPO_URL = "https://github.com/TatianaSF/o1sf-com";

export function buildPageMetadata({ title, description, path = "" }) {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
