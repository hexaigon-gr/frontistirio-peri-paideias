import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { PRIMARY_PHONE } from "@/lib/general/constants";
import { cn } from "@/lib/general/utils";

/**
 * The one call-to-action on the site, in one place.
 *
 * It deliberately does NOT appear on every page. The navbar already carries a
 * call button on every screen, and repeating the same yellow pill under every
 * heading made the site nag. It is used by the home hero and the contact page.
 */
export const CallButton = async ({ className }: { className?: string }) => {
  const t = await getTranslations("Common");

  return (
    <Button asChild variant="chalk" size="pill" className={cn("group", className)}>
      <a href={PRIMARY_PHONE.href}>
        <Phone
          className="size-5 shrink-0 transition-transform duration-300 group-hover:-rotate-12"
          strokeWidth={2.5}
        />
        {t("call")}
        <span className="opacity-45">·</span>
        <span className="tabular-nums">{PRIMARY_PHONE.display}</span>
      </a>
    </Button>
  );
};
