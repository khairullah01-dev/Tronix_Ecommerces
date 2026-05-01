import dotenv from "dotenv";

dotenv.config();

// Previous style:
// Files used process.env.URI, process.env.JWT_SECRET, process.env.CLOUDINARY_NAME directly.
// New style:
// Read all environment variables here once, then import `env` anywhere the backend needs config.

const pick = (...keys) => {
  for (const key of keys) {
    if (process.env[key] && process.env[key].trim() !== "") {
      return process.env[key].trim();
    }
  }

  return "";
};

const splitOrigins = (value) =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const env = {
  nodeEnv: pick("NODE_ENV") || "development",
  port: Number(pick("PORT")) || 4000,
  mongoUri: pick("MONGODB_URI", "MONGO_URI", "URI"),
  jwtSecret: pick("JWT_SECRET"),
  adminEmail: pick("ADMIN_EMAIL"),
  adminPassword: pick("ADMIN_PASSWORD"),
  frontendUrl: pick("FRONTEND_URL") || "http://localhost:5173",
  adminUrl: pick("ADMIN_URL") || "http://localhost:5174",
  corsOrigins: splitOrigins(pick("CORS_ORIGINS")),
  cloudinary: {
    cloudName: pick("CLOUDINARY_CLOUD_NAME", "CLOUDINARY_NAME"),
    apiKey: pick("CLOUDINARY_API_KEY", "CLOUDINARY_API"),
    apiSecret: pick("CLOUDINARY_API_SECRET", "CLOUDINARY_SECRET_KEY"),
  },
  stripe: {
    secretKey: pick("STRIPE_SECRET_KEY"),
  },
  razorpay: {
    keyId: pick("RAZORPAY_KEY_ID"),
    keySecret: pick("RAZORPAY_KEY_SECRET"),
  },
};

export const allowedOrigins = [
  env.frontendUrl,
  env.adminUrl,
  ...env.corsOrigins,
].filter(Boolean);

export const validateEnv = () => {
  const missing = [];

  if (!env.mongoUri) missing.push("MONGODB_URI");
  if (!env.jwtSecret) missing.push("JWT_SECRET");
  if (!env.adminEmail) missing.push("ADMIN_EMAIL");
  if (!env.adminPassword) missing.push("ADMIN_PASSWORD");

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};
