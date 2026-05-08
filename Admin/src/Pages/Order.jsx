import React, { useEffect, useState } from "react";
import { IoLocationOutline, IoMailOutline, IoPhonePortraitOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";

const STATUS_OPTIONS = ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusClass = {
  "Order Placed": "bg-blue-50 text-blue-600",
  Processing:    "bg-amber-50 text-amber-600",
  Shipped:       "bg-indigo-50 text-indigo-600",
  Delivered:     "bg-emerald-50 text-emerald-600",
  Cancelled:     "bg-red-50 text-red-500",
};

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // Track each order's selected status locally before saving
  const [pendingStatus, setPendingStatus] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { token },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
        // Seed pending status from current order statuses
        const seed = {};
        response.data.orders.forEach((o) => {
          seed[o._id] = o.status;
        });
        setPendingStatus(seed);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: pendingStatus[orderId] },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order status updated");
        // Update local state without a full refetch
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: pendingStatus[orderId] } : o
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Fulfillment</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900">Orders</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400 font-semibold">
          Loading orders…
        </div>
      ) : orders.length === 0 ? (
        <p className="py-16 text-center text-gray-400 font-semibold">No orders yet.</p>
      ) : (
        <section className="space-y-5">
          {orders.map((order) => {
            const address = order.address || {};
            const items = order.items || [];
            const currentStatus = pendingStatus[order._id] || order.status;

            return (
              <article
                key={order._id}
                className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
              >
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 lg:flex-row lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-black">
                        #{order._id?.slice(-8).toUpperCase()}
                      </h2>
                      <span
                        className={`rounded-sm px-2 py-1 text-xs font-bold ${
                          statusClass[order.status] || "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={currentStatus}
                      onChange={(e) =>
                        setPendingStatus((prev) => ({
                          ...prev,
                          [order._id]: e.target.value,
                        }))
                      }
                      className="rounded-sm border border-gray-200 px-3 py-2 text-sm font-semibold outline-none focus:border-red-400"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(order._id)}
                      className="rounded-sm bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-gray-900"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="grid gap-5 pt-5 lg:grid-cols-[1fr_1fr_160px]">
                  {/* Customer */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Customer
                    </p>
                    <h3 className="mt-2 font-black">
                      {address.firstName} {address.lastName}
                    </h3>
                    <div className="mt-3 space-y-2 text-sm text-gray-500">
                      <p className="flex items-center gap-2">
                        <IoMailOutline className="text-red-500" />
                        {address.email || "—"}
                      </p>
                      <p className="flex items-center gap-2">
                        <IoPhonePortraitOutline className="text-red-500" />
                        {address.phone || "—"}
                      </p>
                      <p className="flex items-center gap-2">
                        <IoLocationOutline className="text-red-500" />
                        {[address.street, address.city, address.state, address.zip]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Items
                    </p>
                    <div className="mt-2 space-y-1">
                      {items.map((item, i) => (
                        <p key={i} className="text-sm font-semibold text-gray-700">
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      Payment:{" "}
                      <strong className="text-gray-900">{order.paymentMethod}</strong>
                      {" · "}
                      <strong className={order.payment ? "text-emerald-600" : "text-amber-600"}>
                        {order.payment ? "Paid" : "Pending"}
                      </strong>
                    </p>
                  </div>

                  {/* Total */}
                  <div className="rounded-md bg-gray-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-black text-red-500">
                      ${order.amount?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Order;
