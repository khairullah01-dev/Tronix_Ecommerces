import express from 'express'
import { loginUser,registerUser,adminLogin, getProfile } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
// Profile route is protected by authUser.
// Frontend uses it after refresh to load the saved user's name/email from token.
userRouter.get('/profile', authUser, getProfile)


export default userRouter;
