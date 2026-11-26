import { ContingentService } from "./service";
import { QueryGet } from "src/types";
import { Request } from "express";
import { UpdateContingentDTO } from "src/dtos";
export declare class ContingentController {
    private contingentService;
    constructor(contingentService: ContingentService);
    findAll(query: QueryGet): Promise<import("src/types").ResponseEntity<any>>;
    getAll(): Promise<import("src/types").ResponseEntity<any>>;
    detail(id: number): Promise<import("src/types").ResponseEntity<any>>;
    historyEvent(id: number): Promise<import("src/types").ResponseEntity<any>>;
    verifyContingent(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    unverifyContingent(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    verifyAthlete(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    unverifyAthlete(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    update(req: Request, id: number, data: UpdateContingentDTO): Promise<import("src/types").ResponseEntity<any>>;
    delete(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
}
