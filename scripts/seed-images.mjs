import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const TARGET = join(ROOT, "src/content/rides/images");

// Each ride gets a cover + 3 gallery images. Colors cycle through HM-ish purples.
const RIDES = [
  { date: "2026-05-08", base: [91, 45, 140] },
  { date: "2026-05-22", base: [107, 33, 168] },
];

const TINTS = [0, 30, -25, 45]; // brightness offsets per image

async function makeJpeg(rgb, label, outPath) {
  const [r, g, b] = rgb.map((c) => Math.max(0, Math.min(255, c)));
  const svg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1067">
      <rect width="100%" height="100%" fill="rgb(${r},${g},${b})"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
            font-family="ui-sans-serif, system-ui, sans-serif"
            font-size="64" fill="rgba(255,255,255,0.85)">${label}</text>
    </svg>`,
  );
  const buf = await sharp(svg).jpeg({ quality: 82 }).toBuffer();
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
  console.log("wrote", outPath);
}

for (const { date, base } of RIDES) {
  const tint = (i) => base.map((c) => c + TINTS[i]);
  await makeJpeg(tint(0), `${date} cover`, join(TARGET, date, "cover.jpg"));
  await makeJpeg(tint(1), `${date} 01`, join(TARGET, date, "01.jpg"));
  await makeJpeg(tint(2), `${date} 02`, join(TARGET, date, "02.jpg"));
  await makeJpeg(tint(3), `${date} 03`, join(TARGET, date, "03.jpg"));
}
