import { Model } from 'sequelize-typescript';
import { UserModel } from './user.model';
export declare class UserLoginHistoryModel extends Model {
    id: number;
    user_id: number;
    user: UserModel;
    is_login: boolean;
    ip_address: string;
    location: string;
    created_at: Date;
}
