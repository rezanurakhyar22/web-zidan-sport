import { AthleteService } from "./service";
import { QueryGet } from "src/types";
import { ExtraPointDTO, UpdateAthleteDTO } from "src/dtos";
import { Request, Response } from "express";
export declare class AthleteController {
    private athleteService;
    constructor(athleteService: AthleteService);
    findAll(query: QueryGet): Promise<import("src/types").ResponseEntity<any>>;
    findByContingent(contingent_id: number, query: {
        is_verified: boolean;
    }): Promise<import("src/types").ResponseEntity<any>>;
    detail(id: number): Promise<import("src/types").ResponseEntity<any>>;
    downloadIdCard(id: number, res: Response): Promise<void>;
    detailByCode(code: string): Promise<import("src/types").ResponseEntity<any>>;
    update(id: number, data: UpdateAthleteDTO): Promise<import("src/types").ResponseEntity<any>>;
    postExtraPoint(req: Request, id: number, data: ExtraPointDTO): Promise<import("src/types").ResponseEntity<any>>;
    delete(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
}
