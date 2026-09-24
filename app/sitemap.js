import { publicPageIndex } from "../lib/public-pages.js";
import { absoluteUrl } from "../lib/seo.js";

export const dynamic = "force-static";

export default function sitemap() {
  return publicPageIndex.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: page.lastModified,
  }));
}
