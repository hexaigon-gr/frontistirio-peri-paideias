import { getTranslations } from "next-intl/server";

import { STAFF } from "@/lib/general/constants";
import { jsonLdScriptProps, personId } from "@/lib/general/json-ld";
import { SITE_URL } from "@/lib/general/site-url";
import { TEAM_PHOTOS } from "@/lib/general/team-blur";

/**
 * The five teachers as real entities, emitted only on the team page.
 *
 * The site-wide organisation node references these by `@id`; this is where they
 * are actually described, next to the bios a reader can see. That split is
 * deliberate: repeating five full Person nodes on all twelve pages would say
 * nothing extra and would put credentials on pages that do not show them.
 *
 * This is the school's strongest E-E-A-T asset and none of it was machine
 * readable before: named people, named degrees, named institutions. `alumniOf`
 * comes from the structured field in `constants.ts`, never from parsing the
 * display credentials string.
 *
 * The founders' mobile numbers stay out, exactly as they do in the organisation
 * node. Structured data is where a phone number gets harvested.
 */
export const TeamJsonLd = async ({ locale }: { locale: string }) => {
  if (!SITE_URL) return null;

  const t = await getTranslations({ locale, namespace: "Staff" });

  const data = {
    "@context": "https://schema.org",
    "@graph": STAFF.map((person) => {
      const photo = TEAM_PHOTOS[person.key];

      return {
        "@type": "Person",
        "@id": personId(person.key),
        name: person.name,
        jobTitle: [
          ...person.roles.map((role) => t(role)),
          ...(person.responsibility ? [t(`responsibility.${person.responsibility}`)] : []),
        ],
        description: t(`bio.${person.key}`),
        ...(photo ? { image: `${SITE_URL}${photo.src}` } : {}),
        worksFor: { "@id": `${SITE_URL}/#organization` },
        alumniOf: person.alumniOf.map((name) => ({
          "@type": "CollegeOrUniversity",
          name,
        })),
      };
    }),
  };

  return <script {...jsonLdScriptProps(data)} />;
};
