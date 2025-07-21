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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseUUIDPipe } from './pipes/parse-uuid.pipe';// đường dẫn bạn điều chỉnh theo thư mục
// import { Query } from '@nestjs/common';
// import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';
import { Query, ValidationPipe } from '@nestjs/common';
import { FilterProductDto } from './dto/query-filter.dto';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  // @Get()
  // async findAll() {
  //   return await this.productService.findAll();
  // }
  @Get()
async findAll(
  @Query(new ValidationPipe({ transform: true })) query: FilterProductDto,
) {
  return this.productService.findAll(query);
}

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
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
