import { Router } from "express";
import { userLoginValidator, userRegistrationValidator } from "./userValidators";
import { User } from "./user";
import { UserLoginForm, UserRegistrationForm } from "../types";
import bcrypt from "bcrypt";

const userRouter = Router();

userRouter.post("/register", async(req, res) => {
    const data: UserRegistrationForm = req.body;
    const validate = userRegistrationValidator.validate(data);
    if(validate.error)
        return res.status(400).send({ message: validate.error.details[0].message });
    
    const existingUser = await User.findOne({ where: { username: data.username } });
    if(existingUser)
        return res.status(400).send({ message: "User already exists" });

    bcrypt.hash(data.password, 12).then(async(hash: string) => {
        await User.create({ username: data.username, password: hash });
        res.status(200).send({ ok: true });
    });
});

userRouter.post("/login", async(req, res) => {
    const data: UserLoginForm = req.body;
    const validate = userLoginValidator.validate(data);
    if(validate.error)
        return res.status(400).send({ message: validate.error.details[0].message });

    const user = await User.findOne({ where: { username: data.username } });
    if(user === null)
        return res.status(400).send({ message: "User does not exist" });

    const isValidPassw: boolean = await bcrypt.compare(data.password, user.password);
    if(isValidPassw)
        return res.status(200).send({ ok: true }); // TODO: return jwt tok
    return res.status(400).send({ message: "Passwords do not match" });
})

export default userRouter;