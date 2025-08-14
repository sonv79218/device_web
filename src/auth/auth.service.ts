// tạo sign in endpoint
// import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Inject, Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { signInDto } from './dto/signin.dto';
import { RegisterDto } from './dto/register.dto';
// import { BadRequestException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(    
    @InjectRepository(User)
      private userRepository: Repository<User>,
      private usersService: UserService, 
       private jwtService: JwtService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
// hàm đăng nhập 
  async signIn(signInDto: signInDto): 
        Promise<{ access_token: string,user: { sub: string, email: string, name: string, role: string } }> {
    const user = await this.usersService.findOne(signInDto.email); // dùng email và mật khẩu cho riêng tư
     if (!user) {
    throw new NotFoundException('Người dùng không tồn tại');
  }
    if (user?.password !== signInDto.password) {
      // throw new UnauthorizedException();
        throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
      if (!user.active) {
    throw new ForbiddenException('Tài khoản đã bị khóa');
  }
    const payload = { sub: user.id, email: user.email, name: user.name, role: user.role };// thêm thuộc tính tên và quyền 
    return {     
      access_token: await this.jwtService.signAsync(payload), // dùng hàm signAsync mã hóa payload
      user: payload
    };
  }

  //
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

// hàm logout nhận token 
 async logOut(token: string) {
    try {
      // giải mã token
      const decoded: any = jwt.decode(token);
      // lưu biến hết hạn
      const exp = decoded?.exp;
      const ttl = exp ? exp - Math.floor(Date.now() / 1000) : 0;
      console.log(ttl)
      await this.cacheManager.set(`blacklist:${token}`, true, ttl);
      return { message: 'Đăng xuất thành công' };
    } catch (err) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

}
