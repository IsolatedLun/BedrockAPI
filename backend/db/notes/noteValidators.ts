import Joi from "joi";
import { NoteCreationForm } from "../types";

export const noteCreationValidator = Joi.object<NoteCreationForm>({
    title: Joi.string().min(1).required(),
    text: Joi.string().min(1).required()
});