import * as jwt from "jsonwebtoken"
import dotenv from "dotenv";
import Joi from "joi";
import { User } from "./users/user";
import { Note } from "./notes/note";
import { PV } from "./pv/pv";
import { MAX_PV_ATTEMPTS, PV_COOLDOWN } from "../common";
import { UserOtpWithPvForm } from "./types";

dotenv.config();

export function VerifyUser(req: any, res: any, next: any) {
    const tok: string = req.headers["authorization"].split(" ")[1];
    if(tok === null)
        return res.status(401).send({ message: "JWT token is missing" });

    try {
        const payload = jwt.verify(tok, process.env.JWT_SECRET || "secret");
        req.auth = payload;
        next();
    } catch(err) {
        return res.status(400).send({ message: "Invalid JWT token" });
    }
}

export function ValidateBody(validator: Joi.ObjectSchema) {
    return (req: any, res: any, next: any) => {
        const validate = validator.validate(req.data);
        if(validate.error)
            return res.status(400).send({ message: validate.error.details[0].message });
        next();
    }
}

export async function UserRequired(req: any, res: any, next: any) {
    const user = await User.findOne({ where: { username: req.body.username } });
    if(user === null)
        return res.status(400).send({ message: "User does not exist" });

    req.auth = user;
    next();
}

export async function ProtectedNote(req: any, res: any, next: any) {
    const id: number = parseInt(req.params["id"] as string);
    if(isNaN(id))
        return res.status(400).send({ message: `"${id}" is an invalid id` });

    const note = await Note.findByPk(id);
    if(note === null)
        return res.status(400).send({ message: `Note with id of "${id}" not found` });

    const user = await User.findByPk(note.userId);
    if(user.id != req.auth.id)
        return res.status(400).send({ message: `Note with id of "${id}" does not belong to user` });

    req.note = note;
    next();
}

export async function OtpWithPv(req: any, res: any, next: any) {
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