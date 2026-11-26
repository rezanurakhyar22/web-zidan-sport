import { Model } from 'sequelize-typescript';
import { ContingentModel } from './contingent.model';
import { UserModel } from './user.model';
import { AthletePointHistoryModel } from './athlete-point-history.model';
import { EventCategoryMatchResultModel } from './event-category-match-result.model';
export declare class AthleteModel extends Model {
    id: number;
    user_id: number;
    user: UserModel;
    code: string;
    name: string;
    gender: number;
    photo: string;
    date_of_birth: Date;
    birth_certificate: string;
    health_insurance: string;
    body_weight: number;
    point: number;
    emergency_contact_name: string;
    emergency_contact_relation: string;
    emergency_contact_phone_number: string;
    point_history: AthletePointHistoryModel[];
    match_results: EventCategoryMatchResultModel[];
    contingent_id: number | null;
    contingent?: ContingentModel;
    is_verified: boolean;
    created_at: Date;
    updated_at: Date;
}
