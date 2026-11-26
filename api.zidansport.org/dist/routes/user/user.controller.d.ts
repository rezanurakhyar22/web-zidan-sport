import { UserService } from "./user.service";
import { QueryGet } from "src/types";
import { ContingentDTO, UserResetPasswordDTO, UserUpdateDTO } from "src/dtos";
import { Request } from "express";
export declare class USerController {
    private userService;
    constructor(userService: UserService);
    pushToJson(data: Record<string, string>): Promise<void>;
    getAll(query: QueryGet): Promise<import("src/types").ResponseEntity<any>>;
    getById(id: number): Promise<import("src/types").ResponseEntity<any>>;
    getContingentByEventId(user_id: number, event_id: number): Promise<import("src/types").ResponseEntity<any>>;
    createContingent(req: Request, data: any): Promise<import("src/types").ResponseEntity<undefined>>;
    updateContingent(user_id: number, id: number, data: ContingentDTO): Promise<import("src/types").ResponseEntity<any>>;
    update(id: number, data: UserUpdateDTO): Promise<import("src/types").ResponseEntity<any>>;
    resetPassword(data: UserResetPasswordDTO): Promise<import("src/types").ResponseEntity<any>>;
    deleteContingent(id: number): Promise<import("src/types").ResponseEntity<any>>;
    delete(id: number): Promise<import("src/types").ResponseEntity<any>>;
}
