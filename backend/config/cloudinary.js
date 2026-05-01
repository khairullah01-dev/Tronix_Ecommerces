import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

const connectCloudinary = () => {
  // Previous code:
  // cloud_name: process.env.CLOUDINARY_NAME
  // api_key: process.env.CLOUDINARY_API
  // api_secret: process.env.CLOUDINARY_SECRET_KEY
  //
  // New code:
  // Use env.cloudinary, which supports clearer names like CLOUDINARY_CLOUD_NAME too.
  const { cloudName, apiKey, apiSecret } = env.cloudinary;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("Cloudinary is not fully configured. Product image upload will not work.");
    return;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

export default connectCloudinary;
