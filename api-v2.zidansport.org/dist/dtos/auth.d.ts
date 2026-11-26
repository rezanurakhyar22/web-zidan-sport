export declare class RegisterDTO {
    uid: string;
    access: number;
    name: string;
    email: string;
    phone: string;
    gender: number;
    date_of_birth: Date;
    password: string;
    confirm_password: string;
    contingent_name: string;
    contingent_abbreviation: string;
}
export declare class LoginDTO {
    uid: string;
    email: string;
    password: string;
    captcha_token?: string;
    captcha_answer?: string;
}
