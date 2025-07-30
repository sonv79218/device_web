// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret, 
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule,
  ],
  providers: [ AuthService,], // đã được cho vào module nên có thể tìm và dùng authGuard('jwt)
  exports: [JwtModule, AuthService], controllers: [AuthController], // để module khác import dùng
})
export class AuthModule {}
