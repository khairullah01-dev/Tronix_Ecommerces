import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'


const adminAuth =async (req,res,next) => {
    try{
    const {token} = req.headers
if(!token){
    return res.json({success:false,message:"Not Authorized login Again"})
}
/*
Previous code:
const decoded = jwt.verify(token, process.env.JWT_SECRET);

What changed:
- JWT secret now comes from config/env.js.
*/
const decoded = jwt.verify(token, env.jwtSecret);
// console.log(decoded)

/*
Previous code:
if(decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)

What changed:
- Admin credentials now come from env.js.
*/
if(decoded !== env.adminEmail + env.adminPassword ){
    return res.json({success:false,message:"Not Authorized login Again"})
   

 }next()

    }catch(error){
 console.log(error)
 res.json({success:false,message:error.message})
    }
}

export default adminAuth;
