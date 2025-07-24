import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {// kế thừa từ passportStrategy nên tên mặc định của stratergy là jwt
  constructor(private configService: ConfigService) {
    super({
        // { ..., name: 'custom-jwt' } đổi tên strategy
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!, // <-- Quan trọng!
    });
  }
// sau khi giải mã token thành công
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
