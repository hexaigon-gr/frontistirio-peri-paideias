"use client";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { TIME_ZONE } from "@/lib/i18n/routing";

/**
 * The providers EVERY route needs, and nothing else.
 *
 * The auth session, the dialog store, the toaster and the tooltip provider used
 * to live here too, which meant every visitor to a marketing page downloaded
 * next-auth and the whole admin interaction stack to render a page that never
 * calls any of it. They moved to `AdminProviders`. Keep it that way: anything
 * added here is paid for on first load by people who came to read about a
 * tutoring school.
 */
type Props = {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
};

export const Providers = ({ children, messages, locale }: Props) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      disableTransitionOnChange
    >
      <NextIntlClientProvider messages={messages} locale={locale} timeZone={TIME_ZONE}>
        {children}
      </NextIntlClientProvider>
    </NextThemesProvider>
  );
};
