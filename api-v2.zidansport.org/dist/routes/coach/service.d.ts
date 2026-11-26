import { MailerService } from "@nestjs-modules/mailer";
import { Response } from "express";
import { Sequelize } from "sequelize";
import { UpdateCoachDTO } from "src/dtos";
import { CoachModel, ContingentModel, UserModel } from "src/models";
import { QueryGet, ResponseEntity } from "src/types";
export declare class CoachService {
    private readonly sequelize;
    private userModel;
    private coachModel;
    private contingentModel;
    private mailService;
    constructor(sequelize: Sequelize, userModel: typeof UserModel, coachModel: typeof CoachModel, contingentModel: typeof ContingentModel, mailService: MailerService);
    findAll(query: QueryGet): Promise<ResponseEntity>;
    detail(id: number): Promise<ResponseEntity>;
    getByCode(code: string): Promise<ResponseEntity>;
    downloadIdCard(id: number, res: Response): Promise<void>;
    update(id: number, data: UpdateCoachDTO): Promise<ResponseEntity>;
    verifyCoach(id: number): Promise<ResponseEntity>;
    unverifyCoach(id: number): Promise<ResponseEntity>;
    delete(id: number): Promise<ResponseEntity<any>>;
}
