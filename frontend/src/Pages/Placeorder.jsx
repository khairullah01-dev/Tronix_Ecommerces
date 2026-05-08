import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoCardOutline,
  IoCashOutline,
  IoPhonePortraitOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { apiRequest } from "../utils/api";

// ─── Payment method card ───────────────────────────────────────────────────────
const PaymentOption = ({ id, label, description, icon: Icon, selected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(id)}
    className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition ${
      selected
        ? "border-red-500 bg-red-50"
        : "border-gray-200 hover:border-gray-300"
    }`}
  >
    <div
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
        selected ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"
      }`}
    >
      <Icon size={20} />
    </div>
    <div>
      <p className="font-black text-gray-900 text-sm">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
    <div className="ml-auto">
      <div
        className={`h-5 w-5 rounded-full border-2 ${
          selected ? "border-red-500 bg-red-500" : "border-gray-300"
        } flex items-center justify-center`}
      >
        {selected && <div className="h-2 w-2 rounded-full bg-white" />}
      </div>
    </div>
  </button>
);

// ─── Load Razorpay script dynamically ─────────────────────────────────────────
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ─── Component ────────────────────────────────────────────────────────────────
const Placeorder = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { cartItems, clearCart, subtotal } = useCart();
  const shipping = cartItems.length ? 15 : 0;
  const total = subtotal + shipping;

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Build the shared payload for all payment methods
  const buildPayload = () => ({
    items: cartItems.map((item) => ({
      productId: item._id || item.id,
      name: item.name,
      price: item.discountPrice || item.price,
      quantity: item.quantity,
      size: item.size || "default",
      image: (item.images || [])[0] || item.image || "",
    })),
    amount: total,
    address: { ...form },
  });

  // ── COD handler ──────────────────────────────────────────────────────────────
  const handleCOD = async () => {
    const data = await apiRequest("/api/order/place", {
      method: "POST",
      body: JSON.stringify({ ...buildPayload(), paymentMethod: "COD" }),
    });
    localStorage.setItem(
      "tronix_last_order",
      JSON.stringify({
        id: data.order?._id,
        total,
        status: "Order Placed",
        paymentMethod: "COD",
      })
    );
    clearCart();
    navigate("/order");
  };

  // ── Stripe handler ───────────────────────────────────────────────────────────
  const handleStripe = async () => {
    const data = await apiRequest("/api/order/stripe", {
      method: "POST",
      body: JSON.stringify(buildPayload()),
    });
    if (data.session_url) {
      // Save orderId so Order.jsx can verify after redirect
      localStorage.setItem("tronix_pending_order_id", data.orderId);
      window.location.href = data.session_url; // Redirect to Stripe Checkout
    }
  };

  // ── Razorpay handler ─────────────────────────────────────────────────────────
  const handleRazorpay = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Failed to load Razorpay. Check your internet connection.");
      return;
    }

    const data = await apiRequest("/api/order/razorpay", {
      method: "POST",
      body: JSON.stringify(buildPayload()),
    });

    const options = {
      key: data.key,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Tronix",
      description: "Order Payment",
      order_id: data.order.id,
      handler: async (response) => {
        // Verify payment with backend
        try {
          await apiRequest("/api/order/verify-razorpay", {
            method: "POST",
            body: JSON.stringify({
              orderId: data.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          localStorage.setItem(
            "tronix_last_order",
            JSON.stringify({
              id: data.orderId,
              total,
              status: "Processing",
              paymentMethod: "Razorpay",
            })
          );
          clearCart();
          navigate("/order");
        } catch (err) {
          setError(err.message);
        }
      },
      prefill: {
        name:  `${form.firstName} ${form.lastName}`,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#ef4444" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ── Master submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || cartItems.length === 0) return;
    setLoading(true);
    setError("");

    try {
      if (paymentMethod === "COD")      await handleCOD();
      else if (paymentMethod === "Stripe")   await handleStripe();
      else if (paymentMethod === "Razorpay") await handleRazorpay();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Login gate ───────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <main className="bg-gray-50 py-10">
        <section className="mx-auto max-w-xl rounded-lg bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black">Login Required</h1>
          <p className="mt-3 text-gray-500">
            Please login before checkout so we can attach the order to your account.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-sm bg-red-500 px-7 py-3 text-sm font-bold text-white hover:bg-gray-900"
          >
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

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ── Left: Billing + Payment ─────────────────────────────────────── */}
          <div className="space-y-6">
            {/* Billing details */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-black">Billing Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "First name", name: "firstName" },
                  { label: "Last name",  name: "lastName" },
                  { label: "Email",      name: "email",  type: "email" },
                  { label: "Phone",      name: "phone",  type: "tel" },
                ].map(({ label, name, type = "text" }) => (
                  <label key={name} className="space-y-1">
                    <span className="text-xs font-bold text-gray-500">{label}</span>
                    <input
                      required
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={label}
                      className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                    />
                  </label>
                ))}
              </div>
              <label className="mt-4 block space-y-1">
                <span className="text-xs font-bold text-gray-500">Street address</span>
                <input
                  required
                  name="street"
                  value={form.street}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "City",  name: "city" },
                  { label: "State", name: "state" },
                  { label: "ZIP",   name: "zip" },
                ].map(({ label, name }) => (
                  <label key={name} className="space-y-1">
                    <span className="text-xs font-bold text-gray-500">{label}</span>
                    <input
                      required
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={label}
                      className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Payment methods */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-black">Payment Method</h2>
              <div className="space-y-3">
                <PaymentOption
                  id="COD"
                  label="Cash on Delivery"
                  description="Pay in cash when your order arrives"
                  icon={IoCashOutline}
                  selected={paymentMethod === "COD"}
                  onSelect={setPaymentMethod}
                />
                <PaymentOption
                  id="Stripe"
                  label="Pay with Card (Stripe)"
                  description="Visa, Mastercard, Amex — secure hosted checkout"
                  icon={IoCardOutline}
                  selected={paymentMethod === "Stripe"}
                  onSelect={setPaymentMethod}
                />
                <PaymentOption
                  id="Razorpay"
                  label="Razorpay"
                  description="UPI, Net Banking, Cards, Wallets"
                  icon={IoPhonePortraitOutline}
                  selected={paymentMethod === "Razorpay"}
                  onSelect={setPaymentMethod}
                />
              </div>

              {/* Security badge */}
              <div className="mt-5 flex items-center gap-2 rounded-sm bg-gray-50 px-4 py-3 text-xs text-gray-500">
                <IoShieldCheckmarkOutline className="shrink-0 text-emerald-500" size={16} />
                Your payment information is encrypted and secure.
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ────────────────────────────────────────── */}
          <aside className="h-fit rounded-lg bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="mb-5 text-xl font-black">Your Order</h2>
            <div className="space-y-3 border-b border-gray-100 pb-5 text-sm">
              {cartItems.length ? (
                cartItems.map((item, i) => {
                  const price = item.discountPrice || item.price || 0;
                  return (
                    <div key={i} className="flex justify-between gap-4">
                      <span className="text-gray-600">
                        {item.name}{" "}
                        <span className="text-gray-400">× {item.quantity}</span>
                      </span>
                      <strong>${(price * item.quantity).toFixed(2)}</strong>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">Your cart is empty.</p>
              )}
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-lg font-black">
              <span>Total</span>
              <span className="text-red-500">${total.toFixed(2)}</span>
            </div>

            {error && (
              <div className="mt-4 rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cartItems.length === 0 || loading}
              className="mt-5 block w-full rounded-sm bg-red-500 py-3 text-center text-sm font-bold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading
                ? "Processing…"
                : paymentMethod === "COD"
                ? "Place Order (COD)"
                : paymentMethod === "Stripe"
                ? "Pay with Stripe →"
                : "Pay with Razorpay →"}
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              By placing your order you agree to our Terms & Conditions.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default Placeorder;
