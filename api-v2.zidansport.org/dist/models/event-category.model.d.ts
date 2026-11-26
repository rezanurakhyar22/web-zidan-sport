import { Model } from 'sequelize-typescript';
import { EventModel } from './event.model';
import { CategoryModel } from './category.model';
import { EventParticipantsModel } from './event-participants.model';
import { EventCategoryMatchResultModel } from './event-category-match-result.model';
export declare class EventCategoryModel extends Model {
    id: number;
    event_id: number;
    event: EventModel;
    category_id: number;
    category: CategoryModel;
    participants: EventParticipantsModel[];
    match_results: EventCategoryMatchResultModel[];
    created_at: Date;
}
