import React, { useEffect, useRef, useState } from "react";
import {
  IoCloudUploadOutline,
  IoImageOutline,
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
  subCategory: "Mobile",
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
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (index, file) => {
    if (!file) return;
    const updated = [...images];
    updated[index] = file;
    setImages(updated);

    const prev = [...previews];
    prev[index] = URL.createObjectURL(file);
    setPreviews(prev);
  };

  const removeImage = (index) => {
    const updatedImgs = [...images];
    updatedImgs[index] = null;
    setImages(updatedImgs);

    const updatedPrev = [...previews];
    if (updatedPrev[index]) URL.revokeObjectURL(updatedPrev[index]);
    updatedPrev[index] = null;
    setPreviews(updatedPrev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasImage = images.some(Boolean);
    if (!hasImage) {
      toast.error("Please upload at least one product image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img);
      });

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product added successfully!");
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
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Catalog</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          {/* Product Information */}
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-black">Product Information</h2>
           <div className="grid gap-4 md:grid-cols-2">
  {/* Product Name */}
  <label className="space-y-2">
    <span className="text-sm font-bold text-gray-600">
      Product name
    </span>

    <input
      name="name"
      value={form.name}
      onChange={handleChange}
      required
      placeholder="Aero Buds Pro"
      className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
    />
  </label>

  {/* Brand */}
  <label className="space-y-2">
    <span className="text-sm font-bold text-gray-600">
      Brand
    </span>

    <input
      name="brand"
      value={form.brand}
      onChange={handleChange}
      placeholder="Tronix"
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
      SubCategory
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
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-bold text-gray-600">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="h-28 w-full resize-none rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                placeholder="Write product details, specs, and warranty information."
              />
            </label>
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-bold text-gray-600">
                Specifications{" "}
                <span className="font-normal text-gray-400">(key: value, one per line)</span>
              </span>
              <textarea
                name="specifications"
                value={form.specifications}
                onChange={handleChange}
                className="h-24 w-full resize-none rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                placeholder="RAM: 8GB&#10;Battery: 40h&#10;Bluetooth: 5.2"
              />
            </label>
            <div className="mt-4 flex gap-6">
              {[
                { label: "Bestseller", name: "bestseller" },
                { label: "Featured", name: "featured" },
              ].map(({ label, name }) => (
                <label key={name} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <input
                    type="checkbox"
                    name={name}
                    checked={form[name]}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-black">Pricing and Stock</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Price ($)", name: "price", placeholder: "129" },
                { label: "Discount price ($)", name: "discountPrice", placeholder: "99" },
                { label: "Stock quantity", name: "stock", placeholder: "48" },
              ].map(({ label, name, placeholder }) => (
                <label key={name} className="space-y-2">
                  <span className="text-sm font-bold text-gray-600">{label}</span>
                  <input
                    type="number"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required={name === "price" || name === "stock"}
                    placeholder={placeholder}
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">Warranty</span>
                <input
                  name="warranty"
                  value={form.warranty}
                  onChange={handleChange}
                  placeholder="1 Year"
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">Rating (0–5)</span>
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

        {/* Product Media + Save */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-black">Product Images</h2>
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-square">
                  {previews[i] ? (
                    <>
                      <img
                        src={previews[i]}
                        alt={`Image ${i + 1}`}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white shadow"
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
                        onChange={(e) => handleImageChange(i, e.target.files[0])}
                      />
                      <span className="flex flex-col items-center text-gray-400">
                        <IoCloudUploadOutline className="text-3xl text-red-400" />
                        <span className="mt-1 text-xs font-semibold">Image {i + 1}</span>
                      </span>
                    </label>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">PNG, JPG, WEBP · Max 5 MB each</p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-red-500 py-3 text-sm font-bold text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <IoSaveOutline />
              {loading ? "Saving…" : "Save Product"}
            </button>
          </div>
        </aside>
      </form>
    </main>
  );
};

export default Add;
