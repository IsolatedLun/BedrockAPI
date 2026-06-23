import { marked } from "marked";
import { Note } from "./note";
import { NoteCreationForm } from "../types";
import { markdownToPdf } from "@mdpdf/mdpdf";
import { Op } from "sequelize";
import { Request, Response } from 'express';

export async function ViewAllNotes(req: Request, res: Response) {
    const notes = await Note.findAll();
    return res.status(201).send({ notes });
}

export async function ViewNote(req: Request, res: Response) {
    const note = (req as any).note;
    return res.status(201).send(marked.parse(`# ${note.title}\n ${note.text}`));
}

export async function CreateNote(req: Request, res: Response) {
    const user = req.auth;
    const data = req.body;
    const note = await Note.create({ userId: user.id, title: data.title, text: data.text });

    return res.status(201).send({ ok: true, note });
}

export async function DeleteNote(req: Request, res: Response) {
    const note = (req as any).note;

    await Note.destroy({ where: { id: note.id } });
    return res.status(201).send({ ok: true, deleted: true, note });
}

export async function EditNote(req: Request, res: Response) {
    const data: NoteCreationForm = req.body;
    const note = await Note.findByPk((req as any).note.id);

    note.set({ title: data.title, text: data.text });
    await note.save();

    return res.status(201).send(marked.parse(`# ${note.title}\n ${note.text}`));
}

export async function ExportNoteToPDF(req: Request, res: Response) {
    const note = (req as any).note;
    const pdf = await markdownToPdf(`# ${note.title}\n ${note.text}`);

    return res.status(201).send(pdf);
}

export async function SearchNotes(req: Request, res: Response) {
    const authUser = (req as any).auth;
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

    return res.status(201).send({ ok: true, notes: filteredNotes });
}