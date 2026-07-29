/**
 * Captures the social share image: a real 1920x1080 screenshot of the landing
 * page, written to `app/[locale]/opengraph-image.jpg`.
 *
 * JPEG, not PNG: the hero is a photograph, and PNG lands the same frame at
 * nearly 2 MB against roughly a tenth of that for a quality no scraper can
 * tell apart. Slow share cards get dropped by the scrapers that fetch them.
 *
 * Next's file convention picks that path up automatically and emits the
 * og:image and twitter:image tags with the right dimensions, so nothing has to
 * be wired by hand. Regenerate it whenever the hero changes, otherwise the
 * share card keeps advertising an old design.
 *
 * Needs the dev server up. Run: node scripts/generate-og.mjs [url]
 */
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import sharp from "sharp";

const url = process.argv[2] || "http://localhost:3000/el";
const OUTPUT = path.join("app", "[locale]", "opengraph-image.jpg");

const run = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  /* The dev-server overlay renders into <nextjs-portal> and would otherwise sit
     in the corner of the share card forever. */
  await page.addStyleTag({ content: "nextjs-portal{display:none !important}" });
  /* The hero entrance is a one-shot animation, so let it finish or the card
     ships with the headline still half faded in. */
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const raw = await page.screenshot({ type: "png" });
  await browser.close();

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  await sharp(raw)
    .resize(1920, 1080, { fit: "cover" })
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(OUTPUT);

  const { size } = fs.statSync(OUTPUT);
  console.log(`wrote ${OUTPUT} 1920x1080 (${(size / 1024).toFixed(0)} KB) from ${url}`);
};

run();
