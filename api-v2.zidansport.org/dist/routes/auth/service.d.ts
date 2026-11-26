import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import { Sequelize } from "sequelize";
import { LoginDTO, RegisterDTO } from "src/dtos";
import { AthleteModel, AthletePointHistoryModel, CoachModel, ContingentModel, RefreshTokenModel, UserLoginHistoryModel, UserModel } from "src/models";
import { ResponseEntity } from "src/types";
export declare class AuthService {
    private readonly sequelize;
    private userModel;
    private contingentModel;
    private athleteModel;
    private coacheModel;
    private refreshTokenModel;
    private userLoginHistoryModel;
    private athletePointHistoryModel;
    private jwtService;
    private mailService;
    constructor(sequelize: Sequelize, userModel: typeof UserModel, contingentModel: typeof ContingentModel, athleteModel: typeof AthleteModel, coacheModel: typeof CoachModel, refreshTokenModel: typeof RefreshTokenModel, userLoginHistoryModel: typeof UserLoginHistoryModel, athletePointHistoryModel: typeof AthletePointHistoryModel, jwtService: JwtService, mailService: MailerService);
    getCaptcha(): Promise<ResponseEntity<any>>;
    register(data: RegisterDTO, ip?: string): Promise<any>;
    login(data: LoginDTO): Promise<any>;
    refreshToken(refreshToken: string): Promise<ResponseEntity>;
    requestResetPassword(email: string): Promise<ResponseEntity<string>>;
    logout(token: string): Promise<ResponseEntity<any>>;
}
