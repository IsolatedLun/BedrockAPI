import { Note } from "./notes/note";
import { PV } from "./pv/pv";
import { User } from "./users/user";

export async function Root(req: any, res: any) {
    return res.status(200).send("<h1> Server Works </h1>");
}

export async function Reset(req: any, res: any) {
    await User.truncate({ cascade: true });
    await Note.truncate({ cascade: true });
    await PV.truncate({ cascade: true });

    return res.status(200).send({ ok: true });
}