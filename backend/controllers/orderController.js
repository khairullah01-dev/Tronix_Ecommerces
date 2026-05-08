import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { env } from "../config/env.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialise gateways only if keys exist in .env
const stripe = env.stripe?.secretKey ? new Stripe(env.stripe.secretKey) : null;
const razorpay =
  env.razorpay?.keyId && env.razorpay?.keySecret
    ? new Razorpay({ key_id: env.razorpay.keyId, key_secret: env.razorpay.keySecret })
    : null;

const FRONTEND_URL = env.frontendUrl || "http://localhost:5173";

// ─── COD ──────────────────────────────────────────────────────────────────────

const placeOrder = async (req, res) => {
  try {
    const { items, amount, address, paymentMethod = "COD" } = req.body;

    if (!items?.length) {
      return res.status(400).json({ success: false, message: "Order items are required" });
    }

    const newOrder = await orderModel.create({
      userId: req.userId,
      items,
      amount,
      address,
      paymentMethod,
      payment: false, // COD — paid on delivery
      date: Date.now(),
    });

    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });
    res.json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Stripe Checkout ──────────────────────────────────────────────────────────

const placeOrderStripe = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: "Stripe is not configured. Add STRIPE_SECRET_KEY to backend .env",
      });
    }

    const { items, amount, address } = req.body;
    if (!items?.length) {
      return res.status(400).json({ success: false, message: "Order items are required" });
    }

    // Save order (payment pending)
    const newOrder = await orderModel.create({
      userId: req.userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    });

    // Build Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Shipping line item
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping" },
        unit_amount: 1500,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${FRONTEND_URL}/order?payment=success&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${FRONTEND_URL}/placeorder?payment=canceled`,
      metadata: { orderId: newOrder._id.toString() },
    });

    res.json({ success: true, session_url: session.url, orderId: newOrder._id });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Stripe payment after redirect
const verifyStripe = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ success: false, message: "Stripe not configured." });
    }

    const { orderId, session_id } = req.body;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Processing" });
      await userModel.findByIdAndUpdate(req.userId, { cartData: {} });
      return res.json({ success: true, message: "Stripe payment verified" });
    }

    res.json({ success: false, message: "Payment not completed" });
  } catch (error) {
    console.error("Stripe verify error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Razorpay ─────────────────────────────────────────────────────────────────

const placeOrderRazorpay = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend .env",
      });
    }

    const { items, amount, address } = req.body;
    if (!items?.length) {
      return res.status(400).json({ success: false, message: "Order items are required" });
    }

    // Save order (payment pending)
    const newOrder = await orderModel.create({
      userId: req.userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    });

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: newOrder._id.toString(),
    });

    res.json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder._id,
      key: env.razorpay.keyId,
    });
  } catch (error) {
    console.error("Razorpay error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Razorpay payment HMAC signature
const verifyRazorpay = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", env.razorpay.keySecret)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Processing" });
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    res.json({ success: true, message: "Razorpay payment verified" });
  } catch (error) {
    console.error("Razorpay verify error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── User ─────────────────────────────────────────────────────────────────────

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status are required" });
    }
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  userOrders,
  allOrders,
  updateStatus,
};
