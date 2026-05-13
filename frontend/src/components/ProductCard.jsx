import React from "react";
import { Link } from "react-router-dom";
import { IoBagAddOutline, IoCartSharp, IoStar } from "react-icons/io5";
import { useCart } from "../context/CartContext";

/**
 * Standard product card — shows image, category, name, price, rating.
 * Works with both backend products (_id, images[]) and local mock data (id, image).
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Backend uses _id + images[], local mock uses id + image
  const productId = product._id || product.id;
  const image = (product.images || [])[0] || product.image || "";
  const oldPrice = product.discountPrice ? product.price : product.oldPrice;
  const displayPrice = product.discountPrice || product.price;

  return (
    <article className="group relative rounded-lg border border-gray-100 bg-white p-4 py-9 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-red-100/50">
      <Link to={`/product/${productId}`} className="flex justify-center">
        <div className="relative aspect-square w-3/4 overflow-hidden rounded-md bg-gray-50">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="pt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
            {product.category}
          </p>
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <IoStar className="text-amber-400" />
            {product.rating || 0}
          </span>
        </div>
        <Link
          to={`/product/${productId}`}
          className="line-clamp-2 text-sm font-bold text-gray-900 transition hover:text-red-500"
        >
          {product.name}
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-red-500">Rs.{displayPrice}</span>
            {oldPrice && (
              <span className="text-xs font-semibold text-gray-400 line-through">
                Rs.{oldPrice}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className="grid h-9 w-9 place-items-center rounded-sm bg-red-500 text-white transition hover:bg-gray-900"
            onClick={() => addToCart(product)}
          >
            <IoCartSharp />
          </button>
        </div>
      </div>

      {/* Sale / discount badge */}
      {oldPrice && (
        <span className="absolute right-2 top-1 rounded-sm bg-purple-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          {Math.round(((oldPrice - displayPrice) / oldPrice) * 100)}% OFF
        </span>
      )}
    </article>
  );
};

/**
 * Compact horizontal card used on the home page "New Arrival" section.
 */
export const ProductCard2 = ({ product }) => {
  const productId = product._id || product.id;
  const image = (product.images || [])[0] || product.image || "";
  const displayPrice = product.discountPrice || product.price;
  const oldPrice = product.discountPrice ? product.price : product.oldPrice;

  return (
    <article className="group relative flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-red-100/50">
      <Link to={`/product/${productId}`} className="block shrink-0">
        <div className="relative h-24 w-24 overflow-hidden rounded-md bg-gray-50">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-grow flex-col">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">
            {product.category}
          </p>
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <IoStar className="text-amber-400" />
            {product.rating || 0}
          </span>
        </div>
        <Link
          to={`/product/${productId}`}
          className="line-clamp-2 text-sm font-bold text-gray-900 transition hover:text-red-500"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-black text-red-500">Rs.{displayPrice}</span>
          {oldPrice && (
            <span className="text-xs font-semibold text-gray-300 line-through">
              Rs.{oldPrice}
            </span>
          )}
        </div>
      </div>

      {product.badge && (
        <span className="absolute left-2 top-2 rounded-sm bg-red-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          {product.badge}
        </span>
      )}
    </article>
  );
};

export default ProductCard;
