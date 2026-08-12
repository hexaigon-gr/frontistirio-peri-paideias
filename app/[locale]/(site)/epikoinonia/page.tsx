import { Clock, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { FacebookIcon, InstagramIcon } from "@/components/brand-icons";
import { CallButton } from "@/components/call-button";
import { ChalkBulb } from "@/components/chalk/chalk-marks";
import { BoardSection, ChalkFrame, ChalkHeading, PAGE_ACCENTS } from "@/components/sections/board-blocks";
import { LocationMap } from "@/components/sections/location-map";
import { PageIntro } from "@/components/sections/page-intro";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { SocialIcon } from "@/components/social-icon";
import { BUSINESS, FOUNDERS, ROUTES } from "@/lib/general/constants";
import { buildPageMetadata } from "@/lib/general/seo";
import { cn } from "@/lib/general/utils";
import { BasePageProps } from "@/types/page-props";

const ACCENT = PAGE_ACCENTS.contact;

export const generateMetadata = async ({ params }: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  return buildPageMetadata({ locale, path: ROUTES.contact, title: t("title"), description: t("intro") });
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
      <BreadcrumbJsonLd locale={locale} routeKey="contact" />

      <PageIntro
        title={t("title")}
        intro={t("intro")}
        doodle={
          <ChalkBulb className={cn("absolute top-[30%] right-[8%] hidden size-24 md:block lg:size-32", ACCENT.doodle)} />
        }
      >
        {/* The only call button outside the navbar and the home hero. It is
            labelled here because this is the one page that shows both the
            landline and the two personal numbers, and the reader has to know
            which is which before dialling. */}
        <p className="mt-10 text-[0.7rem] tracking-[0.2em] text-chalk-faint uppercase">
          {tCommon("secretariat")}
        </p>
        <CallButton className="mt-3" />
      </PageIntro>

      <BoardSection tone="deep">
        <ChalkHeading accent={ACCENT.rule} title={tCommon("studiesDirection")} className="mb-12" />

        <ul className="grid gap-8 sm:grid-cols-2">
          {FOUNDERS.map((person) => (
            <li key={person.key} className="relative p-7">
              <ChalkFrame className="text-chalk/25" />
              <p className="font-display text-2xl font-bold text-chalk">{person.name}</p>
              <p className="mt-1 text-[0.7rem] tracking-[0.2em] text-chalk-faint uppercase">
                {person.roles.map((role) => tStaff(role)).join(" · ")}
              </p>
              {/* `min-h-11`: these two numbers are the highest-intent taps on
                  the whole site and the anchors measured 32px tall. */}
              <a
                href={person.phone.href}
                className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 font-display text-2xl font-extrabold tabular-nums text-yellow transition-opacity duration-200 hover:opacity-80 sm:text-3xl"
              >
                <Phone className="size-5 shrink-0" strokeWidth={2.5} />
                {person.phone.display}
              </a>
            </li>
          ))}
        </ul>

        {/* The landline is not repeated here: the call button at the top of the
            page already dials it. */}
        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {BUSINESS.email ? (
            <div className="sm:col-span-2">
              <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-chalk">
                <Mail className="size-4.5 text-yellow" strokeWidth={2.5} />
                {tCommon("email")}
              </h2>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="mt-2 inline-flex min-h-11 cursor-pointer items-center break-all font-display text-xl font-bold text-yellow transition-opacity duration-200 hover:opacity-80 sm:text-2xl"
              >
                {BUSINESS.email}
              </a>
            </div>
          ) : null}

          <div>
            <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-chalk">
              <Clock className="size-4.5 text-yellow" strokeWidth={2.5} />
              {tCommon("hours")}
            </h2>
            <p className="mt-3 text-chalk-dim">{t("hoursValue", { opens, closes })}</p>
            <p className="mt-2 max-w-[38ch] text-[0.9rem] leading-[1.7] text-chalk-faint">
              {t("hoursNote")}
            </p>
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
        <ChalkHeading accent={ACCENT.rule} title={t("whereTitle")} className="mb-12" />
        <LocationMap />
      </BoardSection>
    </>
  );
};

export default ContactPage;
