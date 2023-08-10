import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomersOrderService } from './customers-order.service';
import { CreateCustomersOrderDto } from './dto/create-customers-order.dto';
import { UpdateCustomersOrderDto } from './dto/update-customers-order.dto';

@Controller('customers_order')
export class CustomersOrderController {
  constructor(private readonly customersOrderService: CustomersOrderService) {}

  @Post()
  async createCustomerOrder(@Body() orderDto: CreateCustomersOrderDto[]) {
    try {
      const createOrderResult =
        await this.customersOrderService.createCustomerOrder();
      for (const order of orderDto) {
        await this.customersOrderService.createCustomerOrderItems(
          order.item_id,
          order.amount,
          order.option,
          order.price,
          createOrderResult.customerOrder_id,
        );
      }

      return { statusCode: 201, sucess: true, message: createOrderResult };
    } catch (e) {
      return { status: e.status, success: false, message: e.message };
    }
  }

  @Get()
  findAll() {
    return this.customersOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersOrderService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomersOrderDto: UpdateCustomersOrderDto,
  ) {
    return this.customersOrderService.update(+id, updateCustomersOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersOrderService.remove(+id);
  }
}
