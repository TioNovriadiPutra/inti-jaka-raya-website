import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const asset = (...parts) => path.join(root, "public", ...parts);
const photo = await sharp(asset("images", "parallax.jpg"))
  .resize(1200, 630, { fit: "cover" })
  .toBuffer();
const logo = await sharp(asset("images", "logo.png"))
  .resize(456, 120, { fit: "contain", background: "#ffffff" })
  .png()
  .toBuffer();

const versions = [
  {
    file: "social-preview-v2.jpg",
    first: "Industrial Repair &amp;",
    second: "Protective Coatings",
    description: "UK-made Unique Polymer Systems. Serving Indonesia.",
  },
  {
    file: "social-preview-id-v2.jpg",
    first: "Perbaikan Industri &amp;",
    second: "Pelapis Pelindung",
    description: "Unique Polymer Systems buatan Inggris untuk Indonesia.",
  },
];

for (const version of versions) {
  const overlay = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="shade"><stop stop-color="#0f1e35" stop-opacity="0.98"/><stop offset="1" stop-color="#202859" stop-opacity="0.65"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#shade)"/>
    <rect x="64" y="40" width="504" height="144" rx="12" fill="white"/>
    <rect x="64" y="218" width="64" height="6" rx="3" fill="#69bf67"/>
    <g font-family="Arial, sans-serif" fill="white">
      <text x="64" y="292" font-size="52" font-weight="700">${version.first}</text>
      <text x="64" y="356" font-size="52" font-weight="700">${version.second}</text>
      <text x="64" y="421" font-size="25" fill="#e1e6ef">${version.description}</text>
      <text x="64" y="557" font-size="25" fill="#9ddf9b">intijakaraya.com</text>
    </g>
  </svg>`);

  await sharp(photo)
    .composite([{ input: overlay }, { input: logo, left: 88, top: 52 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(asset("images", version.file));
}

// Brand source files are inputs only; never overwrite user-supplied logos.
console.log("Created English and Indonesian social previews (1200 × 630).");
