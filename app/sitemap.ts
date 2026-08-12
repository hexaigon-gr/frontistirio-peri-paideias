import type { MetadataRoute } from "next";

import { ROUTES } from "@/lib/general/constants";
import { SITE_URL } from "@/lib/general/site-url";
import { routing } from "@/lib/i18n/routing";

/* The public pages only. `/admin` used to be listed here while robots.txt
   disallowed it, which is a direct contradiction: a sitemap is a request to
   index, and the admin panel must never be. Anything added here has to be a
   page a stranger is meant to land on. */
const PAGES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: ROUTES.about, priority: 0.8 },
  { path: ROUTES.services, priority: 0.8 },
  { path: ROUTES.programme, priority: 0.8 },
  { path: ROUTES.activities, priority: 0.7 },
  { path: ROUTES.contact, priority: 0.7 },
];

/* Every entry in a sitemap is an absolute URL, so without a canonical origin
   there is nothing correct to emit. Empty beats guessing the origin. */
const sitemap = (): MetadataRoute.Sitemap => {
  if (!SITE_URL) return [];

  return PAGES.flatMap(({ path, priority }) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      /* No `lastModified` on purpose. It used to be `new Date()`, which stamped
         all twelve URLs with the build time, so every deploy claimed the whole
         site had changed. A crawler that catches a `lastmod` lying once starts
         ignoring it for the domain permanently, and there is no honest value
         available here: the pages are static, and per-file git dates are not
         reliable on a shallow CI clone. An absent lastmod beats a false one. */
      changeFrequency: "monthly" as const,
      priority,
      /* Each page declares its own translations, which is what tells a crawler
         the two locales are the same page and not duplicate content. The
         `x-default` has to match the one in the page's own head tags, or the
         two sources disagree and the whole cluster gets dropped. */
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((code) => [code, `${SITE_URL}/${code}${path}`]),
          ),
          "x-default": `${SITE_URL}/${routing.defaultLocale}${path}`,
        },
      },
    })),
  );
};

export default sitemap;
