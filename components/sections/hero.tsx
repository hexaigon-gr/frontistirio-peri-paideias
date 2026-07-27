import { ArrowRight, GraduationCap, MapPin, Phone, Users } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { BUSINESS, ROUTES } from "@/lib/general/constants";
import { Link } from "@/lib/i18n/navigation";

const HIGHLIGHTS = [
  { icon: Users, key: "highlightGroupSize" },
  { icon: GraduationCap, key: "highlightLevels" },
  { icon: MapPin, key: "highlightLocation" },
] as const;

export const Hero = async () => {
  const t = await getTranslations("Hero");
  const tCommon = await getTranslations("Common");

  return (
    <section className="relative min-h-svh overflow-hidden bg-paper pt-20">
      <div className="pointer-events-none absolute -top-40 -right-32 size-[36rem] rounded-full bg-amber/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 size-[32rem] rounded-full bg-chalk/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center rounded-full bg-amber/25 px-4 py-1.5 text-[0.7rem] font-semibold tracking-wide text-ink uppercase sm:text-xs">
            {t("eyebrow")}
          </span>
          <h1 className="mt-5 text-[2rem] leading-[1.12] font-extrabold tracking-tight text-ink sm:text-4xl md:mt-6 md:text-[3.4rem] md:leading-[1.08]">
            <span className="md:block">{t("titleStart")}</span>{" "}
            <span className="md:block">
              {t("titleMiddle")}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{t("titleHighlight")}</span>
                <span className="absolute inset-x-0 bottom-0 z-0 h-2 rounded-sm bg-amber/60 md:h-3" />
              </span>
            </span>
          </h1>
          <p className="mt-5 max-w-lg leading-relaxed text-ink/70 md:mt-6 md:text-lg">
            {t("description")}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-8 md:gap-4">
            <Button size="lg" className="h-12 rounded-full px-8 text-base" asChild>
              <a href={BUSINESS.phone.href}>
                <Phone className="size-4" />
                {tCommon("call")}
              </a>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-12 rounded-full px-8 text-base text-ink hover:bg-ink/5"
              asChild
            >
              <Link href={ROUTES.courses}>
                {tCommon("viewCourses")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
            {HIGHLIGHTS.map(({ icon: Icon, key }) => (
              <li key={key} className="flex items-center gap-2 text-sm text-ink/65">
                <Icon className="size-4 text-amber-deep" />
                {t(key)}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative pb-10">
          <div className="relative h-[clamp(20rem,58vh,32rem)] w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-ink/20">
            <Image
              src="/images/hero/classroom.jpg"
              alt={t("imageAlt")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 -left-6 rounded-2xl border border-ink/10 bg-white p-5 shadow-xl">
            <p className="text-3xl font-extrabold text-ink">{t("badgeValue")}</p>
            <p className="mt-1 text-sm text-ink/60">{t("badgeLabel")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
