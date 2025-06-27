import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoutes.js";
import "dotenv/config.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

//app config
const app = express();
const port = process.env.PORT || 4000;
dotenv.config();

//middleware
app.use(express.json());
app.use(cors());

//db connection
connectDB();

//API Endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => res.status(200).send("Hello World"));

//listen
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
//mongodb+srv://thiensinh:120795@cluster0.cfrpgq6.mongodb.net/?
