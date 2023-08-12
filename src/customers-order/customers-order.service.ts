import {
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Customer_OrderEntity } from 'src/entities/customer_order.entity';
import { Customer_OrderItemEntity } from 'src/entities/customer_orderItem.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ItemEntity } from 'src/entities/item.entity';

@Injectable()
export class CustomersOrderService {
  constructor(
    @InjectRepository(Customer_OrderEntity)
    private customer_order_Repository: Repository<Customer_OrderEntity>,
    @InjectRepository(Customer_OrderItemEntity)
    private customer_orderItem_Repository: Repository<Customer_OrderItemEntity>,
    @InjectRepository(ItemEntity)
    private item_Repository: Repository<ItemEntity>,
    private dataSource: DataSource,
  ) {}

  async createCustomerOrder() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const state = false;
      const order = await new Customer_OrderEntity();
      order.state = state;
      const createCustomerOrderResult =
        await this.customer_order_Repository.save(order);

      await queryRunner.commitTransaction();
      return createCustomerOrderResult;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async createCustomerOrderItems(
    item_id: number,
    amount: number,
    option: JSON,
    price: number,
    cutomerOrder_id,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const orderItem = new Customer_OrderItemEntity();
      orderItem.item_id = item_id;
      orderItem.customerOrder_id = cutomerOrder_id;
      orderItem.amount = amount;
      orderItem.option = option;
      orderItem.price = price;

      const createOrderItemResult = await queryRunner.manager.save(orderItem);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async updateCustomersOrder(data, customerOrder_id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const order = await queryRunner.manager.findOne(Customer_OrderEntity, {
        where: { customerOrder_id },
      });

      if (!order) {
        throw new NotFoundException('해당 주문이 존재하지 않습니다.');
      }
      if (order.state) {
        throw new NotImplementedException('주문 완료상태입니다');
      }

      order.state = data.state;
      const orderResult = await this.customer_order_Repository.save(order);
      const orderItems = await queryRunner.manager.find(
        Customer_OrderItemEntity,
        { where: { customerOrder_id } },
      );

      if (orderItems.length <= 0) {
        throw new NotFoundException('해당 주문이 존재하지 않습니다.');
      }

      for (const orderItem of orderItems) {
        const item = await queryRunner.manager.findOne(ItemEntity, {
          where: { item_id: orderItem.item_id },
        });
        item.amount -= orderItem.amount;
        await this.item_Repository.save(item);
      }

      await queryRunner.commitTransaction();
      return orderResult;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCustomersOrder(customerOrder_id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const order = await this.customer_order_Repository.findOne({
        where: { customerOrder_id },
      });

      if (!order) {
        throw new NotFoundException('해당 주문이 존재하지 않습니다.');
      }

      if (order.state) {
        throw new NotImplementedException('완료된 주문은 취소할 수 없습니다.');
      }

      const deleteOrderItems = await queryRunner.manager.delete(
        Customer_OrderItemEntity,
        { customerOrder_id },
      );
      const deleteOrder = await queryRunner.manager.delete(
        Customer_OrderEntity,
        { customerOrder_id },
      );

      await queryRunner.commitTransaction();
      return { deleteOrder, deleteOrderItems };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
