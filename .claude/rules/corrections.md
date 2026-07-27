# Corrections & Non-Negotiables

<!-- No `paths` frontmatter: this file loads every session. It is the incident log.
     Append the abstracted rule after ANY correction from the user. Keep it lean;
     anything path-specific belongs in a scoped rule file next to this one. -->

Rules learned from actual corrections. These are binding.

## Always

- **pnpm only**, never npm or yarn. This project uses PNPM workspaces.
- **Latest stable package versions.** When adding a dependency, install the current stable release. Never pin an outdated version without an explicit, stated reason.
- **Error-checking protocol.** After finishing work on any file: (1) `pnpm tsc --noEmit`, (2) `pnpm lint`, (3) fix ALL errors before moving on. Never grep-filter the output, because pre-existing errors must stay visible so new ones aren't masked.
- **Screenshot verification.** After each meaningful UI change, screenshot and visually inspect it. Do not batch every change and check once at the end.
- **No em dashes anywhere.** See the Writing Style section of CLAUDE.md. This covers UI copy, translations, code comments, commit messages, docs, and chat responses.
- **Corrections go in THIS file**, not the auto-memory system. After any correction from the user, add the abstracted rule here (or to the scoped rule file it belongs to) immediately.
- **Code-review mindset.** Question whether the implementation is actually correct, push back on wrong requirements, prefer native or library solutions over reinventing, and check current best practices (context7, web) rather than trusting recall.

## Known traps

- **A wrong canonical origin is permanent damage.** Never paste a `*.vercel.app` URL as the site base to unblock a build. Full rule: `.claude/rules/deployment-urls.md`.
- **`tsc` + `lint` passing does not mean it works.** next-intl message caching, Prisma client staleness, and env-var inlining all survive a green typecheck. Drive the feature in the running app.
- **Restart the dev server** after changing `messages/*.json`, the Prisma schema, or any `NEXT_PUBLIC_*` variable. A running server holds stale caches and will lie to you.
- **Never run a second `pnpm dev` while one is already up.** Next falls back to port 3001, both instances write the same `.next` directory, and the manifests corrupt: every route then 500s with `SyntaxError: Unexpected non-whitespace character after JSON`. Recovery is kill every `next dev` process, `rm -rf .next`, start exactly one. Before starting one, check: `netstat -ano | grep LISTENING | grep :300`.
- **Verify what the browser actually got, not what the file says.** A screenshot showing old colours usually means stale served CSS, not a wrong value. Fetch the page, pull the `<link rel=stylesheet>` href, and grep the served CSS for the variable before touching the source again.
- **`next/image` caches by URL path.** After regenerating an image file in place, the optimizer keeps serving the old bytes even after `rm -rf .next/cache/images`. Rename the file instead.
- **Fonts need `subsets: ["latin", "greek"]`.** The starter shipped Roboto with `latin` only, so every Greek glyph silently fell back to a system font.
