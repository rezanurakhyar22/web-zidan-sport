import { Model } from 'sequelize-typescript';
import { EventCategoryModel } from './event-category.model';
import { EventParticipantsModel } from './event-participants.model';
import { ContingentModel } from './contingent.model';
export declare class EventModel extends Model {
    id: number;
    code: string;
    name: string;
    organizer: string;
    photo: string;
    start_date: Date;
    end_date: Date;
    reg_start_date: Date;
    reg_end_date: Date;
    location: string;
    location_map: string;
    recap_link: string;
    created_at: Date;
    updated_at: Date;
    categories: EventCategoryModel[];
    participants: EventParticipantsModel[];
    contingents: ContingentModel[];
}
