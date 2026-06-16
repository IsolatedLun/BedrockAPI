import argon2 from "argon2";
import { AuthRequest, UserLoginForm, UserLoginWithOTPForm, UserRegistrationForm } from "../types";
import { User } from "./user";
import { emailTransporter, otpAuth } from "../../common";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PV } from "../pv/pv";
import { generateRandTok } from "../../utils";
import { Request, Response } from 'express';

dotenv.config();

export async function ViewAllUsers(req: Request, res: Response) {
    const users = await User.findAll();
    return res.status(200).send({ users });
}

export async function registerUser(req: Request, res: Response) {
    const data: UserRegistrationForm = req.body;
    
    const existingUser = await User.findOne({ where: { username: data.username, email: data.email } });
    if(existingUser)
        return res.status(400).send({ message: "User already exists" });

    try {
        const passwHash = await argon2.hash(data.password);
        await User.create({ username: data.username, email: data.email, password: passwHash });
        await PV.create({ otp: otpAuth.generate(), attempts: 0, token: generateRandTok(), username: data.username });

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
}

export async function loginUser(req: AuthRequest, res: Response) {
    const data: UserLoginForm = req.body;
    const user = req.auth;

    const isValidPassw: boolean = await argon2.verify(user.password, data.password);
    if(isValidPassw) {
        const otp: string = otpAuth.generate();
        emailTransporter.sendMail({
            to: user.email,
            subject: `BedrockAPI OTP Login - ${otp}`,
            html: `Use <b>${otp}</b> to log into BedrockAPI`
        })

        return res.status(200).send({ otp: otpAuth.generate() });
    }
    return res.status(400).send({ message: "Passwords do not match" });
}

export async function loginUserWithOTP(req: AuthRequest, res: Response) {
    const data: UserLoginWithOTPForm = req.body;
    const user = req.auth;

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
}