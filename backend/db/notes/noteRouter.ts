import { Router } from "express";
import { noteCreationValidator, noteSearchValidator } from "./noteValidators";
import { ProtectedNote, ValidateBody, VerifyUser } from "../middleware";
import { CreateNote, DeleteNote, EditNote, ExportNoteToPDF, SearchNotes, ViewAllNotes, ViewNote } from "./noteController";
import dotenv from "dotenv";

dotenv.config();
const noteRouter = Router();

noteRouter.get(
    "/all", 
    ViewAllNotes
);

noteRouter.get(
    "/:id", 
    VerifyUser, 
    ProtectedNote, 
    ViewNote
);

noteRouter.post(
    "/create",
    VerifyUser, 
    ValidateBody(noteCreationValidator), 
    CreateNote
);

noteRouter.delete(
    "/delete/:id", 
    VerifyUser, 
    ProtectedNote, 
    DeleteNote
);

noteRouter.patch(
    "/edit/:id", 
    VerifyUser, 
    ProtectedNote, 
    ValidateBody(noteCreationValidator), 
    EditNote
);

noteRouter.get(
    "/export-pdf/:id", 
    VerifyUser, 
    ProtectedNote, 
    ExportNoteToPDF
);

noteRouter.post(
    "/search", 
    VerifyUser, 
    ValidateBody(noteSearchValidator), 
    SearchNotes
);

export default noteRouter;