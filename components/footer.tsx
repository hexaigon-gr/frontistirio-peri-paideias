import { Hexagon, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { FacebookIcon, InstagramIcon } from "@/components/brand-icons";
import { PartnerLogo } from "@/components/partner-logo";
import { SocialIcon } from "@/components/social-icon";
import { BUSINESS, CREDIT, EXTERNAL_TOOLS, FOUNDERS, NAV_LINKS } from "@/lib/general/constants";
import { Link } from "@/lib/i18n/navigation";

/** The tools that have a mark of their own, from the same source as the pages that describe them. */
const PARTNER_TOOLS = EXTERNAL_TOOLS.filter((tool) => tool.logo !== null);

/**
 * Every detail here is confirmed. Anything still unknown in `constants.ts` is
 * guarded rather than printed, so a placeholder can never ship as a fact.
 */
const Footer = async () => {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const tStaff = await getTranslations("Staff");
  const tCommon = await getTranslations("Common");
  const tProgramme = await getTranslations("Programme");
  const year = new Date().getFullYear();
  const { address } = BUSINESS;

  return (
    <footer className="board-texture relative overflow-hidden bg-board-deep">
      <div className="relative mx-auto grid w-full max-w-[84rem] gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          {/* Fixed `h-14` at a 2.37:1 aspect, so the box is 133px wide at every
              breakpoint. See the note on the same image in the navbar. */}
          <Image
            src="/images/logo/wordmark.png"
            alt={BUSINESS.name}
            width={1459}
            height={616}
            sizes="133px"
            className="h-14 w-auto"
          />
          <p className="mt-7 max-w-[42ch] leading-relaxed text-chalk-dim">{t("tagline")}</p>

          {/* `color="board"` is deliberately not a key in SocialIcon's map, so the
              buttons fall back to the primary tint and stay chalk-and-yellow.
              The saturated Facebook blue is the only foreign colour on a
              blackboard and it wrecks the palette. */}
          <div className="mt-8 flex gap-3">
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

          {/* The partner marks, badges only, no copy: the pages that explain them
              already do. They carry no visible text, so the link needs an
              accessible name of its own and the image stays decorative. */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {PARTNER_TOOLS.map((tool) => (
              <a
                key={tool.key}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tProgramme(`tools.${tool.key}.title`)}
                className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
              >
                <PartnerLogo logo={tool.logo} className="mb-0 h-14" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-chalk text-xl text-yellow">{t("navTitle")}</h2>
          {/* `block py-2.5` with a tighter list gap, rather than bare inline
              links in a roomy list. Same rhythm on the page, but each target
              grows from 16px tall to 44 and the whole row becomes tappable
              instead of just the glyphs. */}
          <ul className="mt-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="block py-2.5 text-chalk-dim transition-colors duration-200 hover:text-yellow"
                >
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h2 className="font-chalk text-xl text-yellow">{t("contactTitle")}</h2>

          {/* The landline is labelled, because the page also names the two people
              who run the studies and a bare number between them is ambiguous. */}
          <p className="mt-5 text-[0.7rem] tracking-[0.2em] text-chalk-faint uppercase">
            {tCommon("secretariat")}
          </p>
          {/* `min-h-11` on both this and the email below. They are the two
              highest-intent taps in the footer and they measured 32px and 24px
              tall, so the glyphs were the only target. */}
          <a
            href={BUSINESS.phone.href}
            className="mt-1 flex min-h-11 items-center gap-2.5 font-display text-xl font-extrabold tabular-nums text-chalk transition-colors duration-200 hover:text-yellow"
          >
            <Phone className="size-4 shrink-0 text-yellow" strokeWidth={2.5} />
            {BUSINESS.phone.display}
          </a>

          {/* Names and roles, no numbers: the mobiles are personal and are
              published once, on the contact page. */}
          <p className="mt-7 text-[0.7rem] tracking-[0.2em] text-chalk-faint uppercase">
            {tCommon("studiesDirection")}
          </p>
          <ul className="mt-2 space-y-3">
            {FOUNDERS.map((person) => (
              <li key={person.key}>
                <p className="font-display text-lg font-bold text-chalk">{person.name}</p>
                <p className="text-[0.7rem] tracking-[0.2em] text-chalk-faint uppercase">
                  {person.roles.map((role) => tStaff(role)).join(" · ")}
                </p>
              </li>
            ))}
          </ul>

          {BUSINESS.email ? (
            <a
              href={`mailto:${BUSINESS.email}`}
              className="mt-5 flex min-h-11 items-center gap-2.5 break-all text-chalk-dim transition-colors duration-200 hover:text-yellow"
            >
              <Mail className="size-4 shrink-0 text-yellow" strokeWidth={2.2} />
              {BUSINESS.email}
            </a>
          ) : null}

          <p className="mt-4 flex items-start gap-2.5 text-chalk-dim">
            <MapPin className="mt-0.5 size-4 shrink-0 text-yellow" />
            <span>
              {address.street}
              <br />
              {address.area}, {address.postalCode} {address.city}
            </span>
          </p>
        </div>
      </div>

      <div className="relative border-t border-chalk/10">
        <div className="mx-auto flex w-full max-w-[84rem] flex-col items-center gap-3 px-5 py-6 text-xs text-chalk-faint sm:flex-row sm:justify-between sm:px-8">
          <p>
            © {year} {BUSINESS.legalName}. {t("rights")}
          </p>

          <a
            href={CREDIT.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 cursor-pointer items-center gap-1.5 transition-colors duration-300 hover:text-chalk"
          >
            <Hexagon className="size-3.5 shrink-0 text-primary" strokeWidth={2.5} />
            {t("madeBy", { name: CREDIT.name })}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
