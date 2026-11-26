import { Model } from 'sequelize-typescript';
import { EventModel } from './event.model';
import { EventCategoryModel } from './event-category.model';
import { AthleteModel } from './athlete.model';
import { EventContingentModel } from './event-contingent.model';
export declare class EventParticipantsModel extends Model {
    id: number;
    athlete_id: number;
    athlete: AthleteModel;
    event_id: number;
    event: EventModel;
    event_contingent_id: number;
    event_contingent: EventContingentModel;
    category_id: number;
    category: EventCategoryModel;
    team_name?: string;
    created_at: Date;
    updated_at: Date;
}
