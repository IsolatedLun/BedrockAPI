import argon2 from "argon2";
import { AuthRequest, UserLoginForm, UserRegistrationForm } from "../types";
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
        const pvTok = generateRandTok();
        const otp = otpAuth.generate();

        await User.create({ username: data.username, email: data.email, password: passwHash, verified: false });
        await PV.create({ otp, attempts: 0, token: pvTok, username: data.username });

        emailTransporter.sendMail({
            from: "noreply_bedrock@gmail.com",
            to: data.email,
            subject: "Bedrock Registration Verification",
            html: `Your verification code is <b>${otp}</b>`
        });

        res.status(200).send({ ok: true, pvTok });
    } catch(e) {
        res.status(400).send({ message: "Something went wrong" });
    }
}

export async function verifyRegistration(req: AuthRequest, res: Response) {
    const user = await User.findOne({ where: { username: req.auth.username } });

    user.verified = true;
    await user.save();

    return res.status(200).send({ ok: true, message: "Account verified" });
}

export async function loginUser(req: AuthRequest, res: Response) {
    const data: UserLoginForm = req.body;
    const user = req.auth;

    const isValidPassw: boolean = await argon2.verify(user.password, data.password);
    if(isValidPassw) {
        const otp: string = otpAuth.generate();
        const pvTok = generateRandTok();
        await PV.create({ otp, attempts: 0, token: pvTok, username: data.username });

        emailTransporter.sendMail({
            to: user.email,
            subject: `BedrockAPI OTP Login - ${otp}`,
            html: `Use <b>${otp}</b> to log into BedrockAPI`
        })

        return res.status(200).send({ pvTok });
    }
    return res.status(400).send({ message: "Passwords do not match" });
}

export async function verifyLogin(req: AuthRequest, res: Response) {
    const jwtTok = jwt.sign({
        id: req.auth.id,
        username: req.auth.username,
        email: req.auth.email,
        password: req.auth.password
    }, process.env.JWT_SECRET || "secret"); jwtTok;

    return res.status(200).send({ jwtTok });
}