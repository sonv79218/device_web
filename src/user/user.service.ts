// src/user/user.service.ts

import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

async findAll(): Promise<User[]> {
  const cachedUsers = await this.cacheManager.get<User[]>('allUsers');
  if (cachedUsers) {
    console.log('Trả dữ liệu từ cache');
    return cachedUsers;
  }

  const users = await this.userRepository.find();
  await this.cacheManager.set('allUsers', users, 30000); // TTL 30 giây
  console.log('Trả dữ liệu từ DB và lưu cache');
  return users;
}


async findOne(email: string): Promise<User | null> {
  const cacheKey = `user:email:${email}`;
  const cachedUser = await this.cacheManager.get<User>(cacheKey);
  if (cachedUser) return cachedUser;

  const user = await this.userRepository.findOneBy({ email });
  if (!user) return null;

  await this.cacheManager.set(cacheKey, user, 30000); // TTL 30 giây
  return user;
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
async toggleRole(id: string,oldToken?: string): Promise<User> {
  await this.cacheManager.del(`user:${id}`);const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new NotFoundException('User không tồn tại');
  }

  user.role = user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
   const updatedUser = await this.userRepository.save(user);
  // return this.userRepository.save(user);
    // Xóa cache sau khi update
  await this.cacheManager.del(`user:${id}`);
  await this.cacheManager.del('allUsers'); // xóa cache danh sách để cập nhật role mới
  // Nếu token cũ được gửi vào, blacklist nó
  if (oldToken) {
    await this.cacheManager.set(`blacklist:${oldToken}`, true,   3600 );
  }
  return updatedUser;
}


  // async findOnebyId(id: string): Promise<User|null> {
  //   const user = this.userRepository.findOneBy({ id});
  //   if (!user) throw new NotFoundException('user not found');
  //   return user;
  // }
  async findOnebyId(id: string): Promise<User | null> {
  const cacheKey = `user:${id}`;
  const cachedUser = await this.cacheManager.get<User>(cacheKey);
  if (cachedUser) return cachedUser;

  const user = await this.userRepository.findOneBy({ id });
  if (!user) throw new NotFoundException('User not found');

  await this.cacheManager.set(cacheKey, user, 30000);
  return user;
}

// user.service.ts
async toggleActive(id: string): Promise<User> {
  // Xóa cache trước khi update
  await this.cacheManager.del(`user:${id}`);

  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException('User không tồn tại');
  }

  // Đổi trạng thái active
  user.active = !user.active;

  const updatedUser = await this.userRepository.save(user);

  // Xóa cache sau khi update
  await this.cacheManager.del(`user:${id}`);
  await this.cacheManager.del('allUsers'); // xóa cache danh sách user

  return updatedUser;
}


}
