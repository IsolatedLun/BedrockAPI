import { Router } from "express";
import dotenv from "dotenv";
import { NoteCreationForm, NoteSearchForm } from "../types";
import { noteCreationValidator, noteSearchValidator } from "./noteValidators";
import { User } from "../users/user";
import { Note } from "./note";
import { marked } from "marked";
import { _expressjwt } from "../../common";
import { Op } from "sequelize";

dotenv.config();

const noteRouter = Router();

noteRouter.get("/all", async(req, res) => { 
    const notes = await Note.findAll();
    return res.status(200).send({ notes });
});

noteRouter.get("/:id", _expressjwt, async(req, res) => { 
    const authUser = (req as any).auth;
    const id: number = parseInt(req.params["id"] as string);
    if(isNaN(id))
        return res.status(400).send({ message: `"${id}" is an invalid id` });

    const note = await Note.findByPk(id);
    if(note === null)
        return res.status(400).send({ message: `Note with id of "${id}" not found` });

    const user = await User.findByPk(note.userId);
    if(user.id != authUser.id)
        return res.status(400).send({ message: `Note with id of "${id}" does not belong to user` });

    return res.status(200).send(marked.parse(`# ${note.title}\n ${note.text}`));
});

noteRouter.post("/create", _expressjwt,  async(req, res) => {
    const data: NoteCreationForm = req.body;
    const validate = noteCreationValidator.validate(data);
    if(validate.error)
        return res.status(400).send({ message: validate.error.details[0].message });

    const user = await User.findOne({ where: { id: (req as any).auth.id } });
    if(user === null)
        return res.status(400).send({ message: "User does not exist" });
    
    const note = await Note.create({ userId: user.id, title: data.title, text: data.text });

    return res.status(200).send({ ok: true, note });
});

noteRouter.delete("/delete/:id", _expressjwt, async(req, res) => {
    const authUser = (req as any).auth;
    const id: number = parseInt(req.params["id"] as string);
    if(isNaN(id))
        return res.status(400).send({ message: `"${id}" is an invalid id` });

    const note = await Note.findByPk(id);
    if(note === null)
        return res.status(400).send({ message: `Note with id of "${id}" not found` });

    const user = await User.findByPk(note.userId);
    if(user === null || user.id != authUser.id)
        return res.status(400).send({ message: `Note with id of "${id}" does not belong to user` });

    await Note.destroy({ where: { id: note.id } });
    return res.status(200).send({ ok: true, deleted: true, note });
});

noteRouter.patch("/edit/:id", _expressjwt, async(req, res) => {
    const authUser = (req as any).auth;
    const data: NoteCreationForm = req.body;
    const validate = noteCreationValidator.validate(data);
    if(validate.error)
        return res.status(400).send({ message: validate.error.details[0].message });

    const id: number = parseInt(req.params["id"] as string);
    if(isNaN(id))
        return res.status(400).send({ message: `"${id}" is an invalid id` });

    const note = await Note.findByPk(id);
    if(note === null)
        return res.status(400).send({ message: `Note with id of "${id}" not found` });

    const user = await User.findByPk(note.userId);
    if(user === null || user.id != authUser.id)
        return res.status(400).send({ message: `Note with id of "${id}" does not belong to user` });

    note.set({ title: data.title, text: data.text });
    await note.save();

    return res.status(200).send(marked.parse(`# ${note.title}\n ${note.text}`));
});

// ========
// ========

noteRouter.post("/search", _expressjwt, async(req, res) => {
    const authUser = (req as any).auth;
    const data: NoteSearchForm = req.body;
    const validate = noteSearchValidator.validate(data);
    if(validate.error)
        return res.status(400).send({ message: validate.error.details[0].message });

    const user = await User.findByPk(authUser.id);
    if(user === null)
        return res.status(400).send({ message: "User does not exist" });

    const filteredNotes = await Note.findAll({
        where: {
            userId: authUser.id,
            [Op.or]: [
                {
                    title: { [Op.like]: `%${data.title ?? ""}%` }
                },
                {
                    text: { [Op.like]: `%${data.text ?? ""}%` }
                }
            ]
        }
    });

    return res.status(200).send({ ok: true, notes: filteredNotes });
});

export default noteRouter;