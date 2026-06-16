import { Router } from "express";
import { userLoginValidator, userLoginWithOTPValidator, userRegistrationValidator } from "./userValidators";
import argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { User } from "./user";
import { UserLoginForm, UserLoginWithOTPForm, UserRegistrationForm } from "../types";
import dotenv from "dotenv";
import { emailTransporter, otpAuth } from "../../common";

dotenv.config();

const userRouter = Router();

userRouter.get("/all", async(req, res) => {
    const users = await User.findAll();
    return res.status(200).send({ users });
});

userRouter.post("/register", async(req, res) => {
    const data: UserRegistrationForm = req.body;
    const validate = userRegistrationValidator.validate(data);
    if(validate.error)
        return res.status(400).send({ message: validate.error.details[0].message });
    
    const existingUser = await User.findOne({ where: { username: data.username } });
    if(existingUser)
        return res.status(400).send({ message: "User already exists" });

    try {
        const passwHash = await argon2.hash(data.password);
        await User.create({ username: data.username, email: data.email, password: passwHash });

        emailTransporter.sendMail({
            from: "noreply_bedrock@gmail.com",
            to: data.email,
            subject: "Bedrock Registration",
            html: `Registration for "${data.username}" successful, please continue to the login page`
        });

        res.status(200).send({ ok: true });
    } catch(e) {
        res.status(400).send({ message: "Something went wrong" });
    }
});

userRouter.post("/login", async(req, res) => {
    const data: UserLoginForm = req.body;
    const validate = userLoginValidator.validate(data);
    if(validate.error)
        return res.status(400).send({ message: validate.error.details[0].message });

    const user = await User.findOne({ where: { username: data.username } });
    if(user === null)
        return res.status(400).send({ message: "User does not exist" });

    const isValidPassw: boolean = await argon2.verify(user.password, data.password);
    if(isValidPassw) {
        const tok = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password
        }, process.env.JWT_SECRET || "secret"); tok;

        const otp: string = otpAuth.generate();
        emailTransporter.sendMail({
            to: user.email,
            subject: `BedrockAPI OTP Login - ${otp}`,
            html: `Use <b>${otp}</b> to log into BedrockAPI`
        })

        return res.status(200).send({ otp: otpAuth.generate() });
    }
    return res.status(400).send({ message: "Passwords do not match" });
});

userRouter.post("/login-otp", async(req, res) => {
    const data: UserLoginWithOTPForm = req.body;
    const validate = userLoginWithOTPValidator.validate(data);
    if(validate.error)
        return res.status(400).send({ message: validate.error.details[0].message });

    const user = await User.findOne({ where: { username: data.username } });
    if(user === null)
        return res.status(400).send({ message: "User does not exist" });

    if(otpAuth.validate({ token: data.otp, window: 1 }) === null) {
        return res.status(400).send({ message: "OTP is invalid" });
    }

    const tok = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password
    }, process.env.JWT_SECRET || "secret"); tok;

    return res.status(200).send({ tok });
});

export default userRouter;