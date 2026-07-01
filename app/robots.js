import { aiCrawlerUserAgents, siteConfig } from "../lib/seo";

export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [
      ...aiCrawlerUserAgents.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
