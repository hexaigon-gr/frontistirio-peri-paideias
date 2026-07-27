/**
 * Every business detail the site renders comes from here. Never scatter a phone
 * number, address or social URL across components.
 *
 * Values marked PLACEHOLDER are invented and MUST be replaced with the real ones
 * before the site goes live. Only the social URLs and the area are confirmed.
 */
export const BUSINESS = {
  name: "Περί Παιδείας",
  legalName: "Περί Παιδείας, Φροντιστήριο Μέσης Εκπαίδευσης",

  /** PLACEHOLDER */
  phone: {
    display: "2810 000 000",
    href: "tel:+302810000000",
  },

  /** PLACEHOLDER */
  email: "info@example.gr",

  address: {
    /** PLACEHOLDER */
    street: "Οδός και αριθμός",
    area: "Βενεράτο",
    city: "Ηράκλειο Κρήτης",
    /** PLACEHOLDER */
    postalCode: "70011",
  },

  /** PLACEHOLDER, centre of Venerato rather than the actual building */
  coordinates: {
    lat: 35.2317,
    lng: 25.0225,
  },

  social: {
    facebook: "https://www.facebook.com/peri.paideias.venerato/",
    instagram: "https://www.instagram.com/frontistirio_peripaideias/",
  },
} as const;

/** Route slugs, shared by the navbar, the footer and the sitemap. */
export const ROUTES = {
  home: "/",
  about: "/to-frontistirio",
  courses: "/tmimata",
  teachers: "/kathigites",
  results: "/epitychies",
  contact: "/epikoinonia",
} as const;

export const NAV_LINKS = [
  { key: "about", href: ROUTES.about },
  { key: "courses", href: ROUTES.courses },
  { key: "teachers", href: ROUTES.teachers },
  { key: "results", href: ROUTES.results },
  { key: "contact", href: ROUTES.contact },
] as const;
