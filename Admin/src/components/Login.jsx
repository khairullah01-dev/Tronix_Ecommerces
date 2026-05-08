import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { IoLockClosedOutline, IoMailOutline } from "react-icons/io5";
import { backendUrl } from "../App";

const Login = ({ setToken }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/api/user/admin`, form);
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="grid min-h-screen bg-gray-50 lg:grid-cols-[1fr_1fr]">
      <section className="relative hidden overflow-hidden bg-gray-900 text-white lg:block">
        <img
          src="https://res.cloudinary.com/dmtqzmaei/image/upload/v1778219645/IT_Sector_r4racx.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="relative flex h-full flex-col justify-center p-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-300">Tronix Admin</p>
          <h1 className="mt-4 max-w-lg text-5xl font-black leading-tight">
            Manage your electronics store with clarity.
          </h1>
          <p className="mt-5 max-w-md leading-7 text-white/70">
            Products, inventory, orders, and launch activity in a dashboard that matches your storefront.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Welcome back</p>
          <h2 className="mt-2 text-3xl font-black text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to manage Tronix products and orders.</p>

          <label className="mt-7 block space-y-2">
            <span className="text-sm font-bold text-gray-600">Email</span>
            <div className="relative">
              <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-sm border border-gray-200 px-4 py-3 pl-11 text-sm outline-none focus:border-red-400"
                placeholder="admin@tronix.com"
                required
              />
            </div>
          </label>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-bold text-gray-600">Password</span>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-sm border border-gray-200 px-4 py-3 pl-11 text-sm outline-none focus:border-red-400"
                placeholder="Password"
                required
              />
            </div>
          </label>

          <button type="submit" className="mt-6 w-full rounded-sm bg-red-500 py-3 text-sm font-bold text-white hover:bg-gray-900">
            Log In
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
