import React from "react";
import { IoCallOutline, IoLocationOutline, IoMailOutline } from "react-icons/io5";

const Contact = () => {
  return (
    <main className="bg-gray-50 py-10  ">
      <div className=" p-3 lg:w-1/2 md:mx-20 ">
          <h1 className="mt-2 text-3xl font-black">Contact Us</h1>
          <p className="mt-4 leading-7 text-gray-500">
            Questions about products, delivery, warranty, or bulk orders? Send a message and the Tronix team will help.
          </p>
      </div>
     <div className="mx-auto w-[92%] max-w-6xl py-10">
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
    
    {/* Contact Form */}
    <form className="rounded-lg  bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <input 
          className="rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" 
          placeholder="Name" 
        />
        <input 
          className="rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" 
          placeholder="Email" 
        />
      </div>
      <input 
        className="mt-4 w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" 
        placeholder="Subject" 
      />
      <textarea 
        className="mt-4 h-40 w-full resize-none rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400" 
        placeholder="Message" 
      />
      <button 
        className="mt-4 w-full sm:w-auto rounded-sm bg-red-500 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-900" 
        type="submit"
      >
        Send Message
      </button>
    </form>

    {/* Contact Info Section */}
    <section>
      <div className="space-y-4 mt-8 rounded-xl  bg-red-500 p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-white">Contact</h2>
        
        {[
          [IoLocationOutline, "Chungi Amar Sadhu Lahore, Pakistan"],
          [IoCallOutline, "+1 234 567 890"],
          [IoMailOutline, "support@tronix.com"],
        ].map(([Icon, text], index) => (
          <div key={index} className="flex items-center gap-4 rounded-lg py-2">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-white/20 text-white">
              <Icon size={24} />
            </div>
            <p className="break-all text-lg font-medium text-white sm:text-xl">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
    
  </div>
</div>
    </main>
  );
};

export default Contact;
