import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { ChalkPlus } from "@/components/chalk/chalk-marks";
import { PRIMARY_PHONE } from "@/lib/general/constants";

interface PageIntroProps {
  title: string;
  intro: string;
  children?: ReactNode;
}

/**
 * The top of every inner page. The board continues from the home page, so the
 * heading is written straight onto it rather than dropped into a hero banner.
 */
export const PageIntro = async ({ title, intro, children }: PageIntroProps) => {
  const tCommon = await getTranslations("Common");

  return (
    <section className="board-texture board-dust relative isolate overflow-hidden bg-board">
      <ChalkPlus
        aria-hidden
        className="pointer-events-none absolute top-[22%] right-[8%] hidden size-10 text-chalk/15 md:block"
      />

      <div className="relative mx-auto w-full max-w-[84rem] px-5 pt-32 pb-20 sm:px-8 md:pt-40 md:pb-28">
        <h1 className="max-w-[18ch] font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[1] font-black tracking-[-0.015em] text-chalk">
          {title}
        </h1>

        <p className="mt-7 max-w-[58ch] text-[clamp(1.02rem,1.1vw,1.15rem)] leading-[1.75] text-chalk-dim">
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
