import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { expressjwt } from "express-jwt";

dotenv.config();

export const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_GMAIL_USER,
    pass: process.env.NODEMAILER_GMAIL_PASSW,
  },
});

export const _expressjwt = expressjwt({ secret: process.env.JWT_SECRET || "secret", algorithms: ["HS256"] });