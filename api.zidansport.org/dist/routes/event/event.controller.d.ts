import { EventService } from "./event.service";
import { QueryGet } from "src/types";
import { EventDTO } from "src/dtos";
import { Request, Response } from "express";
export declare class EventController {
    private eventService;
    constructor(eventService: EventService);
    exportEvents(req: Request, id: number, res: Response): Promise<void>;
    findAllEvents(query: QueryGet): Promise<import("src/types").ResponseEntity<any>>;
    findEventById(id: number): Promise<import("src/types").ResponseEntity<any>>;
    findEventByCode(code: string): Promise<import("src/types").ResponseEntity<any>>;
    createEvent(req: Request, data: EventDTO): Promise<import("src/types").ResponseEntity<any>>;
    updateEvent(req: Request, id: number, data: EventDTO): Promise<import("src/types").ResponseEntity<any>>;
    deleteEventCategory(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
    deleteEvent(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
}
