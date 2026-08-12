import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/general/site-url";

/* With no canonical origin, the only safe robots.txt is a full disallow: the
   deployment is reachable at some *.vercel.app host, and anything crawled there
   competes with the real domain later. See `.claude/rules/deployment-urls.md`. */
const robots = (): MetadataRoute.Robots => {
  if (!SITE_URL) return { rules: { userAgent: "*", disallow: "/" } };

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // A wildcard locale segment, NOT a plain "/admin/" rule. robots.txt paths
      // are literal prefix matches and the panel lives at "/el/admin" and
      // "/en/admin", so the plain rule matched no real URL and left the whole
      // panel crawlable. The wildcard form is honoured by Google, Bing and the
      // major AI crawlers, and the explicit per-locale paths cover anything
      // that is not. Blocking a crawl does not prevent indexing of a URL
      // discovered elsewhere, so the admin layout also sets robots: noindex.
      disallow: ["/api/", "/*/admin", "/el/admin", "/en/admin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};

export default robots;
