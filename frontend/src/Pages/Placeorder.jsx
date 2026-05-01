import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Placeorder = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { cartItems, clearCart, subtotal } = useCart();
  const shipping = cartItems.length ? 15 : 0;
  const total = subtotal + shipping;

  // placeOrder is local frontend order logic.
  // Later you can replace this with backend /api/order/place.
  // For now it creates a confirmation object and stores it for Order.jsx.
  const placeOrder = () => {
    if (!isLoggedIn || cartItems.length === 0) return;

    const order = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      customer: user?.name || "Customer",
      items: cartItems,
      total,
      date: new Date().toLocaleDateString(),
      status: "Processing",
    };

    localStorage.setItem("tronix_last_order", JSON.stringify(order));
    clearCart();
    navigate("/order");
  };

  if (!isLoggedIn) {
    return (
      <main className="bg-gray-50 py-10">
        <section className="mx-auto max-w-xl rounded-lg bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black">Login Required</h1>
          <p className="mt-3 text-gray-500">Please login before checkout so we can attach the order to your account.</p>
          <Link to="/login" className="mt-6 inline-block rounded-sm bg-red-500 px-7 py-3 text-sm font-bold text-white hover:bg-gray-900">
            Login to Checkout
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 py-10">
      <div className="mx-auto w-[92%] max-w-6xl">
        <h1 className="mb-8 text-3xl font-black">Checkout</h1>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-black">Billing Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {["First name", "Last name", "Email", "Phone"].map((label) => (
                <input
                  key={label}
                  placeholder={label}
                  defaultValue={label === "First name" ? user?.name?.split(" ")[0] || "" : label === "Email" ? user?.email || "" : ""}
                  className="rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              ))}
            </div>
            <input placeholder="Street address" className="mt-4 w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" />
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {["City", "State", "ZIP"].map((label) => (
                <input key={label} placeholder={label} className="rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" />
              ))}
            </div>
          </form>

          <aside className="h-fit rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-black">Your Order</h2>
            <div className="space-y-3 border-b border-gray-100 pb-5 text-sm">
              {cartItems.length ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <span>{item.name} x {item.quantity}</span>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Your cart is empty.</p>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between py-5 text-lg font-black">
              <span>Total</span>
              <span className="text-red-500">${total.toFixed(2)}</span>
            </div>
            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={placeOrder}
              className="block w-full rounded-sm bg-red-500 py-3 text-center text-sm font-bold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Place Order
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Placeorder;
