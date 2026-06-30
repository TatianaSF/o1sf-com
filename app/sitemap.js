import { getCollection } from "../lib/content";
import { siteConfig } from "../lib/seo";

export const dynamic = "force-static";

export default function sitemap() {
  const staticRoutes = ["", "/sections"];
  const sectionRoutes = getCollection("sections").map((section) => `/sections/${section.slug}`);

  return [...staticRoutes, ...sectionRoutes].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : 0.7,
  }));
}
