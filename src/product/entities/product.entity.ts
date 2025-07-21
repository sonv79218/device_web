// src/product/entities/product.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column({ nullable: true }) // Cho phép null nếu không có giá trị
    location: string;   
    
//   @Column()
//   type: string; // <- Đảm bảo dòng này tồn tại
  @Column({ nullable: true }) // Cho phép null nếu không có giá trị
    test: string;   

  @Column({ default: true })
  isAvailable: boolean;
}
