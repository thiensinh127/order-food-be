import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";
import { processUploadedImage } from "../utils/imageProcessor.js";

// add food item

const addFood = async (req, res) => {
  try {
    const image = await processUploadedImage(req.file);
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image,
      category: req.body.category,
    });
    await food.save();
    res.json({ success: true, message: "Food added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// get all food list
const listFood = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // Build query object
    const query = {};
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    const total = await foodModel.countDocuments(query);
    const foods = await foodModel.find(query).sort({ createdAt: -1, _id: 1 }).skip(skip).limit(limit);

    res.json({ success: true, data: foods, total, page, limit });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// update food
const updateFood = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ success: false, message: "Missing id" });
    }

    const food = await foodModel.findById(id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    let updatedData = {
      name: req.body.name || food.name,
      description: req.body.description || food.description,
      price: req.body.price || food.price,
      category: req.body.category || food.category,
    };

    if (req.file) {
      const newImage = await processUploadedImage(req.file);
      const oldImagePath = path.join("uploads", food.image);

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      updatedData.image = newImage;
    }

    await foodModel.findByIdAndUpdate(id, updatedData, { new: true });

    res.json({ success: true, message: "Food updated" });
  } catch (error) {
    console.error("❌ Update food error:", error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ success: false, message: "Missing id" });
    }
    const food = await foodModel.findById(id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    const imagePath = path.join("uploads", food.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    } else {
      console.warn(`⚠️ File not found: ${imagePath}`);
    }

    await foodModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood, updateFood };
