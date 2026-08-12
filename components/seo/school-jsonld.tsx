import { getTranslations } from "next-intl/server";

import { BUSINESS, FOUNDERS, STAFF } from "@/lib/general/constants";
import { jsonLdScriptProps, personId } from "@/lib/general/json-ld";
import { SITE_URL } from "@/lib/general/site-url";
import { routing } from "@/lib/i18n/routing";

/**
 * The school as a machine-readable entity, emitted on every page of the site.
 *
 * `@type` is BOTH `EducationalOrganization` and `LocalBusiness`, which is valid
 * schema.org and load-bearing here. `EducationalOrganization` descends from
 * `Organization`, not from `Place`, so on its own it made `geo`, `hasMap`,
 * `areaServed` and `openingHoursSpecification` inert: they were emitted and
 * ignored, and the Rich Results Test reported a plain Organization with no
 * local business item. For a village school the local treatment is the single
 * most valuable thing this markup can earn.
 *
 * `School` would not have fixed it. It also descends from `Organization`, and
 * it describes an institution that issues its own diplomas, which a φροντιστήριο
 * does not.
 */
export const SchoolJsonLd = async ({ locale }: { locale: string }) => {
  const { address, coordinates, hours, social } = BUSINESS;

  /* `@id`, `url` and every image are absolute. Publishing them against a
     guessed origin would bind the school's identity to a throwaway host, so
     until the domain exists this emits nothing at all. */
  if (!SITE_URL) return null;

  const t = await getTranslations({ locale, namespace: "Metadata" });

  const data = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    /* Latin script so a search for "Peri Paideias" has something to match. The
       site name itself is Greek and stays Greek. */
    alternateName: ["Peri Paideias", `Φροντιστήριο ${BUSINESS.name}`],
    description: t("homeDescription"),
    slogan: BUSINESS.slogan,
    /* Pinned to the default locale rather than the rendering one. The `@id` is
       a single entity, and asserting the same node with two different `url`
       values on the Greek and English pages left Google to pick one at random
       when it merged them. */
    url: `${SITE_URL}/${routing.defaultLocale}`,
    logo: `${SITE_URL}/images/logo/wordmark.png`,
    /* `image` is NOT a synonym for `logo`. Google reads the logo for the
       knowledge panel mark and `image` for the local business result, and only
       accepts images at least 1200px wide, which rules out the portrait-crop
       gallery shots. */
    image: [`${SITE_URL}/og-image.jpg`, `${SITE_URL}/images/hero/board-hands.webp`],
    /* The landline only. The founders' mobiles are personal, and structured data
       is precisely where a number is harvested and reused: it is machine readable
       and it sits on every page. They stay on the contact page and nowhere else. */
    telephone: BUSINESS.phone.href.replace("tel:", ""),
    /* The school's own address, unlike the mobiles, so it belongs here. Still
       guarded: an empty string would publish an organisation with no contact. */
    ...(BUSINESS.email ? { email: BUSINESS.email } : {}),
    address: {
      "@type": "PostalAddress",
      ...(address.street ? { streetAddress: address.street } : {}),
      addressLocality: address.area,
      /* The region, not the display city. See the note in `constants.ts`. */
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: "GR",
    },
    /* Approximate, from OpenStreetMap, and knowingly so: see `coordinates` in
       `constants.ts`. It is kept because `streetAddress` is now specific enough
       for Google to correct it, and a rough point still helps a map service
       frame the right village. Replace it the moment the door coordinates are
       known. */
    geo: {
      "@type": "GeoCoordinates",
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    },
    areaServed: [address.area, address.municipality, address.city].map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: hours.opens,
      closes: hours.closes,
    },
    knowsLanguage: [...routing.locales],
    sameAs: [social.facebook, social.instagram],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.mapsQuery)}`,
    /* References, not copies. The full Person nodes live on the team page,
       where the bios they describe are actually visible, and both point at the
       same locale-free `@id` so the Greek and English pages describe five
       people rather than ten. */
    founder: FOUNDERS.map((person) => ({ "@id": personId(person.key) })),
    employee: STAFF.map((person) => ({ "@id": personId(person.key) })),
  };

  return <script {...jsonLdScriptProps(data)} />;
};
