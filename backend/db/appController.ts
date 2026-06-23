import { Note } from "./notes/note";
import { PV } from "./pv/pv";
import { sequelize } from "./sequelize";
import { User } from "./users/user";
import { Request, Response } from 'express';

export async function Root(req: Request, res: Response) {
    return res.status(200).send("<h1> Server Works </h1>");
}

export async function Reset(req: Request, res: Response) {
    const transaction = await sequelize.transaction();
    try {
        await User.truncate({ cascade: true, transaction });
        await Note.truncate({ cascade: true, transaction });
        await PV.truncate({ cascade: true, transaction });
    } catch(err) {
        await transaction.rollback();
        return res.status(400).send({ message: err });
    }

    return res.status(200).send({ ok: true });
}