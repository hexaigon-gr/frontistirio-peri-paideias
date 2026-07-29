/**
 * The site's canonical public origin, without a trailing slash, or `null` when
 * no real domain exists yet.
 *
 * NEVER hardcode a `*.vercel.app` URL as the canonical base: not here, not in
 * `NEXT_PUBLIC_SITE_URL`, not "just for now". A wrong canonical origin leaks
 * into sitemap.xml, robots.txt, canonical links and OG tags, search engines
 * index the preview host, and the real domain later competes with it.
 *
 * Before the domain exists, leave `NEXT_PUBLIC_SITE_URL` unset. `SITE_URL` is
 * then `null`, which is not a "broken" state to paper over: it is the signal
 * that the site has no canonical identity yet, and every consumer must degrade
 * to something that CANNOT be indexed under the wrong origin.
 *
 *   `app/robots.ts`      -> disallow everything, advertise no sitemap
 *   `app/sitemap.ts`     -> empty
 *   `app/[locale]/layout.tsx` -> `robots: { index: false, follow: false }`
 *   `components/seo/school-jsonld.tsx` -> render nothing
 *
 * Setting the variable to the real domain flips all of that on at once.
 *
 * Dev (`pnpm dev`) falls back to http://localhost:3000 so local work is unblocked.
 *
 * See `.claude/rules/deployment-urls.md`.
 */

const DEV_SITE_URL = "http://localhost:3000";

const UNSET_WARNING = [
  "NEXT_PUBLIC_SITE_URL is not set, so this build has no canonical origin.",
  "The site will deploy but is marked noindex, robots.txt disallows everything,",
  "sitemap.xml is empty and structured data is omitted, so nothing can be indexed",
  "under a wrong origin. Set it to the site's exact public origin",
  "(e.g. https://example.com) once the domain exists, then REDEPLOY.",
  "Do NOT paste the *.vercel.app deployment URL.",
].join(" ");

const resolveSiteUrl = (): string | null => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) {
    if (process.env.NODE_ENV !== "production") return DEV_SITE_URL;

    console.warn(`\n[site-url] ${UNSET_WARNING}\n`);
    return null;
  }

  let parsed: URL;

  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is not a valid absolute URL: "${raw}". Expected an origin like https://example.com`,
    );
  }

  /* Still a hard failure. An unset variable is an honest "not yet"; a deployment
     URL pasted in is an active mistake that would ship a wrong canonical origin. */
  if (parsed.hostname.endsWith(".vercel.app"))
    throw new Error(
      `NEXT_PUBLIC_SITE_URL points at a Vercel deployment URL (${parsed.hostname}). Use the real domain, or leave the variable unset until it exists.`,
    );

  return parsed.origin;
};

export const SITE_URL = resolveSiteUrl();

/**
 * The origin used ONLY to turn relative asset paths into absolute ones, which
 * in practice means `metadataBase` and therefore the og:image and
 * twitter:image URLs.
 *
 * THIS IS NOT THE CANONICAL ORIGIN AND MUST NEVER BE USED AS ONE. Keep it out
 * of `robots.ts`, `sitemap.ts`, `alternates.canonical`, hreflang and JSON-LD:
 * those stay on `SITE_URL` and stay absent until the real domain exists.
 *
 * Why it may fall back to the Vercel host when `SITE_URL` is null, when the
 * rest of this file exists to stop exactly that: a share image has to be
 * fetchable or it is not a share image. With no `metadataBase`, Next resolves
 * og:image against `http://localhost:3000`, which every scraper fails to fetch,
 * so the card silently renders with no image at all.
 *
 * The rule's invariant is "nothing is ever indexed under an origin that is not
 * the real one". That still holds here: with no canonical origin every page
 * ships `noindex, nofollow`, robots.txt disallows everything, the sitemap is
 * empty and no canonical or hreflang tag is emitted. An image URL on a page no
 * crawler may index cannot be indexed either. And if someone shares the Vercel
 * link, the Vercel host is genuinely the right origin for that image.
 *
 * `VERCEL_PROJECT_PRODUCTION_URL` is preferred over `VERCEL_URL` because the
 * latter changes on every single deployment, which would break the preview of
 * any link shared more than a few minutes ago.
 */
const resolveAssetOrigin = (): string | null => {
  if (SITE_URL) return SITE_URL;

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();

  if (vercelHost) return `https://${vercelHost.replace(/^https?:\/\//, "")}`;

  if (process.env.NODE_ENV !== "production") return DEV_SITE_URL;

  return null;
};

export const ASSET_ORIGIN = resolveAssetOrigin();
