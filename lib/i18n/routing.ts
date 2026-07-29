import { defineRouting } from "next-intl/routing";

export const SUPPORTED_LOCALES = ["el", "en"] as const;

/**
 * Pinned, not inferred. Left unset, next-intl uses whatever zone the process
 * happens to run in, so the server renders one time and the browser hydrates
 * another. It has to be given to BOTH `getRequestConfig` and
 * `NextIntlClientProvider`, because setting it on the server alone still leaves
 * every client component falling back. The school is in Crete.
 */
export const TIME_ZONE = "Europe/Athens";

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: SUPPORTED_LOCALES[0],
  localeDetection: true,
});