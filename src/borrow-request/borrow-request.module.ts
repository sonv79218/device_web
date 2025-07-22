import { Module } from '@nestjs/common';
import { BorrowRequestService } from './borrow-request.service';
import { BorrowRequestController } from './borrow-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowRequest } from './entities/borrow-request.entity';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: 
  [
    TypeOrmModule.forFeature([BorrowRequest]),
    UserModule, // 👈 để Nest biết UserRepository đến từ đâu
    ProductModule, // nếu dùng ProductRepository
  ],
  controllers: [BorrowRequestController],
  providers: [BorrowRequestService],
})
export class BorrowRequestModule {}
