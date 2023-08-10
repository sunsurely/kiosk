import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Status } from '../items/orderInfo';
import { ItemEntity } from './item.entity';

@Entity({ schema: 'kiosk', name: 'orderitems' })
export class OrderItemEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'orderitem_id' })
  orderItem_Id: number;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('int')
  item_id: number;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: Status, default: Status.NOT_COMPLETED })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToOne(() => ItemEntity, (item) => item.orders)
  @JoinColumn({ name: 'item_id' })
  item: ItemEntity;
}
