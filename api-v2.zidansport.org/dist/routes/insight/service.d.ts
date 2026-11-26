import { Sequelize } from "sequelize";
import { AthleteModel, CoachModel, ContingentModel } from "src/models";
import { ResponseEntity } from "src/types";
export declare class InsightService {
    private readonly sequelize;
    private contingentModel;
    private athleteModel;
    private coachModel;
    constructor(sequelize: Sequelize, contingentModel: typeof ContingentModel, athleteModel: typeof AthleteModel, coachModel: typeof CoachModel);
    getInsightService(): Promise<ResponseEntity>;
}
