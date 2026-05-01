import mongoose from "mongoose";
import { env } from "./env.js";

const connectDb = async () => {
  try {
    // Previous code:
    // await mongoose.connect(process.env.URI)
    //
    // New code:
    // Use env.mongoUri so your real .env can use MONGODB_URI, MONGO_URI, or old URI.
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error.message);
    });

    await mongoose.connect(env.mongoUri);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDb;
