import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { expressjwt } from "express-jwt";
import * as OTPAuth from "otpauth";

dotenv.config();

export const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_GMAIL_USER,
    pass: process.env.NODEMAILER_GMAIL_PASSW,
  },
});

export const _expressjwt = expressjwt({ secret: process.env.JWT_SECRET || "secret", algorithms: ["HS256"] });
export const otpAuth = new OTPAuth.TOTP({
  issuer: "ACME",
  label: "Alice",
  algorithm: "SHA256",
  digits: 6,
  period: parseInt(process.env.OTP_PERIOD) || 45,
  secret: process.env.OTP_SECRET || "secret"
});