import "./globals.css";

import type { Metadata } from "next";
import { Alegreya_Sans, Mansalva, Sofia_Sans_Condensed } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { Providers } from "@/components/providers";
import { BUSINESS } from "@/lib/general/constants";
import { ASSET_ORIGIN, SITE_URL } from "@/lib/general/site-url";
import { routing } from "@/lib/i18n/routing";
import { BaseLayoutProps } from "@/types/page-props";

/* Every face here was picked for its Greek, not its Latin. Sofia Sans Condensed
   carries the headlines the way the condensed yellow band of the logo does,
   Alegreya Sans is a humanist text face that stays readable as light-on-dark,
   and Mansalva is the hand that writes on the board. */
const sofiaCondensed = Sofia_Sans_Condensed({
  variable: "--font-sofia-condensed",
  subsets: ["latin", "greek"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const alegreyaSans = Alegreya_Sans({
  variable: "--font-alegreya-sans",
  subsets: ["latin", "greek"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const mansalva = Mansalva({
  variable: "--font-mansalva",
  subsets: ["latin", "greek"],
  weight: ["400"],
  display: "swap",
});

/** BCP 47 tags for hreflang and og:locale, keyed by the routing locale. */
const OG_LOCALE = { el: "el_GR", en: "en_US" } as const;

/**
 * The share card, declared explicitly rather than through Next's
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
 * A plain file in `public/` sidesteps all of it: no generated route, nothing in
 * the prerender manifest, and the path resolves to an absolute URL through
 * `metadataBase`.
 */
const OG_IMAGE = (alt: string) => ({
  url: "/og-image.jpg",
  width: 1920,
  height: 1080,
  alt,
});

export const generateMetadata = async ({ params }: BaseLayoutProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const title = t("homeTitle");
  const description = t("homeDescription");

  return {
    /* No canonical origin yet, so the deployment is held back from every index
       until the real domain is set. `alternates` is omitted for the same
       reason: hreflang has to be absolute, and a guessed origin in it is worse
       than no hreflang. See `.claude/rules/deployment-urls.md`. */
    /* `metadataBase` resolves the og:image path and nothing else, so it uses
       ASSET_ORIGIN, which falls back to the deployment host. Without it Next
       resolves the share image against localhost and every scraper fails to
       fetch it. The canonical identity below is a different question and stays
       on SITE_URL. */
    ...(ASSET_ORIGIN ? { metadataBase: new URL(ASSET_ORIGIN) } : {}),
    ...(SITE_URL
      ? {
          alternates: {
            canonical: `${SITE_URL}/${locale}`,
            languages: Object.fromEntries(
              routing.locales.map((code) => [code, `${SITE_URL}/${code}`]),
            ),
          },
        }
      : { robots: { index: false, follow: false } }),
    title: {
      default: BUSINESS.legalName,
      template: `%s | ${BUSINESS.name}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: BUSINESS.name,
      locale: OG_LOCALE[locale as keyof typeof OG_LOCALE],
      alternateLocale: routing.locales
        .filter((code) => code !== locale)
        .map((code) => OG_LOCALE[code as keyof typeof OG_LOCALE]),
      title,
      description,
      images: [OG_IMAGE(t("ogImageAlt"))],
      ...(SITE_URL ? { url: `${SITE_URL}/${locale}` } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE(t("ogImageAlt"))],
    },
  };
};

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

/**
 * The ONLY namespaces sent to the browser.
 *
 * `NextIntlClientProvider` serialises whatever it is given into every page, and
 * handing it the whole catalogue shipped roughly 14 KB of Greek page copy that
 * only ever renders on the server. These four are the namespaces actually read
 * by a `"use client"` component: `Common` (locale switch), `Nav` and `Staff`
 * (navbar), `Gallery` (lightbox).
 *
 * ADDING `useTranslations` TO A CLIENT COMPONENT MEANS ADDING ITS NAMESPACE
 * HERE, otherwise it throws MISSING_MESSAGE at runtime. Server components are
 * unaffected: `getTranslations` reads the full catalogue directly.
 */
const CLIENT_NAMESPACES = ["Common", "Nav", "Staff", "Gallery"] as const;

const LocaleLayout = async ({ children, params }: BaseLayoutProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]),
  );

  return (
    /* `data-scroll-behavior` tells the router that the smooth scrolling in
       globals.css is deliberate, so it suppresses it during route changes
       instead of animating the whole page on every navigation. */
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${alegreyaSans.variable} ${sofiaCondensed.variable} ${mansalva.variable} font-sans antialiased`}
      >
        <Providers messages={clientMessages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default LocaleLayout;
