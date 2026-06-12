// users
export interface UserRegistrationForm {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
};

export interface UserLoginForm {
    username: string;
    password: string;
}

export interface UserLoginWithOTPForm {
    email: string;
    otp: string;
}


// notes
export interface NoteCreationForm {
    title: string;
    text: string;
}