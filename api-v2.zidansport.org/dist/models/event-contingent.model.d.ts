import { Model } from 'sequelize-typescript';
import { EventParticipantsModel } from './event-participants.model';
import { ContingentModel } from './contingent.model';
export declare class EventContingentModel extends Model {
    id: number;
    contingent_id: number;
    contingent: ContingentModel;
    event_id: number;
    event: Event;
    participants: EventParticipantsModel[];
    created_at: Date;
    updated_at: Date;
}
