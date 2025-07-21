// src/data-source.ts
import { DataSource } from 'typeorm';
import { Product } from './product/entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'test',  
  entities: [Product],
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   entities: ['src/**/*.entity.ts'],
//   migrations: ['src/migrations/*.ts'],
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: false,

//   entities: [Product], 


});
console.log('Entities loaded:', AppDataSource.options.entities);

