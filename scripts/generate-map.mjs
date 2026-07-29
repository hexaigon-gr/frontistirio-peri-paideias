/**
 * Generates the static map behind `components/sections/location-map.tsx`.
 *
 * Run it again whenever the coordinates in `lib/general/constants.ts` change:
 *
 *   node scripts/generate-map.mjs 35.1981073 25.0386127 15
 *
 * Once the exact street address is confirmed, raise the zoom to 17 so the pin
 * reads as a building rather than a village, and update PIN_POSITION in the
 * component with the percentages this script prints.
 *
 * Tiles come from CARTO's dark basemap, which is built on OpenStreetMap data.
 * Both must stay credited in the UI (see the `mapAttribution` message).
 */
import sharp from "sharp";

const [latArg, lonArg, zoomArg] = process.argv.slice(2);
const LAT = Number(latArg ?? 35.1981073);
const LON = Number(lonArg ?? 25.0386127);
const ZOOM = Number(zoomArg ?? 16);

const TILE = 256;
const RETINA = 2;
const OUT_WIDTH = 1800;
const OUT_HEIGHT = 1000;
const COLS = [-2, -1, 0, 1];
const ROWS = [-1, 0, 1];
const USER_AGENT = "peri-paideias-website/1.0 (static map for a single location)";
const OUT_FILE = "public/images/map/venerato.jpg";

const lonToX = (lon, zoom) => ((lon + 180) / 360) * 2 ** zoom;

const latToY = (lat, zoom) => {
  const radians = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2) * 2 ** zoom;
};

const fetchTile = async (zoom, x, y) => {
  // `dark_nolabels`, not `dark_all`: the baked-in map typography competes with the
  // chalk lettering and collides with the pin. The labels we actually need are
  // drawn in the component, in the site's own hand.
  const url = `https://a.basemaps.cartocdn.com/dark_nolabels/${zoom}/${x}/${y}@${RETINA}x.png`;
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });

  if (!response.ok) throw new Error(`Tile ${zoom}/${x}/${y} failed with ${response.status}`);

  return Buffer.from(await response.arrayBuffer());
};

const run = async () => {
  const exactX = lonToX(LON, ZOOM);
  const exactY = latToY(LAT, ZOOM);
  const originX = Math.floor(exactX) + COLS[0];
  const originY = Math.floor(exactY) + ROWS[0];

  const tiles = [];

  for (const row of ROWS) {
    for (const col of COLS) {
      const buffer = await fetchTile(ZOOM, Math.floor(exactX) + col, Math.floor(exactY) + row);
      tiles.push({
        input: buffer,
        left: (col - COLS[0]) * TILE * RETINA,
        top: (row - ROWS[0]) * TILE * RETINA,
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  const canvasWidth = COLS.length * TILE * RETINA;
  const canvasHeight = ROWS.length * TILE * RETINA;
  const stitched = await sharp({
    create: { width: canvasWidth, height: canvasHeight, channels: 3, background: "#000" },
  })
    .composite(tiles)
    .png()
    .toBuffer();

  const pointX = (exactX - originX) * TILE * RETINA;
  const pointY = (exactY - originY) * TILE * RETINA;
  const left = Math.max(0, Math.min(canvasWidth - OUT_WIDTH, Math.round(pointX - OUT_WIDTH / 2)));
  const top = Math.max(0, Math.min(canvasHeight - OUT_HEIGHT, Math.round(pointY - OUT_HEIGHT / 2)));

  await sharp(stitched)
    .extract({ left, top, width: OUT_WIDTH, height: OUT_HEIGHT })
    // Deep slate with bright roads, so the map reads as chalk lines on a board.
    // Two passes: the first crushes the background to black, the second lifts the
    // remaining road network up to chalk.
    .greyscale()
    .linear(5.2, -46)
    .linear(1.75, -8)
    .tint({ r: 244, g: 240, b: 231 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(OUT_FILE);

  const leftPercent = (((pointX - left) / OUT_WIDTH) * 100).toFixed(2);
  const topPercent = (((pointY - top) / OUT_HEIGHT) * 100).toFixed(2);

  console.log(`Wrote ${OUT_FILE} at zoom ${ZOOM}`);
  console.log(`PIN_POSITION = { left: "${leftPercent}%", top: "${topPercent}%" }`);
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
