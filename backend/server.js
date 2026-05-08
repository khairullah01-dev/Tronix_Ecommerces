import express from "express";
import cors from "cors";
import dns from "dns";
import connectDb from "./config/Mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { allowedOrigins, env, validateEnv } from "./config/env.js";
import userRouter from "./Routes/userRoutes.js";
import productRouter from "./Routes/product.route.js";
import cartRouter from "./Routes/cartRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";

// DNS setting kept from original code for MongoDB Atlas connectivity
dns.setServers(["1.1.1.1", "8.8.8.8"]);

validateEnv();

const app = express();

await connectDb();
connectCloudinary();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS: allow requests from the frontend and admin panel
app.use(
  cors()
);

if (env.nodeEnv === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

app.get("/", (req, res) => {
  res.json({ success: true, message: "Tronix API working" });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "tronix-backend",
    database: "connected",
    environment: env.nodeEnv,
  });
});

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || "Server error" });
});

app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});
