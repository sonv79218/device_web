// src/data-source.ts
import { DataSource } from 'typeorm';
import { Product } from './product/entities/product.entity';
import { User } from './user/entities/user.entity';
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'device_manager',  
  entities: [Product,User],
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   entities: ['src/**/*.entity.ts'],
//   migrations: ['src/migrations/*.ts'],
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: true,// tạo bảng lần đầu
//   entities: [Product], 
});
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
// console.log('Entities loaded:', AppDataSource.options.entities);

