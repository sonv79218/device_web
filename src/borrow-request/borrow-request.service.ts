import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowRequest } from './entities/borrow-request.entity';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class BorrowRequestService {
  constructor(
    @InjectRepository(BorrowRequest)
    private borrowRequestRepo: Repository<BorrowRequest>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}
  // tạo request-borrow
  async create(dto: CreateBorrowRequestDto, deviceId: string) {
    // tìm xem có id-device nào phù hợp với id-device truyền vào k
    const device = await this.productRepo.findOneBy({ device_id: deviceId });
      if (!device) {
    throw new NotFoundException('Device not found');
  }
    
  const newRequest = this.borrowRequestRepo.create({
    ...dto,
    product: device, // product là quan hệ ManyToOne với Product entity
  });
  return await this.borrowRequestRepo.save(newRequest);
}
   async findAll(): Promise<BorrowRequest[]> {
    return await this.borrowRequestRepo.find({
      // thêm cả bảng product khi in ra 
  relations: ['product'], // <- thêm dòng này
});
  }
}
