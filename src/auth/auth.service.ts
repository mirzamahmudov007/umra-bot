import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private config: ConfigService) {}

  async login(email: string, password: string) {
    const ADMIN_EMAIL = this.config.get<string>('ADMIN_EMAIL')!;
    const ADMIN_PASSWORD = this.config.get<string>('ADMIN_PASSWORD')!;
    const JWT_SECRET = this.config.get<string>('JWT_SECRET')!;

    if (email !== ADMIN_EMAIL)
      throw new UnauthorizedException('Wrong credentials');

    // oddiy: envda plain tursa ham bo'ladi (MVP).
    // xohlasang hash qilib saqlaysan.
    const ok = password === ADMIN_PASSWORD;
    if (!ok) throw new UnauthorizedException('Wrong credentials');

    const token = jwt.sign({ sub: 'admin', role: 'ADMIN' }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return { accessToken: token };
  }

  verify(token: string) {
    const JWT_SECRET = this.config.get<string>('JWT_SECRET')!;
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
