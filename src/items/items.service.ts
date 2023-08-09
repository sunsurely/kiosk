import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ItemEntity } from './entity/item.entity';
import { OptionEntity } from './entity/option.entity';
import { OrderItemEntity } from './entity/orderItem.entity';
import { Type } from './ItemInfo';
import { Status } from './orderInfo';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
    @InjectRepository(OptionEntity)
    private optionRepository: Repository<OptionEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
    private dataSource: DataSource,
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
          'item.amount',
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

  async updateItem(item_id: number, name: string, price: number, type: string) {
    try {
      const item = await this.itemRepository.update(
        { item_id },
        { name, price, type: type as Type },
      );

      if (!item) {
        throw new BadRequestException('데이터 수정에 실패했습니다.');
      }

      return item;
    } catch (e) {
      throw e;
    }
  }

  async deleteItemWithQueryRunner(item_id: number, orderItem_id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(OrderItemEntity, orderItem_id);

      await queryRunner.manager.delete(ItemEntity, item_id);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async createItemOrder(item_id, name: string, amount: number) {
    try {
      const createItemOrderResult = await this.orderItemRepository.create({
        item_id,
        name,
        amount,
      });

      if (!createItemOrderResult) {
        throw new BadRequestException('데이트 등록에 실패했습니다.');
      }

      const savedItemOrder = await this.orderItemRepository.save(
        createItemOrderResult,
      );
      return savedItemOrder;
    } catch (e) {
      throw e;
    }
  }

  async readItemsOrder(orderItem_Id: number) {
    try {
      const order = await this.orderItemRepository.findOne({
        where: { orderItem_Id },
      });
      if (!order) {
        throw new BadRequestException('해당 주문이 없습니다.');
      }
      return order;
    } catch (e) {
      throw e;
    }
  }

  async updateItemOrderWithQueryRunner(orderItem_Id: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(OrderItemEntity, {
        where: { orderItem_Id },
      });
      if (!order) {
        throw new NotFoundException('해당 주문이 존재하지 않습니다.');
      }
      order.status = 'completed' as Status;

      const item_id = order.item_id;

      const item = await queryRunner.manager.findOne(ItemEntity, {
        where: { item_id },
      });

      item.amount = order.amount;
      await this.orderItemRepository.save(order);
      await this.itemRepository.save(order);
      await queryRunner.commitTransaction();
      return order;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
