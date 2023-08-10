import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/entities/user.entity';
import { ItemEntity } from 'src/entities/item.entity';
import { OptionEntity } from 'src/entities/option.entity';
import { OrderItemEntity } from 'src/entities/orderItem.entity';
import { Customer_OrderEntity } from 'src/entities/customer_order.entity';
import { Customer_OrderItemEntity } from 'src/entities/customer_orderItem.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [
        UserEntity,
        ItemEntity,
        OptionEntity,
        OrderItemEntity,
        Customer_OrderEntity,
        Customer_OrderItemEntity,
      ],
      synchronize: false,
    };
  }
}
