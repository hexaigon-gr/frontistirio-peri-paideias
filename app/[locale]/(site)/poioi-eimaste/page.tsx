import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ChalkBulb, ChalkPi } from "@/components/chalk/chalk-marks";
import { BoardSection, ChalkFrame, ChalkHeading } from "@/components/sections/board-blocks";
import { PageIntro } from "@/components/sections/page-intro";
import { BUSINESS, STAFF } from "@/lib/general/constants";
import { BasePageProps } from "@/types/page-props";

export const generateMetadata = async ({ params }: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return { title: t("title"), description: t("intro") };
};

const AboutPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");
  const tStaff = await getTranslations("Staff");

  return (
    <>
      <PageIntro
        title={t("title")}
        intro={t("intro")}
        doodle={
          <ChalkPi className="absolute top-[34%] right-[7%] hidden size-24 text-yellow/45 md:block lg:size-32" />
        }
      />

      <BoardSection tone="deep">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ChalkHeading title={t("storyTitle")} />
            {/* The slogan from the roll-up banners, written back onto the board
                so the empty half of the column carries the brand voice. */}
            <p className="mt-10 max-w-[16ch] font-chalk text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.35] text-yellow">
              {BUSINESS.slogan}
            </p>
          </div>

          <div className="space-y-6 text-[1.05rem] leading-[1.8] text-chalk-dim lg:col-span-7">
            <p className="text-chalk">{t("storyOne")}</p>
            <p>{t("storyTwo")}</p>
            <p>{t("storyThree")}</p>
          </div>
        </div>
      </BoardSection>

      <BoardSection>
        <ChalkBulb
          aria-hidden
          className="pointer-events-none absolute top-10 right-[6%] hidden size-20 text-yellow/40 lg:block"
        />

        <ChalkHeading title={t("teamTitle")} intro={t("teamIntro")} />

        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {STAFF.map((person) => (
            <li key={person.key} className="relative">
              <div className="flex items-start gap-4">
                {/* The initial, chalked inside a hand-drawn frame. No stock
                    portraits: the ones in the brief were AI generated. */}
                <span className="relative flex size-14 shrink-0 items-center justify-center">
                  <ChalkFrame className="text-chalk/45" />
                  <span className="font-display text-2xl font-black text-yellow">
                    {person.name.charAt(0)}
                  </span>
                </span>

                <div>
                  <p className="font-display text-xl font-bold text-chalk sm:text-2xl">
                    {person.name}
                  </p>
                  <p className="mt-1 text-[0.7rem] tracking-[0.2em] text-chalk-faint uppercase">
                    {tStaff(person.roleKey)}
                    {person.isFounder ? (
                      <span className="ml-2 text-yellow">· {tStaff("founder")}</span>
                    ) : null}
                  </p>
                </div>
              </div>

              <p className="mt-4 leading-[1.75] text-chalk-dim">{tStaff(`bio.${person.key}`)}</p>

              {person.phone ? (
                <a
                  href={person.phone.href}
                  className="mt-3 inline-block cursor-pointer font-display text-lg font-extrabold tabular-nums text-chalk transition-colors duration-200 hover:text-yellow"
                >
                  {person.phone.display}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </BoardSection>
    </>
  );
};

export default AboutPage;
