import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'YOUR_SECRET_KEY_HERE',
    });
  }

  async validate(payload: any) {
    const userId = Number(payload.sub);
    return {
      userId: Number.isFinite(userId) ? userId : -1,
      email: payload.email,
      role: payload.role,
    };
  }
}
