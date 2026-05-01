import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header, Navbar } from "./components/Header";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Blog from "./Pages/Blog";
import Cart from "./Pages/Cart";
import Collection from "./Pages/Collection";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Order from "./Pages/Order";
import Placeorder from "./Pages/Placeorder";
import Product from "./Pages/Product";
import Signup from "./Pages/Signup";

const App = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Collection />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/placeorder" element={<Placeorder />} />
        <Route path="/order" element={<Order />} />
        <Route path="*" element={<div className="mx-auto max-w-6xl px-6 py-24 text-center text-2xl font-bold">404 Not Found</div>} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
