import { Model } from 'sequelize-typescript';
import { EventCategoryModel } from './event-category.model';
import { AthleteModel } from './athlete.model';
export declare class EventCategoryMatchResultModel extends Model {
    id: number;
    category_id: number;
    category: EventCategoryModel;
    athlete_id: number;
    athlete: AthleteModel;
    position: number;
    point: number;
    last_match_point: number;
    created_at: Date;
}
