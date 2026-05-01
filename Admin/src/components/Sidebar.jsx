import React from "react";
import { NavLink } from "react-router-dom";
import {
  IoAddCircleOutline,
  IoBagCheckOutline,
  IoCubeOutline,
  IoGridOutline,
} from "react-icons/io5";

const links = [
  { to: "/", label: "Dashboard", icon: IoGridOutline },
  { to: "/add", label: "Add Product", icon: IoAddCircleOutline },
  { to: "/list", label: "Products", icon: IoCubeOutline },
  { to: "/order", label: "Orders", icon: IoBagCheckOutline },
];

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-bold transition ${
      isActive
        ? "bg-red-500 text-white shadow-sm"
        : "text-gray-500 hover:bg-red-50 hover:text-red-500"
    }`;

  return (
    <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-64 shrink-0 border-r border-gray-100 bg-white p-4 md:block">
      <div className="mb-6 rounded-lg bg-gray-900 p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-300">Store</p>
        <h2 className="mt-2 text-2xl font-black">Tronix</h2>
        <p className="mt-2 text-sm text-white/60">Manage your electronics catalog.</p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              <Icon size={20} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
