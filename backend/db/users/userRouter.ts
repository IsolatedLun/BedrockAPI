import { Router } from "express";
import dotenv from "dotenv";
import { loginUser, loginUserWithOTP, registerUser, ViewAllUsers } from "./userController";
import { UserRequired, ValidateBody } from "../middleware";
import { userLoginValidator, userLoginWithOTPValidator, userRegistrationValidator } from "./userValidators";

dotenv.config();

const userRouter = Router();

userRouter.get("/all", ViewAllUsers);

userRouter.post("/register", ValidateBody(userRegistrationValidator), registerUser);
userRouter.post("/login", ValidateBody(userLoginValidator), UserRequired, loginUser);
userRouter.post("/login-otp", ValidateBody(userLoginWithOTPValidator), UserRequired, loginUserWithOTP);

export default userRouter;