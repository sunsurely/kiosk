import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Customer_OrderItemEntity } from './customer_orderItem.entity';

@Entity({ schema: 'kiosk', name: 'customer_orders' })
export class Customer_OrderEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'customerOrder_id' })
  customerOrder_id: number;

  @Column({ type: 'boolean', default: false })
  state: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Customer_OrderItemEntity, (orderItem) => orderItem.order)
  @JoinColumn({ name: 'customerOrder_id' })
  orderItems: Customer_OrderItemEntity[];
}
