import { SITE_URL } from "@/lib/general/site-url";

/**
 * Shared plumbing for every JSON-LD block on the site.
 */

/**
 * Serialises structured data for `dangerouslySetInnerHTML`.
 *
 * The escape is not decoration. An HTML parser ends a `<script>` element at the
 * first `</` sequence regardless of JSON quoting, so a single `<` arriving in
 * any business string, a name, a bio, anything later loaded from the database,
 * would truncate the element and silently kill ALL structured data on the page.
 * Nothing warns you: the page renders, the tag is just gone.
 */
export const jsonLdScriptProps = (data: unknown) => ({
  type: "application/ld+json",
  dangerouslySetInnerHTML: {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  },
});

/**
 * The stable identifier for one member of staff.
 *
 * Deliberately locale-free. An `@id` carrying `/el/` or `/en/` would describe
 * the same teacher as two different people and split every credential between
 * them.
 */
export const personId = (key: string) => `${SITE_URL}/#person-${key}`;
