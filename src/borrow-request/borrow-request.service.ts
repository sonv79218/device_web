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
  async create(dto: CreateBorrowRequestDto, deviceId: string, userId: string) {
    // tìm xem có id-device nào phù hợp với id-device truyền vào k
    const device = await this.productRepo.findOneBy({ device_id: deviceId });
      if (!device) {
    throw new NotFoundException('Device not found');
  }

      const user_id = await this.userRepo.findOneBy({ id: userId });
      if (!user_id) {
    throw new NotFoundException('User not found');
  }
  // console.log('DTO:', dto);
  // console.log('user_id:', user_id);
  // console.log('device:', device);
  
  const newRequest = this.borrowRequestRepo.create({
    ...dto,
    product: { device_id: device.device_id },
    // product: device.device_id, // product là quan hệ ManyToOne với Product entity
    // user: userId,
    // user: { id: userId }// mong muốn uuser là entity
    user: { id: user_id.id }
    // user: user_id.id

  });
  return await this.borrowRequestRepo.save(newRequest);
}
//    async findAll(): Promise<BorrowRequest[]> {
//     return await this.borrowRequestRepo.find({
//       // thêm cả bảng product khi in ra 
//   relations: ['product','user'], // <- thêm dòng này
// });
//   }
async findAll(): Promise<any[]> {
  return await this.borrowRequestRepo
    .createQueryBuilder('borrowRequest')
    .leftJoinAndSelect('borrowRequest.user', 'user')
    .leftJoinAndSelect('borrowRequest.product', 'product')
    .select([
      'borrowRequest',
      'user.id',
      'product.device_id'
    ])
    .getMany();
}

}
