import  config  from "./config.js";
import mongoose from "mongoose";

async function connectDB(){
    await mongoose.connect(config.MONGO_DB_URL)
    console.log("Connected to database")

}
export default connectDB;