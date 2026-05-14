import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  getStoreSettings,
  updateStoreSettings,
} from "../controllers/storeSettingsController.js";

const storeSettingsRouter = express.Router();

storeSettingsRouter.get("/", getStoreSettings);
storeSettingsRouter.post("/", adminAuth, updateStoreSettings);

export default storeSettingsRouter;
