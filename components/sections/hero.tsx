import { ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";

import { ChalkUnderline } from "@/components/chalk/chalk-marks";
import { FOUNDERS, PRIMARY_PHONE, ROUTES } from "@/lib/general/constants";
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
  const tCommon = await getTranslations("Common");
  const tStaff = await getTranslations("Staff");

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
          <p
            className="rise-in flex items-center gap-3 font-display text-[0.72rem] font-bold tracking-[0.16em] text-yellow uppercase sm:text-xs sm:tracking-[0.28em]"
            style={delay(0)}
          >
            <span className="h-px w-7 bg-yellow/70" />
            {t("eyebrow")}
          </p>

          <h1
            className="rise-in mt-5 font-display text-[clamp(2.35rem,7vw,4.75rem)] leading-[1.05] font-black tracking-[-0.015em] text-chalk md:mt-6 md:leading-[0.98]"
            style={delay(0.08)}
          >
            <span className="md:block">{t("titleBefore")}</span>{" "}
            <span className="md:block">
              <span className="relative inline-block">
                <span className="relative z-10 font-chalk text-[1.06em] leading-none text-yellow">
                  {t("titleEmphasis")}
                </span>
                <ChalkUnderline className="absolute -bottom-1 left-[-2%] h-[0.42em] w-[104%] text-yellow" />
              </span>{" "}
              {t("titleAfter")}
            </span>
          </h1>

          <p
            className="rise-in mt-5 max-w-[46ch] leading-[1.75] text-chalk-dim md:mt-7 md:text-lg"
            style={delay(0.18)}
          >
            {t("description")}
          </p>

          <div
            className="rise-in mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:mt-9 md:gap-4"
            style={delay(0.26)}
          >
            <a
              href={PRIMARY_PHONE.href}
              className="group flex cursor-pointer items-center justify-center gap-2.5 rounded-full bg-yellow px-6 py-4 font-display text-base font-extrabold tracking-wide text-board-deep transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 sm:gap-3 sm:px-7 sm:text-lg"
            >
              <Phone
                className="size-5 shrink-0 transition-transform duration-300 group-hover:-rotate-12"
                strokeWidth={2.5}
              />
              <span>{tCommon("call")}</span>
              <span className="opacity-45">·</span>
              <span className="tabular-nums">{PRIMARY_PHONE.display}</span>
            </a>

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

          {/* The people who answer, kept off the phone layout where every extra
              line pushes the call button under the fold. */}
          <ul className="rise-in mt-10 hidden flex-wrap gap-x-10 gap-y-4 lg:flex" style={delay(0.36)}>
            {FOUNDERS.map((person) => (
              <li key={person.key} className="flex items-baseline gap-3">
                <span className="font-display text-base font-bold text-chalk">{person.name}</span>
                <span className="text-[0.65rem] tracking-[0.18em] text-chalk-faint uppercase">
                  {tStaff(person.roleKey)}
                </span>
                <a
                  href={person.phone.href}
                  className="cursor-pointer font-display font-extrabold tabular-nums text-chalk-dim transition-colors duration-200 hover:text-yellow"
                >
                  {person.phone.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
