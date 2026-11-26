import { AuthService } from "./auth.service";
import { MailerService } from "@nestjs-modules/mailer";
import { RegisterDTO } from "src/dtos";
import { Request } from "express";
export declare class AuthController {
    private authService;
    private mailService;
    constructor(authService: AuthService, mailService: MailerService);
    register(req: Request, body: RegisterDTO): Promise<any>;
    login(req: Request, body: any): Promise<any>;
    refresh(refreshToken: string): Promise<import("../../types").ResponseEntity<any>>;
    requestResetPassword(email: string): Promise<import("../../types").ResponseEntity<string>>;
    logout(token: string): Promise<import("../../types").ResponseEntity<any>>;
}
