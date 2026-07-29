/**
 * Generates the eraser-smear overlay used by `.board-texture::after`.
 *
 *   node scripts/generate-eraser-smear.mjs
 *
 * A wiped blackboard is not an even wash. It is a set of shallow arcs left by a
 * hand sweeping a sponge, brighter where the chalk piled up at the edge of each
 * stroke and fading in the middle. Radial gradients cannot do that, so the arcs
 * are drawn properly and blurred in three passes: broad sweeps, medium streaks,
 * and thin bright edges.
 *
 * Every stroke is drawn nine times, offset by the canvas size in each direction,
 * so the tile repeats without a seam.
 *
 * Output is white with an alpha channel, meant to be painted straight over the
 * slate at full strength. The final intensity is baked into these alpha values
 * rather than set with a CSS opacity, because  overrides the
 * same pseudo-element and the two would drift apart. Deterministic: the seeded generator gives the same texture every run.
 */
import sharp from "sharp";

const WIDTH = 1400;
const HEIGHT = 900;
/**
 * Blur does not wrap around the edge of a canvas, so a stroke near the border
 * gets blurred against nothing and leaves a visible seam where the tile repeats.
 * Every layer is rendered on a padded canvas and cropped back afterwards, by
 * which point the padding holds the wrapped copies and the edges match.
 */
const PAD = 180;
const OUT_FILE = "public/images/texture/eraser-smear.png";

/** mulberry32, so the texture is reproducible across runs and machines. */
const createRandom = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const between = (random, min, max) => min + random() * (max - min);

/** One shallow sweep, repeated across the tile edges so nothing seams. */
const sweepPaths = ({ random, length, bow }) => {
  const startX = between(random, -0.2, 1) * WIDTH;
  const startY = between(random, -0.05, 1.05) * HEIGHT;
  const endX = startX + length;
  const endY = startY + between(random, -0.35, 0.35) * bow;
  const controlX = startX + length * 0.5;
  const controlY = startY - bow;

  const paths = [];

  for (const offsetX of [-WIDTH, 0, WIDTH]) {
    for (const offsetY of [-HEIGHT, 0, HEIGHT]) {
      const shiftX = offsetX + PAD;
      const shiftY = offsetY + PAD;
      paths.push(
        `M${(startX + shiftX).toFixed(1)} ${(startY + shiftY).toFixed(1)} ` +
          `Q${(controlX + shiftX).toFixed(1)} ${(controlY + shiftY).toFixed(1)} ` +
          `${(endX + shiftX).toFixed(1)} ${(endY + shiftY).toFixed(1)}`,
      );
    }
  }

  return paths;
};

const renderLayer = async ({ seed, count, width, opacity, length, bow, blur }) => {
  const random = createRandom(seed);
  const strokes = [];

  for (let index = 0; index < count; index++) {
    const strokeWidth = between(random, width[0], width[1]);
    const strokeOpacity = between(random, opacity[0], opacity[1]);
    const paths = sweepPaths({
      random,
      length: between(random, length[0], length[1]),
      bow: between(random, bow[0], bow[1]),
    });

    for (const path of paths) {
      strokes.push(
        `<path d="${path}" stroke="#fff" stroke-opacity="${strokeOpacity.toFixed(3)}" ` +
          `stroke-width="${strokeWidth.toFixed(1)}" stroke-linecap="round" fill="none"/>`,
      );
    }
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH + PAD * 2}" height="${HEIGHT + PAD * 2}">` +
    `${strokes.join("")}</svg>`;

  return sharp(Buffer.from(svg))
    .blur(blur)
    .extract({ left: PAD, top: PAD, width: WIDTH, height: HEIGHT })
    .png()
    .toBuffer();
};

const run = async () => {
  const layers = await Promise.all([
    // Broad sweeps: the shape of the wipe.
    renderLayer({
      seed: 7,
      count: 26,
      width: [90, 190],
      opacity: [0.012, 0.028],
      length: [520, 1250],
      bow: [40, 190],
      blur: 34,
    }),
    // Medium streaks inside the sweeps.
    renderLayer({
      seed: 21,
      count: 34,
      width: [26, 70],
      opacity: [0.012, 0.03],
      length: [300, 820],
      bow: [20, 130],
      blur: 13,
    }),
    // The bright edge the sponge leaves as it lifts.
    renderLayer({
      seed: 53,
      count: 22,
      width: [4, 13],
      opacity: [0.017, 0.041],
      length: [180, 620],
      bow: [10, 90],
      blur: 3.5,
    }),
  ]);

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } },
  })
    .composite(layers.map((input) => ({ input, blend: "over" })))
    .png({ compressionLevel: 9, palette: false })
    .toFile(OUT_FILE);

  const meta = await sharp(OUT_FILE).metadata();
  const { size } = await import("node:fs").then((fs) => fs.promises.stat(OUT_FILE));
  console.log(`Wrote ${OUT_FILE} ${meta.width}x${meta.height}, ${Math.round(size / 1024)}kB`);
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
