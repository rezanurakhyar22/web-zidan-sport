export declare class ParticipantDTO {
    name: string;
    gender: number;
    date_of_birth: Date;
    photo: string;
    birth_certificate: string;
    health_insurance: string;
    body_weight: number;
    event_id: number;
    contingent_id: number;
    category_id: number;
}
export declare class UpdateParticipantDTO {
    name?: string;
    gender?: number;
    date_of_birth?: Date;
    photo?: string;
    birth_certificate?: string;
    health_insurance?: string;
    body_weight?: number;
    category_id?: number;
}
