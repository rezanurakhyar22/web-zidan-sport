import { EventDTO } from "src/dtos";
import { QueryGet, ResponseEntity } from "src/types";
import { Response } from "express";
import { Sequelize } from "sequelize-typescript";
import { ContingentModel, EventCategoryModel, EventModel, EventParticipantsModel } from "src/models";
export declare class EventService {
    private readonly sequelize;
    private eventModel;
    private eventCategoryModel;
    private eventParticipantsModel;
    private contingentModel;
    constructor(sequelize: Sequelize, eventModel: typeof EventModel, eventCategoryModel: typeof EventCategoryModel, eventParticipantsModel: typeof EventParticipantsModel, contingentModel: typeof ContingentModel);
    exportParticipants(res: Response, eventId: number): Promise<void>;
    findAllEvents(query: QueryGet): Promise<ResponseEntity>;
    findEventById(id: number): Promise<ResponseEntity>;
    findEventByCode(code: string): Promise<ResponseEntity>;
    createEvent(data: EventDTO): Promise<ResponseEntity>;
    updateEvent(id: number, data: EventDTO): Promise<ResponseEntity>;
    deleteEventCategory(id: number): Promise<ResponseEntity>;
    deleteEvent(id: number): Promise<ResponseEntity>;
}
