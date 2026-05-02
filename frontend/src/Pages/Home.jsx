import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoBagCheckOutline,
  IoChevronBack,
  IoChevronForward,
  IoShieldCheckmarkOutline,
  IoSyncOutline,
  IoCubeOutline,
} from "react-icons/io5";
import ProductCard from "../components/ProductCard";
import { blogPosts, categories, products } from "../data/products";

const Home = () => {
  const featured = products.slice(0, 4);
  const sale = products.slice(4, 8);
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 2);
    deadline.setHours(23, 59, 59, 999);

    const updateTimer = () => {
      const distance = Math.max(0, deadline.getTime() - Date.now());
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slider = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(slider);
  }, [heroSlides.length]);

  const changeSlide = (direction) => {
    setActiveSlide((current) => {
      if (direction === "next") {
        return (current + 1) % heroSlides.length;
      }

      return (current - 1 + heroSlides.length) % heroSlides.length;
    });
  };

  return (
    <main className="bg-white">
      <section className="mx-auto grid w-[92%] max-w-6xl gap-5 py-8 lg:grid-cols-[1.8fr_0.9fr]  ">
        <div className="relative h-96 min-h-[430px]  rounded-lg bg-gray-900 md:min-h-[390px]  lg:min-h-[390px]  ">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-opacity duration-700 ${
                activeSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover object-center opacity-65"
              />
            </div>
          ))}

          <div className="relative flex min-h-[430px] max-w-xl flex-col justify-center p-8 text-white md:min-h-[390px] md:p-12 lg:min-h-[390px] ">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-red-500 ">
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

          <div className="absolute bottom-5 left-8 flex items-center gap-2 md:left-12">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === index ? "w-8 bg-red-500" : "w-2 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>

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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {[
            {
              title: "Studio audio",
              image:
                "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "Gaming essentials",
              image:
                "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80",
            },
          ].map((item) => (
            <Link
              key={item.title}
              to="/products"
              className="relative min-h-40 overflow-hidden rounded-lg bg-gray-600 p-6 text-white "
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-500 hover:scale-105"
              />
              <div className="relative bg-white/40 hover:bg-red-500  top-5   p-4 text-center rounded-2xl   ">
                {/* <p className="text-xs font-bold uppercase tracking-widest text-red-500">Featured</p> */}
                <h2 className="mt-2 text-2xl  text-center  font-black">{item.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[92%] max-w-6xl py-8">
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

      <section className="mx-auto w-[92%] max-w-6xl py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">New arrival</p>
            <h2 className="mt-2 text-2xl font-black">Fresh Tech</h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-gray-500 hover:text-red-500">
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="mx-auto grid w-[92%] max-w-6xl gap-4 md:grid-cols-4">
          {[
            ["Free Shipping", "On orders over $100", IoCubeOutline],
            ["Secure Payment", "Protected checkout", IoShieldCheckmarkOutline],
            ["Easy Returns", "14-day return window", IoSyncOutline],
            ["Quality Checked", "Tested before shipping", IoBagCheckOutline],
          ].map(([title, text, Icon]) => (
            <div key={title} className="rounded-lg bg-white p-6 shadow-sm">
              <Icon className="mb-4 text-3xl text-red-500" />
              <h3 className="font-black">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[92%] max-w-6xl py-12">
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Flash sale</p>
            <div className="flex items-center gap-1.5">
              {[
                ["D", timeLeft.days],
                ["H", timeLeft.hours],
                ["M", timeLeft.minutes],
                ["S", timeLeft.seconds],
              ].map(([label, value]) => (
                <div key={label} className="min-w-10 rounded-sm bg-gray-900 px-2 py-1 text-center text-white">
                  <span className="text-xs font-black tabular-nums">{String(value).padStart(2, "0")}</span>
                  <span className="ml-0.5 text-[9px] font-bold uppercase text-white/55">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-black">Limited Deals</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sale.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

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
