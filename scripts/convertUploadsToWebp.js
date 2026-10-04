import { readdir } from "node:fs/promises";
import path from "node:path";
import { convertImageToWebp, webpFilename } from "../utils/imageProcessor.js";

const uploadsDirectory = "uploads";
const imagePattern = /\.(png|jpe?g)$/i;
const files = (await readdir(uploadsDirectory)).filter((filename) => imagePattern.test(filename));

for (const filename of files) {
  const source = path.join(uploadsDirectory, filename);
  const destination = path.join(uploadsDirectory, webpFilename(filename));
  await convertImageToWebp(source, destination);
}

console.log(`Converted ${files.length} upload images to WebP.`);
