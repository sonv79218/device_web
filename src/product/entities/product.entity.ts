// src/product/entities/product.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
export type DeviceStatus = 'available' | 'assigned' | 'maintenance';
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')// uuid này là sao nhỉ
  device_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true }) // Cho phép null nếu không có giá trị
    location: string;   
    
  @Column({ nullable: true })
  brand: string; // <- Đảm bảo dòng này tồn tại
  // @Column({ nullable: true }) // Cho phép null nếu không có giá trị
  // status: string;   
    @Column({
    type: 'enum',
    enum: ['available', 'assigned', 'maintenance'],
    default: 'available',
  })
  status: DeviceStatus;

  @Column({  unique: true, nullable: true })
  serial_number: string; 

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  created_at: Date;
}
