// src/app.module.ts
import { Module} from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { AppDataSource } from './data-source';
import { UserModule } from './user/user.module';
import { BorrowRequestModule } from './borrow-request/borrow-request.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule,ConfigService } from '@nestjs/config'; // module config đc cài sẵn trong nestjs 
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { Product } from './product/entities/product.entity';
import { User } from './user/entities/user.entity';
import { BorrowRequest } from './borrow-request/entities/borrow-request.entity';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
// import * as redisStore from 'cache-manager-ioredis-yet';
@Module({
  imports: [
    CacheModule.register({
      // ttl: 0, // TTL mặc định
      isGlobal: true, // ✅ toàn cục
    }),
    // tùy chỉnh configmodule
    ConfigModule.forRoot({// module cho phép bạn đọc .env và tự cấu hình hệ thống theo biến môi trường.
      isGlobal: true,
      load: [databaseConfig,jwtConfig],
    }), // cách dùng : inject configService 
        TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        // entities: [Product, User, BorrowRequest],
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    UserModule,
    BorrowRequestModule,
    AuthModule,
  ],

providers: [{ 
    provide: APP_GUARD, // chỉ định chạy trên toàn bộ ứng dụng  - trừ khi viết đè lên
    useClass: AuthGuard, // sử dụng AuthGuard làm mặc định 
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
],
  
})
export class AppModule {}
