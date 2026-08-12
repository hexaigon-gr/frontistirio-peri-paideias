import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ChalkPlane } from "@/components/chalk/chalk-marks";
import { BoardSection, ChalkHeading, PAGE_ACCENTS } from "@/components/sections/board-blocks";
import { PageIntro } from "@/components/sections/page-intro";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { OUTINGS, ROUTES, STANDING_ACTIVITIES } from "@/lib/general/constants";
import { buildPageMetadata } from "@/lib/general/seo";
import { cn } from "@/lib/general/utils";
import { BasePageProps } from "@/types/page-props";

const ACCENT = PAGE_ACCENTS.activities;

export const generateMetadata = async ({ params }: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Activities" });

  return buildPageMetadata({ locale, path: ROUTES.activities, title: t("title"), description: t("intro") });
};

const ActivitiesPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Activities");

  return (
    <>
      <BreadcrumbJsonLd locale={locale} routeKey="activities" />

      <PageIntro
        title={t("title")}
        intro={t("intro")}
        doodle={
          <ChalkPlane className={cn("absolute top-[30%] right-[9%] hidden size-24 md:block lg:size-32", ACCENT.doodle)} />
        }
      />

      {/* A marked list rather than the timeline this used to be. These repeat
          every year, so the chalk rule down the edge groups them instead of
          dating them. */}
      <BoardSection tone="deep">
        <ChalkHeading accent={ACCENT.rule} title={t("eventsTitle")} />

        <ul className="mt-12 border-l border-chalk/15 pl-6 sm:pl-10">
          {STANDING_ACTIVITIES.map((key) => (
            <li key={key} className="relative pb-10 last:pb-0">
              <span
                aria-hidden
                className="absolute top-3 -left-6 size-2.5 rounded-full bg-yellow sm:-left-[2.8125rem]"
              />
              <h3 className="font-display text-xl font-bold text-chalk sm:text-2xl">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-2 max-w-[56ch] leading-[1.75] text-chalk-dim">
                {t(`items.${key}.text`)}
              </p>
            </li>
          ))}
        </ul>
      </BoardSection>

      <BoardSection>
        <ChalkHeading accent={ACCENT.rule} title={t("outdoorTitle")} intro={t("outdoorIntro")} />

        <p className="mt-5 max-w-[46ch] leading-[1.75] text-chalk-dim">{t("outdoorClosing")}</p>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
          {OUTINGS.map((item) => (
            <div key={item.key}>
              <p className="font-chalk text-lg text-yellow">{item.year}</p>
              <h3 className="mt-1 font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] font-black text-chalk">
                {t(`items.${item.key}.title`)}
              </h3>
              <p className="mt-3 max-w-[46ch] leading-[1.75] text-chalk-dim">
                {t(`items.${item.key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </BoardSection>
    </>
  );
};

export default ActivitiesPage;
