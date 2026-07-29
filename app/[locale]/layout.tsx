import "./globals.css";

import type { Metadata } from "next";
import { Alegreya_Sans, Mansalva, Sofia_Sans_Condensed } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getMessages,setRequestLocale } from "next-intl/server";

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

export const metadata: Metadata = {
  /* No canonical origin yet, so the deployment is held back from every index
     until the real domain is set. See `.claude/rules/deployment-urls.md`. */
  ...(SITE_URL
    ? { metadataBase: new URL(SITE_URL) }
    : { robots: { index: false, follow: false } }),
  title: {
    default: BUSINESS.legalName,
    template: `%s | ${BUSINESS.name}`,
  },
  description: "",
};

export const generateStaticParams = () => {
  return routing.locales.map((locale) => ({ locale }));
};

const LocaleLayout = async ({ children, params }: BaseLayoutProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    /* `data-scroll-behavior` tells the router that the smooth scrolling in
       globals.css is deliberate, so it suppresses it during route changes
       instead of animating the whole page on every navigation. */
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${alegreyaSans.variable} ${sofiaCondensed.variable} ${mansalva.variable} font-sans antialiased`}
      >
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default LocaleLayout;
