import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';// xử lý route
// import { AppService } from './app.service'; // cung cấp logic
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';

// @Module({
//   imports: [ProductModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // hoặc mysql
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ProductModule,
  ],
})
export class AppModule {}
