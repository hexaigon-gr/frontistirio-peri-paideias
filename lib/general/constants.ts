/**
 * Every business detail the site renders comes from here. Never scatter a phone
 * number, address or social URL across components.
 *
 * Sources: the client's roll-up banners (`photos/image.png`) for the phone
 * numbers and the slogan, and `ΙΣΤΟΣΕΛΙΔΑ.pdf` for the staff, the levels, the
 * opening hours and the external tools. Values marked PLACEHOLDER are still
 * invented and MUST be replaced before the site goes live.
 */
export const BUSINESS = {
  name: "Περί Παιδείας",
  legalName: "Περί Παιδείας, Φροντιστήριο Μέσης Εκπαίδευσης",
  slogan: "Μαζί σχεδιάζουμε το Μέλλον σας!",

  /** PLACEHOLDER */
  email: "info@example.gr",

  address: {
    /** Empty until the client confirms it. The UI hides the line rather than inventing one. */
    street: "",
    area: "Βενεράτο",
    /** Venerato sits in Δημοτική Ενότητα Παλιανής, Δήμος Ηρακλείου. Not Malevizi. */
    municipality: "Δήμος Ηρακλείου",
    city: "Ηράκλειο Κρήτης",
    postalCode: "70011",
  },

  /**
   * Centre of Venerato, from OpenStreetMap. This is the village, not the door of
   * the building. Replace with the exact point once the address is confirmed, and
   * regenerate `public/images/map/venerato.jpg` at a closer zoom.
   */
  coordinates: {
    lat: 35.1981073,
    lng: 25.0386127,
  },

  /** Καθημερινά 14:00 έως 21:00, per the study programme page of the PDF. */
  hours: { opens: "14:00", closes: "21:00" },

  social: {
    facebook: "https://www.facebook.com/peri.paideias.venerato/",
    instagram: "https://www.instagram.com/frontistirio_peripaideias/",
  },
} as const;

/**
 * The teaching team. The first two founded the school, so they carry the phone
 * numbers printed on the banners. `roleKey` and `bioKey` are translation keys,
 * names are proper nouns and stay as written.
 */
export const STAFF = [
  {
    key: "karatzis",
    name: "Βασίλης Καράτζης",
    roleKey: "mathematician",
    isFounder: true,
    phone: { display: "697 923 6257", href: "tel:+306979236257" },
  },
  {
    key: "manthaiaki",
    name: "Μαρία Μανθαιάκη",
    roleKey: "philologist",
    isFounder: true,
    phone: { display: "698 163 9440", href: "tel:+306981639440" },
  },
  {
    key: "athanasaki",
    name: "Μαρία Αθανασάκη",
    roleKey: "philologist",
    isFounder: false,
    phone: null,
  },
  {
    key: "triamatakis",
    name: "Κώστας Τριαματάκης",
    roleKey: "mathematician",
    isFounder: false,
    phone: null,
  },
  {
    key: "kallergi",
    name: "Γιάννα Καλλέργη",
    roleKey: "informatics",
    isFounder: false,
    phone: null,
  },
] as const;

export const FOUNDERS = STAFF.filter((person) => person.isFounder);

/** The number the main call button dials. */
export const PRIMARY_PHONE = STAFF[1].phone;

/** Specialists the school works with, from the services page of the PDF. */
export const PARTNER_SPECIALISTS = ["psychologist", "speechTherapist", "specialEducator", "careerAdvisor"] as const;

/** How the teaching is organised. */
export const METHOD_ITEMS = [
  "smallGroups",
  "personalTracking",
  "parentContact",
  "readingRoom",
  "diagnosticTests",
  "revisions",
  "notes",
] as const;

/** Levels taught, from the study programme page. */
export const LEVELS = ["primary", "middle", "high"] as const;

/**
 * External tools the school gives its students. The two marked `featured` were
 * singled out in the brief for special mention.
 */
export const EXTERNAL_TOOLS = [
  {
    key: "oefePlatform",
    href: "https://oefe.cloud/el/static/home",
    featured: true,
  },
  {
    key: "careerGuide",
    href: "https://odigos.stadiodromia.gr/login.php",
    featured: true,
  },
  {
    key: "panhellenicTopics",
    href: "https://www.oefe.gr/el/normal/thematapanelliniwn.aspx",
    featured: false,
  },
  {
    key: "topicBank",
    href: "https://trapeza.iep.edu.gr/",
    featured: false,
  },
  {
    key: "oefeRevision",
    href: "https://epan.oefe.cloud/el/normal/EpanThemataArchive",
    featured: false,
  },
] as const;

/** Weekly hours per class. The Λύκειο tables are still coming from the client. */
export const WEEKLY_PROGRAMME = [
  {
    key: "middleAll",
    subjects: [
      { key: "modernGreek", hours: 2 },
      { key: "maths", hours: 2 },
      { key: "physics", hours: 1 },
    ],
  },
] as const;

/** Events and out-of-class activities, newest first. */
export const EVENTS = [
  { key: "anxietyTalk2026", year: "2026", kind: "event" },
  { key: "careerAdvisor2026", year: "2026", kind: "event" },
  { key: "excursion2026", year: "2026", kind: "activity" },
  { key: "sifmeni2025", year: "2025", kind: "event" },
  { key: "escapeRoom2025", year: "2025", kind: "activity" },
  { key: "sifmeni2024", year: "2024", kind: "event" },
  { key: "careerAdvisor2024", year: "2024", kind: "event" },
] as const;

/** Route slugs, shared by the navbar, the footer and the sitemap. */
export const ROUTES = {
  home: "/",
  about: "/poioi-eimaste",
  services: "/ypiresies",
  programme: "/programma-spoudon",
  activities: "/drastiriotites",
  contact: "/epikoinonia",
} as const;

export const NAV_LINKS = [
  { key: "about", href: ROUTES.about },
  { key: "services", href: ROUTES.services },
  { key: "programme", href: ROUTES.programme },
  { key: "activities", href: ROUTES.activities },
  { key: "contact", href: ROUTES.contact },
] as const;
