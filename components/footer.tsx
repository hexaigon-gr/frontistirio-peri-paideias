import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { FacebookIcon, InstagramIcon } from "@/components/brand-icons";
import { SocialIcon } from "@/components/social-icon";
import { BUSINESS, CONTACT_ANCHOR, NAV_LINKS, STAFF } from "@/lib/general/constants";
import { Link } from "@/lib/i18n/navigation";

/**
 * Only verified details are printed here. The street address, the postal code
 * and the email are still placeholders in `constants.ts`, so they are left out
 * rather than published as invented facts.
 */
const Footer = async () => {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const tStaff = await getTranslations("Staff");
  const year = new Date().getFullYear();
  const { address } = BUSINESS;

  return (
    <footer id={CONTACT_ANCHOR} className="board-texture relative overflow-hidden bg-board-deep">
      <div className="relative mx-auto grid w-full max-w-[84rem] gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-5">
          <Image
            src="/images/logo/wordmark.png"
            alt={BUSINESS.name}
            width={1459}
            height={616}
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
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-chalk text-xl text-yellow">{t("navTitle")}</h2>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="text-chalk-dim transition-colors duration-200 hover:text-yellow"
                >
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h2 className="font-chalk text-xl text-yellow">{t("contactTitle")}</h2>

          <ul className="mt-5 space-y-5">
            {STAFF.map((person) => (
              <li key={person.key}>
                <p className="font-display text-lg font-bold text-chalk">{person.name}</p>
                <p className="text-[0.7rem] tracking-[0.2em] text-chalk-faint uppercase">
                  {tStaff(person.roleKey)}
                </p>
                <a
                  href={person.phone.href}
                  className="mt-1.5 flex items-center gap-2.5 font-display text-xl font-extrabold tabular-nums text-chalk transition-colors duration-200 hover:text-yellow"
                >
                  <Phone className="size-4 shrink-0 text-yellow" strokeWidth={2.5} />
                  {person.phone.display}
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-6 flex items-start gap-2.5 text-chalk-dim">
            <MapPin className="mt-0.5 size-4 shrink-0 text-yellow" />
            {address.area}, {address.city}
          </p>
        </div>
      </div>

      <div className="relative border-t border-chalk/10">
        <div className="mx-auto w-full max-w-[84rem] px-5 py-6 text-center text-xs text-chalk-faint sm:px-8">
          © {year} {BUSINESS.legalName}. {t("rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
