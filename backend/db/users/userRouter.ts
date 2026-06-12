import { Router } from "express";
import { userLoginValidator, userRegistrationValidator } from "./userValidators";
import { User } from "./user";
import { UserLoginForm, UserRegistrationForm } from "../types";
import argon2 from "argon2";
import * as jwt from "jsonwebtoken";

const userRouter = Router();

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
        await User.create({ username: data.username, password: passwHash });
        res.status(200).send({ ok: true });
    } catch {
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
            password: user.password
        }, process.env.JWT_SECRET || "secret");

        return res.status(200).send({ tok });
    }
    return res.status(400).send({ message: "Passwords do not match" });
})

export default userRouter;