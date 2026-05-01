import validator from 'validator'
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js';




const createToken = (id) => {
    /*
    Previous code:
    return jwt.sign({ id }, process.env.JWT_SECRET)

    What changed:
    - JWT secret now comes from config/env.js.
    - Token now expires after 7 days for better security.
    */
    return jwt.sign({ id }, env.jwtSecret, { expiresIn: "7d" })
}

// Route for login user

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = createToken(user._id)
            // Previous response only returned token.
            // New response returns token + user name/email so frontend can show "Hi, Name".
            return res.json({
                success: true,
                token,
                user: {
                    name: user.name,
                    email: user.email
                }
            })
        }
        else {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }


}

// for Register User
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        // chcking user exist
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exist" })

        }
        // validator email format & strong password

        if (!validator.isEmail(email)) {

            return res.json({ success: false, message: "Please Enter the valid Email" })

        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password 

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({ name, email, password: hashedPassword })
        const user = await newUser.save()
        console.log("saved user", user)


        const token = createToken(user._id)

        // Previous register response only returned token.
        // New response returns token + user name/email so the name shows immediately after signup.
        res.json({
            success: true,
            token,
            user: {
                name: user.name,
                email: user.email
            }
        })





    }
    catch (error) {

        console.log(error)
        res.json({ success: false, message: "Something went wrong" })
    }

}

// for admin login

const adminLogin = async (req, res) => {
    try {
       const { email, password } = req.body;
       console.log(email,password);
       
    /*
    Previous code:
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const token = jwt.sign(email+password, process.env.JWT_SECRET)
    }

    What changed:
    - Admin email/password/JWT secret now come from env.js.
    - Token has an expiry time.
    */
    if(email === env.adminEmail && password === env.adminPassword){
        console.log("hhhh")
       const token = jwt.sign(
  { email: env.adminEmail, role: "admin" },
  env.jwtSecret,
  { expiresIn: "7d" }
);
        // Admin login does not use userModel.
        // So we return an admin display object instead of user.name from database.
        console.log 
        res.json({
            success: true,
            token,
            user: {
                name: "Admin",
                email: env.adminEmail
            }
        })
    }else{
        res.json({ success: false, message: "Invalid Credentials" })
    }

}catch(error){
console.log(error)
res.json({ success: false, message: error.message })    
}
}

const getProfile = async (req, res) => {
    try {
        /*
        New function:
        Frontend needs the user's name after page refresh.
        authUser checks the token and gives us req.userId.
        */
        const user = await userModel.findById(req.userId).select("-password")

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.json({
            success: true,
            user: {
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

export { loginUser, registerUser, adminLogin, getProfile }
