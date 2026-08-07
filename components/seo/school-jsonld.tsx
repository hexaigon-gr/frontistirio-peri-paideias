import { BUSINESS, STAFF } from "@/lib/general/constants";
import { SITE_URL } from "@/lib/general/site-url";

/**
 * Structured data, so search engines and map services can place the school
 * rather than guess. `streetAddress` is left out on purpose while the exact
 * address is unconfirmed: an invented street here would end up in map listings.
 */
export const SchoolJsonLd = ({ locale }: { locale: string }) => {
  const { address, coordinates, hours, social } = BUSINESS;

  /* `@id`, `url` and `logo` are all absolute. Publishing them against a guessed
     origin would bind the school's identity to a throwaway host, so until the
     domain exists this emits nothing at all. */
  if (!SITE_URL) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    slogan: BUSINESS.slogan,
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/images/logo/wordmark.png`,
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
      addressRegion: address.city,
      postalCode: address.postalCode,
      addressCountry: "GR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    },
    areaServed: [address.area, address.municipality, address.city],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: hours.opens,
      closes: hours.closes,
    },
    sameAs: [social.facebook, social.instagram],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.mapsQuery)}`,
    employee: STAFF.map((person) => ({ "@type": "Person", name: person.name })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
