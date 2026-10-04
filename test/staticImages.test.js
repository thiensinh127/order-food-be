import test from "node:test";
import assert from "node:assert/strict";
import { imageStaticOptions } from "../config/staticImages.js";

test("serves uploaded images with an immutable one-year cache policy", () => {
  assert.deepEqual(imageStaticOptions, {
    maxAge: "1y",
    immutable: true,
  });
});
