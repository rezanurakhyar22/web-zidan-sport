import { Model } from 'sequelize-typescript';
import { UserModel } from './user.model';
export declare class RefreshTokenModel extends Model {
    id: number;
    user_id: number;
    user: UserModel;
    token: string;
    created_at: Date;
}
