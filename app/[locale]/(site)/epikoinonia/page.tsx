import { Clock, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FacebookIcon, InstagramIcon } from "@/components/brand-icons";
import { ChalkBulb } from "@/components/chalk/chalk-marks";
import { BoardSection, ChalkFrame, ChalkHeading } from "@/components/sections/board-blocks";
import { LocationMap } from "@/components/sections/location-map";
import { PageIntro } from "@/components/sections/page-intro";
import { SocialIcon } from "@/components/social-icon";
import { BUSINESS, FOUNDERS } from "@/lib/general/constants";
import { BasePageProps } from "@/types/page-props";

export const generateMetadata = async ({ params }: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  return { title: t("title"), description: t("intro") };
};

const ContactPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");
  const tCommon = await getTranslations("Common");
  const tStaff = await getTranslations("Staff");
  const { opens, closes } = BUSINESS.hours;

  return (
    <>
      <PageIntro
        title={t("title")}
        intro={t("intro")}
        doodle={
          <ChalkBulb className="absolute top-[30%] right-[8%] hidden size-24 text-yellow/45 md:block lg:size-32" />
        }
      />

      <BoardSection tone="deep">
        <ul className="grid gap-8 sm:grid-cols-2">
          {FOUNDERS.map((person) => (
            <li key={person.key} className="relative p-7">
              <ChalkFrame className="text-chalk/25" />
              <p className="font-display text-2xl font-bold text-chalk">{person.name}</p>
              <p className="mt-1 text-[0.7rem] tracking-[0.2em] text-chalk-faint uppercase">
                {tStaff(person.roleKey)}
              </p>
              <a
                href={person.phone.href}
                className="mt-4 flex cursor-pointer items-center gap-3 font-display text-2xl font-extrabold tabular-nums text-yellow transition-opacity duration-200 hover:opacity-80 sm:text-3xl"
              >
                <Phone className="size-5 shrink-0" strokeWidth={2.5} />
                {person.phone.display}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-chalk">
              <Clock className="size-4.5 text-yellow" strokeWidth={2.5} />
              {tCommon("hours")}
            </h2>
            <p className="mt-3 text-chalk-dim">{t("hoursValue", { opens, closes })}</p>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-chalk">{t("socialTitle")}</h2>
            <div className="mt-4 flex gap-3">
              <SocialIcon
                url={BUSINESS.social.facebook}
                color="board"
                icon={<FacebookIcon className="size-5" />}
                isMobile
              />
              <SocialIcon
                url={BUSINESS.social.instagram}
                color="board"
                icon={<InstagramIcon className="size-5" />}
                isMobile
              />
            </div>
          </div>
        </div>
      </BoardSection>

      <BoardSection>
        <ChalkHeading title={t("whereTitle")} className="mb-12" />
        <LocationMap />
      </BoardSection>
    </>
  );
};

export default ContactPage;
