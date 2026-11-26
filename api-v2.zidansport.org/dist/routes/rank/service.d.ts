import { Sequelize } from "sequelize";
import { CategoryModel, EventModel } from "src/models";
import { ResponseEntity } from "src/types";
export declare class RankService {
    private readonly sequelize;
    private eventModel;
    private categoryModel;
    constructor(sequelize: Sequelize, eventModel: typeof EventModel, categoryModel: typeof CategoryModel);
    rankByYearService(year: number, category_id: number): Promise<ResponseEntity>;
}
