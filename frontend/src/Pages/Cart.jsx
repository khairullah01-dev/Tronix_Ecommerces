import React from "react";
import { Link } from "react-router-dom";
import {
  IoAdd,
  IoCartOutline,
  IoRemove,
  IoTrashOutline,
  IoCheckmarkCircleOutline,
  IoReceiptOutline,
} from "react-icons/io5";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeItem, subtotal, updateQuantity } = useCart();

  const shipping = cartItems.length ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto w-[92%] max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
            Shopping cart
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Your Cart
          </h1>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Cart Items */}
            <section className="space-y-4">
              {cartItems.map((item, idx) => {
                const productId = item._id || item.id;
                const size = item.size || "default";

                const image =
                  (item.images || [])[0] ||
                  item.image ||
                  "";

                const price =
                  item.discountPrice ||
                  item.price ||
                  0;

                return (
                  <article
                    key={`${productId}-${size}-${idx}`}
                    className="grid gap-5 rounded-lg bg-white p-4 shadow-sm sm:grid-cols-[110px_1fr_auto] sm:items-center"
                  >
                    {/* Product Image */}
                    <img
                      src={image}
                      alt={item.name}
                      className="h-28 w-28 rounded-md bg-gray-100 object-cover"
                    />

                    {/* Product Details */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-red-500">
                        {item.category}
                      </p>

                      <h2 className="mt-1 font-black">
                        {item.name}
                      </h2>

                      <p className="mt-2 text-sm font-bold text-gray-500">
                        Rs.{price.toFixed(2)}
                      </p>

                      {/* Quantity */}
                      <div className="mt-4 flex w-fit items-center rounded-sm border border-gray-200">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="grid h-9 w-9 place-items-center hover:text-red-500"
                          onClick={() =>
                            updateQuantity(productId, -1, size)
                          }
                        >
                          <IoRemove />
                        </button>

                        <span className="grid h-9 w-10 place-items-center border-x border-gray-200 text-sm font-black">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="grid h-9 w-9 place-items-center hover:text-red-500"
                          onClick={() =>
                            updateQuantity(productId, 1, size)
                          }
                        >
                          <IoAdd />
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                      <p className="text-lg font-black">
                        Rs.{(price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        className="grid h-10 w-10 place-items-center rounded-sm text-gray-400 hover:bg-red-50 hover:text-red-500"
                        onClick={() =>
                          removeItem(productId, size)
                        }
                      >
                        <IoTrashOutline size={20} />
                      </button>
                    </div>
                  </article>
                );
              })}

            
            </section>

            {/* Sidebar */}
            <aside className="h-fit rounded-lg bg-white p-6 shadow-sm lg:sticky lg:top-28">
              <h2 className="text-xl font-black">
                Order Summary
              </h2>

              {/* Prices */}
              <div className="mt-6 space-y-4 border-b border-gray-100 pb-6 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>

                  <strong className="text-gray-900">
                    Rs.{subtotal.toFixed(2)}
                  </strong>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>

                  <strong className="text-gray-900">
                    Rs.{shipping.toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between py-6 text-lg font-black">
                <span>Total</span>

                <span className="text-red-500">
                  Rs.{total.toFixed(2)}
                </span>
              </div>

              {/* Checkout */}
              <Link
                to="/placeorder"
                className="block rounded-sm bg-red-500 py-3 text-center text-sm font-bold text-white hover:bg-gray-900"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/order"
                className="mt-4 flex items-center justify-center gap-2 rounded-sm border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              >
                <IoReceiptOutline size={18} />
                My Orders
              </Link>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="mt-4 block text-center text-sm font-bold text-gray-400 hover:text-red-500"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        ) : (
          <section className="rounded-lg border border-dashed border-gray-200 bg-white p-12 text-center">
            <IoCartOutline className="mx-auto text-6xl text-red-500" />

            <h2 className="mt-4 text-2xl font-black">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Add a few devices and they will appear here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-sm bg-red-500 px-7 py-3 text-sm font-bold text-white hover:bg-gray-900"
            >
              Start Shopping
            </Link>
          </section>
        )}
      </div>
    </main>
  );
};

export default Cart;
