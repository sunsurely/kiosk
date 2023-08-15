import { Module } from '@nestjs/common';
import { CustomersOrderService } from './customers-order.service';
import { CustomersOrderController } from './customers-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer_OrderEntity } from 'src/entities/customer_order.entity';
import { Customer_OrderItemEntity } from 'src/entities/customer_orderItem.entity';
import { ItemEntity } from 'src/entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer_OrderEntity,
      Customer_OrderItemEntity,
      ItemEntity,
    ]),
  ],
  controllers: [CustomersOrderController],
  providers: [CustomersOrderService],
})
export class CustomersOrderModule {}
