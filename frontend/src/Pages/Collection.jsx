import React, { useEffect, useMemo, useState } from "react";
import { IoFilterOutline, IoSearchOutline } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { apiRequest } from "../utils/api";

const Collection = () => {
  const [searchParams] = useSearchParams();

  const [showFilter, setShowFilter] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Price Range
  const [maxPrice, setMaxPrice] = useState(5000);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const data = await apiRequest("/api/product/list?limit=200");

        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Search Query and selected category from URL
  useEffect(() => {
    setQuery(searchParams.get("search") || "");
    const categoryParam = searchParams.get("category");
    setSelectedCategory(categoryParam && categoryParam !== "" ? categoryParam : "All");
  }, [searchParams]);

  // Categories
  const categories = useMemo(() => {
    const cats = [
      ...new Set(
        products
          .map((p) => p.subCategory)
          .filter(Boolean)
      ),
    ];

    return cats.sort();
  }, [products]);

  // Highest Price
  const highestPrice = useMemo(() => {
    if (products.length === 0) return 5000;

    return Math.max(
      ...products.map((p) => Number(p.price) || 0)
    );
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSelectedCategory =
        selectedCategory === "All" ||
        product.subCategory === selectedCategory;

      const matchesCategory =
        activeCategory === "All" ||
        product.subCategory === activeCategory;

      const matchesQuery = product.name
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesPrice =
        Number(product.price) <= maxPrice;

      return (
        matchesSelectedCategory &&
        matchesCategory &&
        matchesQuery &&
        matchesPrice
      );
    });
  }, [products, activeCategory, selectedCategory, query, maxPrice]);

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto w-[92%] max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              Shop
            </p>

            <h1 className="mt-2 text-3xl font-black">
              All Categories
            </h1>
          </div>

          {/* Search */}
          <div className="flex gap-3">
            <label className="relative block flex-1 md:w-80">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search products"
                className="w-full rounded-sm border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-red-300"
              />
            </label>

            <button
              type="button"
              aria-label="Toggle filters"
              className="grid h-12 w-12 place-items-center rounded-sm bg-red-500 text-white lg:hidden"
              onClick={() =>
                setShowFilter(!showFilter)
              }
            >
              <IoFilterOutline size={22} />
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside
            className={`${
              showFilter ? "block" : "hidden"
            } lg:block`}
          >
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-28">
              {/* Categories */}
              <h2 className="mb-5 text-sm font-black uppercase tracking-widest">
                Categories
              </h2>

              <div className="space-y-2">
                {["All", ...categories].map(
                  (category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        setActiveCategory(category)
                      }
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
                          : products.filter(
                              (p) =>
                                p.subCategory ===
                                category
                            ).length}
                      </span>
                    </button>
                  )
                )}
              </div>

              {/* Price Filter */}
              {/* <div className="mt-8">
                <h2 className="mb-4 text-sm font-black uppercase tracking-widest">
                  Price Range
                </h2>

                <input
                  type="range"
                  min="0"
                  max={highestPrice}
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(
                      Number(e.target.value)
                    )
                  }
                  className="w-full accent-red-500"
                />

                <div className="mt-3 flex items-center justify-between text-sm font-semibold">
                  <span className="text-gray-400">
                    Rs.0
                  </span>

                  <span className="rounded-sm bg-red-50 px-3 py-1 text-red-500">
                    Up to Rs.{maxPrice}
                  </span>
                </div>
              </div> */}
            </div>
          </aside>

          {/* Products */}
          <section>
            <div className="mb-5 flex items-center justify-between rounded-lg border border-gray-100 bg-white px-5 py-3 text-sm">
              <p className="font-semibold text-gray-500">
                Showing{" "}
                <span className="font-black text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                products
              </p>

              <select className="bg-transparent text-sm font-semibold outline-none">
                <option>Default sorting</option>
                <option>Price low to high</option>
                <option>Price high to low</option>
              </select>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-24 text-gray-400 font-semibold">
                Loading products…
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-center text-sm font-semibold text-red-500">
                {error}
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}

                {filteredProducts.length === 0 && (
                  <p className="col-span-full py-12 text-center text-gray-400 font-semibold">
                    No products found.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Collection;