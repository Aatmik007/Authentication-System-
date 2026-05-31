import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: [true,"User is required"]
    },
    refreshTokenHash:{
        type: String,
        required: [true,"HashToken is required "]
    },
    ip:{
        type: String,
        required: [true,"ip address is required"]
    },
    userAgent:{
        type: String,
        required: [true,"UserAgent is required"]
    },
    revoked:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const sessionModel = mongoose.model("sessions",sessionSchema)
export default sessionModel;