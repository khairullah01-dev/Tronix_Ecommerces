import React from "react";
import { Link } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const Order = () => {
  // Read the most recent local order created in Placeorder.jsx.
  // This makes the confirmation page show the real checkout total/order number.
  const lastOrder = (() => {
    try {
      return JSON.parse(localStorage.getItem("tronix_last_order")) || null;
    } catch {
      return null;
    }
  })();

  return (
    <main className="bg-gray-50 py-10">
      <div className="mx-auto max-w-3xl px-6">
        <section className="rounded-lg bg-white p-8 text-center shadow-sm">
          <IoCheckmarkCircleOutline className="mx-auto text-6xl text-red-500" />
          <h1 className="mt-4 text-3xl font-black">Order Confirmed</h1>
          <p className="mt-3 text-gray-500">
            Thanks for shopping with Tronix. Your order number is{" "}
            <strong className="text-gray-900">{lastOrder?.id || "TRX-2048"}</strong>.
          </p>
          <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
            {[
              ["Status", lastOrder?.status || "Processing"],
              ["Delivery", "2-4 business days"],
              ["Total", `$${(lastOrder?.total || 0).toFixed(2)}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
                <p className="mt-1 font-black">{value}</p>
              </div>
            ))}
          </div>
          <Link to="/products" className="mt-8 inline-block rounded-sm bg-red-500 px-7 py-3 text-sm font-bold text-white hover:bg-gray-900">
            Continue Shopping
          </Link>
        </section>
      </div>
    </main>
  );
};

export default Order;
