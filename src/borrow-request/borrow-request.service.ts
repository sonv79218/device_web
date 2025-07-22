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
  
  async create(dto: CreateBorrowRequestDto) {
  const newRequest = this.borrowRequestRepo.create({
    ...dto,
  });
  return await this.borrowRequestRepo.save(newRequest);
}
   async findAll(): Promise<BorrowRequest[]> {
    return await this.borrowRequestRepo.find();
  }
}
