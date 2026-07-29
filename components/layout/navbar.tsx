"use client";

import { Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { LocaleSwitch } from "@/components/layout/locale-switch";
import { BUSINESS, FOUNDERS, NAV_LINKS, PRIMARY_PHONE, ROUTES } from "@/lib/general/constants";
import { cn } from "@/lib/general/utils";
import { Link } from "@/lib/i18n/navigation";

const SCROLL_THRESHOLD = 20;

/**
 * A chalk stroke that draws itself under a nav link on hover. A scaleX reveal was
 * the obvious alternative and it is wrong here: it squashes the wobble instead of
 * laying chalk down. The drawing and the timing live in `.chalk-underline` in
 * globals.css.
 */
const LinkStroke = () => (
  <svg
    viewBox="0 0 100 10"
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
    filter="url(#chalk-rough-soft)"
    className="chalk-underline absolute -bottom-2 left-0 h-2 w-full overflow-visible text-yellow"
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="group relative cursor-pointer py-1 text-[0.95rem] font-medium text-chalk-dim transition-colors duration-200 hover:text-chalk"
              >
                {t(link.key)}
                <LinkStroke />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <LocaleSwitch className="hidden lg:flex" />

            <a
              href={PRIMARY_PHONE.href}
              className="group flex cursor-pointer items-center gap-2.5 rounded-full bg-yellow px-4 py-2.5 font-display text-base font-extrabold tracking-wide text-board-deep transition-transform duration-200 hover:-translate-y-0.5 sm:px-5"
            >
              <Phone className="size-4 shrink-0" strokeWidth={2.5} />
              <span className="hidden tabular-nums sm:inline">{PRIMARY_PHONE.display}</span>
              <span className="sr-only sm:hidden">{t("call")}</span>
            </a>

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
          "board-texture fixed inset-y-0 right-0 z-70 flex w-[19rem] max-w-[86vw] flex-col overflow-hidden bg-board-deep transition-transform duration-300 ease-out lg:hidden",
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
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={closeMenu}
              className="border-b border-chalk/10 py-4 font-display text-2xl font-bold text-chalk transition-colors duration-200 hover:text-yellow"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {t(link.key)}
            </Link>
          ))}
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
                {tStaff(person.roleKey)}
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
