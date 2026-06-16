import * as jwt from "jsonwebtoken"
import dotenv from "dotenv";
import Joi from "joi";
import { User } from "./users/user";

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