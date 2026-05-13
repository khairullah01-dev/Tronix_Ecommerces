import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoBagCheckOutline,
  IoChevronBack,
  IoChevronForward,
  IoShieldCheckmarkOutline,
  IoSyncOutline,
  IoCubeOutline,
  IoPhonePortraitOutline,
  IoLaptopOutline,
  IoHeadsetOutline,
  IoGameControllerOutline,
  IoWatchOutline,
  IoCameraOutline,
  IoTvOutline,
  IoTabletLandscapeOutline

} from "react-icons/io5";
import ProductCard, { ProductCard2 } from "../components/ProductCard";
import { blogPosts } from "../data/products";
import { apiRequest } from "../utils/api";


const categories = [
  { name: "Phones", icon: IoPhonePortraitOutline },
  { name: "Laptops", icon: IoLaptopOutline },
  { name: "Audio", icon: IoHeadsetOutline },
  { name: "Gaming", icon: IoGameControllerOutline },
  { name: "Watches", icon: IoWatchOutline },
  { name: "Cameras", icon: IoCameraOutline },
  { name: "Tablets", icon: IoTabletLandscapeOutline },
  { name: "Displays", icon: IoTvOutline },
];

const heroSlides = [
  {
    title: "Better Devices for Better Life",
    label: "New collection",
    text: "Shop high-quality phones, laptops, audio gear, wearables, and smart accessories in one clean store.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Upgrade Your Work Setup",
    label: "Editor picks",
    text: "Find sharper displays, lighter laptops, and desk-ready accessories built for focus and comfort.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Immersive Sound, Cleaner Days",
    label: "Audio deals",
    text: "Explore earbuds, headphones, and speakers tuned for calls, music, gaming, and travel.",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1400&q=80",
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Fetch products from backend
  useEffect(() => {
    apiRequest("/api/product/list")
      .then((data) => setProducts(data.products || []))
      .catch(() => { }); // silent fail — page still renders
  }, []);

  // Countdown timer
  useEffect(() => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 2);
    deadline.setHours(23, 59, 59, 999);

    const updateTimer = () => {
      const distance = Math.max(0, deadline.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance hero slider
  useEffect(() => {
    const slider = setInterval(
      () => setActiveSlide((c) => (c + 1) % heroSlides.length),
      4500
    );
    return () => clearInterval(slider);
  }, []);

  const changeSlide = (dir) =>
    setActiveSlide((c) =>
      dir === "next"
        ? (c + 1) % heroSlides.length
        : (c - 1 + heroSlides.length) % heroSlides.length
    );

  // Derive featured / sale products from live data
  const featured = products.slice(0, 4);
  const sale = products.filter((p) => p.discountPrice).slice(0, 4);
  const flashProducts = sale.length >= 2 ? sale : products.slice(4, 8);

  // Unique categories from live products
  const liveCategories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <main className="bg-white">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto grid w-[92%] max-w-6xl gap-5 py-8 lg:grid-cols-[1.8fr_0.9fr]">
        <div className="relative h-96 min-h-[430px] rounded-lg bg-gray-900 md:min-h-[390px] lg:min-h-[390px]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-opacity duration-700 ${activeSlide === index ? "opacity-100" : "opacity-0"
                }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover object-center opacity-65"
              />
            </div>
          ))}

          <div className="relative flex min-h-[430px] max-w-xl flex-col justify-center p-8 text-white md:min-h-[390px] md:p-12 lg:min-h-[390px]">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-red-500">
              {heroSlides[activeSlide].label}
            </p>
            <h1 className="text-3xl font-black leading-tight md:text-4xl">
              {heroSlides[activeSlide].title}
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/80">
              {heroSlides[activeSlide].text}
            </p>
            <Link
              to="/products"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-sm bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-gray-900"
            >
              Shop now <IoChevronForward />
            </Link>
          </div>

          {/* Dots */}
          <div className="absolute bottom-5 left-8 flex items-center gap-2 md:left-12">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all ${activeSlide === index ? "w-8 bg-red-500" : "w-2 bg-white/60 hover:bg-white"
                  }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="absolute bottom-5 right-5 flex gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => changeSlide("previous")}
              className="grid h-9 w-9 place-items-center rounded-sm bg-white/15 text-white backdrop-blur transition hover:bg-red-500"
            >
              <IoChevronBack />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => changeSlide("next")}
              className="grid h-9 w-9 place-items-center rounded-sm bg-white/15 text-white backdrop-blur transition hover:bg-red-500"
            >
              <IoChevronForward />
            </button>
          </div>
        </div>

        {/* Side banners */}
        <div className="border border-yellow-400 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {[
            {
              title: "Studio audio",
              image: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "Gaming essentials",
              image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80",
            },
          ].map((item) => (
            <Link
              key={item.title}
              to="/products"
              className="relative min-h-40 overflow-hidden rounded-lg bg-gray-600 p-6 text-white"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-500 hover:scale-105"
              />
              <div className="relative top-5 rounded-2xl backdrop-blur-sm bg-white/30 p-4 text-center hover:bg-red-400">
                <h2 className="mt-2 text-center text-2xl font-black">{item.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Category grid ─────────────────────────────────────────────── */}
      <section className="mx-auto w-[92%] max-w-6xl py-8 ">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                to="/products"
                className="rounded-lg border border-gray-100 bg-white p-4 text-center shadow-sm transition hover:border-red-200 hover:text-red-500"
              >
                <Icon className="mx-auto mb-3 text-2xl" />
                <span className="text-xs font-bold">{category.name}</span>
              </Link>
            );
          })}
        </div>
      </section>


      {/* ─── New Arrivals ───────────────────────────────────────────────── */}
      <section className="mx-auto w-[92%] max-w-6xl py-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-2xl font-bold text-black">New Arrivals</p>
          <Link to="/products" className="text-sm font-bold text-gray-500 hover:text-red-500">
            View all
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard2 key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        )}
      </section>

      {/* ─── Flash Sale ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-[92%] max-w-6xl py-12">
        <div className="mb-6 flex w-full items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-3xl capitalize font-bold">Flash sale</p>
            <div className="flex items-center gap-2">
              {[
                ["Day", timeLeft.days],
                ["Hour", timeLeft.hours],
                ["Min", timeLeft.minutes],
                ["Sec", timeLeft.seconds],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex min-w-9 flex-col justify-center rounded-sm border border-gray-400 px-2 py-1 text-center"
                >
                  <span className="font-black tabular-nums text-red-400">
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="mx-0.5 text-[9px] font-bold uppercase text-black/55">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Link to="/products" className="text-sm font-bold text-gray-500 hover:text-red-500">
            View all
          </Link>
        </div>
        {flashProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {flashProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        )}
      </section>

      {/* ─── Trust badges ───────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto grid w-[92%] max-w-6xl gap-4 md:grid-cols-4">
          {[
            ["Free Shipping", "On orders over Rs.100", IoCubeOutline],
            ["Secure Payment", "Protected checkout", IoShieldCheckmarkOutline],
            ["Easy Returns", "14-day return window", IoSyncOutline],
            ["Quality Checked", "Tested before shipping", IoBagCheckOutline],
          ].map(([title, text, Icon]) => (
            <div key={title} className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm">
              <Icon className="text-4xl text-red-500" />
              <div>
                <h3 className="font-black">{title}</h3>
                <p className="mt-1 text-sm text-gray-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Blog ───────────────────────────────────────────────────────── */}
      <section className="mx-auto w-[92%] max-w-6xl py-12">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Latest news</p>
          <h2 className="mt-2 text-2xl font-black">From the Blog</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.id} to="/blog" className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
              <img src={post.image} alt={post.title} className="h-44 w-full rounded-md object-cover" />
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-red-500">{post.category}</p>
              <h3 className="mt-2 font-black leading-snug">{post.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
