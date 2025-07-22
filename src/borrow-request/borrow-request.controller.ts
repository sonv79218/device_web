import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Request , Req} from '@nestjs/common';
import { BorrowRequestService } from './borrow-request.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
@Controller('borrow-request')

export class BorrowRequestController {
  constructor(private readonly borrowRequestService: BorrowRequestService) {}
  // sử dụng useGuards để xử lý token 
  @UseGuards(JwtAuthGuard) // trả về  return { userId: payload.sub, username: payload.username }; trả về dữ liệu để @user gắn vào request
  // truyền thêm dữ liệu qua param
 @Post(':deviceId')
  create(
  @Param('deviceId') deviceId: string,
  @Body() createBorrowRequestDto: CreateBorrowRequestDto,
  //
  @User() user: any)
 {{
  return this.borrowRequestService.create(createBorrowRequestDto,deviceId,user.sub);
}
}

  @Get()
  findAll() {
    return this.borrowRequestService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.borrowRequestService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBorrowRequestDto: UpdateBorrowRequestDto) {
  //   return this.borrowRequestService.update(+id, updateBorrowRequestDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.borrowRequestService.remove(+id);
  // }
}
