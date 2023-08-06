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
import { OptionEntity } from './option.entity';
import { Type } from '../ItemInfo';

@Entity({ schema: 'kiosk', name: 'items' })
export class ItemEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'item_id' })
  item_id: number;

  @Column({ type: 'int' })
  option_id: number;

  @Column('varchar', { length: 10 })
  name: string;

  @Column({ type: 'int', default: 0 })
  amount: number;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'enum', enum: Type })
  type: Type;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => OptionEntity, (option) => option.items)
  @JoinColumn({ name: 'option_id' })
  option: OptionEntity;
}
