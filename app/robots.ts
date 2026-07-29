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
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};

export default robots;
