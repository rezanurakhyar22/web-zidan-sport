import { Sequelize } from "sequelize-typescript";
import { CategoryDTO } from "src/dtos";
import { CategoryModel, EventCategoryModel } from "src/models";
import { QueryGet, ResponseEntity } from "src/types";
export declare class CategoryService {
    private readonly sequelize;
    private categoryModel;
    private eventCategoryModel;
    constructor(sequelize: Sequelize, categoryModel: typeof CategoryModel, eventCategoryModel: typeof EventCategoryModel);
    findAll(query: QueryGet): Promise<ResponseEntity>;
    getAll(): Promise<ResponseEntity<CategoryModel[]>>;
    create(data: CategoryDTO): Promise<ResponseEntity<any>>;
    update(id: number, data: CategoryDTO): Promise<ResponseEntity<any>>;
    delete(id: number): Promise<ResponseEntity<any>>;
}
