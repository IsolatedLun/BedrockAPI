import { marked } from "marked";
import { Note } from "./note";
import { NoteCreationForm } from "../types";
import { markdownToPdf } from "@mdpdf/mdpdf";
import { Op } from "sequelize";

export async function ViewAllNotes(req: any, res: any) {
    const notes = await Note.findAll();
    return res.status(200).send({ notes });
}

export async function ViewNote(req: any, res: any) {
    const note = req.note;
    return res.status(200).send(marked.parse(`# ${note.title}\n ${note.text}`));
}

export async function CreateNote(req: any, res: any) {
    const user = req.auth;
    const data = req.body;
    const note = await Note.create({ userId: user.id, title: data.title, text: data.text });

    return res.status(200).send({ ok: true, note });
}

export async function DeleteNote(req: any, res: any) {
    const note = req.note;

    await Note.destroy({ where: { id: note.id } });
    return res.status(200).send({ ok: true, deleted: true, note });
}

export async function EditNote(req: any, res: any) {
    const data: NoteCreationForm = req.body;
    const note = await Note.findByPk(req.note.id);

    note.set({ title: data.title, text: data.text });
    await note.save();

    return res.status(200).send(marked.parse(`# ${note.title}\n ${note.text}`));
}

export async function ExportNoteToPDF(req: any, res: any) {
    const note = req.note;
    const pdf = await markdownToPdf(`# ${note.title}\n ${note.text}`);

    return res.status(200).send(pdf);
}

export async function SearchNotes(req: any, res: any) {
    const authUser = req.auth;
    const data = req.body;
    const filteredNotes = await Note.findAll({
        where: {
            userId: authUser.id,
            [Op.or]: [
                {
                    title: { [Op.like]: `%${data.title ?? ""}` }
                },
                {
                    text: { [Op.iLike]: `%${data.text ?? ""}%` }
                }
            ]
        }
    });

    return res.status(200).send({ ok: true, notes: filteredNotes });
}