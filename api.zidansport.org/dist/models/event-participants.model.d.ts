import { Model } from 'sequelize-typescript';
import { ContingentModel } from './contingent.model';
import { EventCategoryModel } from './event-category.model';
export declare class EventParticipantsModel extends Model {
    id: number;
    name: string;
    gender: number;
    date_of_birth: Date;
    photo: string;
    birth_certificate: string;
    health_insurance: string;
    body_weight: number;
    event_id: number;
    event: Event;
    contingent_id: number;
    contingent: ContingentModel;
    category_id: number;
    category: EventCategoryModel;
    created_at: Date;
    updated_at: Date;
}
