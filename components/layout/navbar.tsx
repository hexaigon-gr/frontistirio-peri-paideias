"use client";

import { Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { LocaleSwitch } from "@/components/layout/locale-switch";
import { Button } from "@/components/ui/button";
import { BUSINESS, FOUNDERS, NAV_LINKS, PRIMARY_PHONE, ROUTES } from "@/lib/general/constants";
import { cn } from "@/lib/general/utils";
import { Link, usePathname } from "@/lib/i18n/navigation";

const SCROLL_THRESHOLD = 20;

/**
 * A chalk stroke that draws itself under a nav link on hover. A scaleX reveal was
 * the obvious alternative and it is wrong here: it squashes the wobble instead of
 * laying chalk down. The drawing and the timing live in `.chalk-underline` in
 * globals.css.
 */
const LinkStroke = ({ isActive }: { isActive: boolean }) => (
  <svg
    viewBox="0 0 100 10"
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
    filter="url(#chalk-rough-soft)"
    className={cn(
      "chalk-underline absolute -bottom-2 left-0 h-2 w-full overflow-visible text-yellow",
      isActive && "is-drawn",
    )}
  >
    <path
      d="M1.5 5.4C19 2.8 35 2 51 2.5c16 .5 31.5 1.6 47.5 3.6"
      pathLength={1}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
    <path
      d="M4 8.4C21 6.6 38 6 54 6.4c14 .4 27 1 41 2.2"
      pathLength={1}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export const Navbar = () => {
  const t = useTranslations("Nav");
  const tStaff = useTranslations("Staff");
  /* Locale-agnostic: next-intl strips the /el or /en prefix, so this compares
     against the bare hrefs in NAV_LINKS without special-casing either locale. */
  const pathname = usePathname();
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
            ? "border-chalk/12 bg-board-deep/92 backdrop-blur-sm"
            : "border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-[84rem] items-center justify-between gap-6 px-5 transition-all duration-300 sm:px-8",
            isScrolled ? "h-16" : "h-20 md:h-24",
          )}
        >
          <Link href={ROUTES.home} aria-label={BUSINESS.name} className="shrink-0">
            <Image
              src="/images/logo/wordmark.png"
              alt={BUSINESS.name}
              width={1459}
              height={616}
              priority
              className={cn(
                "w-auto transition-all duration-300",
                isScrolled ? "h-9" : "h-10 md:h-14",
              )}
            />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.key}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative cursor-pointer py-1 text-[0.95rem] transition-colors duration-200 hover:text-chalk",
                    isActive ? "font-semibold text-chalk" : "font-medium text-chalk-dim",
                  )}
                >
                  {t(link.key)}
                  <LinkStroke isActive={isActive} />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <LocaleSwitch className="hidden lg:flex" />

            <Button asChild variant="chalk" size="pill-sm">
              <a href={PRIMARY_PHONE.href}>
                <Phone className="size-4 shrink-0" strokeWidth={2.5} />
                <span className="hidden tabular-nums sm:inline">{PRIMARY_PHONE.display}</span>
                <span className="sr-only sm:hidden">{t("call")}</span>
              </a>
            </Button>

            <button
              type="button"
              className="flex size-11 cursor-pointer items-center justify-center rounded-full text-chalk transition-colors duration-200 hover:bg-chalk/10 lg:hidden"
              aria-label={t("openMenu")}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="size-6" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-60 bg-board-deep/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeMenu}
        aria-hidden
      />

      <aside
        className={cn(
          "board-texture fixed inset-y-0 right-0 z-70 flex w-76 max-w-[86vw] flex-col overflow-hidden bg-board-deep transition-transform duration-300 ease-out lg:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!isMenuOpen}
      >
        <div className="relative flex h-20 items-center justify-between px-5">
          <LocaleSwitch className="pl-1" />
          <button
            type="button"
            className="flex size-11 cursor-pointer items-center justify-center rounded-full text-chalk transition-colors duration-200 hover:bg-chalk/10"
            aria-label={t("closeMenu")}
            onClick={closeMenu}
          >
            <X className="size-6" strokeWidth={2} />
          </button>
        </div>

        <nav className="relative flex flex-col px-6">
          {NAV_LINKS.map((link, index) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={closeMenu}
                aria-current={isActive ? "page" : undefined}
                /* No room for a drawn stroke in the panel, so the current page
                   is marked with a chalk tick in the margin instead. */
                className={cn(
                  "flex items-center gap-3 border-b border-chalk/10 py-4 font-display text-2xl font-bold transition-colors duration-200 hover:text-yellow",
                  isActive ? "text-yellow" : "text-chalk",
                )}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-6 w-1 rounded-full bg-yellow transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
                {t(link.key)}
              </Link>
            );
          })}
        </nav>

        <div className="relative mt-auto space-y-4 p-6">
          {FOUNDERS.map((person) => (
            <a
              key={person.key}
              href={person.phone.href}
              className="block cursor-pointer"
              onClick={closeMenu}
            >
              <span className="block font-display text-lg font-bold text-chalk">{person.name}</span>
              <span className="block text-xs tracking-[0.16em] text-chalk-faint uppercase">
                {person.roles.map((role) => tStaff(role)).join(" · ")}
              </span>
              <span className="mt-1 block font-display text-xl font-extrabold tabular-nums text-yellow">
                {person.phone.display}
              </span>
            </a>
          ))}
        </div>
      </aside>
    </>
  );
};
