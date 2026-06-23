import { Request } from 'express';
import { UserAttrs } from './users/user';
import { NoteAttrs } from './notes/note';

declare global {
    namespace Express {
        interface Request {
            auth?: UserAttrs,
            note?: NoteAttrs,
            data?: any;
        }
    }
}

// users
export interface UserRegistrationForm {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
};

export interface UserOtpWithPvForm {
    token: string;
    otp: string;
};

export interface UserLoginForm {
    username: string;
    password: string;
}

export interface UserLoginWithOTPForm { 
    token: string;
    otp: string;
}

export interface UserPasswResetForm {
    username: string;
    email: string;
    newPassword: string
}

// notes
export interface NoteCreationForm {
    title: string;
    text: string;
}

export interface NoteSearchForm {
    title: string;
    text: string;
}

// misc
export type AuthRequest = Request & { auth: UserAttrs };