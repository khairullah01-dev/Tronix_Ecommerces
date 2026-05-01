import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoBagAddOutline, IoHeartOutline, IoStar } from "react-icons/io5";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

const Product = () => {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id)) || products[0];
  const [activeImage, setActiveImage] = useState(product.gallery[0]);
  const { addToCart } = useCart();
  const related = useMemo(
    () => products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3),
    [product]
  );

  return (
    <main className="bg-white py-10">
      <div className="mx-auto w-[92%] max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <section>
            <div className="overflow-hidden rounded-lg bg-gray-50">
              <img src={activeImage} alt={product.name} className="aspect-square w-full object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {product.gallery.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`overflow-hidden rounded-md border-2 bg-gray-50 ${
                    activeImage === image ? "border-red-500" : "border-transparent"
                  }`}
                >
                  <img src={image} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </section>

          <section className="lg:pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">{product.category}</p>
            <h1 className="mt-3 text-4xl font-black leading-tight">{product.name}</h1>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-500">
              <span className="flex text-amber-400">
                <IoStar /><IoStar /><IoStar /><IoStar /><IoStar />
              </span>
              {product.rating} rating
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-black text-red-500">${product.price}</span>
              <span className="text-lg font-bold text-gray-300 line-through">${product.oldPrice}</span>
            </div>
            <p className="mt-6 leading-7 text-gray-500">{product.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {["Free shipping", "2 year warranty", "Easy returns"].map((item) => (
                <div key={item} className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm font-bold">
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  // Product detail page uses the same cart function as product cards.
                  // This keeps cart behavior consistent across the whole website.
                  addToCart(product);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-red-500 px-7 py-3 text-sm font-bold text-white transition hover:bg-gray-900"
              >
                <IoBagAddOutline /> Add to cart
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-gray-200 px-7 py-3 text-sm font-bold text-gray-700 transition hover:border-red-500 hover:text-red-500"
              >
                <IoHeartOutline /> Wishlist
              </button>
            </div>

            <div className="mt-10 rounded-lg border border-gray-100 p-5">
              <h2 className="font-black">Product details</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-500">
                <li>Premium build with lightweight everyday design.</li>
                <li>Optimized for fast setup and reliable performance.</li>
                <li>Includes charger cable, quick guide, and warranty card.</li>
              </ul>
            </div>
          </section>
        </div>

        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-black">Related Products</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(related.length ? related : products.slice(0, 3)).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Product;
