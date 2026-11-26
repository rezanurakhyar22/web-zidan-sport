import { Response } from "express";
import { Sequelize } from "sequelize";
import { ExtraPointDTO, UpdateAthleteDTO } from "src/dtos";
import { AthleteModel, AthletePointHistoryModel, ContingentModel, EventCategoryMatchResultModel, UserModel } from "src/models";
import { QueryGet, ResponseEntity } from "src/types";
export declare class AthleteService {
    private readonly sequelize;
    private athleteModel;
    private userModel;
    private contingentModel;
    private eventCategoryMatchResultModel;
    private athletePointHistoryModel;
    constructor(sequelize: Sequelize, athleteModel: typeof AthleteModel, userModel: typeof UserModel, contingentModel: typeof ContingentModel, eventCategoryMatchResultModel: typeof EventCategoryMatchResultModel, athletePointHistoryModel: typeof AthletePointHistoryModel);
    findAll(query: QueryGet): Promise<ResponseEntity>;
    findByContingent(contingent_id: number, is_verified?: boolean): Promise<ResponseEntity>;
    findUnverifiedAthleteByContingent(contingent_id: number): Promise<ResponseEntity>;
    detail(id: number): Promise<ResponseEntity>;
    getAthleteByCode(code: string): Promise<ResponseEntity>;
    downloadIdCard(id: number, res: Response): Promise<void>;
    update(id: number, data: UpdateAthleteDTO): Promise<ResponseEntity>;
    postExtraPoint(id: number, data: ExtraPointDTO): Promise<ResponseEntity>;
    resetAllPoint(): Promise<ResponseEntity<any>>;
    delete(id: number): Promise<ResponseEntity<any>>;
}
