import { ParticipantDTO, UpdateParticipantDTO } from "src/dtos";
import { EventParticipantsModel } from "src/models";
import { ResponseEntity } from "src/types";
export declare class ParticipantService {
    private eventParticipantsModel;
    constructor(eventParticipantsModel: typeof EventParticipantsModel);
    getParticipantsByContingentId(contingent_id: number): Promise<ResponseEntity>;
    createParticipant(data: ParticipantDTO): Promise<ResponseEntity>;
    updateParticipant(id: number, data: UpdateParticipantDTO): Promise<ResponseEntity<any>>;
    deleteParticipant(id: number): Promise<ResponseEntity<any>>;
}
