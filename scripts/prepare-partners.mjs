import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

/**
 * Partner marks (ΟΕΦΕ, Οδηγός Σταδιοδρομίας) for the tools the school gives its
 * students.
 *
 * These are the only saturated, non-chalk colours on the site, and that is
 * deliberate: a third party's logo may not be recoloured to fit our palette,
 * because a recoloured mark misrepresents the organisation. Instead each one is
 * baked onto a white plate, so it reads as a real badge applied to the board
 * rather than as a colour that leaked into the brand.
 *
 * The sources arrive as JPEGs with uneven white margins, so they are trimmed to
 * the ink first and given identical padding. Without that, one logo floats and
 * the other touches its edges even at the same box size.
 *
 * Run with: node scripts/prepare-partners.mjs
 */

const SOURCES = [
  { slug: "oefe", file: "ΟΕΦΕ.jpg" },
  { slug: "odigos", file: "odigos_stadiodromias.jpg" },
];

const OUT_DIR = path.join(process.cwd(), "public", "images", "partners");
/* Twice the 64px the plate is drawn at, so the mark stays crisp on a 2x screen. */
const CONTENT_HEIGHT = 104;
const PADDING = 12;

const prepare = async ({ slug, file }) => {
  const trimmed = await sharp(path.join(process.cwd(), "photos", file))
    .trim({ threshold: 12 })
    .toBuffer();

  const image = sharp(trimmed)
    .resize({ height: CONTENT_HEIGHT, fit: "contain", background: "#ffffff" })
    .flatten({ background: "#ffffff" })
    .extend({
      top: PADDING,
      bottom: PADDING,
      left: PADDING,
      right: PADDING,
      background: "#ffffff",
    });

  const { data, info } = await image.webp({ quality: 92 }).toBuffer({ resolveWithObject: true });

  await writeFile(path.join(OUT_DIR, `${slug}.webp`), data);

  return { slug, width: info.width, height: info.height };
};

await mkdir(OUT_DIR, { recursive: true });

const results = [];
for (const source of SOURCES) results.push(await prepare(source));

for (const { slug, width, height } of results) {
  console.log(`${slug}.webp  ${width}x${height}`);
}
