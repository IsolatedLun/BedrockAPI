import { Router } from "express";
import dotenv from "dotenv";
import { loginUser, loginUserWithOTP, registerUser } from "./userController";
import { UserRequired, ValidateBody } from "../middleware";
import { userLoginValidator, userLoginWithOTPValidator, userRegistrationValidator } from "./userValidators";
import { User } from "./user";

dotenv.config();

const userRouter = Router();

// Add OTP to registeration

userRouter.get("/all", async(req, res) => {
    const users = await User.findAll();
    return res.status(200).send({ users });
});


userRouter.post("/register", ValidateBody(userRegistrationValidator), registerUser);
userRouter.post("/login", ValidateBody(userLoginValidator), UserRequired, loginUser);
userRouter.post("/login-otp", ValidateBody(userLoginWithOTPValidator), UserRequired, loginUserWithOTP);

export default userRouter;