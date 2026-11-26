import { Model } from 'sequelize-typescript';
import { UserLoginHistoryModel } from './user-login-history.model';
import { CoachModel } from './coach.model';
import { AthleteModel } from './athlete.model';
import { ContingentModel } from './contingent.model';
import { RefreshTokenModel } from './refresh-token.model';
export declare class UserModel extends Model {
    id: number;
    name: string;
    password: string;
    gender: number;
    date_of_birth: Date;
    access: number;
    email: string;
    phone: string;
    reset_password_token: string;
    is_verified: boolean;
    photo: string;
    is_deleted: boolean;
    user_login_histories: UserLoginHistoryModel[];
    refresh_tokens?: RefreshTokenModel[];
    coach?: CoachModel;
    athlete?: AthleteModel;
    contingent?: ContingentModel;
    updated_at: Date;
    created_at: Date;
}
