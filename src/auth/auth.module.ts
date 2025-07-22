// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'JWT_SECRET', // dùng env
      signOptions: { expiresIn: '1d' },
    // signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1d' },
    }),
    ConfigModule,
  ],
  providers: [JwtStrategy], // đã được cho vào module nên có thể tìm và dùng authGuard('jwt)
  exports: [JwtModule], // để module khác import dùng
})
export class AuthModule {}
