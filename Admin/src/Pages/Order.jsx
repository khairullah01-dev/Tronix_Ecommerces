import React from "react";
import { IoLocationOutline, IoMailOutline, IoPhonePortraitOutline } from "react-icons/io5";
import { orders } from "../data/adminData";

const statusClass = {
  Processing: "bg-red-50 text-red-500",
  Shipped: "bg-blue-50 text-blue-600",
  Pending: "bg-amber-50 text-amber-600",
  Delivered: "bg-emerald-50 text-emerald-600",
};

const Order = () => {
  return (
    <main>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Fulfillment</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900">Orders</h1>
      </div>

      <section className="space-y-5">
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 lg:flex-row lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-black">{order.id}</h2>
                  <span className={`rounded-sm px-2 py-1 text-xs font-bold ${statusClass[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-400">{order.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <select defaultValue={order.status} className="rounded-sm border border-gray-200 px-3 py-2 text-sm font-semibold outline-none focus:border-red-400">
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
                <button type="button" className="rounded-sm bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-gray-900">
                  Update
                </button>
              </div>
            </div>

            <div className="grid gap-5 pt-5 lg:grid-cols-[1fr_1fr_160px]">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Customer</p>
                <h3 className="mt-2 font-black">{order.customer}</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-500">
                  <p className="flex items-center gap-2"><IoMailOutline className="text-red-500" /> customer@email.com</p>
                  <p className="flex items-center gap-2"><IoPhonePortraitOutline className="text-red-500" /> +1 234 567 890</p>
                  <p className="flex items-center gap-2"><IoLocationOutline className="text-red-500" /> 21 Market Street, NY</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Items</p>
                <p className="mt-2 font-semibold text-gray-700">{order.items}</p>
                <p className="mt-3 text-sm text-gray-500">Payment: <strong className="text-gray-900">{order.payment}</strong></p>
              </div>

              <div className="rounded-md bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total</p>
                <p className="mt-2 text-2xl font-black text-red-500">${order.total}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Order;
