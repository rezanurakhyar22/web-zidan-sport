import { ParticipantService } from "././participant.service";
import { ParticipantDTO, UpdateParticipantDTO } from "src/dtos";
export declare class ParticipantController {
    private participantService;
    constructor(participantService: ParticipantService);
    getParticipantsByContingentId(contingent_id: number): Promise<import("../../types").ResponseEntity<any>>;
    createParticipant(data: ParticipantDTO): Promise<import("../../types").ResponseEntity<any>>;
    updateParticipant(id: number, data: UpdateParticipantDTO): Promise<import("../../types").ResponseEntity<any>>;
    deleteParticipant(id: number): Promise<import("../../types").ResponseEntity<any>>;
}
