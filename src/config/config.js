import dotenv from "dotenv";
dotenv.config();
if(!process.env.MONGO_DB_URL){
    throw new Error("Environment variables are not defined ")
}
if(!process.env.JWT_SECRET_KEY){
    throw new Error("Secret key not found ")
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("Invalid client id")
}
if(process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("Invalid google client secret")
}
if(!process.env.GOOGLE_REFRESH_TOKEN){
    throw new Error("Invalid refresh token")
}
if(!process.env.GOOGLE_ACCOUNT){
    throw new Error("Invalid user ")
}
const config ={
    MONGO_DB_URL: process.env.MONGO_DB_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
}
export default config;