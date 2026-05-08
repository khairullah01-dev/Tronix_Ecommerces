import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";


//  Add for Any product
const addProduct = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Request body is empty." });
        }

        const { name, description, price, category, subcategory, bestseller, brand, stock } = req.body;
        console.log("Adding Product:", req.body);

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter(item => item !== undefined);
        // const images = [image1,image2,image3,image4].filter(Boolean);

        let imageUrl = await Promise.all(images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
            return result.secure_url;
        })
        )

        const productData = {
            name,
            description,
            price: Number(price),
            brand,
            category,
            subCategory: subcategory,
            stock: Number(stock) || 0,
            bestseller: bestseller === 'true',
            images: imageUrl,
            date: Date.now()
        };

        const product = new productModel(productData)
        await product.save()

        res.json({ success: true, message: "Product Added Successfully" })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message })
    }
}

const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message })
    }
}

const removeProducts = async (req, res) => {
    try {
        // --- START: Added check for req.body ---
        if (!req.body) {
            return res.status(400).json({ success: false, message: "Request body is empty." });
        }
        // --- END: Added check for req.body ---
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product removed successfully",
            data: deletedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const singleProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
       

if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
}
        console.log("Single Product:", product);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, product })
    } catch (error) {       
        console.error(error);
        res.status(500).json({ success: false, message: error.message })
    }
}

export { addProduct, listProducts, removeProducts, singleProducts }