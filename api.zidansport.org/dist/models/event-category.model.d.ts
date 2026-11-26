import { Model } from 'sequelize-typescript';
import { CategoryModel } from './category.model';
import { EventParticipantsModel } from './event-participants.model';
export declare class EventCategoryModel extends Model {
    id: number;
    event_id: number;
    event: Event;
    category_id: number;
    category: CategoryModel;
    participants: EventParticipantsModel[];
    created_at: Date;
}
