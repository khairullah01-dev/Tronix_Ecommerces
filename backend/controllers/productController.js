import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";


//  Add for Any product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory, sizes, bestseller } = req.body;
        console.log(req.body)

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

            category,
            subCategory: subcategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === 'true',
            images: imageUrl,
            date: Date.now()
        };
        console.log(price)
        console.log(productData);

        const product = new productModel(productData)
        await product.save()


        res.json({ success: true, message: "Product Added Successfully" })
        //    console.log("BODY:", req.body);
        // console.log("FILES:", req.files);
        // console.log("images", images)

        // console.log("IMAGES:",image1,image2,image3,image4)


    }
    catch (error) {
        res.json({ success: false, message: error.message })

    }

}

// function for list product

const listProducts = async (req, res) => {

    try {
        const products = await productModel.find({})
        res.json({ success: true, products })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// function for Remove product

const removeProducts = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const deletedProduct = await productModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        console.log("Deleted product ID:", id);

        res.json({
            success: true,
            message: "Product removed successfully",
            data: deletedProduct
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// function for Single  product info

const singleProducts = async (req, res) => {
try {
        const { id } = req.body;
        const product = await productModel.findById(id)
        res.json({ success: true, product })

    } catch (error) {       
        console.log(error)
        res.json({ success: false, message: error.message })
    }
    


}

export { addProduct, listProducts, removeProducts, singleProducts }