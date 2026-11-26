import { AuthService } from "./service";
import { LoginDTO, RegisterDTO } from "src/dtos";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    getCaptcha(): Promise<any>;
    register(body: RegisterDTO): Promise<any>;
    login(body: LoginDTO): Promise<any>;
    refresh(refreshToken: string): Promise<import("../../types").ResponseEntity<any>>;
    requestResetPassword(email: string): Promise<import("../../types").ResponseEntity<string>>;
    logout(token: string): Promise<import("../../types").ResponseEntity<any>>;
}
