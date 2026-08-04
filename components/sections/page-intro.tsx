import type { ReactNode } from "react";

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
 *
 * No call button here. The navbar carries one on every screen, and repeating the
 * same yellow pill under every page heading made the site nag. Pages that want
 * one pass `<CallButton />` through `children`, which today is only Contact.
 */
export const PageIntro = ({ title, intro, doodle, children }: PageIntroProps) => {
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
      </div>
    </section>
  );
};
