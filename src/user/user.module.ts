import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
// import { UserRepository } from './user.repository.ts';

@Module({
   imports: [TypeOrmModule.forFeature([User]),
       JwtModule.register({
      secret: '123456', // NÊN dùng process.env.JWT_SECRET
      signOptions: { expiresIn: '1d' },
    }),],
  controllers: [UserController],
  providers: [UserService],
  // exports: [UserRepository], // 👈 Quan trọng để module khác dùng được
  exports: [TypeOrmModule],
})
export class UserModule {}
