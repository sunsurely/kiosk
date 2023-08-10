import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ItemEntity } from './item.entity';
import { Customer_OrderEntity } from './customer_order.entity';

@Entity({ schema: 'kiosk', name: 'customer_orderitems' })
export class Customer_OrderItemEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'customerOrderitem_id' })
  customerOrderitem_id: number;

  @Column({ type: 'int' })
  customerOrder_id: number;

  @Column({ type: 'int' })
  item_id: number;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'json' })
  option: JSON;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => ItemEntity, (item) => item.orders)
  item: ItemEntity;

  @ManyToOne(() => Customer_OrderEntity, (order) => order.orderItems)
  @JoinColumn({ name: 'customerOrder_id' })
  order: Customer_OrderEntity;
}
