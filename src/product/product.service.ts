import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/query-filter.dto';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(dto);
    return await this.productRepo.save(product);
  }

  // async findAll(): Promise<Product[]> {
  //   return await this.productRepo.find();
  // }
async findAll(query: FilterProductDto) {
  const { type, status, page = 1, limit = 10 } = query;

  const qb = this.productRepo.createQueryBuilder('product');

  if (type) {
    qb.andWhere('product.type = :type', { type });
  }

  if (status) {
    qb.andWhere('product.status = :status', { status });
  }

  qb.orderBy('product.created_at', 'DESC')
    .skip((page - 1) * limit)
    .take(limit);

  const products = await qb.getMany();
  return products;
}



  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOneBy({ device_id: id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return await this.productRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }
}
