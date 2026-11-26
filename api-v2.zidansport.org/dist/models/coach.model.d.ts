import { Model } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { ContingentModel } from './contingent.model';
export declare class CoachModel extends Model {
    id: number;
    user_id: number;
    user: UserModel;
    code: string;
    name: string;
    gender: number;
    date_of_birth: Date;
    photo: string;
    grade: string;
    accreditation_number: string;
    accreditation_issue_by: string;
    accreditation_valid_from: Date;
    accreditation_valid_until: Date;
    accreditation_photo: string;
    verify_status: number;
    contingent_id: number | null;
    contingent?: ContingentModel;
    created_at: Date;
    updated_at: Date;
}
