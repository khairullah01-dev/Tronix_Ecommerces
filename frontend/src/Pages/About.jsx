import React from "react";
import {
  IoHeadsetOutline,
  IoRocketOutline,
  IoShieldCheckmarkOutline,
  IoStorefrontOutline,
} from "react-icons/io5";

const values = [
  {
    title: "Authentic Quality",
    text: "Every product is selected from trusted suppliers and checked before it reaches your door.",
    icon: IoShieldCheckmarkOutline,
  },
  {
    title: "Fast Delivery",
    text: "Reliable shipping for phones, laptops, audio gear, gaming devices, and smart accessories.",
    icon: IoRocketOutline,
  },
  {
    title: "Real Support",
    text: "Product advice, warranty help, and setup guidance from people who understand electronics.",
    icon: IoHeadsetOutline,
  },
  {
    title: "Store Experience",
    text: "A clean buying experience online with the same care you expect from a premium store.",
    icon: IoStorefrontOutline,
  },
];

const About = () => {
  return (
    <main className="bg-white">
      <section className="relative min-h-[360px] overflow-hidden bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=80"
          alt="Electronics store shelves"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="relative mx-auto flex min-h-[360px] w-[92%] max-w-6xl flex-col justify-center text-white">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-200">About Tronix</p>
          <h1 className="mt-3 max-w-xl text-4xl font-black leading-tight md:text-5xl">
            Useful technology, carefully chosen.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/80">
            Tronix is an electronics storefront built around practical upgrades: better screens, better sound,
            faster devices, and accessories that make daily work and play smoother.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-[92%] max-w-6xl gap-10 py-14 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Our story</p>
          <h2 className="mt-2 text-3xl font-black">Built for modern electronics shopping</h2>
          <p className="mt-5 leading-7 text-gray-500">
            The goal is simple: make it easy to compare, trust, and buy electronics without a noisy experience.
            The interface is intentionally clean, product-led, and fast to scan.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              ["10k+", "Products sold"],
              ["5k+", "Happy customers"],
              ["24/7", "Support access"],
              ["2 yr", "Warranty options"],
            ].map(([number, label]) => (
              <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 p-5">
                <p className="text-3xl font-black text-red-500">{number}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80"
          alt="Team working in a modern office"
          className="h-[420px] w-full rounded-lg object-cover"
        />
      </section>

      <section className="bg-gray-50 py-14">
        <div className="mx-auto w-[92%] max-w-6xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Why choose us</p>
            <h2 className="mt-2 text-3xl font-black">A cleaner way to buy tech</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="grid h-12 w-12 place-items-center rounded-sm bg-red-50 text-red-500">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 font-black">{value.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{value.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
