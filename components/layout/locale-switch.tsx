"use client";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/general/utils";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { SUPPORTED_LOCALES } from "@/lib/i18n/routing";

const LABELS: Record<string, string> = { el: "ΕΛ", en: "EN" };

/**
 * Two locales do not need a dropdown. A pair of chalk-written labels with the
 * active one circled reads faster and costs one tap instead of two.
 */
export const LocaleSwitch = ({ className }: { className?: string }) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Common");

  return (
    <div
      className={cn("flex items-center gap-1 text-sm", className)}
      role="group"
      aria-label={t("switchLanguage")}
    >
      {SUPPORTED_LOCALES.map((code, index) => (
        <span key={code} className="flex items-center gap-1">
          {index > 0 && <span className="text-chalk-faint/50">/</span>}
          <button
            type="button"
            lang={code}
            aria-current={code === locale ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale: code })}
            className={cn(
              "cursor-pointer px-1 py-0.5 font-display font-bold tracking-wide transition-colors duration-200",
              code === locale ? "text-yellow" : "text-chalk-faint hover:text-chalk",
            )}
          >
            {LABELS[code] ?? code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
};
