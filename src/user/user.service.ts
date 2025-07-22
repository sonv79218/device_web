// src/user/user.service.ts

import { Injectable, ConflictException,UnauthorizedException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

//   async create(createUserDto: CreateUserDto): Promise<User> {
//     const newUser = this.userRepository.create(createUserDto);
//     return this.userRepository.save(newUser);
//   }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

//   // async findOne(id: number): Promise<User> {
//   //   return this.userRepository.findOneBy({ id });
//   // }
//   async findOne(id: string): Promise<User | null> {
//   return this.userRepository.findOneBy({ id });
// }


//   async update(id: string, updateUserDto: UpdateUserDto): Promise<User| null> {
//     await this.userRepository.update(id, updateUserDto);
//     return this.findOne(id);
//   }

//   async remove(id: number): Promise<void> {
//     await this.userRepository.delete(id);
//   }
    async register(dto: CreateUserDto) {
      // kiểm tra mật khẩu khớp
      const { password, confirmPassword, ...rest } = dto;
        if (password !== confirmPassword) {
    throw new BadRequestException('Passwords do not match');
  }
  // kiểm tra email tồn tại chưa
    const existing = await this.userRepository.findOneBy({ email: dto.email });
    if (existing) throw new ConflictException('Email already exists');
// mã hóa mật khẩu
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ ...dto, password: hashed });
    await this.userRepository.save(user);
    return { message: 'User registered successfully' };
  }

  async login(dto: LoginUserDto) {
    // kiểm tra email đã tồn tại chưa
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    //
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
