import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from './UserInfo';

@Entity({ schema: 'kiosk', name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_Id' })
  user_Id: number;

  @Column('varchar', { length: 30 })
  name: string;

  @Column('varchar', { length: 60 })
  email: string;

  @Column('varchar', { length: 100 })
  password: string;

  @Column({ type: 'enum', enum: Status, default: Status.NORMAL })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
