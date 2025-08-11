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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// import { ParseUUIDPipe } from './pipes/parse-uuid.pipe';// đường dẫn bạn điều chỉnh theo thư mục
import { Query, ValidationPipe } from '@nestjs/common';
import { FilterProductDto } from './dto/query-filter.dto';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
// tạo thiết bị mới - chỉ admin mới được tạo
  @Post()
  @Roles(Role.Admin)
  async create(@Body() createProductDto: CreateProductDto) {// lấy dữ liệu gửi vào từ nhập liệu - body và phải hợp lệ với DTO
    return await this.productService.create(createProductDto);
  }
// lấy toàn bộ thiết bị
  @Get()
async findAll(
  //@Query(key?: string)
  @Query(new ValidationPipe({ transform: true })) query: FilterProductDto, //lấy dữ liệu từ query
) {
  return this.productService.findAll(query);
}

@Get('filters')
getFilters() {
  return this.productService.getAllTypesAndStatuses();
}



  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {// middleware kiểm tra id 
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productService.remove(id);
  }
}
