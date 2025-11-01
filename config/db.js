import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URL;
  if (!uri) {
    console.error("Missing MONGODB_URL");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};