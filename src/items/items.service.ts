import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from './entity/item.entity';
import { OptionEntity } from './entity/option.entity';
import { Type } from './ItemInfo';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
    @InjectRepository(OptionEntity)
    private optionRepository: Repository<OptionEntity>,
  ) {}

  async createItem(name: string, price: number, type: string, option_id) {
    try {
      const item = new ItemEntity();
      item.name = name;
      item.price = price;
      item.type = type as Type;
      item.option_id = option_id;
      const createItemResult = await this.itemRepository.save(item);
      return createItemResult;
    } catch (e) {
      throw e;
    }
  }

  async createOption(extra_price: number, shot_price: number, hot: boolean) {
    try {
      const option = new OptionEntity();
      option.extra_price = extra_price;
      option.shot_price = shot_price;
      option.hot = hot;
      const createOptionResult = await this.optionRepository.save(option);
      return createOptionResult;
    } catch (e) {
      throw e;
    }
  }

  async readItems() {
    try {
      const items = await this.itemRepository.find();
      if (!items || items.length === 0) {
        throw new BadRequestException('등록된 상품이 없습니다.');
      }
      return items;
    } catch (e) {
      throw e;
    }
  }

  async readItemsByType(type: string) {
    try {
      const items = await this.itemRepository.find({
        where: { type: type as Type },
      });

      if (items.length === 0) {
        throw new BadRequestException('등록된 상품이 없습니다.');
      }
      return items;
    } catch (e) {
      throw e;
    }
  }

  async readItemDetail(item_id: number) {
    try {
      const item = await this.itemRepository
        .createQueryBuilder('item')
        .select([
          'item.item_id',
          'item.name',
          'item.price',
          'item.type',
          'option.extra_price',
          'option.shot_price',
          'option.hot',
        ])
        .leftJoinAndSelect('item.option', 'option')
        .where('item.item_id=:item_id', { item_id })
        .andWhere('item.deletedAt IS NULL')
        .getOne();

      return item;
    } catch (e) {
      throw e;
    }
  }

  async updateItem(item_id: number, data) {
    try {
      const item = await this.itemRepository.update(
        { item_id },
        { amount: data.amount },
      );

      if (!item) {
        throw new BadRequestException('데이터 수정에 실패했습니다.');
      }
      return true;
      return item;
    } catch (e) {
      throw e;
    }
  }
}
