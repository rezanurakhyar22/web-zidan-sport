import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import { Sequelize } from "sequelize-typescript";
import { LoginDTO, RegisterDTO } from "src/dtos";
import { ContingentModel, EventModel, UserLoginHistoryModel, UserModel } from "src/models";
import { ResponseEntity } from "src/types";
export declare class AuthService {
    private readonly sequelize;
    private userModel;
    private eventModel;
    private contingentModel;
    private userLoginHistoryModel;
    private jwtService;
    private mailService;
    constructor(sequelize: Sequelize, userModel: typeof UserModel, eventModel: typeof EventModel, contingentModel: typeof ContingentModel, userLoginHistoryModel: typeof UserLoginHistoryModel, jwtService: JwtService, mailService: MailerService);
    register(data: RegisterDTO, ip?: string): Promise<any>;
    login(data: LoginDTO, ip?: string): Promise<any>;
    refreshToken(refreshToken: string): Promise<ResponseEntity>;
    requestResetPassword(email: string): Promise<ResponseEntity<string>>;
    logout(token: string): Promise<ResponseEntity<any>>;
}
