
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { signInDto } from './dto/signin.dto';
import { Public } from './public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
@Public()
@Post('register')
async register(@Body() RegisterDto: RegisterDto) {
  return this.authService.register(RegisterDto);
}

@Public()
  // @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() SignInDto: signInDto) {
    return this.authService.signIn(SignInDto);
  }

    // @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  // đăng ký token cần hủy hiệu lực 
  @Post()
  logOut(@Request() req){
    const token = req.headers['authorization']?.replace('Bearer ', '');
    return this.authService.logOut(token);
  }
}
