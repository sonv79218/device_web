import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BorrowRequestService } from 'src/borrow-request/borrow-request.service';
import { CreateBorrowRequestDto } from 'src/borrow-request/dto/create-borrow-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

// đăng ký
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.userService.register(dto);
  }
// đăng nhập
    @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }
}
