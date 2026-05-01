import React, { useMemo, useState } from "react";
import { IoCreateOutline, IoSearchOutline, IoTrashOutline } from "react-icons/io5";
import { products } from "../data/adminData";

const statusClass = {
  Active: "bg-emerald-50 text-emerald-600",
  "Low stock": "bg-amber-50 text-amber-600",
  Draft: "bg-gray-100 text-gray-500",
};

const List = () => {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <main>
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Inventory</p>
          <h1 className="mt-2 text-3xl font-black text-gray-900">Product List</h1>
        </div>
        <label className="relative block w-full lg:w-80">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search products"
            className="w-full rounded-sm border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-red-400"
          />
        </label>
      </div>

      <section className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="hidden grid-cols-[1fr_120px_110px_110px_100px] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-4 text-xs font-black uppercase tracking-widest text-gray-400 lg:grid">
          <span>Product</span>
          <span>Category</span>
          <span>Stock</span>
          <span>Price</span>
          <span>Action</span>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredProducts.map((product) => (
            <article key={product.id} className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_120px_110px_110px_100px] lg:items-center">
              <div className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="h-16 w-16 rounded-sm object-cover" />
                <div>
                  <h2 className="font-black text-gray-900">{product.name}</h2>
                  <span className={`mt-2 inline-block rounded-sm px-2 py-1 text-xs font-bold ${statusClass[product.status]}`}>
                    {product.status}
                  </span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-500">{product.category}</p>
              <p className="text-sm font-black">{product.stock}</p>
              <p className="text-sm font-black text-red-500">${product.price}</p>
              <div className="flex gap-2">
                <button type="button" aria-label={`Edit ${product.name}`} className="grid h-9 w-9 place-items-center rounded-sm bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500">
                  <IoCreateOutline />
                </button>
                <button type="button" aria-label={`Delete ${product.name}`} className="grid h-9 w-9 place-items-center rounded-sm bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white">
                  <IoTrashOutline />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default List;
