import { Note } from "./notes/note";
import { PV } from "./pv/pv";
import { User } from "./users/user";
import { Request, Response } from 'express';

export async function Root(req: Request, res: Response) {
    return res.status(200).send("<h1> Server Works </h1>");
}

export async function Reset(req: Request, res: Response) {
    await User.truncate({ cascade: true });
    await Note.truncate({ cascade: true });
    await PV.truncate({ cascade: true });

    return res.status(200).send({ ok: true });
}