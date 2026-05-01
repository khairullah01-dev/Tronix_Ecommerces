import React from "react";
import {
  IoBagHandleOutline,
  IoChevronForward,
  IoPeopleOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import StatCard from "../components/StatCard";
import { orders, products, stats } from "../data/adminData";

const Dashboard = () => {
  return (
    <main className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <article className="overflow-hidden rounded-lg bg-gray-900 text-white shadow-sm">
          <div className="grid min-h-[280px] gap-6 p-6 md:grid-cols-[1fr_260px] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-300">Today overview</p>
              <h2 className="mt-3 max-w-lg text-3xl font-black leading-tight">
                Manage launches, orders, and inventory from one clean workspace.
              </h2>
              <div className="mt-6 grid max-w-md grid-cols-3 gap-3">
                {[
                  [IoTrendingUpOutline, "Sales", "+18%"],
                  [IoBagHandleOutline, "Orders", "42"],
                  [IoPeopleOutline, "Users", "128"],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="rounded-md bg-white/10 p-4">
                    <Icon className="text-2xl text-red-300" />
                    <p className="mt-3 text-xs font-bold uppercase tracking-widest text-white/45">{label}</p>
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

        <article className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-black">Stock Alerts</h2>
            <button className="text-sm font-bold text-red-500" type="button">View</button>
          </div>
          <div className="space-y-4">
            {products.filter((item) => item.stock <= 15).map((product) => (
              <div key={product.id} className="flex items-center gap-3 rounded-md bg-gray-50 p-3">
                <img src={product.image} alt={product.name} className="h-12 w-12 rounded-sm object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black">{product.name}</p>
                  <p className="text-xs font-semibold text-gray-400">{product.stock} left in stock</p>
                </div>
                <IoChevronForward className="text-gray-300" />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-black">Top Products</h2>
          <div className="space-y-4">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="h-14 w-14 rounded-sm object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{product.name}</p>
                  <p className="text-sm text-gray-400">{product.category}</p>
                </div>
                <p className="font-black text-red-500">${product.price}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 font-black">Recent Orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="grid gap-3 rounded-md bg-gray-50 p-4 text-sm md:grid-cols-[100px_1fr_auto] md:items-center">
                <strong>{order.id}</strong>
                <span className="text-gray-500">{order.customer}</span>
                <span className="font-black text-red-500">${order.total}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
};

export default Dashboard;
