export declare const language: (lang: string) => {
    to_many_register_attempt: string;
    to_many_login_attempt: string;
    email_already_exist: (v: string) => string;
    password_does_not_match: string;
};
