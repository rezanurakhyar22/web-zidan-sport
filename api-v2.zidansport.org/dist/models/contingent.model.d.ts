import { Model } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { AthleteModel } from './athlete.model';
import { CoachModel } from './coach.model';
export declare class ContingentModel extends Model {
    id: number;
    user_id: number;
    user: UserModel;
    code: string;
    abbreviation: string;
    name: string;
    logo: string;
    is_ban: boolean;
    is_verified: boolean;
    athletes: AthleteModel[];
    coaches: CoachModel[];
    created_at: Date;
    updated_at: Date;
}
