import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { apiRequest } from "../utils/api";
import { useCart } from "../context/CartContext";

const statusClass = {
  "Order Placed": "bg-blue-50 text-blue-600",
  Processing:     "bg-amber-50 text-amber-600",
  Shipped:        "bg-indigo-50 text-indigo-600",
  Delivered:      "bg-emerald-50 text-emerald-600",
  Cancelled:      "bg-red-50 text-red-500",
};

const orderSteps = ["Order Placed", "Processing", "Shipped", "Delivered"];

const statusMessages = {
  "Order Placed": "Your order has been received and is waiting for processing.",
  Processing: "Your products are being checked, packed, and prepared for dispatch.",
  Shipped: "Your order has left the store and is on the way.",
  Delivered: "Your order has been delivered.",
  Cancelled: "This order has been cancelled.",
};

const getStepIndex = (status) => {
  if (status === "Cancelled") return -1;
  const index = orderSteps.indexOf(status);
  return index === -1 ? 0 : index;
};

const OrderProgress = ({ status }) => {
  const currentStep = getStepIndex(status);
  const isCancelled = status === "Cancelled";

  return (
    <div className="mt-5 rounded-lg bg-gray-50 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {orderSteps.map((step, index) => {
          const isComplete = !isCancelled && index <= currentStep;
          const isCurrent = !isCancelled && index === currentStep;

          return (
            <div key={step} className="flex flex-1 items-center gap-3">
              <div
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black ${
                  isComplete
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-300 ring-1 ring-gray-200"
                }`}
              >
                {isComplete ? <IoCheckmarkCircleOutline size={20} /> : index + 1}
              </div>
              <div className="min-w-0">
                <p
                  className={`text-sm font-black ${
                    isCurrent ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  {step}
                </p>
                <div
                  className={`mt-2 h-1 rounded-full md:hidden ${
                    isComplete ? "bg-red-500" : "bg-gray-200"
                  }`}
                />
              </div>
              {index < orderSteps.length - 1 && (
                <div
                  className={`hidden h-1 flex-1 rounded-full md:block ${
                    !isCancelled && index < currentStep ? "bg-red-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <p
        className={`mt-4 text-sm font-semibold ${
          isCancelled ? "text-red-500" : "text-gray-500"
        }`}
      >
        {statusMessages[status] || statusMessages["Order Placed"]}
      </p>
    </div>
  );
};

const Order = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading]= useState(true);
  const [error, setError] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("idle"); // idle | verifying | success | fail
  const [showConfirmation, setShowConfirmation] = useState(false);
  const verifiedRef = useRef(false);     // prevent double-call in StrictMode

  // Read Stripe redirect params from URL
  const payment    = searchParams.get("payment");
  const orderId    = searchParams.get("orderId");
  const sessionId  = searchParams.get("session_id");

  // ── Stripe payment verification after redirect ───────────────────────────────
  useEffect(() => {
    if (payment !== "success" || !orderId || !sessionId) return;
    if (verifiedRef.current) return;
    verifiedRef.current = true;

    const verifyStripe = async () => {
      setVerifyStatus("verifying");
      try {
        await apiRequest("/api/order/verify-stripe", {
          method: "POST",
          body: JSON.stringify({ orderId, session_id: sessionId }),
        });
        clearCart();
        setVerifyStatus("success");
        // Save for the confirmation banner
        localStorage.setItem(
          "tronix_last_order",
          JSON.stringify({
            id: orderId,
            total: null,
            status: "Processing",
            paymentMethod: "Stripe",
          })
        );
      } catch (err) {
        console.error("Stripe verify error:", err.message);
        setVerifyStatus("fail");
      }
    };
    verifyStripe();
  }, [payment, orderId, sessionId, clearCart]);

  // ── Fetch order history ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      if (!localStorage.getItem("tronix_token")) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiRequest("/api/order/userorders");
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [verifyStatus]); // Refetch after Stripe verification so the new order shows up

  // ── Last order from localStorage (COD / Razorpay) ───────────────────────────
  const lastOrder = (() => {
    try {
      return JSON.parse(localStorage.getItem("tronix_last_order")) || null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const shouldShowConfirmation =
      verifyStatus === "success" || (lastOrder && verifyStatus === "idle");

    if (!shouldShowConfirmation) return;

    setShowConfirmation(true);
    const timer = setTimeout(() => {
      setShowConfirmation(false);
      localStorage.removeItem("tronix_last_order");
    }, 5000);

    return () => clearTimeout(timer);
  }, [verifyStatus, lastOrder]);

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-3xl px-6">

        {/* ── Stripe verifying spinner ─────────────────────────────────────── */}
        {verifyStatus === "verifying" && (
          <div className="mb-8 rounded-lg bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-500" />
            <p className="mt-4 font-semibold text-gray-500">Verifying your payment…</p>
          </div>
        )}

        {/* ── Stripe failed ────────────────────────────────────────────────── */}
        {verifyStatus === "fail" && (
          <div className="mb-8 rounded-lg bg-red-50 p-8 text-center shadow-sm">
            <IoCloseCircleOutline className="mx-auto text-6xl text-red-500" />
            <h2 className="mt-4 text-2xl font-black">Payment Verification Failed</h2>
            <p className="mt-2 text-gray-500">
              Your payment may not have been captured. Please contact support with order ID{" "}
              <strong>{orderId}</strong>.
            </p>
          </div>
        )}

        {/* ── Order confirmation banner ────────────────────────────────────── */}
        {showConfirmation && (
          <section className="mb-8 rounded-lg bg-white p-8 text-center shadow-sm">
            <IoCheckmarkCircleOutline className="mx-auto text-6xl text-red-500" />
            <h1 className="mt-4 text-3xl font-black">
              {verifyStatus === "success" ? "Payment Confirmed!" : "Order Confirmed!"}
            </h1>
            <p className="mt-3 text-gray-500">
              Thank you for shopping with Tronix. Your order ID is{" "}
              <strong className="text-gray-900">
                {(lastOrder?.id || orderId || "").slice(-8).toUpperCase()}
              </strong>
              .
            </p>
            {lastOrder && (
              <>
              <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
                {[
                  ["Status",  lastOrder.status || "Order Placed"],
                  ["Payment", lastOrder.paymentMethod || "—"],
                  ["Total",   lastOrder.total ? `Rs.${Number(lastOrder.total).toFixed(2)}` : "—"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {label}
                    </p>
                    <p className="mt-1 font-black">{value}</p>
                  </div>
                ))}
              </div>
              <OrderProgress status={lastOrder.status || "Order Placed"} />
              </>
            )}
          </section>
        )}

        {/* ── Order history ────────────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Account</p>
          <h2 className="mt-2 text-3xl font-black">My Orders</h2>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-400 font-semibold">
            Loading orders…
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-center text-sm font-semibold text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && !lastOrder && (
          <section className="rounded-lg border border-dashed border-gray-200 bg-white p-12 text-center">
            <IoTimeOutline className="mx-auto text-6xl text-red-500" />
            <h3 className="mt-4 text-xl font-black">No orders yet</h3>
            <p className="mt-2 text-gray-500">Start shopping to see your orders here.</p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-sm bg-red-500 px-7 py-3 text-sm font-bold text-white hover:bg-gray-900"
            >
              Start Shopping
            </Link>
          </section>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-bold text-gray-400">
                      Order #{order._id?.slice(-8).toUpperCase()}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block rounded-sm px-3 py-1 text-xs font-bold ${
                        statusClass[order.status] || "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span
                      className={`inline-block rounded-sm px-3 py-1 text-xs font-bold ${
                        order.payment
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {order.payment ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>

                <OrderProgress status={order.status || "Order Placed"} />

                <div className="mt-4 space-y-2 text-sm">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-sm object-cover bg-gray-100"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-gray-400">
                          Qty: {item.quantity} · Rs.{Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 text-sm">
                  <span className="text-gray-500">
                    Method: <strong className="text-gray-800">{order.paymentMethod}</strong>
                  </span>
                  <span className="text-lg font-black text-red-500">
                    Rs.{Number(order.amount).toFixed(2)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-block rounded-sm bg-red-500 px-7 py-3 text-sm font-bold text-white hover:bg-gray-900"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Order;
