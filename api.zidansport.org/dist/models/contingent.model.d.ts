import { Model } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { EventParticipantsModel } from './event-participants.model';
export declare class ContingentModel extends Model {
    id: number;
    name: string;
    branch: string;
    photo: string;
    user_id: number;
    user: UserModel;
    event_id: number;
    event: Event;
    participants: EventParticipantsModel[];
    created_at: Date;
    updated_at: Date;
}
