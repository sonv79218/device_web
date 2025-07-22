import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Request , Req} from '@nestjs/common';
import { BorrowRequestService } from './borrow-request.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';

@Controller('borrow-request')
export class BorrowRequestController {
  constructor(private readonly borrowRequestService: BorrowRequestService) {}
 @Post()
create(@Body() createBorrowRequestDto: CreateBorrowRequestDto)
 {{
  return this.borrowRequestService.create(createBorrowRequestDto);
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
