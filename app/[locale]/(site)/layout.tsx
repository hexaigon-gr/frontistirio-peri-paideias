import { setRequestLocale } from "next-intl/server";

import { ChalkDefs } from "@/components/chalk/chalk-marks";
import Footer from "@/components/footer";
import { Navbar } from "@/components/layout/navbar";
import { SchoolJsonLd } from "@/components/seo/school-jsonld";
import { BaseLayoutProps } from "@/types/page-props";

const SiteLayout = async ({ children, params }: BaseLayoutProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="on-board relative flex min-h-svh flex-col">
      <SchoolJsonLd locale={locale} />
      <ChalkDefs />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default SiteLayout;
