import { Model } from 'sequelize-typescript';
import { UserLoginHistoryModel } from './user-login-history.model';
import { ContingentModel } from './contingent.model';
export declare class UserModel extends Model {
    id: number;
    name: string;
    username: string;
    password: string;
    gender: number;
    date_of_birth: Date;
    permission_level: number;
    email: string;
    phone: string;
    reset_password_token: string;
    refresh_token: string;
    is_verified: boolean;
    photo: string;
    is_delete: boolean;
    register_ip: string;
    created_at: Date;
    updated_at: Date;
    user_login_histories: UserLoginHistoryModel[];
    contingents: ContingentModel[];
}
