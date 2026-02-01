import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const h = req.headers['authorization'] as string | undefined;

    if (!h?.startsWith('Bearer ')) throw new UnauthorizedException('No token');
    const token = h.slice('Bearer '.length).trim();
    const payload = this.auth.verify(token);
    req.user = payload;
    return true;
  }
}
