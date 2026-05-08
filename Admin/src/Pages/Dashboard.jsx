import React, { useEffect, useState } from "react";
import {
  IoBagHandleOutline,
  IoChevronForward,
  IoCubeOutline,
  IoPeopleOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import StatCard from "../components/StatCard";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";

const Dashboard = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, ordRes] = await Promise.all([
          axios.get(`${backendUrl}/api/product/list`),
          axios.get(`${backendUrl}/api/order/list`, { headers: { token } }),
        ]);

        if (prodRes.data.success) setProducts(prodRes.data.products || []);
        else toast.error(prodRes.data.message);

        if (ordRes.data.success) setOrders(ordRes.data.orders || []);
        else toast.error(ordRes.data.message);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Compute live stats from fetched data
  const totalRevenue = orders
    .filter((o) => o.payment)
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const stats = [
    {
      label: "Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      trend: `${orders.filter((o) => o.payment).length} paid`,
    },
    { label: "Orders", value: orders.length.toString(), trend: "total" },
    { label: "Products", value: products.length.toString(), trend: "in catalogue" },
    {
      label: "Low Stock",
      value: products.filter((p) => p.stock <= 15).length.toString(),
      trend: "items need restock",
    },
  ];

  const lowStock = products.filter((p) => p.stock <= 15);
  const recentOrders = [...orders].slice(0, 5);

  if (loading) {
    return (
      <main className="flex items-center justify-center py-24">
        <p className="text-gray-400 font-semibold">Loading dashboard…</p>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        {/* Hero banner */}
        <article className="overflow-hidden rounded-lg bg-gray-900 text-white shadow-sm">
          <div className="grid min-h-[280px] gap-6 p-6 md:grid-cols-[1fr_260px] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-300">
                Live overview
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-black leading-tight">
                Manage launches, orders, and inventory from one clean workspace.
              </h2>
              <div className="mt-6 grid max-w-md grid-cols-3 gap-3">
                {[
                  [IoTrendingUpOutline, "Revenue", `$${totalRevenue.toLocaleString()}`],
                  [IoBagHandleOutline, "Orders", orders.length],
                  [IoCubeOutline, "Products", products.length],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="rounded-md bg-white/10 p-4">
                    <Icon className="text-2xl text-red-300" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-widest text-white/45">
                      {label}
                    </p>
                    <p className="text-xl font-black">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80"
              alt="Analytics dashboard"
              className="h-60 w-full rounded-md object-cover"
            />
          </div>
        </article>

        {/* Low stock alert */}
        <article className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-black">Stock Alerts</h2>
            <span className="rounded-sm bg-red-50 px-2 py-1 text-xs font-bold text-red-500">
              {lowStock.length} items
            </span>
          </div>
          <div className="space-y-4">
            {lowStock.length === 0 ? (
              <p className="text-sm text-gray-400">All products are well-stocked.</p>
            ) : (
              lowStock.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
                  <img
                    src={(product.images || [])[0] || ""}
                    alt={product.name}
                    className="h-12 w-12 rounded-sm object-cover bg-gray-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black">{product.name}</p>
                    <p className="text-xs font-semibold text-gray-400">
                      {product.stock} left in stock
                    </p>
                  </div>
                  <IoChevronForward className="text-gray-300" />
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Top products */}
        <article className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-black">Top Products</h2>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product._id} className="flex items-center gap-4">
                <img
                  src={(product.images || [])[0] || ""}
                  alt={product.name}
                  className="h-14 w-14 rounded-sm object-cover bg-gray-100"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{product.name}</p>
                  <p className="text-sm text-gray-400">{product.category}</p>
                </div>
                <p className="font-black text-red-500">${product.price}</p>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-sm text-gray-400">No products yet.</p>
            )}
          </div>
        </article>

        {/* Recent orders  */}
        <article className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-black">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="grid gap-3 rounded-md bg-gray-50 p-4 text-sm md:grid-cols-[120px_1fr_auto] md:items-center"
              >
                <strong className="truncate text-xs">
                  #{order._id?.slice(-8).toUpperCase()}
                </strong>
                <span className="text-gray-500 truncate">
                  {order.address?.firstName} {order.address?.lastName}
                </span>
                <span className="font-black text-red-500">${order.amount?.toFixed(2)}</span>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-gray-400">No orders yet.</p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
};

export default Dashboard;
