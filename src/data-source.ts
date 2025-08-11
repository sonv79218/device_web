// src/data-source.ts
import { DataSource } from 'typeorm';
import { Product } from './product/entities/product.entity';
import { User } from './user/entities/user.entity';
import { BorrowRequest } from './borrow-request/entities/borrow-request.entity';
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'device_manager',  
  entities: [Product,User,BorrowRequest],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: true,// tạo bảng lần đầu
});
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

