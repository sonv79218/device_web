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
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
// tạo thiết bị mới
  @Post()
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

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {// middleware kiểm tra id 
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productService.remove(id);
  }
}
