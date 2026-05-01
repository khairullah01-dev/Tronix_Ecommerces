import React, { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import {
  IoBagOutline,
  IoClose,
  IoLogOutOutline,
  IoMenu,
  IoPersonOutline,
  IoSearch,
} from "react-icons/io5";
import { FiPhone } from "react-icons/fi";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/products" },
  { label: "About", path: "/about" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const navClass = ({ isActive }) =>
  `text-sm font-semibold transition hover:text-red-500 ${
    isActive ? "text-red-500" : "text-gray-600"
  }`;

export const Header = () => {
  return (
    <div className="hidden border-b border-gray-100 bg-white py-2 md:block">
      <header className="mx-auto flex w-[92%] max-w-6xl items-center justify-between text-sm text-gray-500">
        <ul className="flex gap-4 text-gray-400">
          <li><a aria-label="Instagram" href="#"><FaInstagram /></a></li>
          <li><a aria-label="Facebook" href="#"><FaFacebook /></a></li>
          <li><a aria-label="Twitter" href="#"><FaTwitter /></a></li>
          <li><a aria-label="LinkedIn" href="#"><FaLinkedin /></a></li>
        </ul>

        <ul className="flex items-center gap-6">
          <li className="flex items-center gap-2">
            <FiPhone size={14} className="text-red-500" />
            <span>+1 234 567 890</span>
          </li>
          <li className="flex items-center gap-2">
            <MdOutlineMail size={15} className="text-red-500" />
            <span>support@tronix.com</span>
          </li>
        </ul>
      </header>
    </div>
  );
};

export const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { count } = useCart();
  const { isLoggedIn, logout, user } = useAuth();

  // submitSearch sends the search text to the products page.
  // Collection.jsx reads this query and filters products.
  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();

    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/products");
    }
  };

  // handleLogout uses AuthContext logout() to clear token/user data.
  // Then it sends the customer back to the home page.
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-[92%] max-w-6xl items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-sm text-gray-700 md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <IoMenu size={26} />
          </button>
          <Link to="/" className="text-2xl font-black tracking-tight text-red-500">
            Tronix
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <form className="relative hidden md:block" onSubmit={submitSearch}>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products"
            className="w-56 rounded-sm bg-gray-100 py-2 pl-4 pr-11 text-sm outline-none transition focus:ring-2 focus:ring-red-100 lg:w-72"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 top-0 grid h-full w-10 place-items-center rounded-r-sm bg-red-500 text-white"
          >
            <IoSearch />
          </button>
        </form>

        <div className="flex items-center gap-3 text-gray-700">
          {isLoggedIn && (
            // This text appears only after login/signup.
            // user?.name comes from AuthContext, which gets it from backend login/register/profile.
            <span className="hidden max-w-36 truncate text-sm font-bold text-gray-600 lg:block">
              Hi, {user?.name || "User"}
            </span>
          )}
          {isLoggedIn ? (
            <button
              type="button"
              aria-label="Logout"
              onClick={handleLogout}
              className="inline-flex h-10 items-center gap-2 rounded-sm bg-red-500 px-3 text-sm font-bold text-white transition hover:bg-gray-900"
            >
              <IoLogOutOutline size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              aria-label="Login"
              className="inline-flex h-10 items-center gap-2 rounded-sm px-3 text-sm font-bold text-gray-700 transition hover:bg-red-50 hover:text-red-500"
            >
              <IoPersonOutline size={20} />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-sm transition hover:bg-red-50 hover:text-red-500"
          >
            <IoBagOutline size={21} />
            {count > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="mx-auto w-[92%] pb-4 md:hidden">
        <form className="relative" onSubmit={submitSearch}>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products"
            className="w-full rounded-sm bg-gray-100 py-2 pl-4 pr-11 text-sm outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 top-0 grid h-full w-11 place-items-center rounded-r-sm bg-red-500 text-white"
          >
            <IoSearch />
          </button>
        </form>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition md:hidden ${
          isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <aside
          className={`h-full w-72 bg-white p-6 shadow-2xl transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="text-2xl font-black text-red-500">Tronix</span>
            <button
              type="button"
              aria-label="Close menu"
              className="grid h-10 w-10 place-items-center rounded-sm text-gray-500"
              onClick={() => setIsSidebarOpen(false)}
            >
              <IoClose size={26} />
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={navClass}
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  // Mobile menu logout uses the same logout function as desktop.
                  handleLogout();
                  setIsSidebarOpen(false);
                }}
                className="mt-3 rounded-sm bg-red-500 px-4 py-3 text-left text-sm font-bold text-white"
              >
                Logout {user?.name ? `(${user.name})` : ""}
              </button>
            ) : (
              <NavLink
                to="/login"
                className={navClass}
                onClick={() => setIsSidebarOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>
        </aside>
      </div>
    </nav>
  );
};
