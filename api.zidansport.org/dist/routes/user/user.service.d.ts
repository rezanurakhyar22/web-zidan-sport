import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import { Sequelize } from "sequelize-typescript";
import { ContingentDTO, UserResetPasswordDTO, UserUpdateDTO } from "src/dtos";
import { ContingentModel, UserModel } from "src/models";
import { QueryGet, ResponseEntity } from "src/types";
export declare class UserService {
    private readonly sequelize;
    private userModel;
    private contingentModel;
    private mailService;
    private jwtService;
    constructor(sequelize: Sequelize, userModel: typeof UserModel, contingentModel: typeof ContingentModel, mailService: MailerService, jwtService: JwtService);
    private readonly filePath;
    private ensureFileExists;
    readJson(): Promise<any[]>;
    pushToJson(newData: any): Promise<void>;
    findAllUsers(query: QueryGet): Promise<ResponseEntity>;
    findUserById(id: number): Promise<ResponseEntity>;
    getUserContingentByEventId(user_id: number, event_id: number): Promise<ResponseEntity>;
    createContingent(id: number, data: ContingentDTO): Promise<ResponseEntity<undefined>>;
    updateUser(id: number, data: UserUpdateDTO): Promise<ResponseEntity>;
    updateUserContingent(id: number, user_id: number, data: ContingentDTO): Promise<ResponseEntity<any>>;
    resetPassword({ password, confirmPassword, token }: UserResetPasswordDTO): Promise<ResponseEntity>;
    deleteContingent(id: number): Promise<ResponseEntity<any>>;
    deleteUser(id: number): Promise<ResponseEntity<any>>;
}
