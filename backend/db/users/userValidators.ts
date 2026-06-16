import Joi from "joi";
import { UserLoginForm, UserLoginWithOTPForm, UserPasswResetForm, UserRegistrationForm, UserVerifyRegistration } from "../types";

export const userRegistrationValidator = Joi.object<UserRegistrationForm>({
    username: Joi.string().alphanum().min(2).max(32).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(2).max(8).required(),
    repeatPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .label("Repeat Password")
        .messages({ 'any.only': '{{#label}} must match the password' })
});

export const userVerifyRegistrationValidator = Joi.object<UserVerifyRegistration>({
    token: Joi.string().required(),
    otp: Joi.string().required()
})

export const userLoginValidator = Joi.object<UserLoginForm>({
    username: Joi.string().alphanum().min(2).max(32).required(),
    password: Joi.string().min(2).max(8).required()
});

export const userPassswResetValidator = Joi.object<UserPasswResetForm>({
    username: Joi.string().alphanum().min(2).max(32).required(),
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(2).max(8).required()
});

export const userLoginWithOTPValidator = Joi.object<UserLoginWithOTPForm>({
    otp: Joi.string().required()
});