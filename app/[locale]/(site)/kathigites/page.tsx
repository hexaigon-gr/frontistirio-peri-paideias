import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageIntro } from "@/components/sections/page-intro";
import { BasePageProps } from "@/types/page-props";

export const generateMetadata = async ({ params }: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages" });

  return { title: t("teachers.title"), description: t("teachers.intro") };
};

const Page = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages");

  return <PageIntro title={t("teachers.title")} intro={t("teachers.intro")} />;
};

export default Page;
