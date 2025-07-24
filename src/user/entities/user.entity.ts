// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BorrowRequest } from 'src/borrow-request/entities/borrow-request.entity';
export type UserRole = 'user' | 'admin';
@Entity()
export class User {
    // thuộc tính quan hệ
@OneToMany(() => BorrowRequest, br => br.user)
borrowRequests: BorrowRequest[];

// @OneToMany(() => BorrowRequest, borrow => borrow.approvedBy)
// approvedBorrowRequests: BorrowRequest[];

// thuộc tính bình thường
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', default: 'user' })
  role: UserRole;

  @Column()
  password: string;
}
