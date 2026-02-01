import { AuthService } from './auth.service';
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    login(body: LoginDto): Promise<{
        accessToken: string;
    }>;
}
export {};
