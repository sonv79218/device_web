import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  Patch,
  NotFoundException,
  ParseUUIDPipe
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }
    // @Public()
    @Get(':id')
  async findOnebyId(@Param('id', new ParseUUIDPipe()) id: string) {// middleware kiểm tra id 
    const user = await this.userService.findOnebyId(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  // đổi thông tin
  @Patch(':id')
  @Roles(Role.User)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }
  // đổi mật khẩu
  @Patch(':id/password')
@Roles(Role.User)
async changePassword(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() changePasswordDto: ChangePasswordDto,
) {
  return this.userService.changePassword(id, changePasswordDto);
}
// đổi quyền 

@Patch(':id/toggle-role')
@Roles(Role.Admin)
async toggleRole(
  @Param('id',ParseUUIDPipe) id: string,
) {
  return this.userService.toggleRole(id);
}

// ban và bỏ ban 
// user.controller.ts
@Patch(':id/toggle-active')
@Roles(Role.Admin)
async toggleActive(
  @Param('id', ParseUUIDPipe) id: string,
) {
  return this.userService.toggleActive(id);
}


}



