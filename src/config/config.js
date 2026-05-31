import dotenv from "dotenv";
dotenv.config();
if(!process.env.MONGO_DB_URL){
    throw new Error("Environment variables are not defined ")
}
if(!process.env.JWT_SECRET_KEY){
    throw new Error("Secret key not found ")
}
const config ={
    MONGO_DB_URL: process.env.MONGO_DB_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}
export default config;