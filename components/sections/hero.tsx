import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";

import {
  ChalkAtom,
  ChalkBulb,
  ChalkFlask,
  ChalkPi,
  ChalkPlane,
  ChalkPlus,
  ChalkUnderline,
} from "@/components/chalk/chalk-marks";
import { CONTACT_ANCHOR, PRIMARY_PHONE, STAFF } from "@/lib/general/constants";

const delay = (seconds: number) => ({ "--rise-delay": `${seconds}s` }) as CSSProperties;

/** A wobbly chalk rule, the kind drawn freehand under a heading. */
const ChalkRule = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 240 6"
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
    filter="url(#chalk-rough-soft)"
    className={className}
  >
    <path
      d="M2 4c40-3 78-4 118-3 38 1 78 2 118 4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  </svg>
);

export const Hero = async () => {
  const t = await getTranslations("Hero");
  const tCommon = await getTranslations("Common");
  const tStaff = await getTranslations("Staff");

  return (
    <section className="board-texture board-dust relative isolate flex min-h-svh flex-col overflow-hidden bg-board">
      {/* Doodles fill the empty parts of the board the way a teacher does, so every
          placement is checked against the text columns rather than scattered. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {/* Phone: only the two gaps that stay empty once the content stacks. */}
        <ChalkAtom
          className="rise-in absolute top-[58%] right-[-4%] size-24 text-sky/30 md:hidden"
          style={delay(0.85)}
        />
        <ChalkFlask
          className="rise-in absolute bottom-[3%] left-[-3%] size-20 text-rose/22 md:hidden"
          style={delay(0.95)}
        />

        {/* Desktop: the top band, the corridor between the two columns, and the
            strip under the buttons. */}
        <ChalkPlane
          className="rise-in absolute top-[9%] left-[48%] hidden size-16 text-chalk/22 md:block lg:size-20"
          style={delay(0.75)}
        />
        <ChalkBulb
          className="rise-in absolute top-[13%] right-[5%] hidden size-24 text-yellow/65 md:block lg:size-28"
          style={delay(0.55)}
        />
        <ChalkAtom
          className="rise-in absolute right-[24%] bottom-[27%] hidden size-24 text-sky/32 md:block lg:size-28"
          style={delay(0.9)}
        />
        <ChalkFlask
          className="rise-in absolute bottom-[9%] left-[4%] hidden size-20 text-rose/25 md:block lg:size-24"
          style={delay(1)}
        />
        <ChalkPi
          className="rise-in absolute bottom-[12%] left-[38%] hidden size-14 text-violet/22 lg:block"
          style={delay(1.1)}
        />
        <ChalkPlus
          className="rise-in absolute top-[26%] right-[38%] hidden size-7 text-chalk/18 lg:block"
          style={delay(1.2)}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[84rem] flex-1 grid-cols-1 items-center gap-x-16 gap-y-14 px-5 pt-28 pb-24 sm:px-8 md:pt-32 lg:grid-cols-12 lg:pb-28">
        <div className="lg:col-span-7">
          <p
            className="rise-in flex items-center gap-3 font-display text-[0.72rem] font-bold tracking-[0.16em] text-yellow uppercase sm:text-xs sm:tracking-[0.28em]"
            style={delay(0)}
          >
            <span className="h-px w-7 bg-yellow/70" />
            {t("eyebrow")}
          </p>

          <h1
            className="rise-in mt-6 font-display text-[clamp(2.6rem,7.2vw,5.4rem)] leading-[0.98] font-black tracking-[-0.015em] text-chalk"
            style={delay(0.08)}
          >
            {t("titleBefore")}{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="inline-block rotate-[-1.6deg] font-chalk text-[1.06em] leading-none text-yellow">
                {t("titleEmphasis")}
              </span>
              <ChalkUnderline className="absolute -bottom-1 left-[-2%] h-[0.42em] w-[104%] text-yellow" />
            </span>{" "}
            {t("titleAfter")}
          </h1>

          <p
            className="rise-in mt-8 max-w-[54ch] text-[clamp(1.03rem,1.15vw,1.2rem)] leading-[1.75] text-chalk-dim"
            style={delay(0.18)}
          >
            {t("description")}
          </p>

          <div
            className="rise-in mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
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

            <a
              href={`#${CONTACT_ANCHOR}`}
              className="group flex cursor-pointer items-center justify-center gap-2.5 px-2 py-3 text-base font-medium text-chalk-dim transition-colors duration-200 hover:text-chalk sm:justify-start"
            >
              <MapPin className="size-4.5 shrink-0 text-chalk-faint transition-colors duration-200 group-hover:text-yellow" />
              <span className="relative">
                {t("secondaryCta")}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-chalk/50 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </a>
          </div>
        </div>

        {/* Written on the board rather than boxed in a card: the two people who
            actually answer the phone, exactly as the roll-up banner lists them. */}
        <div
          className="rise-in rotate-[-0.7deg] lg:col-span-5 lg:justify-self-end"
          style={delay(0.36)}
        >
          <p className="font-chalk text-xl text-yellow sm:text-2xl">{t("staffTitle")}</p>
          <ChalkRule className="mt-2 h-1.5 w-40 text-yellow/60" />

          <ul className="mt-7 space-y-7">
            {STAFF.map((person) => (
              <li key={person.key}>
                <p className="font-display text-2xl font-bold text-chalk sm:text-[1.75rem]">
                  {person.name}
                </p>
                <p className="mt-0.5 text-[0.7rem] tracking-[0.2em] text-chalk-faint uppercase">
                  {tStaff(person.roleKey)}
                </p>
                <a
                  href={person.phone.href}
                  className="mt-2 inline-block cursor-pointer font-display text-xl font-extrabold tabular-nums text-chalk transition-colors duration-200 hover:text-yellow sm:text-2xl"
                >
                  {person.phone.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The chalk ledge closes the board. The sticks are cut out of the client's
          own logo file, so the site rests the same two pieces of chalk on it. */}
      <div className="relative z-10 h-14 shrink-0 sm:h-16">
        <Image
          src="/images/logo/chalk-sticks.png"
          alt=""
          width={295}
          height={130}
          loading="eager"
          className="pointer-events-none absolute right-[6%] bottom-[2.6rem] w-24 drop-shadow-[0_8px_10px_rgba(0,0,0,0.55)] sm:bottom-[3rem] sm:w-32 lg:right-[9%] lg:w-36"
        />
        <div className="absolute inset-x-0 bottom-0 h-9 bg-linear-to-b from-board-soft to-board-deep sm:h-10" />
        <div className="absolute inset-x-0 bottom-9 h-1.5 bg-chalk/22 sm:bottom-10" />
      </div>
    </section>
  );
};
