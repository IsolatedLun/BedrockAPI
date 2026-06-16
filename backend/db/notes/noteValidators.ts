import Joi from "joi";
import { NoteCreationForm, NoteSearchForm } from "../types";

export const noteCreationValidator = Joi.object<NoteCreationForm>({
    title: Joi.string().min(1).required(),
    text: Joi.string().min(1).required()
});

export const noteSearchValidator = Joi.object<NoteSearchForm>({
    title: Joi.string(),
    text: Joi.string()
});