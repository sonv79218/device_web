// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { AppDataSource } from './data-source';
import { UserModule } from './user/user.module';
import { BorrowRequestModule } from './borrow-request/borrow-request.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => AppDataSource.options,
    }),
    ProductModule,
    UserModule,
    BorrowRequestModule,
    AuthModule,
  ],
})
export class AppModule {}
