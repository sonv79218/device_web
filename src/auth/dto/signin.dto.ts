// src/user/dto/login-user.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class signInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  
}
