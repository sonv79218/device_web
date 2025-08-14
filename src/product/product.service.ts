import {  Inject,Injectable, NotFoundException,InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/query-filter.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
     @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(dto);
    // return await this.productRepo.save(product);
        const saved = await this.productRepo.save(product);
    // ❌ Xóa cache liên quan để dữ liệu mới được lấy lại
    await this.cacheManager.del('products:all');
    return saved;
  }

  // async findAll(): Promise<Product[]> {
  //   return await this.productRepo.find();
  // }
async findAll(query: FilterProductDto) {
  // nếu có cache
      const cacheKey = `products:${JSON.stringify(query)}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData){
      // console.log('lấy từ cache ')
       return cachedData};
    // nếu không 
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
    const result = { data: products, totalCount };
    // ✅ Lưu cache với TTL 60 giây
    await this.cacheManager.set(cacheKey, result, 60);
  //   return {
  //   data: products,
  //   totalCount,
  // };
   return result;
}



  async findOne(id: string): Promise<Product> {
        const cacheKey = `product:${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);
      if (cachedProduct) {console.log(`lấy sản phẩm ${cacheKey}`)
        return cachedProduct};
      // nếu không có trong cache thì 
      console.log('hello')
    const product = await this.productRepo.findOneBy({ device_id: id });
    if (!product) throw new NotFoundException('Product not found');
     await this.cacheManager.set(cacheKey, product, 60000);
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
