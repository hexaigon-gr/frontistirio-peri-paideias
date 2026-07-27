# Ιστοσελίδα Φροντιστηρίου "Περί Παιδείας" (Βενεράτο, Ηράκλειο Κρήτης)

## Αποφάσεις

- Τύπος: φροντιστήριο Μέσης Εκπαίδευσης
- Δομή: πολλαπλές σελίδες (όχι one-page)
- Γλώσσες: `el` (default) + `en`
- Κύριο CTA: τηλεφωνική κλήση
- Scope φάσης 1: marketing site μόνο, χωρίς βάση και χωρίς φόρμες
- Αισθητική: ανοιχτό κρεμ (εκδοχή Β), με παλέτα από το λογότυπο
  (ανθρακί `#292826`, κίτρινο `#f8b805`, χαρτί `#faf8f3`, ροζ κιμωλία ως τρίτο χρώμα)
- Θέμα κλειδωμένο σε light, ο διακόπτης dark αφαιρέθηκε από το site

## Ανοιχτά (blockers περιεχομένου)

- [ ] Ακριβή στοιχεία επικοινωνίας: διεύθυνση, ΤΚ, τηλέφωνο, email, ωράριο
- [ ] Λογότυπο σε png ή svg
- [ ] Πραγματικές φωτογραφίες χώρου και καθηγητών
- [ ] Τάξεις, μαθήματα, κατευθύνσεις
- [ ] Καθηγητές: ονόματα και ειδικότητες
- [ ] Επιτυχίες: ποσοστά, σχολές, έτος
- [ ] Domain

Σημείωση: το `peripaideias.gr` ανήκει σε ομώνυμο φροντιστήριο στη Νίκαια Αττικής.
Χρειάζεται domain και SEO με γεωγραφικό προσδιορισμό (Βενεράτο, Ηράκλειο, Μαλεβίζι).

## Βήματα

### 1. Θεμέλια

- [x] Λογότυπο από το Facebook, καθαρισμένο σε δύο εκδοχές με διαφάνεια
- [x] `lib/general/constants.ts` με όλα τα business στοιχεία σε ένα exported object
- [x] Brand παλέτα ως CSS variables στο `app/[locale]/globals.css`
- [x] Γραμματοσειρές μέσω `next/font`, με ελληνικό subset (έλειπε από το starter)
- [x] `messages/el.json` και `messages/en.json` με namespace ανά section
- [x] Default locale σε `el`
- [x] Route group `(site)` ώστε το admin να μην κληρονομεί navbar και footer
- [ ] Καθάρισμα του starter: `components/examples/`, Todo server actions, admin mock σελίδες

### 2. Απόφαση αισθητικής

- [x] Hero variant A και variant B, screenshot και των δύο
- [x] Επιλογή εκδοχής Β, διαγραφή της Α

### 3. Κοινά components

- [x] Navbar: fixed, διάφανο πάνω από το hero, συμπαγές στο scroll, με κουμπί κλήσης
- [x] Mobile menu: slide-in panel από δεξιά, με scroll lock
- [x] Footer με στοιχεία επικοινωνίας και socials (`SocialIcon` με inline brand SVG,
      επειδή το lucide v1 δεν έχει πια εικονίδια brands)
- [ ] Χάρτης στη σελίδα επικοινωνίας (`ExpandMap`), μόλις υπάρχει η πραγματική διεύθυνση
- [ ] Sticky call bar στο κινητό

### 4. Σελίδες

- [x] `/` Αρχική: hero (τα υπόλοιπα sections μένουν)
- [ ] Αρχική: γιατί εμείς, τμήματα, επιτυχίες, κριτικές, CTA
- [ ] `/to-frontistirio` Το φροντιστήριο: ιστορία, φιλοσοφία, χώροι
- [ ] `/tmimata` Τμήματα: Γυμνάσιο, Λύκειο, κατευθύνσεις, μαθήματα
- [ ] `/kathigites` Καθηγητές
- [ ] `/epitychies` Επιτυχίες
- [ ] `/epikoinonia` Επικοινωνία: χάρτης, ωράριο, τηλέφωνα

### 5. SEO και τεχνικά

- [ ] Metadata ανά σελίδα, Open Graph, JSON-LD `EducationalOrganization` και `LocalBusiness`
- [ ] `sitemap.ts` και `robots.ts` να δουλεύουν με τις πραγματικές διαδρομές
- [ ] `NEXT_PUBLIC_SITE_URL` μένει unset μέχρι να υπάρχει domain
- [ ] Εικόνες μέσω `next/image`, WebP, σωστά μεγέθη

### 6. Ποιότητα

- [ ] `pnpm tsc --noEmit` και `pnpm lint` καθαρά
- [ ] Screenshot verification ανά section, desktop και mobile
- [ ] Κλειδιά i18n και στα δύο αρχεία, restart dev server

## Review

(συμπληρώνεται στο τέλος)
