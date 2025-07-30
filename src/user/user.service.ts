// src/user/user.service.ts

import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

    async findOne(email: string): Promise<User | null> { // tìm xem có email nào không 
    return this.userRepository.findOneBy({ email });
  }

}
