import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    if (decoded.email !== env.adminEmail || decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    res.status(401).json({ success: false, message: "Session expired or invalid token." });
  }
};

export default adminAuth;
