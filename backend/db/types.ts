// users
export interface UserRegistrationForm {
    username: string;
    password: string;
    repeatPassword: string;
};

export interface UserLoginForm {
    username: string;
    password: string;
}

// notes
export interface NoteCreationForm {
    title: string;
    text: string;
}