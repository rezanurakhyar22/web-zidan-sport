export declare class EventDTO {
    name: string;
    organizer?: string;
    photo?: string;
    start_date?: Date;
    end_date?: Date;
    reg_start_date?: Date;
    reg_end_date?: Date;
    location?: string;
    location_map?: string;
    is_series?: boolean;
    categories?: any[];
}
declare class Athlete {
    athlete_id: number;
    category_id: number;
}
export declare class RegisterToEventDTO {
    contingent_id: number;
    athletes: Athlete[];
}
export declare class CancelReasonDTO {
    reason: string;
}
export declare class MatchResult {
    position: number;
    athlete_id: number;
    last_match_point?: number;
}
export declare class EventMatchResultDTO {
    results: MatchResult[];
    total_participants?: number;
}
export {};
