// tạo sign in endpoint
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { signInDto } from './dto/signin.dto';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(    
    @InjectRepository(User)
      private userRepository: Repository<User>,
      private usersService: UserService, 
       private jwtService: JwtService) {}
// hàm đăng nhập 
  async signIn(signInDto: signInDto): 
        Promise<{ access_token: string,user: { sub: string, email: string, name: string, role: string } }> {
    const user = await this.usersService.findOne(signInDto.email); // dùng email và mật khẩu cho riêng tư
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };// thêm thuộc tính tên và quyền 
    return {     
      access_token: await this.jwtService.signAsync(payload), // dùng hàm signAsync mã hóa payload
      user: payload
    };
  }
// hàm đăng ký
    async register(dto: RegisterDto) {
      // kiểm tra mật khẩu khớp
      const { password, confirmPassword, ...rest } = dto;
        if (password !== confirmPassword) {
    throw new BadRequestException('Passwords do not match');
  }
  // kiểm tra email tồn tại chưa
    const existing = await this.userRepository.findOneBy({ email: dto.email });
    if (existing) throw new ConflictException('Email already exists');
// mã hóa mật khẩu
    // const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ ...dto, password:dto.password});
    await this.userRepository.save(user);
    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };// thêm thuộc tính tên và quyền 
    return {
      access_token: await this.jwtService.signAsync(payload), // dùng hàm signAsync mã hóa payload
    };
  }
}
