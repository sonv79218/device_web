import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('borrow_request')
export class BorrowRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;


// quan hệ bảng 
@ManyToOne(() => User, (user) => user.borrowRequests)
@JoinColumn({ name: 'user_id' })
user: User;

  
@ManyToOne(() => Product, (product) => product.borrowRequests, {
  onDelete: 'CASCADE',
})
  // để xuất dữ liệu
  @JoinColumn({ name: 'device_id' })
  product: Product;

// thuộc tính bình thường
  @Column({ type: 'text' })
  note: string;

  @Column({ type: 'timestamp' })
  expectedReturnDate: Date;

  @Column({ default: 'pending' })
  status: 'pending'|'approved'| 'rejected'|'returned';

  @CreateDateColumn()
  createdAt: Date;
}