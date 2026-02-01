import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private config;
    constructor(config: ConfigService);
    login(email: string, password: string): Promise<{
        accessToken: string;
    }>;
    verify(token: string): string | jwt.JwtPayload;
}
