/**
 * Re-encodes the two board textures that CSS paints as background images.
 *
 *   node scripts/prepare-textures.mjs
 *
 * These two are the only images on the site that never pass through
 * `next/image`, because a CSS `background-image` cannot. So nothing resized
 * them, nothing negotiated a modern format, and they shipped as a 1600px JPEG
 * and a 1400px RGBA PNG on every single page: 184 KB, and measurably the LCP
 * resource on five of the six pages.
 *
 * The smear is the interesting one. It is roughly 93% transparent soft
 * gradients, which AVIF encodes almost for free while WebP's alpha handling
 * needs twenty times the bytes for worse quality. Both formats are written
 * anyway, because the WebP is the fallback for anything that cannot take AVIF.
 *
 * Sizes are the sizes CSS actually paints (`background-size`), not the source
 * dimensions. Uniform scaling keeps a seamless tile seamless, since both edges
 * move together.
 */
import { stat } from "node:fs/promises";

import sharp from "sharp";

const DIR = "public/images/texture";

const SOURCES = [
  {
    /* Painted at `background-size: 800px auto`, so 1600px was exactly double
       what any layout asked for. It sits under `mix-blend-mode: multiply` at
       0.55 opacity, so it is grain, not detail: quality can go low. */
    file: `${DIR}/blackboard.jpg`,
    slug: "blackboard",
    width: 800,
    avif: { quality: 50 },
    webp: { quality: 72 },
  },
  {
    /* Painted at its native 1400px, so no resize. Alpha must survive. */
    file: `${DIR}/eraser-smear.png`,
    slug: "eraser-smear",
    width: null,
    avif: { quality: 55 },
    webp: { quality: 80, alphaQuality: 90 },
  },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const run = async () => {
  for (const { file, slug, width, avif, webp } of SOURCES) {
    const before = (await stat(file)).size;
    const meta = await sharp(file).metadata();

    for (const [ext, options] of [
      ["avif", avif],
      ["webp", webp],
    ]) {
      const target = `${DIR}/${slug}.${ext}`;
      const pipeline = sharp(file);
      if (width) pipeline.resize({ width });

      await pipeline[ext](options).toFile(target);

      const after = (await stat(target)).size;
      const out = await sharp(target).metadata();
      console.log(
        `${slug}.${ext.padEnd(4)} ${String(out.width).padStart(4)}x${out.height}  ${kb(after).padStart(9)}  (source ${meta.width}x${meta.height} ${kb(before)})`,
      );
    }
  }

  console.log(
    "\nThe .jpg and .png sources stay on disk as the masters. CSS no longer references them.",
  );
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
