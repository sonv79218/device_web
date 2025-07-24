import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Request , Req} from '@nestjs/common';
import { BorrowRequestService } from './borrow-request.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserGuard } from 'src/auth/jwt-user.guard';
import { User } from 'src/common/decorators/user.decorator';
import { AdminGuard } from 'src/auth/jwt-admin.guard';
@Controller('borrow-request')

export class BorrowRequestController {
  constructor(private readonly borrowRequestService: BorrowRequestService) {}

  // tạo yêu cầu mượn - chỉ người dùng mới đc mượn
  // sử dụng useGuards để xử lý token 
  @UseGuards(JwtAuthGuard,UserGuard)
 @Post(':deviceId')
  create(
  @Param('deviceId') deviceId: string,
  @Body() createBorrowRequestDto: CreateBorrowRequestDto,
  @User() user: any)
 {{
  return this.borrowRequestService.create(createBorrowRequestDto,deviceId,user.userId);
}
}
// duyệt - chỉ admin mới duyệt
@UseGuards(JwtAuthGuard,AdminGuard)
@Patch('approve/:id') // lấy id của borrow và duyệt 
async approve(
  @Param('id') id: string,
  @User() user: any,
){
  return this.borrowRequestService.approveRequest(id,user.userId);
}
// từ chối 
@UseGuards(JwtAuthGuard,AdminGuard)
@Patch('reject/:id') // lấy id của borrow và duyệt 
async reject(
  @Param('id') id: string,
  @User() user: any,
){
  return this.borrowRequestService.rejectRequest(id,user.userId);
}

// trả - lấy dữ liệu người dùng và sửa trạng thái trong bảng borrow - cập nhật trạng thái trong bảng product là status thành avaiable
@UseGuards(JwtAuthGuard,UserGuard)
@Patch('return/:id')// truyền vào id borrow
async returnDevice(
  @Param('id') id: string,
  @User() user: any,
) {
  // console.log(user.userId);
  return this.borrowRequestService.returnDeviceById(id, user.userId);
}


// lấy tất cả
  @Get()
  findAll() {
    return this.borrowRequestService.findAll();
  }


}
