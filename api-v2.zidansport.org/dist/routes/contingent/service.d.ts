import { MailerService } from "@nestjs-modules/mailer";
import { Sequelize } from "sequelize";
import { UpdateContingentDTO } from "src/dtos";
import { AthleteModel, ContingentModel, EventModel, UserModel } from "src/models";
import { QueryGet, ResponseEntity } from "src/types";
export declare class ContingentService {
    private readonly sequelize;
    private contingentModel;
    private athleteModel;
    private userModel;
    private eventModel;
    private mailService;
    constructor(sequelize: Sequelize, contingentModel: typeof ContingentModel, athleteModel: typeof AthleteModel, userModel: typeof UserModel, eventModel: typeof EventModel, mailService: MailerService);
    findAll(query: QueryGet): Promise<ResponseEntity>;
    getAll(): Promise<ResponseEntity>;
    detail(id: number): Promise<ResponseEntity>;
    historyEvent(id: number): Promise<ResponseEntity>;
    update(id: number, data: UpdateContingentDTO): Promise<ResponseEntity>;
    verifyContingent(id: number): Promise<ResponseEntity>;
    unverifyContingent(id: number): Promise<ResponseEntity>;
    verifyAthlete(user_id: number, athlete_id: number): Promise<ResponseEntity<any>>;
    expelAthlete(user_id: number, athlete_id: number): Promise<ResponseEntity>;
    delete(id: number): Promise<ResponseEntity<any>>;
}
