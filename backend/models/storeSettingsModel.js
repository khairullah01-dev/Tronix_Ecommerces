import mongoose from "mongoose";

const contactDetailSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    text: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const storeSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "store-settings",
    },
    flashSaleEndsAt: {
      type: Date,
      required: true,
    },
    header: {
      brandName: {
        type: String,
        trim: true,
        default: "Tronix",
      },
      phone: {
        type: String,
        trim: true,
        default: "+1 234 567 890",
      },
      email: {
        type: String,
        trim: true,
        default: "support@tronix.com",
      },
      instagramUrl: {
        type: String,
        trim: true,
        default: "#",
      },
      facebookUrl: {
        type: String,
        trim: true,
        default: "#",
      },
      twitterUrl: {
        type: String,
        trim: true,
        default: "#",
      },
      linkedinUrl: {
        type: String,
        trim: true,
        default: "#",
      },
      adminPanelUrl: {
        type: String,
        trim: true,
        default: "https://tronix-ecommerces-2wbi.vercel.app",
      },
    },
    contact: {
      intro: {
        type: String,
        trim: true,
        default:
          "Questions about products, delivery, warranty, or bulk orders? Send a message and the Tronix team will help.",
      },
      address: {
        type: String,
        trim: true,
        default: "Chungi Amar Sadhu Lahore, Pakistan",
      },
      phone: {
        type: String,
        trim: true,
        default: "+1 234 567 890",
      },
      email: {
        type: String,
        trim: true,
        default: "support@tronix.com",
      },
      details: {
        type: [contactDetailSchema],
        default: [
          {
            title: "Store Hours",
            text: "Monday to Saturday, 10:00 AM - 8:00 PM",
          },
          {
            title: "Warranty Support",
            text: "Share your order ID and product issue for fast warranty help.",
          },
          {
            title: "Bulk Orders",
            text: "Ask for special pricing on office, school, and reseller orders.",
          },
        ],
      },
    },
  },
  { timestamps: true }
);

const storeSettingsModel =
  mongoose.models.storeSettings ||
  mongoose.model("storeSettings", storeSettingsSchema);

export default storeSettingsModel;
