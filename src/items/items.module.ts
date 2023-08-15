import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from '../entities/item.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { OptionEntity } from '../entities/option.entity';
import { OrderItemEntity } from '../entities/orderItem.entity';
import { ItemsOptionsService } from 'src/items/itemsOption.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity, OptionEntity, OrderItemEntity]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsOptionsService],
})
export class ItemsModule {}
