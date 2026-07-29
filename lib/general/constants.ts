/**
 * Every business detail the site renders comes from here. Never scatter a phone
 * number, address or social URL across components.
 *
 * The staff, the mobile numbers and the slogan are taken from the client's own
 * roll-up banners (`photos/image.png`). Values marked PLACEHOLDER are still
 * invented and MUST be replaced before the site goes live.
 */
export const BUSINESS = {
  name: "Περί Παιδείας",
  legalName: "Περί Παιδείας, Φροντιστήριο Μέσης Εκπαίδευσης",
  slogan: "Μαζί σχεδιάζουμε το Μέλλον σας!",

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

/**
 * Διεύθυνση σπουδών. The first entry is the number the main call button dials.
 * Names stay as written, they are proper nouns. The role is a translation key,
 * so it reads "Philologist" on the English site instead of "Φιλόλογος".
 */
export const STAFF = [
  {
    key: "manthaiaki",
    name: "Μανθαιάκη Μαρία",
    roleKey: "philologist",
    phone: { display: "698 163 9440", href: "tel:+306981639440" },
  },
  {
    key: "karatzis",
    name: "Καρατζής Βασίλης",
    roleKey: "mathematician",
    phone: { display: "697 923 6257", href: "tel:+306979236257" },
  },
] as const;

export const PRIMARY_PHONE = STAFF[0].phone;

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

/** Anchor for the contact block in the footer, used by the hero's second CTA. */
export const CONTACT_ANCHOR = "epikoinonia";
