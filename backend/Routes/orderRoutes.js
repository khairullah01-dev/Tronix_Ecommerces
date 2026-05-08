import express from "express";
import {
  allOrders,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateStatus,
  userOrders,
  verifyRazorpay,
  verifyStripe,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/authUser.js";

const orderRouter = express.Router();

// User routes
orderRouter.post("/place",            authUser, placeOrder);
orderRouter.post("/stripe",           authUser, placeOrderStripe);
orderRouter.post("/razorpay",         authUser, placeOrderRazorpay);
orderRouter.post("/verify-stripe",    authUser, verifyStripe);
orderRouter.post("/verify-razorpay",  authUser, verifyRazorpay);
orderRouter.get("/userorders",        authUser, userOrders);

// Admin routes
orderRouter.get("/list",    adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

export default orderRouter;
