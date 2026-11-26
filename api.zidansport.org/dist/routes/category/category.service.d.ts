import { Sequelize } from "sequelize-typescript";
import { CategoryDTO } from "src/dtos";
import { CategoryModel, EventCategoryModel } from "src/models";
import { QueryGet, ResponseEntity } from "src/types";
export declare class CategoryService {
    private readonly sequelize;
    private categoryModel;
    private eventCategoryModel;
    constructor(sequelize: Sequelize, categoryModel: typeof CategoryModel, eventCategoryModel: typeof EventCategoryModel);
    findAllCategories(query: QueryGet): Promise<ResponseEntity>;
    createCategory(data: CategoryDTO): Promise<ResponseEntity<any>>;
    updateCategory(id: number, data: CategoryDTO): Promise<ResponseEntity<any>>;
    deleteCategory(id: number): Promise<ResponseEntity<any>>;
}
