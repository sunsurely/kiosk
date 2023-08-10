import { Module } from '@nestjs/common';
import { CustomersOrderService } from './customers-order.service';
import { CustomersOrderController } from './customers-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer_OrderEntity } from 'src/entities/customer_order.entity';
import { Customer_OrderItemEntity } from 'src/entities/customer_orderItem.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { ItemEntity } from 'src/entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer_OrderEntity,
      Customer_OrderItemEntity,
      ItemEntity,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  controllers: [CustomersOrderController],
  providers: [CustomersOrderService],
})
export class CustomersOrderModule {}
