import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { CustomersOrderService } from './customers-order.service';
import { CreateCustomersOrderDto } from './dto/create-customers-order.dto';

@Controller('customers_order')
export class CustomersOrderController {
  constructor(private readonly customersOrderService: CustomersOrderService) {}

  @Post()
  async createCustomerOrder(@Body() orderDto: CreateCustomersOrderDto[]) {
    try {
      let sum = 0;
      const createOrderResult =
        await this.customersOrderService.createCustomerOrder();
      for (const order of orderDto) {
        sum += order.price;
        await this.customersOrderService.createCustomerOrderItems(
          order.item_id,
          order.amount,
          order.option,
          order.price,
          createOrderResult.customerOrder_id,
        );
      }

      return {
        statusCode: 201,
        sucess: true,
        message: createOrderResult,
        total: sum,
      };
    } catch (e) {
      return { status: e.status, success: false, message: e.message };
    }
  }

  @Put('/:customerOrder_id')
  async updateCustomersOrder(
    @Body() data: boolean,
    @Param(
      'customerOrder_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    customerOrder_id: number,
  ) {
    try {
      return this.customersOrderService.updateCustomersOrder(
        data,
        customerOrder_id,
      );
    } catch (e) {
      return { status: e.status, success: false, message: e.message };
    }
  }

  @Delete('/:customerOrder_id')
  async deleteCustomersOrder(
    @Param(
      'customerOrder_id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    customerOrder_id: number,
  ) {
    try {
      const deleteCustomersOrderResult =
        await this.customersOrderService.deleteCustomersOrder(customerOrder_id);
      return {
        statusCode: 201,
        sucess: true,
        deleteCustomersOrderResult,
      };
    } catch (e) {
      return { status: e.status, success: false, message: e.message };
    }
  }
}
