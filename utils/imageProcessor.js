import { unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const webpFilename = (filename) => `${path.parse(filename).name}.webp`;

export const convertImageToWebp = (source, destination) => (
  sharp(source).rotate().webp({ quality: 82, effort: 4 }).toFile(destination)
);

export const processUploadedImage = async (file) => {
  const destination = path.join(path.dirname(file.path), webpFilename(file.filename));
  await convertImageToWebp(file.path, destination);
  await unlink(file.path);
  return path.basename(destination);
};
