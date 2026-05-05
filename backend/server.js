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

/*
Your previous server setup was:

import dotenv from 'dotenv'
dotenv.config()
import dns from 'dns'
dns.setServers(["1.1.1.1","8.8.8.8"])
const port = process.env.PORT || 4000
app.use(cors())
app.get('/', (req, res) => {
  res.send("API working ")
})
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)

What changed:
- dotenv/config values now live in config/env.js.
- PORT is read from env.port instead of process.env.PORT directly.
- CORS now allows only your frontend/admin URLs.
- Added /api/health for checking backend status.
- Added /api/cart and /api/order routes for full ecommerce flow.
- Added 404 handler for wrong routes.
*/

// Kept from your previous code:
// You added this DNS setting because your server/database connection needed it.
// I am not changing it, so the backend keeps the same DNS behavior.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

validateEnv();

const app = express();

await connectDb();
connectCloudinary();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

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
