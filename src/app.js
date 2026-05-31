import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";

const app = express();


app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth",authRouter)
app.use(cookieParser());

export default app;