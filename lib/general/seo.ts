import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { BUSINESS } from "@/lib/general/constants";
import { SITE_URL } from "@/lib/general/site-url";
import { routing } from "@/lib/i18n/routing";

/**
 * Per-page canonical, hreflang and share tags.
 *
 * This exists because Next merges metadata SHALLOWLY. A layout that declares
 * `alternates` hands the identical object to every page beneath it, and a page
 * that returns only `{ title, description }` inherits it verbatim. That is
 * exactly what shipped: all ten sub-pages declared the locale homepage as their
 * canonical, so each of them told Google "I am a duplicate of the homepage"
 * while `sitemap.xml` submitted all twelve. The sitemap and the pages
 * contradicted each other and the canonical wins.
 *
 * The same shallow merge is why this returns a COMPLETE `openGraph` and
 * `twitter` rather than just a `url`: a page that sets `openGraph.url` alone
 * would replace the layout's object outright and silently drop the image, the
 * site name and the locale.
 *
 * So every page owns its whole identity and the layout owns none of it. The
 * layout keeps only `metadataBase`, the title template, and the noindex
 * fallback for when there is no canonical origin.
 */

/** BCP 47 tags for og:locale, keyed by the routing locale. */
const OG_LOCALE = { el: "el_GR", en: "en_US" } as const;

/**
 * The share card, a plain file in `public/` rather than Next's
 * `opengraph-image` file convention.
 *
 * That convention generates a route, and inside the dynamic `[locale]` segment
 * it cannot enumerate the locales, because a metadata image route does not
 * inherit `generateStaticParams` from the layout above it. It builds as
 * `/-/opengraph-image.jpg` with an unfilled param and registers the prerender
 * under the literal `/[locale]/opengraph-image.jpg`. A local build tolerates
 * that; the Vercel adapter fails with "Invariant: failed to find source route".
 * Moving the file to the app root builds, but silently emits no tag at all,
 * because there is no root `layout.tsx` for the metadata to attach to.
 *
 * A plain file sidesteps all of it: no generated route, nothing in the
 * prerender manifest, and the path resolves through `metadataBase`.
 */
const OG_IMAGE = (alt: string) => ({
  url: "/og-image.jpg",
  width: 1920,
  height: 1080,
  alt,
});

interface PageMetadataInput {
  locale: string;
  /** Route path from `ROUTES`. `"/"` and `""` both mean the locale root. */
  path?: string;
  title: string;
  description: string;
  /**
   * The home page carries the full brand string in its own title, so it opts
   * out of the `%s | Περί Παιδείας` template that every other page wants.
   */
  absoluteTitle?: boolean;
}

/**
 * `ROUTES.home` is `"/"`, but the canonical origin already ends without a
 * slash and `${SITE_URL}/${locale}/` would 308 to the unslashed form. A
 * canonical that points at a redirect is a canonical Google has to resolve
 * before it can trust it.
 */
const normalisePath = (path: string) => (path === "/" ? "" : path);

export const buildPageMetadata = async ({
  locale,
  path = "",
  title,
  description,
  absoluteTitle = false,
}: PageMetadataInput): Promise<Metadata> => {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const suffix = normalisePath(path);
  const ogImage = OG_IMAGE(t("ogImageAlt"));

  /* og:title has no template applied to it, so the brand has to be written in
     or every shared sub-page reads as a bare "Ποιοι είμαστε". */
  const socialTitle = absoluteTitle ? title : `${title} | ${BUSINESS.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    /* No canonical origin yet means no canonical and no hreflang: both have to
       be absolute, and a guessed origin is worse than their absence. The
       locale layout marks the whole deployment noindex in that state.
       See `.claude/rules/deployment-urls.md`. */
    ...(SITE_URL
      ? {
          alternates: {
            canonical: `${SITE_URL}/${locale}${suffix}`,
            languages: {
              ...Object.fromEntries(
                routing.locales.map((code) => [code, `${SITE_URL}/${code}${suffix}`]),
              ),
              /* Greek is the real audience, so an unmatched language lands
                 there rather than on the English translation. */
              "x-default": `${SITE_URL}/${routing.defaultLocale}${suffix}`,
            },
          },
        }
      : {}),
    openGraph: {
      type: "website",
      siteName: BUSINESS.name,
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: routing.locales
        .filter((code) => code !== locale)
        .map((code) => OG_LOCALE[code as keyof typeof OG_LOCALE]),
      title: socialTitle,
      description,
      images: [ogImage],
      ...(SITE_URL ? { url: `${SITE_URL}/${locale}${suffix}` } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
  };
};
