import { Model } from 'sequelize-typescript';
export declare class CategoryModel extends Model {
    id: number;
    code: string;
    name: string;
    gender: number;
    min_year: string;
    max_year: string;
    min_body_weight: number;
    max_body_weight: number;
    is_best_of_the_best: boolean;
    is_festival: boolean;
    is_team: boolean;
    team_members: number;
    type: number;
    created_at: Date;
    updated_at: Date;
}
