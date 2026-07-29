import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { PRIMARY_PHONE } from "@/lib/general/constants";

interface PageIntroProps {
  title: string;
  intro: string;
  /** A chalk mark placed in the empty right half of the heading band. */
  doodle?: ReactNode;
  children?: ReactNode;
}

/**
 * The top of every inner page. The board carries on from the home page, so the
 * heading is written straight onto it instead of sitting in a banner.
 */
export const PageIntro = async ({ title, intro, doodle, children }: PageIntroProps) => {
  const tCommon = await getTranslations("Common");

  return (
    <section className="board-texture board-dust relative isolate overflow-hidden bg-board">
      {doodle ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {doodle}
        </div>
      ) : null}

      <div className="relative mx-auto w-full max-w-[84rem] px-5 pt-32 pb-16 sm:px-8 md:pt-40 md:pb-24">
        <h1 className="max-w-[16ch] font-display text-[clamp(2.4rem,6.4vw,4.75rem)] leading-[0.98] font-black tracking-[-0.02em] text-chalk">
          {title}
        </h1>

        <p className="mt-7 max-w-[56ch] text-[clamp(1.02rem,1.1vw,1.18rem)] leading-[1.75] text-chalk-dim">
          {intro}
        </p>

        {children}

        <a
          href={PRIMARY_PHONE.href}
          className="group mt-10 inline-flex cursor-pointer items-center gap-3 rounded-full bg-yellow px-6 py-3.5 font-display text-base font-extrabold tracking-wide text-board-deep transition-transform duration-200 hover:-translate-y-0.5 sm:text-lg"
        >
          <Phone
            className="size-5 shrink-0 transition-transform duration-300 group-hover:-rotate-12"
            strokeWidth={2.5}
          />
          {tCommon("call")}
          <span className="opacity-45">·</span>
          <span className="tabular-nums">{PRIMARY_PHONE.display}</span>
        </a>
      </div>
    </section>
  );
};
