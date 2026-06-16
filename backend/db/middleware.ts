import * as jwt from "jsonwebtoken"
import dotenv from "dotenv";
import Joi from "joi";
import { User } from "./users/user";
import { Note } from "./notes/note";

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
    console.log(user)
    console.log(req.auth)
    if(user.id != req.auth.id)
        return res.status(400).send({ message: `Note with id of "${id}" does not belong to user` });

    req.note = note;
    next();
}