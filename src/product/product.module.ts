
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // nhờ vào phần này có thể import các repository vào service
  controllers: [ProductController],
  providers: [ProductService],
  // export để cho borrow dùng module này với ??
  exports:[TypeOrmModule],
})
export class ProductModule {}
