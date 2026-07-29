import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/general/site-url";
import { routing } from "@/lib/i18n/routing";

/* Every entry in a sitemap is an absolute URL, so without a canonical origin
   there is nothing correct to emit. Empty beats guessing the origin. */
const sitemap = (): MetadataRoute.Sitemap => {
  if (!SITE_URL) return [];

  const routes = ["", "/admin"];

  return routes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
  );
};

export default sitemap;
