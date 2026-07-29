import { ArrowUpRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ChalkSetSquare } from "@/components/chalk/chalk-marks";
import { BoardSection, ChalkFrame, ChalkHeading, ChalkRule } from "@/components/sections/board-blocks";
import { PageIntro } from "@/components/sections/page-intro";
import { BUSINESS, EXTERNAL_TOOLS, LEVELS, WEEKLY_PROGRAMME } from "@/lib/general/constants";
import { BasePageProps } from "@/types/page-props";

export const generateMetadata = async ({ params }: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Programme" });

  return { title: t("title"), description: t("intro") };
};

const ProgrammePage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Programme");
  const tCommon = await getTranslations("Common");
  const { opens, closes } = BUSINESS.hours;

  return (
    <>
      <PageIntro
        title={t("title")}
        intro={t("intro")}
        doodle={
          <ChalkSetSquare className="absolute top-[32%] right-[8%] hidden size-24 text-yellow/45 md:block lg:size-32" />
        }
      />

      {/* Three bands rather than three identical cards: the levels are a
          sequence a child moves through, so they read top to bottom. */}
      <BoardSection tone="deep">
        <ul>
          {LEVELS.map((level, index) => (
            <li
              key={level}
              className="grid gap-x-10 gap-y-3 border-t border-chalk/12 py-9 first:border-t-0 first:pt-0 md:grid-cols-12 md:py-11"
            >
              <div className="flex items-baseline gap-4 md:col-span-5">
                <span className="font-chalk text-2xl leading-none text-yellow/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-[clamp(1.7rem,3.2vw,2.6rem)] leading-none font-black text-chalk">
                  {t(`levels.${level}.title`)}
                </h2>
              </div>
              <p className="max-w-[52ch] leading-[1.8] text-chalk-dim md:col-span-7">
                {t(`levels.${level}.text`)}
              </p>
            </li>
          ))}
        </ul>
      </BoardSection>

      <BoardSection>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ChalkHeading title={t("hoursTitle")} />
            <p className="mt-6 max-w-[48ch] leading-[1.8] text-chalk-dim">
              {t("hoursText", { opens, closes })}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <Clock className="size-5 text-yellow" strokeWidth={2.5} />
              <h3 className="font-display text-xl font-bold text-chalk">{t("weeklyTitle")}</h3>
            </div>
            <ChalkRule className="mt-3 h-1.5 w-24 text-chalk/40" />

            <div className="mt-8 space-y-8">
              {WEEKLY_PROGRAMME.map((group) => (
                <div key={group.key}>
                  <p className="font-display text-lg font-bold tracking-wide text-yellow">
                    {t(`classes.${group.key}`)}
                  </p>
                  <ul className="mt-3 divide-y divide-chalk/10">
                    {group.subjects.map((subject) => (
                      <li
                        key={subject.key}
                        className="flex items-baseline justify-between gap-6 py-2.5"
                      >
                        <span className="text-chalk">{t(`subjects.${subject.key}`)}</span>
                        <span className="shrink-0 font-display font-bold tabular-nums text-chalk-dim">
                          {t("hoursPerWeek", { hours: subject.hours })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-[52ch] text-[0.95rem] leading-[1.7] text-chalk-faint">
              {t("weeklyPending")}
            </p>
          </div>
        </div>
      </BoardSection>

      <BoardSection tone="deep" id="ergaleia">
        <ChalkHeading title={t("toolsTitle")} intro={t("toolsIntro")} />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {EXTERNAL_TOOLS.map((tool) => (
            <a
              key={tool.key}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                tool.featured
                  ? "group relative block cursor-pointer p-7 md:col-span-2 md:p-9"
                  : "group relative block cursor-pointer p-6"
              }
            >
              <ChalkFrame className={tool.featured ? "text-yellow/55" : "text-chalk/22"} />

              <h3
                className={
                  tool.featured
                    ? "flex items-center gap-2.5 font-display text-2xl font-black text-yellow sm:text-3xl"
                    : "flex items-center gap-2 font-display text-lg font-bold text-chalk"
                }
              >
                {t(`tools.${tool.key}.title`)}
                <ArrowUpRight
                  className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2.5}
                />
              </h3>
              <p className="mt-2.5 max-w-[54ch] leading-[1.7] text-chalk-dim">
                {t(`tools.${tool.key}.text`)}
              </p>
              <span className="sr-only">{tCommon("opensInNewTab")}</span>
            </a>
          ))}
        </div>
      </BoardSection>
    </>
  );
};

export default ProgrammePage;
