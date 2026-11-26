import { EventService } from "./service";
import { QueryGet } from "src/types";
import { CancelReasonDTO, EventDTO, EventMatchResultDTO, RegisterToEventDTO } from "src/dtos";
import { Request, Response } from "express";
export declare class EventController {
    private eventService;
    constructor(eventService: EventService);
    findAll(query: QueryGet): Promise<import("src/types").ResponseEntity<any>>;
    getInfo(): Promise<import("src/types").ResponseEntity<any>>;
    createEvent(req: Request, data: EventDTO): Promise<import("src/types").ResponseEntity<any>>;
    exportEvents(req: Request, id: number, res: Response): Promise<void>;
    registerToEvent(req: Request, id: number, data: RegisterToEventDTO): Promise<import("src/types").ResponseEntity<any>>;
    findOne(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    getCategoryWinners(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    findParticipant(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    findCategoryMatchResults(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    postMatchResults(req: Request, id: number, data: EventMatchResultDTO): Promise<import("src/types").ResponseEntity<any>>;
    cancelEvent(req: Request, id: number, data: CancelReasonDTO): Promise<import("src/types").ResponseEntity<any>>;
    findOneByCode(code: string): Promise<import("src/types").ResponseEntity<any>>;
    updateEvent(req: Request, id: number, data: EventDTO): Promise<import("src/types").ResponseEntity<any>>;
    deleteParticipant(req: Request, event_id: number, id: number): Promise<import("src/types").ResponseEntity<any>>;
    deleteCategory(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    deleteContingent(req: Request, event_id: number, id: number): Promise<import("src/types").ResponseEntity<any>>;
    deleteCategoryMatchResults(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    delete(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
}
