import { Router } from "express";
import dotenv from "dotenv";
import { loginUser, registerUser, verifyLogin, verifyRegistration, ViewAllUsers } from "./userController";
import { OtpWithPv, UserRequired, ValidateBody } from "../middleware";
import { userLoginValidator, userRegistrationValidator, userOtpWithPvValidator } from "./userValidators";

dotenv.config();
const userRouter = Router();

userRouter.get(
    "/all", 
    ViewAllUsers
);

userRouter.post(
    "/register", 
    ValidateBody(userRegistrationValidator), 
    registerUser
);

userRouter.post(
    "/verify-registration", 
    ValidateBody(userOtpWithPvValidator),
    OtpWithPv,
    verifyRegistration as any
);

userRouter.post(
    "/login", 
    ValidateBody(userLoginValidator), 
    UserRequired, 
    loginUser as any
);

userRouter.post(
    "/verify-login", 
    ValidateBody(userOtpWithPvValidator),
    OtpWithPv,
    verifyLogin as any
);

export default userRouter;