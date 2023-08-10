import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from '../entities/item.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { OptionEntity } from '../entities/option.entity';
import { OrderItemEntity } from '../entities/orderItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity, OptionEntity, OrderItemEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
