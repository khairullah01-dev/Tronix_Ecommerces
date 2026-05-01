import React from "react";
import { IoLogOutOutline, IoNotificationsOutline, IoSearchOutline } from "react-icons/io5";

const Navbar = ({ setToken }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Admin Panel</p>
          <h1 className="text-xl font-black text-gray-900">Tronix Dashboard</h1>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <label className="relative w-full max-w-md">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search orders, products, customers"
              className="w-full rounded-sm bg-gray-100 py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-red-100"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-sm bg-gray-100 text-gray-600 hover:text-red-500"
          >
            <IoNotificationsOutline size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <button
            onClick={() => setToken("")}
            className="inline-flex items-center gap-2 rounded-sm bg-red-500 px-4 py-3 text-sm font-bold text-white hover:bg-gray-900"
          >
            <IoLogOutOutline />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
