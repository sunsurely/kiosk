import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionEntity } from 'src/entities/option.entity';
import { ItemsOptionsService } from './itemsOption.service';

@Module({
  imports: [TypeOrmModule.forFeature([OptionEntity])],
  providers: [ItemsOptionsService],
})
export class ItemsOptionModule {}
