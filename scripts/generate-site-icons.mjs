import sharp from "sharp";
import { copyFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../public/images/icon.png", import.meta.url));
const metadata = await sharp(source).metadata();
if (metadata.width !== 32 || metadata.height !== 32) {
  throw new Error("Expected the supplied 32 × 32 site icon.");
}

// Keep the supplied PNG unchanged at the stable public favicon URL.
await copyFile(source, fileURLToPath(new URL("../public/icon.png", import.meta.url)));

// A single-image ICO container with the same PNG artwork for legacy clients.
const png = await sharp(source).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(header.length, 18);
await writeFile(
  fileURLToPath(new URL("../public/favicon.ico", import.meta.url)),
  Buffer.concat([header, png]),
);
console.log("Updated /icon.png and /favicon.ico from the supplied site icon.");
