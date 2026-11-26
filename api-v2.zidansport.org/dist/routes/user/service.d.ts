import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import { Sequelize } from "sequelize";
import { UserResetPasswordDTO, UserUpdateDTO } from "src/dtos";
import { UserModel } from "src/models";
import { QueryGet, ResponseEntity } from "src/types";
export declare class UserService {
    private readonly sequelize;
    private userModel;
    private mailService;
    private jwtService;
    constructor(sequelize: Sequelize, userModel: typeof UserModel, mailService: MailerService, jwtService: JwtService);
    findAll(query: QueryGet): Promise<ResponseEntity>;
    detail(id: number): Promise<ResponseEntity>;
    update(id: number, data: UserUpdateDTO): Promise<ResponseEntity>;
    resetPassword({ password, confirm_password, token }: UserResetPasswordDTO): Promise<ResponseEntity>;
    delete(id: number): Promise<ResponseEntity<any>>;
}
