import React from "react";
import { blogPosts } from "../data/products";

const Blog = () => {
  return (
    <main className="bg-gray-50 py-10">
      <div className="mx-auto w-[92%] max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Journal</p>
          <h1 className="mt-2 text-3xl font-black">Latest News</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-lg bg-white p-5 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
              alt="Laptop display"
              className="h-72 w-full rounded-md object-cover"
            />
            <p className="mt-5 text-xs font-bold uppercase tracking-widest text-red-500">Product guide</p>
            <h2 className="mt-2 text-2xl font-black">Better devices for better everyday work</h2>
            <p className="mt-4 leading-7 text-gray-500">
              The best tech purchases are the ones that remove friction. A brighter display, better keyboard,
              stronger battery, or cleaner audio setup can change how your whole day feels.
            </p>
            <p className="mt-4 rounded-md bg-red-50 p-5 text-sm leading-7 text-red-700">
              Start with the device you use the most, then choose upgrades that improve comfort, speed, and focus.
            </p>
          </article>

          <aside className="space-y-5">
            {blogPosts.map((post) => (
              <article key={post.id} className="rounded-lg bg-white p-4 shadow-sm">
                <img src={post.image} alt={post.title} className="h-40 w-full rounded-md object-cover" />
                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-red-500">{post.category}</p>
                <h3 className="mt-2 font-black leading-snug">{post.title}</h3>
              </article>
            ))}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Blog;
