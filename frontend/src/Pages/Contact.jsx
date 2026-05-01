import React from "react";
import { IoCallOutline, IoLocationOutline, IoMailOutline } from "react-icons/io5";

const Contact = () => {
  return (
    <main className="bg-gray-50 py-10">
      <div className="mx-auto grid w-[92%] max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">Contact</p>
          <h1 className="mt-2 text-3xl font-black">Contact Us</h1>
          <p className="mt-4 leading-7 text-gray-500">
            Questions about products, delivery, warranty, or bulk orders? Send a message and the Tronix team will help.
          </p>
          <div className="mt-8 space-y-4">
            {[
              [IoLocationOutline, "Store", "21 Market Street, New York, NY"],
              [IoCallOutline, "Phone", "+1 234 567 890"],
              [IoMailOutline, "Email", "support@tronix.com"],
            ].map(([Icon, title, text]) => (
              <div key={title} className="flex gap-4 rounded-lg bg-white p-5 shadow-sm">
                <div className="grid h-11 w-11 place-items-center rounded-sm bg-red-50 text-red-500">
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className="font-black">{title}</h2>
                  <p className="text-sm text-gray-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <form className="rounded-lg bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="Name" />
            <input className="rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="Email" />
          </div>
          <input className="mt-4 w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="Subject" />
          <textarea className="mt-4 h-40 w-full resize-none rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" placeholder="Message" />
          <button className="mt-4 rounded-sm bg-red-500 px-7 py-3 text-sm font-bold text-white hover:bg-gray-900" type="submit">
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
};

export default Contact;
