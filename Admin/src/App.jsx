import React, { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  IoAddCircleOutline,
  IoBagCheckOutline,
  IoCubeOutline,
  IoGridOutline,
} from "react-icons/io5";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Add from "./Pages/Add";
import Dashboard from "./Pages/Dashboard";
import List from "./Pages/List";
import Order from "./Pages/Order";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const mobileLinks = [
  { to: "/", label: "Home", icon: IoGridOutline },
  { to: "/add", label: "Add", icon: IoAddCircleOutline },
  { to: "/list", label: "List", icon: IoCubeOutline },
  { to: "/order", label: "Orders", icon: IoBagCheckOutline },
];

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  if (token === "") {
    return (
      <>
        <ToastContainer />
        <Login setToken={setToken} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <ToastContainer />
      <Navbar setToken={setToken} />
      <div className="flex">
        <Sidebar />
        <div className="w-full px-4 py-6 md:px-8 md:py-8">
          <Routes>
            <Route path="/" element={<Dashboard token={token} />} />
            <Route path="/add" element={<Add token={token} />} />
            <Route path="/list" element={<List token={token} />} />
            <Route path="/order" element={<Order token={token} />} />
          </Routes>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-gray-100 bg-white md:hidden">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-bold ${
                  isActive ? "text-red-500" : "text-gray-400"
                }`
              }
            >
              <Icon size={21} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default App;
