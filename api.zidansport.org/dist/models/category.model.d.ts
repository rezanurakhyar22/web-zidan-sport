import { Model } from 'sequelize-typescript';
import { EventCategoryModel } from './event-category.model';
export declare class CategoryModel extends Model {
    id: number;
    name: string;
    gender: number;
    min_year: string;
    max_year: string;
    min_body_weight: number;
    max_body_weight: number;
    created_at: Date;
    updated_at: Date;
    event_categories: EventCategoryModel[];
}
