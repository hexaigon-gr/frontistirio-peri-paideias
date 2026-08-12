import "./globals.css";

import type { Metadata } from "next";
import { Alegreya_Sans, Mansalva, Sofia_Sans_Condensed } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { Providers } from "@/components/providers";
import { BUSINESS } from "@/lib/general/constants";
import { ASSET_ORIGIN, SITE_URL } from "@/lib/general/site-url";
import { routing } from "@/lib/i18n/routing";
import { BaseLayoutProps } from "@/types/page-props";

/* Every face here was picked for its Greek, not its Latin. Sofia Sans Condensed
   carries the headlines the way the condensed yellow band of the logo does,
   Alegreya Sans is a humanist text face that stays readable as light-on-dark,
   and Mansalva is the hand that writes on the board. */
/**
 * `fallback` matters more than usual on this one, and it is a layout fix rather
 * than a taste one.
 *
 * The hero H1 measured 0.163 CLS on a throttled phone, which fails the 0.1
 * threshold. The shift was exactly 39px, which is exactly one line of that
 * heading at 390px. Nothing was resizing: a generic sans fallback is far wider
 * than a condensed face, so the title wrapped onto an extra line before the
 * webfont arrived and reflowed back after it. Naming condensed system faces
 * first keeps the line count stable across the swap.
 */
const sofiaCondensed = Sofia_Sans_Condensed({
  variable: "--font-sofia-condensed",
  subsets: ["latin", "greek"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
  fallback: ["Arial Narrow", "Helvetica Neue Condensed", "Liberation Sans Narrow", "sans-serif"],
});

/**
 * The body face, and the only one that carries real reading. It keeps its
 * preload.
 *
 * The 500 and 700 weights cost roughly 45 KB between them to set about eighty
 * characters per page. They are genuinely used, so removing them is a design
 * decision for the client rather than a bug to fix, and next/font cannot
 * preload weights selectively within one family.
 */
const alegreyaSans = Alegreya_Sans({
  variable: "--font-alegreya-sans",
  subsets: ["latin", "greek"],
  weight: ["400", "500", "700"],
  display: "swap",
});

/**
 * The chalk hand, and the single largest file on the site at 64 KB across both
 * subsets. It sets between 25 and 129 characters per page, none of them above
 * the fold on any page but the home hero, and **zero** Latin letters anywhere.
 *
 * `preload: false` keeps it working everywhere and takes it out of the
 * first-paint queue, where it was competing with the LCP image at top priority.
 * The subset stays because the handful of numerals it does set are Latin
 * glyphs, so dropping it would break them.
 */
const mansalva = Mansalva({
  variable: "--font-mansalva",
  subsets: ["latin", "greek"],
  weight: ["400"],
  display: "swap",
  preload: false,
});

/**
 * Only what genuinely belongs to every page.
 *
 * Canonical, hreflang, description and the share tags are deliberately NOT
 * here. Next merges metadata shallowly, so anything declared at this level is
 * handed unchanged to a page that does not restate it, and every sub-page then
 * claims to be the locale homepage. Each page builds its own through
 * `buildPageMetadata` in `lib/general/seo.ts`.
 */
export const metadata: Metadata = {
  /* `metadataBase` resolves the og:image path and nothing else, so it uses
     ASSET_ORIGIN, which falls back to the deployment host. Without it Next
     resolves the share image against localhost and every scraper fails to
     fetch it. The canonical identity is a different question and stays on
     SITE_URL, inside the per-page helper. */
  ...(ASSET_ORIGIN ? { metadataBase: new URL(ASSET_ORIGIN) } : {}),
  /* No canonical origin yet, so the whole deployment is held out of every
     index until the real domain is set. The pages then emit no canonical and
     no hreflang either. See `.claude/rules/deployment-urls.md`. */
  ...(SITE_URL ? {} : { robots: { index: false, follow: false } }),
  title: {
    default: BUSINESS.legalName,
    template: `%s | ${BUSINESS.name}`,
  },
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
