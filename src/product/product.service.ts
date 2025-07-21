// import { Injectable } from '@nestjs/common';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';

// @Injectable()
// export class ProductService {
//   create(createProductDto: CreateProductDto) {
//     return 'This action adds a new product';
//   }

//   findAll() {
//     return `This action returns all product`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} product`;
//   }

//   update(id: number, updateProductDto: UpdateProductDto) {
//     return `This action updates a #${id} product`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} product`;
//   }
// }
// src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
  ) {}

  create(dto: CreateProductDto) {
    const product = this.repo.create(dto);
    return this.repo.save(product);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  update(id: number, dto: UpdateProductDto) {
    return this.repo.update(id, dto);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
