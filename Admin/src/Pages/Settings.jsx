import React, { useEffect, useState } from "react";
import {
  IoAddOutline,
  IoCallOutline,
  IoMailOutline,
  IoRemoveOutline,
  IoSaveOutline,
  IoStorefrontOutline,
  IoTimeOutline,
} from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const emptyDetail = { title: "", text: "" };

const toDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const buildFallbackDeadline = () => {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 2);
  deadline.setHours(23, 59, 59, 999);
  return toDateTimeLocal(deadline);
};

const Settings = ({ token }) => {
  const [form, setForm] = useState({
    flashSaleEndsAt: buildFallbackDeadline(),
    header: {
      brandName: "",
      phone: "",
      email: "",
      instagramUrl: "",
      facebookUrl: "",
      twitterUrl: "",
      linkedinUrl: "",
      adminPanelUrl: "",
    },
    contact: {
      intro: "",
      address: "",
      phone: "",
      email: "",
      details: [{ ...emptyDetail }],
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/store-settings`);

        if (response.data.success) {
          const settings = response.data.settings;
          setForm({
            flashSaleEndsAt: toDateTimeLocal(settings.flashSaleEndsAt),
            header: {
              brandName: settings.header?.brandName || "",
              phone: settings.header?.phone || "",
              email: settings.header?.email || "",
              instagramUrl: settings.header?.instagramUrl || "",
              facebookUrl: settings.header?.facebookUrl || "",
              twitterUrl: settings.header?.twitterUrl || "",
              linkedinUrl: settings.header?.linkedinUrl || "",
              adminPanelUrl: settings.header?.adminPanelUrl || "",
            },
            contact: {
              intro: settings.contact?.intro || "",
              address: settings.contact?.address || "",
              phone: settings.contact?.phone || "",
              email: settings.contact?.email || "",
              details:
                settings.contact?.details?.length > 0
                  ? settings.contact.details
                  : [{ ...emptyDetail }],
            },
          });
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleContactChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }));
  };

  const handleHeaderChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [name]: value,
      },
    }));
  };

  const handleDetailChange = (index, field, value) => {
    setForm((prev) => {
      const details = [...prev.contact.details];
      details[index] = { ...details[index], [field]: value };

      return {
        ...prev,
        contact: {
          ...prev.contact,
          details,
        },
      };
    });
  };

  const addDetail = () => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        details: [...prev.contact.details, { ...emptyDetail }],
      },
    }));
  };

  const removeDetail = (index) => {
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        details:
          prev.contact.details.length === 1
            ? [{ ...emptyDetail }]
            : prev.contact.details.filter((_, detailIndex) => detailIndex !== index),
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/store-settings`,
        {
          flashSaleEndsAt: new Date(form.flashSaleEndsAt).toISOString(),
          header: form.header,
          contact: form.contact,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center py-24">
        <p className="font-semibold text-gray-400">Loading settings...</p>
      </main>
    );
  }

  return (
    <main>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
          Store Content
        </p>
        <h1 className="mt-2 text-3xl font-black text-gray-900">Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="space-y-6">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-sm bg-red-50 text-red-500">
                <IoTimeOutline size={22} />
              </span>
              <div>
                <h2 className="font-black">Flash Sale Timer</h2>
                <p className="text-sm font-semibold text-gray-400">
                  Controls the countdown on the home page.
                </p>
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-bold text-gray-600">
                Sale ends at
              </span>
              <input
                type="datetime-local"
                value={form.flashSaleEndsAt}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    flashSaleEndsAt: event.target.value,
                  }))
                }
                required
                className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
              />
            </label>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-sm bg-red-50 text-red-500">
                <IoStorefrontOutline size={22} />
              </span>
              <div>
                <h2 className="font-black">Header</h2>
                <p className="text-sm font-semibold text-gray-400">
                  Controls the top bar, logo text, and admin shortcut.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Brand Name
                </span>
                <input
                  name="brandName"
                  value={form.header.brandName}
                  onChange={handleHeaderChange}
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Admin Panel URL
                </span>
                <input
                  name="adminPanelUrl"
                  value={form.header.adminPanelUrl}
                  onChange={handleHeaderChange}
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-gray-600">Phone</span>
                <input
                  name="phone"
                  value={form.header.phone}
                  onChange={handleHeaderChange}
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-gray-600">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.header.email}
                  onChange={handleHeaderChange}
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["Instagram URL", "instagramUrl"],
                ["Facebook URL", "facebookUrl"],
                ["Twitter URL", "twitterUrl"],
                ["LinkedIn URL", "linkedinUrl"],
              ].map(([label, name]) => (
                <label key={name} className="block space-y-2">
                  <span className="text-sm font-bold text-gray-600">
                    {label}
                  </span>
                  <input
                    name={name}
                    value={form.header[name]}
                    onChange={handleHeaderChange}
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-black">Contact Info</h2>
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-bold text-gray-600">
                  Intro Text
                </span>
                <textarea
                  name="intro"
                  value={form.contact.intro}
                  onChange={handleContactChange}
                  rows={4}
                  className="w-full resize-none rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-gray-600">Address</span>
                <input
                  name="address"
                  value={form.contact.address}
                  onChange={handleContactChange}
                  className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <IoCallOutline /> Phone
                  </span>
                  <input
                    name="phone"
                    value={form.contact.phone}
                    onChange={handleContactChange}
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <IoMailOutline /> Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.contact.email}
                    onChange={handleContactChange}
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-red-400"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-black">Contact Detail Section</h2>
                <p className="text-sm font-semibold text-gray-400">
                  Add small detail blocks shown under the contact form.
                </p>
              </div>
              <button
                type="button"
                onClick={addDetail}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
              >
                <IoAddOutline /> Add Detail
              </button>
            </div>

            <div className="space-y-4">
              {form.contact.details.map((detail, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 md:grid-cols-[1fr_1.4fr_auto]"
                >
                  <input
                    value={detail.title}
                    onChange={(event) =>
                      handleDetailChange(index, "title", event.target.value)
                    }
                    placeholder="Detail title"
                    className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400"
                  />
                  <input
                    value={detail.text}
                    onChange={(event) =>
                      handleDetailChange(index, "text", event.target.value)
                    }
                    placeholder="Detail text"
                    className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400"
                  />
                  <button
                    type="button"
                    aria-label="Remove detail"
                    onClick={() => removeDetail(index)}
                    className="grid h-11 w-11 place-items-center rounded-sm bg-white text-gray-500 hover:bg-red-500 hover:text-white"
                  >
                    <IoRemoveOutline />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-red-500 py-3 text-sm font-bold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <IoSaveOutline />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </section>
      </form>
    </main>
  );
};

export default Settings;
