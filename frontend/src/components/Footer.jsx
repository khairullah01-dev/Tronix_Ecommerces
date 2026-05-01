import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { IoMailOutline, IoPaperPlaneOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-red-50">
      <div className="bg-red-500 py-6 text-white">
        <div className="mx-auto flex w-[92%] max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-sm bg-white/15">
              <IoMailOutline size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold">Join our newsletter</h3>
              <p className="text-sm text-white/80">Deals, launches, and buying tips in your inbox.</p>
            </div>
          </div>
          <form className="flex w-full max-w-md overflow-hidden rounded-sm bg-white">
            <input
              type="email"
              aria-label="Email address"
              placeholder="Enter your email"
              className="min-w-0 flex-1 px-4 py-3 text-sm text-gray-700 outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="grid w-12 place-items-center bg-gray-900 text-white transition hover:bg-gray-700"
            >
              <IoPaperPlaneOutline />
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid w-[92%] max-w-6xl gap-8 py-12 text-sm text-gray-500 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="text-2xl font-black text-red-500">
            Tronix
          </Link>
          <p className="mt-4 max-w-sm leading-6">
            Modern electronics store for phones, laptops, audio gear, gaming accessories, and smart devices.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Shop</h4>
          <div className="space-y-3">
            <Link className="block hover:text-red-500" to="/products">All Products</Link>
            <Link className="block hover:text-red-500" to="/cart">Cart</Link>
            <Link className="block hover:text-red-500" to="/order">Track Order</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Company</h4>
          <div className="space-y-3">
            <Link className="block hover:text-red-500" to="/about">About</Link>
            <Link className="block hover:text-red-500" to="/blog">Blog</Link>
            <Link className="block hover:text-red-500" to="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Follow</h4>
          <div className="flex gap-3 text-lg text-red-500">
            <a aria-label="Instagram" href="#"><FaInstagram /></a>
            <a aria-label="Facebook" href="#"><FaFacebook /></a>
            <a aria-label="Twitter" href="#"><FaTwitter /></a>
            <a aria-label="LinkedIn" href="#"><FaLinkedin /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
