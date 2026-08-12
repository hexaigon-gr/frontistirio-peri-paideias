import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";

import { CallButton } from "@/components/call-button";
import { ChalkUnderline } from "@/components/chalk/chalk-marks";
import { FOUNDERS, ROUTES } from "@/lib/general/constants";
import { Link } from "@/lib/i18n/navigation";
/* Static import so the file carries a content hash and next/image cannot serve a
   stale optimisation after the photo is regenerated. */
import heroImage from "@/public/images/hero/board-hands.webp";

const delay = (seconds: number) => ({ "--rise-delay": `${seconds}s` }) as CSSProperties;

/**
 * The photograph is the board here, so the section drops the drawn chalk marks
 * and the slate tile it used to carry: two boards stacked on each other read as
 * a mess.
 *
 * Legibility is handled by two scrims rather than one, because the crop differs
 * per orientation. On a wide screen the photo keeps its dark left third and the
 * scrim only has to deepen it, so it runs left to right. On a phone the frame
 * crops to the chalk drawings and there is no dark side left, so the scrim runs
 * bottom to top and the text sits in the half it darkens.
 */
export const Hero = async () => {
  const t = await getTranslations("Hero");
  const tStaff = await getTranslations("Staff");
  const tCommon = await getTranslations("Common");

  return (
    <section className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-board md:justify-center">
      <Image
        src={heroImage}
        alt={t("imageAlt")}
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-[62%_center] md:object-center"
      />

      {/* Phone: darken the lower half the text sits in. */}
      <div className="absolute inset-0 bg-linear-to-t from-board via-board/85 via-40% to-board/20 md:hidden" />
      {/* Wide: deepen the empty left side and let the drawings breathe on the right. */}
      <div className="absolute inset-0 hidden bg-linear-to-r from-board from-15% via-board/80 via-45% to-transparent md:block" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-board to-transparent" />
      {/* The navbar is transparent over the hero, so the links need something
          behind them where the photo is brightest. */}
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-board/85 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[84rem] px-5 pt-28 pb-14 sm:px-8 md:py-24">
        <div className="max-w-[34rem] lg:max-w-[38rem]">
          {/* The H1 is the name and the place, not the slogan.

              Nothing here moved or changed colour: the two lines are exactly the
              ones that were already at the top of the hero, and the slogan below
              keeps its size, weight and chalk underline. Only the tag changed.
              The slogan, "Γιατί η επιτυχία δεν είναι τύχη", is a good line and a
              bad H1: it names no school, no service and no village, and the H1 is
              the single string a search engine and an assistant weigh hardest.
              The information was already on the page, sitting in an eyebrow that
              carries no semantic weight at all. */}
          <h1>
            {/* The name is read first, written in the chalk hand rather than the
                display face: on a photographed board a typeset brand line reads
                as a sticker laid over the picture. */}
            <span
              className="rise-in block font-chalk text-[clamp(1.9rem,4.4vw,2.9rem)] leading-none text-yellow"
              style={delay(0)}
            >
              {t("brand")}
            </span>

            {/* Chalk white, not yellow: the brand line above it is already yellow,
                and two golden lines in a row spend the emphasis colour on nothing. */}
            <span
              className="rise-in mt-3.5 flex items-start gap-3 font-display text-[0.72rem] font-bold tracking-[0.16em] text-chalk-dim uppercase sm:text-xs sm:tracking-[0.28em]"
              style={delay(0.06)}
            >
              {/* Aligned to the first line, not to the block: on a phone the line
                  wraps and a vertically centred rule floats between the two. */}
              <span className="mt-[0.55em] h-px w-7 shrink-0 bg-chalk/40" />
              {t("eyebrow")}
            </span>
          </h1>

          <p
            className="rise-in mt-5 font-display text-[clamp(2.35rem,7vw,4.75rem)] leading-[1.05] font-black tracking-[-0.015em] text-chalk md:mt-6 md:leading-[0.98]"
            style={delay(0.14)}
          >
            <span className="md:block">{t("titleBefore")}</span>{" "}
            <span className="md:block">
              {t("titleMiddle")}{" "}
              <span className="relative inline-block">
                <span className="relative z-10 font-chalk text-[1.06em] leading-none text-yellow">
                  {t("titleEmphasis")}
                </span>
                {/* Offset in em, not rem: the heading scales from 2.35rem to
                    4.75rem, and a fixed offset that clears the descenders at one
                    end sits through the letters at the other. */}
                <ChalkUnderline className="absolute -bottom-[0.17em] left-[-2%] h-[0.42em] w-[104%] text-yellow" />
              </span>
              {/* No space before it: the closing mark hangs on the emphasised word. */}
              {t("titleAfter")}
            </span>
          </p>

          <p
            className="rise-in mt-5 max-w-[46ch] leading-[1.75] text-chalk-dim md:mt-7 md:text-lg"
            style={delay(0.24)}
          >
            {t("description")}
          </p>

          <div
            className="rise-in mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:mt-9 md:gap-4"
            style={delay(0.32)}
          >
            <CallButton />

            <Link
              href={ROUTES.about}
              className="group flex cursor-pointer items-center justify-center gap-2.5 px-2 py-3 text-base font-medium text-chalk-dim transition-colors duration-200 hover:text-chalk sm:justify-start"
            >
              <span className="relative">
                {t("secondaryCta")}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-chalk/50 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
              <ArrowRight className="size-4.5 shrink-0 text-chalk-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-yellow" />
            </Link>
          </div>

          {/* The people who answer. Width alone is not enough of a test: a
              1366x768 laptop is wide enough for the row and too short for it, and
              the block pushed the call button off the bottom of the screen. So it
              is hidden by default and appears only when the viewport has both. */}
          <div
            className="rise-in mt-10 hidden lg:[@media(min-height:820px)]:block"
            style={delay(0.42)}
          >
            <p className="flex items-center gap-3 text-[0.65rem] tracking-[0.22em] text-chalk-faint uppercase">
              <span className="h-px w-5 bg-chalk/25" />
              {tCommon("studiesDirection")}
            </p>

            {/* Names and roles only. The mobile numbers are personal, so they are
                published once, on the contact page, and nowhere else. */}
            <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-4">
              {FOUNDERS.map((person) => (
                <li key={person.key} className="flex items-baseline gap-3">
                  <span className="font-display text-base font-bold text-chalk">{person.name}</span>
                  <span className="text-[0.65rem] tracking-[0.18em] text-chalk-faint uppercase">
                    {person.roles.map((role) => tStaff(role)).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
