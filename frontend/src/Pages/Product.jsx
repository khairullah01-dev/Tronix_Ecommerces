import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoBagAddOutline, IoHeartOutline, IoStar, IoStarOutline } from "react-icons/io5";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { apiRequest } from "../utils/api";

const StarRating = ({ rating = 0 }) => {
  const stars = Math.round(rating);
  return (
    <span className="flex text-amber-400">
      {[1, 2, 3, 4, 5].map((s) =>
        s <= stars ? <IoStar key={s} /> : <IoStarOutline key={s} />
      )}
    </span>
  );
};

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  // Fetch the single product by :id from the backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiRequest(`/api/product/single/${id}`);
        const prod = data.product;
        setProduct(prod);
        // Images field from productModel is an array of URLs
        setActiveImage((prod.images || [])[0] || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Fetch related products (same category, excluding this one)
  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      try {
        const data = await apiRequest("/api/product/list");
        const all = data.products || [];
        const rel = all
          .filter(
            (p) => p.category === product.category && p._id !== product._id
          )
          .slice(0, 3);
        setRelated(rel);
      } catch {
        // Non-critical — just skip related products
      }
    };
    fetchRelated();
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white py-10">
        <p className="text-gray-400 font-semibold">Loading product…</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white py-10">
        <div className="text-center">
          <p className="text-red-500 font-semibold">{error || "Product not found."}</p>
          <Link to="/products" className="mt-4 inline-block text-sm font-bold text-gray-500 underline">
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const images = product.images || [];
  const displayPrice = product.discountPrice || product.price;
  const oldPrice = product.discountPrice ? product.price : null;

  return (
    <main className="bg-white py-10">
      <div className="mx-auto w-[92%] max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          {/* Image gallery */}
          <section>
            <div className="overflow-hidden rounded-lg bg-gray-50">
              <img
                src={activeImage || images[0]}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((img) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`overflow-hidden rounded-md border-2 bg-gray-50 ${
                      activeImage === img ? "border-red-500" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Product info */}
          <section className="lg:pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              {product.category}
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight">{product.name}</h1>
            {product.brand && (
              <p className="mt-1 text-sm font-semibold text-gray-400">{product.brand}</p>
            )}
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-500">
              <StarRating rating={product.rating} />
              {product.rating} rating
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-black text-red-500">Rs.{displayPrice}</span>
              {oldPrice && (
                <span className="text-lg font-bold text-gray-300 line-through">
                  Rs.{oldPrice}
                </span>
              )}
            </div>
            <p className="mt-6 leading-7 text-gray-500">{product.description}</p>

            {product.stock !== undefined && (
              <p className={`mt-3 text-sm font-bold ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {["Free shipping", `${product.warranty || "1 year"} warranty`, "Easy returns"].map((item) => (
                <div key={item} className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm font-bold">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-red-500 px-7 py-3 text-sm font-bold text-white transition hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <IoBagAddOutline />
                {added ? "Added!" : "Add to cart"}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-gray-200 px-7 py-3 text-sm font-bold text-gray-700 transition hover:border-red-500 hover:text-red-500"
              >
                <IoHeartOutline /> Wishlist
              </button>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mt-10 rounded-lg border border-gray-100 p-5">
                <h2 className="font-black">Specifications</h2>
                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span className="font-semibold text-gray-700">{k}</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-2xl font-black">Related Products</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default Product;
