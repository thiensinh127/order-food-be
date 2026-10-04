import "dotenv/config";
import mongoose from "mongoose";
import { access } from "node:fs/promises";
import path from "node:path";
import { connectDB } from "../config/db.js";
import foodModel from "../models/foodModel.js";
import { webpFilename } from "../utils/imageProcessor.js";

await connectDB();

const foods = await foodModel.find({ image: /\.(png|jpe?g)$/i });
const updates = [];

for (const food of foods) {
  const image = webpFilename(food.image);
  await access(path.join("uploads", image));
  updates.push({ updateOne: { filter: { _id: food._id }, update: { image } } });
}

if (updates.length) await foodModel.bulkWrite(updates);
console.log(`Updated ${updates.length} food image references to WebP.`);
await mongoose.disconnect();
