import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/lib/general/constants";
import { jsonLdScriptProps } from "@/lib/general/json-ld";
import { SITE_URL } from "@/lib/general/site-url";

/**
 * The trail from the locale home page to this one.
 *
 * `BreadcrumbList` is one of the few rich result types Google still supports
 * and still renders, and it costs almost nothing here: the site is a flat
 * two-level tree, and the labels already exist in the `Nav` namespace of both
 * message catalogues.
 *
 * It is emitted per page rather than from the layout because a layout has no
 * access to the current path, and inferring one would mean a client component
 * where a prop does.
 */
type RouteKey = Exclude<keyof typeof ROUTES, "home">;

export const BreadcrumbJsonLd = async ({ locale, routeKey }: { locale: string; routeKey: RouteKey }) => {
  if (!SITE_URL) return null;

  const t = await getTranslations({ locale, namespace: "Nav" });

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/${locale}${ROUTES[routeKey]}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("home"),
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t(routeKey),
        /* No `item` on the last entry. Google's guidance is that the page a
           breadcrumb is on does not link to itself. */
      },
    ],
  };

  return <script {...jsonLdScriptProps(data)} />;
};
