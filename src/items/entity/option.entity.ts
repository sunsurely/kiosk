import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ItemEntity } from './item.entity';

@Entity({ schema: 'kiosk', name: 'options' })
export class OptionEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'option_id' })
  option_id: number;

  @Column({ type: 'int' })
  extra_price: number;

  @Column({ type: 'int' })
  shot_price: number;

  @Column({ type: 'boolean' })
  hot: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => ItemEntity, (item) => item.option)
  items: ItemEntity[];
}
