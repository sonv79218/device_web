// src/user/user.service.ts

import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

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

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        // Check nếu email mới trùng với email người khác (trừ chính người đang update)
  if (updateUserDto.email) {
    const existingUser = await this.userRepository.findOne({
      where: { email: updateUserDto.email },
    });

    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException('Email đã được sử dụng');
    }
  }
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepository.save(user);
  }
  // đổi mật khẩu 
  // user.service.ts

async changePassword(id: string, dto: ChangePasswordDto): Promise<any> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException('User không tồn tại');
  }

  // So sánh mật khẩu cũ (plain text)
  if (user.password !== dto.oldPassword) {
    throw new BadRequestException('Mật khẩu cũ không đúng');
  }

  // Gán mật khẩu mới
  user.password = dto.newPassword;
  await this.userRepository.save(user);

  return { message: 'Đổi mật khẩu thành công' };
}

// đổi quyền 
async toggleRole(id: string): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException('User không tồn tại');
  }

  user.role = user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
  return this.userRepository.save(user);
}


  async findOnebyId(id: string): Promise<User|null> {
    const user = this.userRepository.findOneBy({ id});
    if (!user) throw new NotFoundException('user not found');
    return user;
  }


}
