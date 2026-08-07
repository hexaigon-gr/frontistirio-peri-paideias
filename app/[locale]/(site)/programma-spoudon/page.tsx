import { ArrowUpRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ChalkSetSquare } from "@/components/chalk/chalk-marks";
import { PartnerLogo } from "@/components/partner-logo";
import { BoardSection, ChalkFrame, ChalkHeading, ChalkRule, PAGE_ACCENTS } from "@/components/sections/board-blocks";
import { PageIntro } from "@/components/sections/page-intro";
import { BUSINESS, EXTERNAL_TOOLS, LEVELS, WEEKLY_PROGRAMME } from "@/lib/general/constants";
import { cn } from "@/lib/general/utils";
import { BasePageProps } from "@/types/page-props";

type ProgrammeGroup = (typeof WEEKLY_PROGRAMME)[number];
type ProgrammeSubject =
  | ProgrammeGroup["subjects"][number]
  | Extract<ProgrammeGroup, { tracks: unknown }>["tracks"][number]["subjects"][number];

/**
 * One row per subject. The note sits under the subject rather than behind an
 * asterisk: a marker makes the reader hunt for its meaning, and the hours column
 * has to stay a single scannable number.
 */
const SubjectList = ({
  subjects,
  t,
}: {
  subjects: readonly ProgrammeSubject[];
  t: Awaited<ReturnType<typeof getTranslations<"Programme">>>;
}) => (
  <ul className="mt-3 divide-y divide-chalk/10">
    {subjects.map((subject) => (
      <li key={subject.key} className="flex items-baseline justify-between gap-5 py-2.5">
        <span className="min-w-0">
          <span className="text-chalk">{t(`subjects.${subject.key}`)}</span>
          {"noteKey" in subject ? (
            <span className="mt-1 block text-[0.78rem] leading-snug text-chalk-faint">
              {t(`subjectNotes.${subject.noteKey}`)}
            </span>
          ) : null}
        </span>
        <span className="shrink-0 font-display font-bold tabular-nums text-chalk-dim">
          {"unit" in subject && subject.unit === "day"
            ? t("hoursDaily", { hours: subject.hours })
            : t("hoursWeekly", { hours: subject.hours })}
        </span>
      </li>
    ))}
  </ul>
);

const ACCENT = PAGE_ACCENTS.programme;

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
          <ChalkSetSquare className={cn("absolute top-[32%] right-[8%] hidden size-24 md:block lg:size-32", ACCENT.doodle)} />
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
        <div className="flex items-start gap-4">
          <Clock className="mt-1.5 size-6 shrink-0 text-yellow" strokeWidth={2.4} />
          <div>
            <ChalkHeading accent={ACCENT.rule} title={t("hoursTitle")} />
            <p className="mt-6 max-w-[62ch] leading-[1.8] text-chalk-dim">
              {t("hoursText", { opens, closes })}
            </p>
          </div>
        </div>
      </BoardSection>

      {/* The timetable runs in two columns on a wide screen, with each year group
          kept whole by break-inside-avoid. A group split across a column break
          would put a subject under the wrong heading. */}
      <BoardSection tone="deep" id="ores-ana-taxi">
        <ChalkHeading accent={ACCENT.rule} title={t("weeklyTitle")} intro={t("weeklyIntro")} />

        <div className="mt-12 lg:columns-2 lg:gap-x-16">
          {WEEKLY_PROGRAMME.map((group) => (
            <div key={group.key} className="mb-11 break-inside-avoid last:mb-0">
              <h3 className="font-display text-xl font-bold tracking-wide text-yellow sm:text-2xl">
                {t(`classes.${group.key}`)}
              </h3>
              <ChalkRule className="mt-2 h-1.5 w-20 text-yellow/50" />

              {/* A year taught entirely per track has no common subjects, and an
                  empty list still renders its own top margin. */}
              {group.subjects.length ? <SubjectList subjects={group.subjects} t={t} /> : null}

              {"tracks" in group
                ? group.tracks.map((track) => (
                    <div key={track.key} className="mt-7">
                      <p className="text-[0.7rem] tracking-[0.18em] text-chalk-faint uppercase">
                        {t(`tracks.${track.key}`)}
                      </p>
                      <SubjectList subjects={track.subjects} t={t} />
                    </div>
                  ))
                : null}
            </div>
          ))}
        </div>
      </BoardSection>

      <BoardSection tone="deep" id="ergaleia">
        <ChalkHeading accent={ACCENT.rule} title={t("toolsTitle")} intro={t("toolsIntro")} />

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

              <div className="sm:flex sm:items-start sm:gap-6">
                {tool.logo ? <PartnerLogo logo={tool.logo} /> : null}

                <div>
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
                </div>
              </div>
              <span className="sr-only">{tCommon("opensInNewTab")}</span>
            </a>
          ))}
        </div>
      </BoardSection>
    </>
  );
};

export default ProgrammePage;
