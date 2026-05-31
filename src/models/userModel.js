import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username :{
        type: String,
        unique: [true , "Username must be unique"],
        required: [true , "Username should be contained"]
    },
    email :{
        type:String,
        required : [true,"email should be compulsory"],
        unique : [true ,"email should be unique"]
    },
    password :{
        type: String,
        required : [true , "password is required "]
    }
})

const userModel = mongoose.model("users",userSchema)

export default userModel;