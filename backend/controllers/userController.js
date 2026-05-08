import validator from 'validator'
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js';


const createToken = (id) => {
    return jwt.sign({ id }, env.jwtSecret, { expiresIn: "7d" })
}

// Route for login user

const loginUser = async (req, res) => {
    try {
        // --- START: Added check for req.body ---
        if (!req.body) {
            return res.status(400).json({ success: false, message: "Request body is empty." });
        }
        // --- END: Added check for req.body ---
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = createToken(user._id)
            return res.status(200).json({
                success: true,
                token,
                user: {
                    name: user.name,
                    email: user.email
                }
            })
        }
        else {
            return res.status(401).json({ success: false, message: "Invalid Credentials" })
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error during login" })
    }
}

const registerUser = async (req, res) => {
    try {
        // --- START: Added check for req.body ---
        if (!req.body) {
            return res.status(400).json({ success: false, message: "Request body is empty." });
        }
        // --- END: Added check for req.body ---
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({ name, email, password: hashedPassword })
        const user = await newUser.save()
        
        const token = createToken(user._id)
        res.status(201).json({
            success: true,
            token,
            user: { name: user.name, email: user.email }
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

const adminLogin = async (req, res) => {
    try {
        // --- START: Added check for req.body ---
        if (!req.body) {
            return res.status(400).json({ success: false, message: "Request body is empty." });
        }
        // --- END: Added check for req.body ---
        const { email, password } = req.body;

        if (email === env.adminEmail && password === env.adminPassword) {
            const token = jwt.sign(
                { email: env.adminEmail, role: "admin" },
                env.jwtSecret,
                { expiresIn: "7d" }
            );
            res.status(200).json({
                success: true,
                token,
                user: { name: "Admin", email: env.adminEmail }
            })
        } else {
            res.status(401).json({ success: false, message: "Invalid Admin Credentials" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message })
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select("-password")
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.json({
            success: true,
            user: { name: user.name, email: user.email }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, getProfile }
