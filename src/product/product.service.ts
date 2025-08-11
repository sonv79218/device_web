import { Injectable, NotFoundException,InternalServerErrorException } from '@nestjs/common';
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
  const { type, status, page , limit } = query;

  const qb = this.productRepo.createQueryBuilder('product');
  

  if (type) {
    qb.andWhere('product.type = :type', { type });
  }

  if (status) {
    qb.andWhere('product.status = :status', { status });
  }
const totalCount = await qb.getCount();
  if(page&&limit)
  qb.orderBy('product.created_at', 'DESC')
    .skip((page - 1) * limit)
    .take(limit);

  const products = await qb.getMany();
    return {
    data: products,
    totalCount,
  };
}



  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOneBy({ device_id: id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
  
    async getAllTypesAndStatuses(): Promise<{ types: string[]; statuses: string[] }> {
    const types = await this.productRepo
      .createQueryBuilder('product')
      .select('DISTINCT product.type', 'type')
      .getRawMany();

    const statuses = await this.productRepo
      .createQueryBuilder('product')
      .select('DISTINCT product.status', 'status')
      .getRawMany();

    return {
      types: types.map((t) => t.type),
      statuses: statuses.map((s) => s.status),
    };
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return await this.productRepo.save(product);
  }

async remove(id: string): Promise<void> {
  const product = await this.findOne(id);
  
  if (!product) {
    throw new NotFoundException(`Product with id ${id} not found`);
  }

  try {
    await this.productRepo.remove(product);
  } catch (error) {
    console.error('❌ Error removing product:', error); // Log ra lỗi thật
    throw new InternalServerErrorException('Could not delete product');
  }
}

}
