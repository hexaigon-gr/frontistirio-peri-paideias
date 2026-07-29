/**
 * Builds `app/favicon.ico` from the wordmark, replacing the Next.js starter default.
 *
 * The wordmark is a wide lockup on transparency, and a 1459x616 strip is
 * illegible once it is squeezed into 16 square pixels. So only the pi is used:
 * it is the one glyph in the logo that still reads as this school at tab size.
 * It is trimmed to its true bounds, sat on the board colour with breathing room,
 * and written at every size a browser or a pinned tile might ask for.
 *
 * sharp cannot encode ICO, so the container is assembled here. Every modern
 * target accepts PNG-compressed entries, which is what an ICO has allowed since
 * Vista, and it keeps the file far smaller than raw bitmaps would.
 *
 * Run: node scripts/generate-favicon.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const SOURCE = "public/images/logo/wordmark.png";
const OUTPUT = "app/favicon.ico";

/** `--board-deep` from globals.css, oklch(0.185 0.005 85), as sRGB. */
const BOARD_DEEP = { r: 28, g: 26, b: 22 };

/** The pi sits in the left quarter of the lockup. */
const GLYPH_REGION = { left: 0, top: 0, width: 545, height: 616 };

/** Fraction of the canvas the glyph fills, leaving an even margin around it. */
const GLYPH_SCALE = 0.72;

const SIZES = [16, 32, 48, 64, 128, 256];

const buildIco = (pngs) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  const entries = [];
  let offset = 6 + pngs.length * 16;

  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    // 0 means 256 in the ICO directory.
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
};

const run = async () => {
  const cropped = await sharp(SOURCE).extract(GLYPH_REGION).png().toBuffer();
  const glyph = await sharp(cropped).trim().png().toBuffer();
  const { width, height } = await sharp(glyph).metadata();

  const pngs = [];

  for (const size of SIZES) {
    const box = Math.round(size * GLYPH_SCALE);
    const scale = Math.min(box / width, box / height);

    const mark = await sharp(glyph)
      .resize(Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)), {
        fit: "inside",
      })
      .toBuffer();

    const data = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { ...BOARD_DEEP, alpha: 1 },
      },
    })
      .composite([{ input: mark, gravity: "center" }])
      .png({ compressionLevel: 9 })
      .toBuffer();

    pngs.push({ size, data });
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, buildIco(pngs));

  const total = fs.statSync(OUTPUT).size;
  console.log(`wrote ${OUTPUT} (${SIZES.join(", ")}) ${(total / 1024).toFixed(1)} KB`);
};

run();
