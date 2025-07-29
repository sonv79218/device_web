// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { AppDataSource } from './data-source';
import { UserModule } from './user/user.module';
import { BorrowRequestModule } from './borrow-request/borrow-request.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'; // module config đc cài sẵn trong nestjs 
@Module({
  imports: [
    // tùy chỉnh configmodule
    ConfigModule.forRoot({// module cho phép bạn đọc .env và tự cấu hình hệ thống theo biến môi trường.
      isGlobal: true,
    }), // cách dùng : inject configService 
    // tùy chỉnh typeOrmModule
    TypeOrmModule.forRootAsync({ // module tạo cơ sở dữ liệu -> cho phép cấu hình
      useFactory: async () => AppDataSource.options, // 
    }),
    ProductModule,
    UserModule,
    BorrowRequestModule,
    AuthModule,
  ],
})
export class AppModule {}
