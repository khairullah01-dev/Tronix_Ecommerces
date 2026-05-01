import React from "react";
import { IoCloudUploadOutline, IoImageOutline, IoSaveOutline } from "react-icons/io5";
import { categories } from "../data/adminData";

const Add = () => {
  return (
    <main>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Catalog</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900">Add Product</h1>
      </div>

      <form className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-black">Product Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">Product name</span>
                <input className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="Aero Buds Pro" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold text-gray-600">Category</span>
                <select className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400">
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-bold text-gray-600">Description</span>
              <textarea className="h-36 w-full resize-none rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="Write product details, specs, and warranty information." />
            </label>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-black">Pricing and Stock</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {["Price", "Compare price", "Stock quantity"].map((label) => (
                <label key={label} className="space-y-2">
                  <span className="text-sm font-bold text-gray-600">{label}</span>
                  <input className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" placeholder={label === "Stock quantity" ? "48" : "129"} />
                </label>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-black">Product Media</h2>
            <label className="grid min-h-56 cursor-pointer place-items-center rounded-lg border border-dashed border-red-200 bg-red-50/60 p-6 text-center">
              <input type="file" className="hidden" multiple />
              <span>
                <IoCloudUploadOutline className="mx-auto text-5xl text-red-500" />
                <strong className="mt-3 block text-sm">Upload product images</strong>
                <span className="mt-1 block text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</span>
              </span>
            </label>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="grid aspect-square place-items-center rounded-sm bg-gray-100 text-gray-300">
                  <IoImageOutline />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-black">Status</h2>
            <select className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400">
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
            <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-red-500 py-3 text-sm font-bold text-white hover:bg-gray-900">
              <IoSaveOutline />
              Save Product
            </button>
          </div>
        </aside>
      </form>
    </main>
  );
};

export default Add;
