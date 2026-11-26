export declare class UserResetPasswordDTO {
    password: String;
    confirmPassword: String;
    token: String;
}
export declare class UserUpdateDTO {
    name?: String;
    password?: String;
    confirm_password?: String;
    phone?: String;
    gender?: String;
    date_of_birth?: Date;
    photo?: String;
}
export declare class ContingentDTO {
    name: string;
    branch: string;
    photo: string;
    event_id: number;
}
