// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
@Module({
  // inject module config vào 
  imports: [
    UserModule,
    PassportModule,
        // Sử dụng JWT cấu hình từ env 
        // import để dùng cho module khác 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [jwtConfig.KEY],
      useFactory: (jwtConf: ConfigType<typeof jwtConfig>) => ({
        secret: jwtConf.secret,
        signOptions: {
          expiresIn: jwtConf.expiresIn,
        },
      }),
    }),


    ConfigModule,
  ],
  providers: [ AuthService,], // đã được cho vào module nên có thể tìm và dùng authGuard('jwt)
  exports: [JwtModule, AuthService], controllers: [AuthController], // để module khác import dùng
})
export class AuthModule {}
