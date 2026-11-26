import { CategoryModel, EventModel, EventParticipantsModel, UserModel } from "src/models";
import { ResponseEntity } from "src/types";
export declare class InsightService {
    private eventModel;
    private eventParticipantsModel;
    private categoryModel;
    private userModel;
    constructor(eventModel: typeof EventModel, eventParticipantsModel: typeof EventParticipantsModel, categoryModel: typeof CategoryModel, userModel: typeof UserModel);
    getInsight(): Promise<ResponseEntity>;
}
