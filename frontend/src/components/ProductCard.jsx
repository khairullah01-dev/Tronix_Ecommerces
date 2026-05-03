import React from "react";
import { Link } from "react-router-dom";
import { IoBagAddOutline, IoEyeOutline, IoStar } from "react-icons/io5";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <article className="group relative rounded-lg border border-red-900 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-red-100/50">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-md bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-sm bg-red-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        </div>
      </Link>

      <div className="pt-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
            {product.category}
          </p>
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <IoStar className="text-amber-400" />
            {product.rating}
          </span>
        </div>
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 text-sm font-bold text-gray-900 transition hover:text-red-500"
        >
          {product.name}
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-red-500">${product.price}</span>
            <span className="text-xs font-semibold text-gray-300 line-through">
              ${product.oldPrice}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/product/${product.id}`}
              aria-label={`View ${product.name}`}
              className="grid h-9 w-9 place-items-center rounded-sm border border-gray-200 text-gray-600 transition hover:border-red-500 hover:text-red-500"
            >
              <IoEyeOutline />
            </Link>
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              className="grid h-9 w-9 place-items-center rounded-sm bg-red-500 text-white transition hover:bg-gray-900"
              onClick={() => {
                // Adds the selected product to shared cart state.
                // Header cart badge and Cart page update automatically because they use CartContext.
                addToCart(product);
              }}
            >
              <IoBagAddOutline />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};




export const ProductCard2 = ({product}) => {
  return (
   <article className="group flex items-center gap-4 relative rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-red-100/50">
  
  {/* Image (LEFT SIDE) */}
  <Link to={`/product/${product.id}`} className="block shrink-0">
    <div className="relative h-24 w-24 overflow-hidden rounded-md bg-gray-50">
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    </div>
  </Link>

  {/* Content (RIGHT SIDE) */}
  <div className="flex flex-col flex-grow">
    
    {/* Category + Rating */}
    <div className="mb-1 flex items-center justify-between">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">
        {product.category}
      </p>

      <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
        <IoStar className="text-amber-400" />
        {product.rating}
      </span>
    </div>

    {/* Name */}
    <Link
      to={`/product/${product.id}`}
      className="line-clamp-2 text-sm font-bold text-gray-900 transition hover:text-red-500"
    >
      {product.name}
    </Link>

    {/* Price */}
    <div className="mt-2 flex items-center justify-between">
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-black text-red-500">
          ${product.price}
        </span>

        {product.oldPrice && (
          <span className="text-xs font-semibold text-gray-300 line-through">
            ${product.oldPrice}
          </span>
        )}
      </div>
    </div>
  </div>

  {/* Badge */}
  {product.badge && (
    <span className="absolute left-2 top-2 rounded-sm bg-red-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
      {product.badge}
    </span>
  )}
</article>
  )
}

export default ProductCard;


