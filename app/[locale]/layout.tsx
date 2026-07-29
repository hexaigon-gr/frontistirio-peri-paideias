import "./globals.css";

import type { Metadata } from "next";
import { Alegreya_Sans, Mansalva, Sofia_Sans_Condensed } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { Providers } from "@/components/providers";
import { BUSINESS } from "@/lib/general/constants";
import { SITE_URL } from "@/lib/general/site-url";
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
    ...(SITE_URL
      ? {
          metadataBase: new URL(SITE_URL),
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
      ...(SITE_URL ? { url: `${SITE_URL}/${locale}` } : {}),
    },
    /* The image itself comes from `app/[locale]/opengraph-image.jpg`, which Next
       resolves into both og:image and twitter:image on its own. */
    twitter: { card: "summary_large_image", title, description },
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
