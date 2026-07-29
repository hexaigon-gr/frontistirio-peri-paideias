# Deployment URLs & Public Origin

<!-- No `paths` frontmatter on purpose: this rule loads every session. The mistake it
     prevents happens in conversation ("let's deploy"), not while reading a file. -->

## NEVER hardcode a `*.vercel.app` URL as the canonical base

**Before the domain exists: leave `NEXT_PUBLIC_SITE_URL` unset. Do not paste the Vercel URL "for now".**

A `*.vercel.app` origin written into the canonical base leaks into `sitemap.xml`, `robots.txt`, `<link rel="canonical">`, OG/Twitter image URLs, and any absolute link built from it. Search engines index the preview host, the real domain later competes with it, and the damage outlives the "temporary" commit.

This is enforced in code, not just documented. `lib/general/site-url.ts` exports `SITE_URL` as `string | null`, and **throws** if the value's hostname ends in `.vercel.app`.

### The invariant is "never ship a wrong origin", not "never ship"

The rule used to make an unset variable throw during `next build`. That was the wrong lever: it blocked deployment entirely, which pressures whoever is deploying into pasting the Vercel URL to get unstuck, causing the exact damage the rule exists to prevent.

The invariant to protect is that **no content is ever indexed under an origin that is not the real one**. `SITE_URL === null` is a legitimate state (no canonical identity yet), and every consumer must degrade to something that cannot be indexed:

| Surface | With `SITE_URL === null` |
| --- | --- |
| `app/robots.ts` | `User-Agent: * / Disallow: /`, no `Sitemap:` line |
| `app/sitemap.ts` | empty `<urlset>` |
| `app/[locale]/layout.tsx` | no `metadataBase`, `robots: { index: false, follow: false }` |
| `components/seo/school-jsonld.tsx` | renders `null` |

Setting the variable to the real domain flips all four on at once. The build log prints a loud `[site-url]` warning whenever it runs in this mode, so the state is never silent.

**Any NEW absolute-URL surface must handle `SITE_URL === null` the same way.** TypeScript forces the check; do not defeat it with `!` or `?? "https://..."`.

### Before the domain is bought

- Leave `NEXT_PUBLIC_SITE_URL` **unset**, in `.env.local`, in `.env.template`, and in the Vercel project.
- `pnpm dev` falls back to `http://localhost:3000`. `pnpm build` succeeds and deploys, fully unindexable, with the `[site-url]` warning in the log. That is the design, not a bug to work around.
- Do not "fix" the warning by inventing a value: no `*.vercel.app`, no `http://localhost:3000` committed as production, no `||` fallback added back into `site-url.ts`, `robots.ts`, `sitemap.ts`, or `metadataBase`. A pasted `*.vercel.app` value still fails the build, on purpose.
- **Do not submit the deployment to Google Search Console** while it has no canonical origin.

### After the domain is bought

1. Set `NEXT_PUBLIC_SITE_URL` in the Vercel project env vars (Production, plus Preview/Development if those need absolute URLs) to the **exact public origin**: scheme + host, no trailing slash, no path. Match the redirect target, so `https://example.com` rather than `https://www.example.com` if www redirects to apex.
2. Uncomment and set the same value in `.env.template`, so the next clone starts correct.
3. Redeploy. Env var changes do not apply to an existing deployment.
4. Add the production callback URL to Google OAuth (`https://your-domain.com/api/auth/callback/google`) and set `NEXTAUTH_URL` to the same origin.
5. **Verify the noindex actually lifted**, because forgetting step 1 leaves the site invisible forever and nothing else will tell you:

   ```bash
   curl -s https://your-domain.com/robots.txt        # expect Allow: / plus the Sitemap: line
   curl -s https://your-domain.com/el | grep robots  # expect NO noindex meta tag
   ```

### Reading the origin in code

- Always `import { SITE_URL } from "@/lib/general/site-url"`. Never read `process.env.NEXT_PUBLIC_SITE_URL` at a call site, and never re-derive an origin from `VERCEL_URL`, `headers().get("host")`, or a hardcoded string.
- `SITE_URL` is `string | null`. Guard it (`if (!SITE_URL) return ...`) and degrade to something unindexable. Never `SITE_URL!` and never `SITE_URL ?? "..."`.
- When non-null it is already normalized (origin only, no trailing slash), so build paths as `${SITE_URL}/${locale}/...`.
- Any new absolute-URL surface (feed, OG image route, email template, webhook callback, share link) goes through `SITE_URL`.

### Legacy

`NEXT_PUBLIC_BASE_URL` was the old name and had a silent `|| "http://localhost:3000"` fallback, which is exactly the failure this rule prevents. It is gone. Do not reintroduce it under either name.
