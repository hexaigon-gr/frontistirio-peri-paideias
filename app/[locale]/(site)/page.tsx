import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BoardIndex } from "@/components/sections/board-index";
import { Hero } from "@/components/sections/hero";
import { ROUTES } from "@/lib/general/constants";
import { buildPageMetadata } from "@/lib/general/seo";
import { BasePageProps } from "@/types/page-props";

export const generateMetadata = async ({ params }: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return buildPageMetadata({
    locale,
    path: ROUTES.home,
    title: t("homeTitle"),
    description: t("homeDescription"),
    absoluteTitle: true,
  });
};

const HomePage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <BoardIndex />
    </>
  );
};

export default HomePage;
