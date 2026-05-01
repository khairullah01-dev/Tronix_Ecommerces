import React, { useEffect, useMemo, useState } from "react";
import { IoFilterOutline, IoSearchOutline } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { categories, products } from "../data/products";

const Collection = () => {
  const [searchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Header search sends customers to /products?search=phone.
    // This effect reads that URL value and places it inside this page search input.
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto w-[92%] max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Shop</p>
            <h1 className="mt-2 text-3xl font-black">All Categories</h1>
          </div>
          <div className="flex gap-3">
            <label className="relative block flex-1 md:w-80">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products"
                className="w-full rounded-sm border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-red-300"
              />
            </label>
            <button
              type="button"
              aria-label="Toggle filters"
              className="grid h-12 w-12 place-items-center rounded-sm bg-red-500 text-white lg:hidden"
              onClick={() => setShowFilter(!showFilter)}
            >
              <IoFilterOutline size={22} />
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className={`${showFilter ? "block" : "hidden"} lg:block`}>
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-28">
              <h2 className="mb-5 text-sm font-black uppercase tracking-widest">Categories</h2>
              <div className="space-y-2">
                {["All", ...categories.map((item) => item.name)].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm font-semibold transition ${
                      activeCategory === category
                        ? "bg-red-500 text-white"
                        : "text-gray-500 hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    {category}
                    <span>
                      {category === "All"
                        ? products.length
                        : products.filter((product) => product.category === category).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="mb-4 text-sm font-black uppercase tracking-widest">Price</h2>
                <input type="range" min="0" max="1600" className="w-full accent-red-500" />
                <div className="mt-2 flex justify-between text-xs font-bold text-gray-400">
                  <span>$0</span>
                  <span>$1600+</span>
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-5 flex items-center justify-between rounded-lg border border-gray-100 bg-white px-5 py-3 text-sm">
              <p className="font-semibold text-gray-500">
                Showing <span className="font-black text-gray-900">{filteredProducts.length}</span> products
              </p>
              <select className="bg-transparent text-sm font-semibold outline-none">
                <option>Default sorting</option>
                <option>Price low to high</option>
                <option>Price high to low</option>
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Collection;
