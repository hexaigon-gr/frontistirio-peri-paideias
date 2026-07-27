import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { FacebookIcon, InstagramIcon } from "@/components/brand-icons";
import { SocialIcon } from "@/components/social-icon";
import { BUSINESS, NAV_LINKS } from "@/lib/general/constants";
import { Link } from "@/lib/i18n/navigation";

const Footer = async () => {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Nav");
  const year = new Date().getFullYear();
  const { address } = BUSINESS;

  return (
    <footer className="border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Image
            src="/images/logo/wordmark-light.png"
            alt={BUSINESS.name}
            width={565}
            height={237}
            className="h-12 w-auto"
          />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/60">{t("tagline")}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wide text-amber uppercase">
            {t("navTitle")}
          </h2>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="text-sm text-paper/70 transition-colors hover:text-amber"
                >
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-wide text-amber uppercase">
            {t("contactTitle")}
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-paper/70">
            <li>
              <a
                href={BUSINESS.phone.href}
                className="flex items-center gap-2.5 transition-colors hover:text-amber"
              >
                <Phone className="size-4 shrink-0 text-amber" />
                {BUSINESS.phone.display}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-amber"
              >
                <Mail className="size-4 shrink-0 text-amber" />
                {BUSINESS.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-amber" />
              <span>
                {address.street}, {address.area}
                <br />
                {address.postalCode} {address.city}
              </span>
            </li>
          </ul>

          <h2 className="mt-8 text-sm font-semibold tracking-wide text-amber uppercase">
            {t("followTitle")}
          </h2>
          <div className="mt-4 flex gap-3">
            <SocialIcon
              url={BUSINESS.social.facebook}
              color="facebook"
              icon={<FacebookIcon className="size-5" />}
              isMobile
            />
            <SocialIcon
              url={BUSINESS.social.instagram}
              color="instagram"
              icon={<InstagramIcon className="size-5" />}
              isMobile
            />
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 text-center text-xs text-paper/50">
          © {year} {BUSINESS.legalName}. {t("rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
