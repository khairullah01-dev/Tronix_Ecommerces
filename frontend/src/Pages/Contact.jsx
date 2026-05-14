import React, { useEffect, useState } from "react";
import {
  IoCallOutline,
  IoInformationCircleOutline,
  IoLocationOutline,
  IoMailOutline,
} from "react-icons/io5";
import { apiRequest } from "../utils/api";

const defaultContact = {
  intro:
    "Questions about products, delivery, warranty, or bulk orders? Send a message and the Tronix team will help.",
  address: "Chungi Amar Sadhu Lahore, Pakistan",
  phone: "+1 234 567 890",
  email: "support@tronix.com",
  details: [
    {
      title: "Store Hours",
      text: "Monday to Saturday, 10:00 AM - 8:00 PM",
    },
    {
      title: "Warranty Support",
      text: "Share your order ID and product issue for fast warranty help.",
    },
    {
      title: "Bulk Orders",
      text: "Ask for special pricing on office, school, and reseller orders.",
    },
  ],
};

const Contact = () => {
  const [contact, setContact] = useState(defaultContact);

  useEffect(() => {
    apiRequest("/api/store-settings")
      .then((data) => {
        if (data.settings?.contact) {
          setContact({
            ...defaultContact,
            ...data.settings.contact,
            details:
              data.settings.contact.details?.length > 0
                ? data.settings.contact.details
                : defaultContact.details,
          });
        }
      })
      .catch(() => { });
  }, []);

  const contactItems = [
    [IoLocationOutline, contact.address],
    [IoCallOutline, contact.phone],
    [IoMailOutline, contact.email],
  ].filter(([, text]) => text);

  return (
    <main className="bg-gray-50 py-10">
      <div className="mx-auto w-[92%] max-w-6xl">
        <div className="max-w-2xl">
          <h1 className="mt-2 text-3xl font-black">Contact Us</h1>
          <p className="mt-4 leading-7 text-gray-500">{contact.intro}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <form className="rounded-lg bg-white p-6 shadow-sm">
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
              className="mt-4 w-full rounded-sm bg-red-500 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-900 sm:w-auto"
              type="submit"
            >
              Send Message
            </button>
          </form>

          <section>
            <div className="space-y-4 rounded-lg bg-red-500 p-6 shadow-sm sm:p-10">
              <h2 className="text-2xl font-bold text-white">Contact</h2>

              {contactItems.map(([Icon, text], index) => (
                <div key={index} className="flex items-center gap-4 rounded-lg py-2">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-white/20 text-white">
                    {React.createElement(Icon, { size: 24 })}
                  </div>
                  <p className="break-words text-lg font-medium text-white sm:text-xl">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {contact.details.length > 0 && (
          <section className="grid gap-4 pb-10 md:grid-cols-3">
            {contact.details.map((detail, index) => (
              <article
                key={`${detail.title}-${index}`}
                className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
              >
                <IoInformationCircleOutline className="text-2xl text-red-500" />
                <h2 className="mt-4 font-black">{detail.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {detail.text}
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default Contact;
