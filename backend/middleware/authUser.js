import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized. Please login again." });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
