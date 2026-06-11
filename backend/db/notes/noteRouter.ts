import { Router } from "express";
import { expressjwt } from "express-jwt";
import { NoteCreationForm } from "../types";
import { noteCreationValidator } from "./noteValidators";
import { User } from "../users/user";
import { Note } from "./note";

const noteRouter = Router();
const _expressjwt = expressjwt({ secret: process.env.JWT_SECRET || "secret", algorithms: ["HS256"] });

noteRouter.post("/create", _expressjwt,  async(req, res) => {
    const data: NoteCreationForm = req.body;
    const validate = noteCreationValidator.validate(data);
    if(validate.error)
        return res.status(400).send({ message: validate.error.details[0].message });

    const user = await User.findOne({ where: { username: (req as any).auth.username } });
    const note = await Note.create({ userId: user.id, title: data.title, text: data.text });

    return res.status(200).send({ ok: true, note });
});

export default noteRouter;