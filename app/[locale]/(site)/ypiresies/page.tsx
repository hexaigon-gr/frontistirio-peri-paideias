import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ChalkAtom, ChalkFlask } from "@/components/chalk/chalk-marks";
import { BoardSection, ChalkFrame, ChalkHeading, PAGE_ACCENTS } from "@/components/sections/board-blocks";
import { PageIntro } from "@/components/sections/page-intro";
import { EXTERNAL_TOOLS, METHOD_ITEMS, PARTNER_SPECIALISTS } from "@/lib/general/constants";
import { cn } from "@/lib/general/utils";
import { BasePageProps } from "@/types/page-props";

const EXTRA_ITEMS = ["oefeSimulation", "personalityTest"] as const;
const FEATURED_TOOLS = EXTERNAL_TOOLS.filter((tool) => tool.featured);

const ACCENT = PAGE_ACCENTS.services;

export const generateMetadata = async ({ params }: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Services" });

  return { title: t("title"), description: t("intro") };
};

const ServicesPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Services");
  const tProgramme = await getTranslations("Programme");
  const tCommon = await getTranslations("Common");

  return (
    <>
      <PageIntro
        title={t("title")}
        intro={t("intro")}
        doodle={
          <ChalkFlask className={cn("absolute top-[30%] right-[8%] hidden size-24 md:block lg:size-32", ACCENT.doodle)} />
        }
      />

      {/* Numbered like notes taken off a board, not repeated in identical cards. */}
      <BoardSection tone="deep">
        <ChalkHeading accent={ACCENT.rule} title={t("methodTitle")} intro={t("methodIntro")} />

        <ol className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {METHOD_ITEMS.map((item, index) => (
            <li key={item} className="flex gap-5">
              <span className="mt-1 shrink-0 font-chalk text-3xl leading-none text-yellow">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-chalk">
                  {t(`method.${item}.title`)}
                </h3>
                <p className="mt-2 max-w-[46ch] leading-[1.75] text-chalk-dim">
                  {t(`method.${item}.text`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </BoardSection>

      {/* What the school itself offers comes before who it calls in: a parent
          reading top to bottom should finish our list before meeting outside
          names. The tones keep alternating, so the swap moves `tone` too. */}
      <BoardSection>
        <ChalkHeading accent={ACCENT.rule} title={t("extrasTitle")} />

        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {EXTRA_ITEMS.map((item) => (
            <div key={item}>
              <h3 className="font-display text-xl font-bold text-chalk">
                {t(`extras.${item}.title`)}
              </h3>
              <p className="mt-2 max-w-[46ch] leading-[1.75] text-chalk-dim">
                {t(`extras.${item}.text`)}
              </p>
            </div>
          ))}

          {FEATURED_TOOLS.map((tool) => (
            <a
              key={tool.key}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block cursor-pointer"
            >
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-yellow">
                {tProgramme(`tools.${tool.key}.title`)}
                <ArrowUpRight className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </h3>
              <p className="mt-2 max-w-[46ch] leading-[1.75] text-chalk-dim">
                {tProgramme(`tools.${tool.key}.text`)}
              </p>
              <span className="sr-only">{tCommon("opensInNewTab")}</span>
            </a>
          ))}
        </div>
      </BoardSection>

      <BoardSection tone="deep">
        <ChalkAtom
          aria-hidden
          className="pointer-events-none absolute top-16 right-[5%] hidden size-24 text-sky/30 lg:block"
        />

        <ChalkHeading accent={ACCENT.rule} title={t("specialistsTitle")} intro={t("specialistsIntro")} />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PARTNER_SPECIALISTS.map((specialist) => (
            <li key={specialist} className="relative p-6">
              <ChalkFrame className="text-chalk/25" />
              <h3 className="font-display text-lg font-bold text-chalk">
                {t(`specialists.${specialist}.title`)}
              </h3>
              <p className="mt-2.5 text-[0.95rem] leading-[1.7] text-chalk-dim">
                {t(`specialists.${specialist}.text`)}
              </p>
            </li>
          ))}
        </ul>
      </BoardSection>
    </>
  );
};

export default ServicesPage;
