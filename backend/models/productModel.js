import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number
  },
  images: {
    type: [String],
    required: true
  },
  category: {
    type: String,
    required: true   // e.g. "Electronics"
  },
  subCategory: {
    type: String,
    required: true   // e.g. "Mobile", "Laptop", "Headphones"
  },
  stock: {
    type: Number,
    required: true
  },
  warranty: {
    type: String     // e.g. "1 Year"
  },
  specifications: {
    type: Object     // flexible specs (RAM, battery, etc.)
  },
  rating: {
    type: Number,
    default: 0
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  date: {
    type: Number,
    required: true
  }
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;