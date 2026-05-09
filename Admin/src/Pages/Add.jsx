import React, { useRef, useState } from "react";
import {
  IoCloudUploadOutline,
  IoSaveOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";

const categoryOptions = {
  Electronics: [
    "Mobile",
    "Laptop",
    "Headphones",
    "Smartwatch",
    "Camera",
    "Monitor",
    "Gaming Console",
  ],
};

const emptyForm = {
  name: "",
  brand: "",
  category: "Electronics",
  subcategory: "Mobile",
  description: "",
  specifications: "",
  price: "",
  discountPrice: "",
  stock: "",
  warranty: "",
  rating: "",
  bestseller: false,
  featured: false,
};

const Add = ({ token }) => {
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const fileRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, file) => {
    if (!file) return;

    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);

    const updatedPreviews = [...previews];
    updatedPreviews[index] = URL.createObjectURL(file);
    setPreviews(updatedPreviews);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);

    const updatedPreviews = [...previews];

    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }

    updatedPreviews[index] = null;
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasImage = images.some(Boolean);

    if (!hasImage) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const specsObject = {};

      form.specifications.split("\n").forEach((line) => {
        const [key, value] = line.split(":");

        if (key && value) {
          specsObject[key.trim()] = value.trim();
        }
      });

      const formData = new FormData();

      Object.entries({
        ...form,
        specifications: JSON.stringify(specsObject),
      }).forEach(([key, value]) => {
        formData.append(key, value);
      });

      images.forEach((img, index) => {
        if (img) {
          formData.append(`image${index + 1}`, img);
        }
      });

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success("Product added successfully");

        setForm(emptyForm);
        setImages([null, null, null, null]);
        setPreviews([null, null, null, null]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
          Catalog
        </p>

        <h1 className="mt-2 text-3xl font-black text-gray-900">
          Add Product
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1fr_360px]"
      >
        <section className="space-y-6">
          {/* Product Information */}
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-black">
              Product Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Product Name */}
              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Product Name
                </span>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="iPhone 15 Pro"
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>

              {/* Brand */}
              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Brand
                </span>

                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                  placeholder="Apple"
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>

              {/* Category */}
              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Category
                </span>

                <select
                  name="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                      subCategory:
                        categoryOptions[e.target.value][0],
                    }))
                  }
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                >
                  {Object.keys(categoryOptions).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              {/* SubCategory */}
              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Sub Category
                </span>

                <select
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                >
                  {categoryOptions[form.category].map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Description */}
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-bold text-gray-600">
                Description
              </span>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Write product details..."
                className="h-28 w-full resize-none rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
              />
            </label>

            {/* Specifications */}
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-bold text-gray-600">
                Specifications
              </span>

              <textarea
                name="specifications"
                value={form.specifications}
                onChange={handleChange}
                placeholder={`RAM: 8GB
Battery: 5000mAh
Camera: 48MP`}
                className="h-24 w-full resize-none rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
              />
            </label>

            {/* Checkbox */}
            <div className="mt-4 flex gap-6">
              <label className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <input
                  type="checkbox"
                  name="bestseller"
                  checked={form.bestseller}
                  onChange={handleChange}
                />

                Bestseller
              </label>

              <label className="flex items-center gap-3 text-sm font-bold text-gray-600">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />

                Featured
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-black">
              Pricing & Stock
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Price
                </span>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="1000"
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Discount Price
                </span>

                <input
                  type="number"
                  name="discountPrice"
                  value={form.discountPrice}
                  onChange={handleChange}
                  placeholder="900"
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Stock
                </span>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  placeholder="20"
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Warranty
                </span>

                <input
                  type="text"
                  name="warranty"
                  value={form.warranty}
                  onChange={handleChange}
                  placeholder="1 Year"
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Rating
                </span>

                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="4.5"
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Images */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-black">
              Product Images
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-square">
                  {previews[i] ? (
                    <>
                      <img
                        src={previews[i]}
                        alt=""
                        className="h-full w-full rounded-lg object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white"
                      >
                        <IoTrashOutline size={12} />
                      </button>
                    </>
                  ) : (
                    <label className="grid h-full w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-red-300">
                      <input
                        ref={fileRefs[i]}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(
                            i,
                            e.target.files[0]
                          )
                        }
                      />

                      <span className="flex flex-col items-center text-gray-400">
                        <IoCloudUploadOutline className="text-3xl text-red-400" />

                        <span className="mt-1 text-xs font-semibold">
                          Image {i + 1}
                        </span>
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-red-500 py-3 text-sm font-bold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <IoSaveOutline />

              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </aside>
      </form>
    </main>
  );
};

export default Add;