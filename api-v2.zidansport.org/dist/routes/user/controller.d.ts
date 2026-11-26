import { UserService } from "./service";
import { UserResetPasswordDTO, UserUpdateDTO } from "src/dtos";
import { QueryGet } from "src/types";
import { Request } from "express";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAll(req: Request, query: QueryGet): Promise<import("src/types").ResponseEntity<any>>;
    getById(id: number): Promise<import("src/types").ResponseEntity<any>>;
    update(id: number, data: UserUpdateDTO): Promise<import("src/types").ResponseEntity<any>>;
    resetPassword(data: UserResetPasswordDTO): Promise<import("src/types").ResponseEntity<any>>;
    delete(id: number): Promise<import("src/types").ResponseEntity<any>>;
}
