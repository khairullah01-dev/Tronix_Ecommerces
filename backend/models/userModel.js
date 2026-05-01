import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        // Previous code: require:true
        // Mongoose validation needs `required:true`.
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cartData:{
        type:Object,
        default:{}
    }
},{minimize:false})

const userModel = mongoose.model("user",userSchema)

export default userModel;
