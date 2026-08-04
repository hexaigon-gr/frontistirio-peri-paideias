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

  /** Landline, read off the business card in `photos/`. */
  phone: { display: "2815 306051", href: "tel:+302815306051" },

  /**
   * PLACEHOLDER. The card shows an address that reads pp.peripaideias@gmail.com
   * but the photo is too blurry to publish it. Confirm before rendering it.
   */
  email: "",

  address: {
    street: "Επαρχιακή Οδός Ηρακλείου - Πενταμοδίου 12",
    area: "Νέο Βενεράτο",
    /** Venerato sits in Δημοτική Ενότητα Παλιανής, Δήμος Ηρακλείου. Not Malevizi. */
    municipality: "Δήμος Ηρακλείου",
    city: "Ηράκλειο Κρήτης",
    postalCode: "70011",
  },

  /**
   * The exact string to hand to a maps service, in the Latin form Google itself
   * returns for this address. Every "directions" link searches by address rather
   * than by coordinates: neither OpenStreetMap nor Photon knows this provincial
   * road or the Neo Venerato settlement, while Google resolves the address to the
   * door. Letting the maps app do the geocoding beats shipping a guessed point.
   */
  mapsQuery: "Epar.Od. Irakliou-Pentamodiou 12, Neo Venerato 700 11, Heraklion, Greece",

  /** What the static map frames. The image covers the wider Venerato area. */
  mapLabel: "Βενεράτο",

  /**
   * Centre of the Venerato area, from OpenStreetMap. Used only to frame the static
   * map image, never for navigation. Once the exact point is known, put it here and
   * run `node scripts/generate-map.mjs <lat> <lon> 17`.
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

/**
 * Hours per class, as the client supplied them.
 *
 * Hours are weekly except where `unit` says otherwise: primary school is quoted
 * per day, so the row has to carry its own unit rather than inherit the section's.
 *
 * `noteKey` renders under the subject instead of an asterisk and a footnote. A
 * marker forces the reader to hunt for its meaning, and a dangling one that never
 * got a note is worse than no marker at all.
 *
 * Β΄ Λυκείου splits by orientation, so it carries `tracks` on top of the subjects
 * every student takes.
 *
 * MISSING: Γ΄ Λυκείου. The table the client sent stops at Β΄ and jumps to ΕΠΑΛ.
 */
export const WEEKLY_PROGRAMME = [
  {
    key: "primary",
    subjects: [{ key: "dailyStudy", hours: 2, unit: "day" }],
  },
  {
    key: "middleAll",
    subjects: [
      { key: "maths", hours: 2 },
      { key: "ancientGreekOriginal", hours: 2 },
      { key: "ancientGreekTranslation", hours: 1 },
      { key: "modernGreekMiddle", hours: 2 },
      { key: "physics", hours: 2 },
    ],
  },
  {
    key: "highA",
    subjects: [
      { key: "modernGreekHigh", hours: 2 },
      { key: "algebra", hours: 2 },
      { key: "geometry", hours: 1 },
      { key: "ancientGreek", hours: 2, noteKey: "humanitiesExtraHour" },
      { key: "physics", hours: 2 },
    ],
  },
  {
    key: "highB",
    subjects: [{ key: "modernGreekHigh", hours: 3 }],
    tracks: [
      {
        key: "humanities",
        subjects: [
          { key: "ancientGreek", hours: 3 },
          { key: "latin", hours: 2 },
          { key: "history", hours: 1 },
        ],
      },
      {
        key: "sciences",
        subjects: [
          { key: "maths", hours: 5 },
          { key: "economics", hours: 1, noteKey: "startsJanuary" },
          { key: "informatics", hours: 1, noteKey: "startsJanuary" },
        ],
      },
    ],
  },
  {
    key: "epal",
    subjects: [
      { key: "maths", hours: 2 },
      { key: "modernGreekEpal", hours: 2 },
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

/**
 * The gallery, in display order. `slug` keys into GALLERY_IMAGES in
 * `lib/general/gallery-blur.ts`, which is generated by
 * `scripts/prepare-gallery.mjs` and holds the sizes and blur placeholders.
 * Captions live in the message files, one key per slug.
 */
export const GALLERY = [
  "classroom",
  "waiting-area",
  "study-room",
  "office",
  "reception-desk",
  "reception-corner",
  "cards",
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

/** Who built the site. Kept out of the translations so the name is written once. */
export const CREDIT = {
  name: "Hexaigon",
  href: "https://hexaigon.gr",
} as const;
