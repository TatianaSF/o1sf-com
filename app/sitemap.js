import { getCollection } from "../lib/content";
import { aiFeedPaths, siteConfig } from "../lib/seo";

export const dynamic = "force-static";

export default function sitemap() {
  const now = new Date();
  const staticRoutes = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/sections", changeFrequency: "monthly", priority: 0.8 },
    { path: aiFeedPaths.profile, changeFrequency: "weekly", priority: 0.8 },
    { path: aiFeedPaths.sections, changeFrequency: "weekly", priority: 0.8 },
    { path: aiFeedPaths.llms, changeFrequency: "weekly", priority: 0.8 },
  ];
  const sectionRoutes = getCollection("sections").map((section) => ({
    path: `/sections/${section.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...sectionRoutes].map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
