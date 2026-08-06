import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import {
  ChalkAtom,
  ChalkBulb,
  ChalkFlask,
  ChalkPi,
  ChalkPlane,
} from "@/components/chalk/chalk-marks";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import {
  BoardSection,
  ChalkFrame,
  ChalkHeading,
  PAGE_ACCENTS,
} from "@/components/sections/board-blocks";
import { ROUTES } from "@/lib/general/constants";
import { cn } from "@/lib/general/utils";
import { Link } from "@/lib/i18n/navigation";

/**
 * The landing page is a door, not the whole building. The client wants real
 * pages rather than one long scroll, which leaves a visitor who only ever
 * scrolls with nothing to click, so each page gets a chalked note here that
 * says what is behind it and points at it.
 *
 * The title and the one-liner are read from each page's own namespace rather
 * than written again, so a teaser can never drift from the page it advertises.
 */
const ENTRIES = [
  {
    ns: "About",
    href: ROUTES.about,
    Doodle: ChalkBulb,
    tone: PAGE_ACCENTS.about.card,
    span: "lg:col-span-2",
  },
  {
    ns: "Services",
    href: ROUTES.services,
    Doodle: ChalkFlask,
    tone: PAGE_ACCENTS.services.card,
    span: "lg:col-span-2",
  },
  {
    ns: "Programme",
    href: ROUTES.programme,
    Doodle: ChalkPi,
    tone: PAGE_ACCENTS.programme.card,
    span: "lg:col-span-2",
  },
  {
    ns: "Activities",
    href: ROUTES.activities,
    Doodle: ChalkPlane,
    tone: PAGE_ACCENTS.activities.card,
    span: "lg:col-span-3",
  },
  {
    ns: "Contact",
    href: ROUTES.contact,
    Doodle: ChalkAtom,
    tone: PAGE_ACCENTS.contact.card,
    span: "lg:col-span-3",
  },
] as const;

export const BoardIndex = async () => {
  const t = await getTranslations("Home");
  const tCommon = await getTranslations("Common");

  const entries = await Promise.all(
    ENTRIES.map(async (entry) => {
      const tEntry = await getTranslations(entry.ns);

      return { ...entry, title: tEntry("title"), intro: tEntry("intro") };
    }),
  );

  return (
    <BoardSection tone="deep">
      <ChalkHeading title={t("exploreTitle")} intro={t("exploreIntro")} />

      {/* Six columns so the five notes break 3 + 2 instead of leaving a hole. */}
      <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {entries.map(({ ns, href, Doodle, tone, span, title, intro }) => (
          <StaggerItem key={ns} className={span}>
            <Link
              href={href}
              className="group relative flex h-full cursor-pointer flex-col p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <ChalkFrame className="text-chalk/25 transition-colors duration-300 group-hover:text-yellow/60" />

              <Doodle
                aria-hidden
                className={cn(
                  "pointer-events-none absolute top-5 right-5 size-14 transition-opacity duration-300 group-hover:opacity-100 lg:size-16",
                  tone,
                  "opacity-70",
                )}
              />

              {/* Padding rather than a ch cap, so the title only has to clear
                  the doodle instead of being forced to wrap at a fixed width. */}
              <h3 className="pr-16 font-display text-2xl font-bold text-chalk transition-colors duration-300 group-hover:text-yellow lg:pr-20">
                {title}
              </h3>

              <p className="mt-3 max-w-[42ch] text-[0.95rem] leading-[1.7] text-chalk-dim">
                {intro}
              </p>

              {/* `mt-auto` lines every call to action up along the bottom of the
                  row, however uneven the notes above them are. */}
              <span className="mt-auto flex items-center gap-2 pt-6 font-display text-sm font-bold tracking-wide text-chalk-faint transition-colors duration-300 group-hover:text-yellow">
                {tCommon("seeMore")}
                <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </BoardSection>
  );
};
