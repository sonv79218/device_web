import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Request , Req, ParseUUIDPipe} from '@nestjs/common';
import { BorrowRequestService } from './borrow-request.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
// import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { UserGuard } from 'src/auth/jwt-user.guard';
import { User } from 'src/common/decorators/user.decorator';
// import { AdminGuard } from 'src/auth/jwt-admin.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
@Controller('borrow-request')

export class BorrowRequestController {
  constructor(private readonly borrowRequestService: BorrowRequestService) {}// khai báo constructor để sử dụng service 

  // tạo yêu cầu mượn - chỉ người dùng mới đc mượn
  // sử dụng useGuards để xử lý token 
  // @UseGuards(JwtAuthGuard,UserGuard)

@Post(':deviceId')
@Roles(Role.User)
  create(
  @Param('deviceId',new ParseUUIDPipe()) deviceId: string,
  // @Param('id', new ParseUUIDPipe()) id: string,
  @Body() createBorrowRequestDto: CreateBorrowRequestDto, 
  @User() user: any)
 {{
  return this.borrowRequestService.create(createBorrowRequestDto,deviceId,user.userId);
}
}
// duyệt - chỉ admin mới duyệt
// @UseGuards(JwtAuthGuard,AdminGuard)

@Patch('approve/:id') // lấy id của borrow và duyệt 
@Roles(Role.Admin)
async approve(
  // @Param('id') id: string,
  @Param('id', new ParseUUIDPipe()) id: string,
  @User() user: any,
){
  return this.borrowRequestService.approveRequest(id,user.userId);
}
// từ chối 
// @UseGuards(JwtAuthGuard,AdminGuard)
@Patch('reject/:id') // lấy id của borrow và duyệt 
@Roles(Role.User)
async reject(
  // @Param('id') id: string, 
  @Param('id', new ParseUUIDPipe()) id: string,
  @User() user: any,
){
  return this.borrowRequestService.rejectRequest(id,user.userId);
}

// trả - lấy dữ liệu người dùng và sửa trạng thái trong bảng borrow - cập nhật trạng thái trong bảng product là status thành avaiable
// @UseGuards(JwtAuthGuard,UserGuard)
@Patch('return/:id')// truyền vào id borrow
@Roles(Role.Admin)
async returnDevice(
  // @Param('id') id: string,
  @Param('id', new ParseUUIDPipe()) id: string,
  @User() user: any,
) {
  // console.log(user.userId);
  return this.borrowRequestService.returnDeviceById(id, user.userId);
}


// lấy tất cả
  @Get()
  // @Roles(Role.User)
  findAll() {
    return this.borrowRequestService.findAll();
  }


}
