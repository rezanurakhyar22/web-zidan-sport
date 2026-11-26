import { CategoryService } from "./category.service";
import { QueryGet } from "src/types";
import { Request } from "express";
import { CategoryDTO } from "src/dtos";
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
    findAllCategory(query: QueryGet): Promise<import("src/types").ResponseEntity<any>>;
    createCategory(req: Request, data: CategoryDTO): Promise<import("src/types").ResponseEntity<any>>;
    updateCategory(req: Request, id: number, data: CategoryDTO): Promise<import("src/types").ResponseEntity<any>>;
    deleteCategory(req: Request, id: number): Promise<import("src/types").ResponseEntity<any>>;
}
