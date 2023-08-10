import { Injectable, NotImplementedException } from '@nestjs/common';
import { UpdateCustomersOrderDto } from './dto/update-customers-order.dto';
import { Customer_OrderEntity } from 'src/entities/customer_order.entity';
import { Customer_OrderItemEntity } from 'src/entities/customer_orderItem.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class CustomersOrderService {
  constructor(
    @InjectRepository(Customer_OrderEntity)
    private customer_order_Repository: Repository<Customer_OrderEntity>,
    @InjectRepository(Customer_OrderItemEntity)
    private customer_orderItem_Repository: Repository<Customer_OrderItemEntity>,
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

  findAll() {
    return `This action returns all customersOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customersOrder`;
  }

  update(id: number, updateCustomersOrderDto: UpdateCustomersOrderDto) {
    return `This action updates a #${id} customersOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} customersOrder`;
  }
}
