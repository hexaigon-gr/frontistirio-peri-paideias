import { setRequestLocale } from "next-intl/server";

import Footer from "@/components/footer";
import { Navbar } from "@/components/layout/navbar";
import { BaseLayoutProps } from "@/types/page-props";

const SiteLayout = async ({ children, params }: BaseLayoutProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-svh flex-col bg-paper">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default SiteLayout;
