import React, { useEffect, useMemo, useState } from "react";
import { IoCreateOutline, IoSearchOutline, IoTrashOutline } from "react-icons/io5";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import axios from "axios";

const statusClass = {
  Active: "bg-emerald-50 text-emerald-600",
  "Low stock": "bg-amber-50 text-amber-600",
  Draft: "bg-gray-100 text-gray-500",
};

const List = ({ token }) => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product list from real backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product by _id
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query, products]
  );

  // Determine stock status label
  const stockStatus = (stock) => {
    if (stock === 0) return "Draft";
    if (stock <= 15) return "Low stock";
    return "Active";
  };

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

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400 font-semibold">
          Loading products…
        </div>
      ) : (
        <section className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
          <div className="hidden grid-cols-[1fr_120px_110px_110px_100px] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-4 text-xs font-black uppercase tracking-widest text-gray-400 lg:grid">
            <span>Product</span>
            <span>Category</span>
            <span>Stock</span>
            <span>Price</span>
            <span>Action</span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <p className="py-12 text-center text-gray-400 font-semibold">
                No products found.
              </p>
            ) : (
              filteredProducts.map((product) => {
                const status = stockStatus(product.stock);
                const image = (product.images || [])[0] || "";
                return (
                  <article
                    key={product._id}
                    className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_120px_110px_110px_100px] lg:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={image}
                        alt={product.name}
                        className="h-16 w-16 rounded-sm object-cover bg-gray-100"
                      />
                      <div>
                        <h2 className="font-black text-gray-900">{product.name}</h2>
                        <span
                          className={`mt-2 inline-block rounded-sm px-2 py-1 text-xs font-bold ${statusClass[status]}`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-500">{product.category}</p>
                    <p className="text-sm font-black">{product.stock}</p>
                    <p className="text-sm font-black text-red-500">Rs.{product.price}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => handleDelete(product._id, product.name)}
                        className="grid h-9 w-9 place-items-center rounded-sm bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white"
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default List;
