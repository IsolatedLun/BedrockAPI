import * as jwt from "jsonwebtoken"
import dotenv from "dotenv";
import Joi from "joi";
import { User, UserAttrs } from "./users/user";
import { Note } from "./notes/note";
import { PV } from "./pv/pv";
import { MAX_PV_ATTEMPTS, PV_COOLDOWN } from "../common";
import { UserOtpWithPvForm } from "./types";
import { Request, Response, NextFunction } from "express";

dotenv.config();

export function VerifyUser(req: Request, res: Response, next: NextFunction) {
    const tok: string = req.headers["authorization"].split(" ")[1];
    if(!tok)
        return res.status(401).send({ message: "JWT token is missing" });

    try {
        const payload = jwt.verify(tok, process.env.JWT_SECRET || "secret") as UserAttrs;
        req.auth = payload;
        next();
    } catch(err) {
        return res.status(400).send({ message: "Invalid JWT token" });
    }
}

export function ValidateBody(validator: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validate = validator.validate(req.body);
        if(validate.error)
            return res.status(400).send({ message: validate.error.details[0].message });
        next();
    }
}

export async function UserRequired(req: Request, res: Response, next: NextFunction) {
    const user = await User.findOne({ where: { username: req.body.username } });
    if(user === null)
        return res.status(400).send({ message: "User does not exist" });

    req.auth = user;
    next();
}

export async function ProtectedNote(req: Request, res: Response, next: NextFunction) {
    const id: number = parseInt(req.params["id"] as string);
    if(isNaN(id))
        return res.status(400).send({ message: `"${id}" is an invalid id` });

    const user = await User.findByPk(req.auth.id);
    if(!user)
        return res.status(400).send({ message: `Note with id of "${id}" does not belong to user` });

    const note = await Note.findByPk(id);
    if(!note)
        return res.status(400).send({ message: `Note with id of "${id}" not found` });

    req.note = note;
    next();
}

export async function OtpWithPv(req: Request, res: Response, next: NextFunction) {
    const data: UserOtpWithPvForm = req.body;
    const pv = await PV.findOne({ where: { token: data.token } });

    if(pv.attempts >= MAX_PV_ATTEMPTS) {
        const timePassed = Date.now() - pv.lastAttempt.getTime();
        if(timePassed < PV_COOLDOWN) {
            const timeLeft = ((PV_COOLDOWN - timePassed) / 1000).toFixed(1);
            return res.status(400).send({ message: `Too many attempts, please try again later in ${timeLeft}s` });
        }
        else
            pv.attempts = 0;
    }

    if (pv.otp !== data.otp) {
        pv.attempts++;
        pv.lastAttempt = new Date();
        await pv.save();

        return res.status(400).send({ message: "Invalid OTP" });
    }

    await pv.destroy();
    const user = await User.findOne({ where: { username: pv.username } });
    if (!user)
        return res.status(404).send({ message: "User not found" });

    req.auth = user;
    next();
}