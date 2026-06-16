import argon2 from "argon2";
import { AuthRequest, UserLoginForm, UserLoginWithOTPForm, UserRegistrationForm, UserVerifyRegistration } from "../types";
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

export async function verifyRegistration(req: Request, res: Response) {
    const data: UserVerifyRegistration = req.body;
    const pv = await PV.findOne({
        where: { token: data.token }
    });

    if (pv.otp !== data.otp) {
        pv.attempts++;
        await pv.save();

        return res.status(400).send({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ where: { username: pv.username } });
    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    user.verified = true;
    await user.save();
    await pv.destroy();

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
    const data: UserLoginWithOTPForm = req.body;
    const pv = await PV.findOne({ where: { token: data.token } });

    if (pv.otp !== data.otp) {
        pv.attempts++;

        await pv.save();

        return res.status(400).send({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ where: { username: pv.username } });
    if (!user)
        return res.status(404).send({ message: "User not found" });

    const jwtTok = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password
    }, process.env.JWT_SECRET || "secret"); jwtTok;

    await pv.destroy();
    return res.status(200).send({ jwtTok });
}