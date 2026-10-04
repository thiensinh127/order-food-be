import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { convertImageToWebp } from "../utils/imageProcessor.js";

test("converts an uploaded PNG to a WebP file", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "food-webp-"));
  const destination = path.join(directory, "food.webp");

  try {
    await convertImageToWebp("uploads/1761965307704-food_23.png", destination);
    const metadata = await sharp(destination).metadata();
    assert.equal(metadata.format, "webp");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
