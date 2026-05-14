import storeSettingsModel from "../models/storeSettingsModel.js";

const buildDefaultDeadline = () => {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 2);
  deadline.setHours(23, 59, 59, 999);
  return deadline;
};

const defaultSettings = () => ({
  key: "store-settings",
  flashSaleEndsAt: buildDefaultDeadline(),
  header: {
    brandName: "Tronix",
    phone: "+1 234 567 890",
    email: "support@tronix.com",
    instagramUrl: "#",
    facebookUrl: "#",
    twitterUrl: "#",
    linkedinUrl: "#",
    adminPanelUrl: "https://tronix-ecommerces-2wbi.vercel.app",
  },
  contact: {
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
  },
});

const normalizeSettings = (settings) => {
  const plain = settings?.toObject ? settings.toObject() : settings;
  const fallback = defaultSettings();

  return {
    flashSaleEndsAt:
      plain?.flashSaleEndsAt || fallback.flashSaleEndsAt.toISOString(),
    header: {
      ...fallback.header,
      ...(plain?.header || {}),
    },
    contact: {
      ...fallback.contact,
      ...(plain?.contact || {}),
      details:
        plain?.contact?.details?.length > 0
          ? plain.contact.details
          : fallback.contact.details,
    },
  };
};

const getStoreSettings = async (req, res) => {
  try {
    const settings = await storeSettingsModel.findOne({
      key: "store-settings",
    });

    res.json({
      success: true,
      settings: normalizeSettings(settings),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStoreSettings = async (req, res) => {
  try {
    const { flashSaleEndsAt, header = {}, contact = {} } = req.body;
    const parsedDeadline = new Date(flashSaleEndsAt);

    if (!flashSaleEndsAt || Number.isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid flash sale end date and time.",
      });
    }

    const details = Array.isArray(contact.details)
      ? contact.details
          .map((detail) => ({
            title: String(detail.title || "").trim(),
            text: String(detail.text || "").trim(),
          }))
          .filter((detail) => detail.title || detail.text)
      : [];

    const settings = await storeSettingsModel.findOneAndUpdate(
      { key: "store-settings" },
      {
        key: "store-settings",
        flashSaleEndsAt: parsedDeadline,
        header: {
          brandName: String(header.brandName || "").trim(),
          phone: String(header.phone || "").trim(),
          email: String(header.email || "").trim(),
          instagramUrl: String(header.instagramUrl || "").trim(),
          facebookUrl: String(header.facebookUrl || "").trim(),
          twitterUrl: String(header.twitterUrl || "").trim(),
          linkedinUrl: String(header.linkedinUrl || "").trim(),
          adminPanelUrl: String(header.adminPanelUrl || "").trim(),
        },
        contact: {
          intro: String(contact.intro || "").trim(),
          address: String(contact.address || "").trim(),
          phone: String(contact.phone || "").trim(),
          email: String(contact.email || "").trim(),
          details,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Store settings updated successfully.",
      settings: normalizeSettings(settings),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getStoreSettings, updateStoreSettings };
