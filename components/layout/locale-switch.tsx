"use client";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/general/utils";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";

const LABELS: Record<string, string> = { el: "ΕΛ", en: "EN" };

/**
 * Two locales do not need a dropdown. A pair of chalk-written labels with the
 * active one circled reads faster and costs one tap instead of two.
 *
 * These are real links, not buttons calling `router.replace`. A button emits no
 * `href`, and this switch is the ONLY route between the two locales: with it as
 * a button the English half of the site had zero inbound internal links and was
 * reachable only through the sitemap, so it crawled slowly and accrued no
 * internal weight. The visual result is identical, the click still navigates
 * client-side, and a crawler now sees an anchor.
 *
 * Each label is a 44px box because at its natural size it measured 21x24, and
 * two of those four pixels apart is a mis-tap waiting to happen.
 */
export const LocaleSwitch = ({ className }: { className?: string }) => {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Common");

  return (
    <div
      className={cn("flex items-center text-sm", className)}
      role="group"
      aria-label={t("switchLanguage")}
    >
      {SUPPORTED_LOCALES.map((code, index) => (
        <span key={code} className="flex items-center">
          {/* Full token, not a faded one: at 50% the slash fell under 4.5:1. */}
          {index > 0 && (
            <span aria-hidden className="text-chalk-faint">
              /
            </span>
          )}
          <Link
            href={pathname}
            locale={code}
            lang={code}
            aria-current={code === locale ? "true" : undefined}
            className={cn(
              "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center font-display font-bold tracking-wide transition-colors duration-200",
              code === locale ? "text-yellow" : "text-chalk-faint hover:text-chalk",
            )}
          >
            {LABELS[code] ?? code.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
};
