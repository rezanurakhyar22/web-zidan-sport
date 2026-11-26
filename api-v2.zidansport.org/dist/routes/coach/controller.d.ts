import { CoachService } from "./service";
import { QueryGet } from "src/types";
import { UpdateCoachDTO } from "src/dtos";
import { Request, Response } from "express";
export declare class CoachController {
    private coachService;
    constructor(coachService: CoachService);
    findAll(query: QueryGet): Promise<import("src/types").ResponseEntity<any>>;
    detail(id: number): Promise<import("src/types").ResponseEntity<any>>;
    getByCode(code: string): Promise<import("src/types").ResponseEntity<any>>;
    downloadIdCard(id: number, res: Response): Promise<void>;
    update(id: number, data: UpdateCoachDTO): Promise<import("src/types").ResponseEntity<any>>;
    verifyCoach(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    unverifyCoach(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    delete(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
}
