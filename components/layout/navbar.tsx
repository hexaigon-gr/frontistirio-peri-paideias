"use client";

import { Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { BUSINESS, NAV_LINKS, ROUTES } from "@/lib/general/constants";
import { cn } from "@/lib/general/utils";
import { Link } from "@/lib/i18n/navigation";

const SCROLL_THRESHOLD = 24;

export const Navbar = () => {
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
          isScrolled
            ? "border-ink/10 bg-paper/85 backdrop-blur"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <Link href={ROUTES.home} aria-label={BUSINESS.name}>
            <Image
              src="/images/logo/wordmark-ink.png"
              alt={BUSINESS.name}
              width={565}
              height={237}
              priority
              className="h-11 w-auto"
            />
          </Link>

          <nav className="hidden items-center gap-7 rounded-full border border-ink/10 bg-white/70 px-7 py-2.5 backdrop-blur lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="cursor-pointer text-sm font-medium text-ink/70 transition-colors hover:text-ink"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button size="lg" className="rounded-full" asChild>
              <a href={BUSINESS.phone.href}>
                <Phone className="size-4" />
                <span className="hidden sm:inline">{BUSINESS.phone.display}</span>
              </a>
            </Button>
            <Button
              size="icon-lg"
              variant="ghost"
              className="rounded-full text-ink lg:hidden"
              aria-label={t("openMenu")}
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-60 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeMenu}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-70 flex w-80 max-w-[85vw] flex-col bg-paper shadow-2xl transition-transform duration-300 lg:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-20 items-center justify-end px-6">
          <Button
            size="icon-lg"
            variant="ghost"
            className="rounded-full text-ink"
            aria-label={t("closeMenu")}
            onClick={closeMenu}
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-amber/20"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-6">
          <Button size="lg" className="w-full rounded-full" asChild>
            <a href={BUSINESS.phone.href}>
              <Phone className="size-4" />
              {tCommon("call")}
            </a>
          </Button>
        </div>
      </aside>
    </>
  );
};
