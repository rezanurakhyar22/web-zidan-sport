import { Model } from 'sequelize-typescript';
import { AthleteModel } from './athlete.model';
import { CategoryModel } from './category.model';
export declare class AthletePointHistoryModel extends Model {
    id: number;
    athlete_id: number;
    athlete: AthleteModel;
    point: number;
    event_id: number;
    category_id: number;
    category: CategoryModel;
    is_extra_point: boolean;
    is_reset: boolean;
    description: string;
    created_at: Date;
}
