import { Router } from "express";
const authRouter = Router();
import * as authController from "../controller/authController.js"


authRouter.post("/register",authController.registerUser)

authRouter.post("/login",authController.login)

authRouter.get("/get-me",authController.get_me)

authRouter.get("/refresh",authController.RefreshToken)

authRouter.get("/logout",authController.logout)

authRouter.get("logout-all",authController.logoutAll)

authRouter.post("otp",authController.otp)

export default authRouter;