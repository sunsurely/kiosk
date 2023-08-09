import {
  Controller,
  Body,
  Param,
  Post,
  Get,
  Put,
  Query,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateOptionDto } from './dto/create-option.dto';
import { CreateOrderItemDto } from './dto/create-orderItem.dto';
import { ItemEntity } from './entity/item.entity';
import { OptionEntity } from './entity/option.entity';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post('/registItems/:option_id')
  async createItem(
    @Body() createItems: CreateItemDto[],
    @Param('option_id', ParseIntPipe) option_id: number,
  ) {
    try {
      const createItemResults: ItemEntity[] = [];
      for (const item of createItems) {
        createItemResults.push(
          await this.itemsService.createItem(
            item.name,
            item.price,
            item.type,
            option_id,
          ),
        );
      }
      return createItemResults;
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Post('/registOptions')
  async createOption(@Body() createOptions: CreateOptionDto[]) {
    try {
      const createOptionResult: OptionEntity[] = [];
      for (const option of createOptions) {
        createOptionResult.push(
          await this.itemsService.createOption(
            option.extra_price,
            option.shot_price,
            option.hot,
          ),
        );
      }

      return createOptionResult;
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Get()
  async readItems() {
    try {
      const readItemsResult = await this.itemsService.readItems();
      return readItemsResult;
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Get('/types')
  async readItemsByType(@Query('type') type) {
    try {
      const readItemsResult = await this.itemsService.readItemsByType(type);
      return readItemsResult;
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Get('/detail/:item_id')
  async readItemDetail(@Param('item_id', ParseIntPipe) item_id: number) {
    try {
      const readItemDetailResult = await this.itemsService.readItemDetail(
        item_id,
      );
      return readItemDetailResult;
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Put('/:item_id')
  async updateItem(
    @Param('item_id', ParseIntPipe) item_id: number,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    try {
      const updateItemResult = await this.itemsService.updateItem(
        item_id,
        updateItemDto.name,
        updateItemDto.price,
        updateItemDto.type,
      );

      return { sucess: true, message: '상품정보를 업데이트 했습니다.' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Post('/:item_id/order')
  async createItemOrder(
    @Param('item_id', ParseIntPipe) item_id: number,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    try {
      const createItemOrderResult = await this.itemsService.createItemOrder(
        item_id,
        createOrderItemDto.name,
        createOrderItemDto.amount,
      );

      return createItemOrderResult;
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Get('/order/:orderItem_Id')
  async readItemsOrder(
    @Param('orderItem_Id', ParseIntPipe) orderItem_Id: number,
  ) {
    try {
      const readItemOrderResult = await this.itemsService.readItemsOrder(
        orderItem_Id,
      );

      return { sucess: true, readItemOrderResult };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Put('/order/:order_id')
  async updateItemOrder(@Param('order_id', ParseIntPipe) orderItem_Id: number) {
    try {
      const order = await this.itemsService.updateItemOrderWithQueryRunner(
        orderItem_Id,
      );
      return { success: true, order };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  @Delete('/:item_id/:orderItem_Id')
  async deleteItem(
    @Param('item_id', ParseIntPipe) item_id: number,
    @Param('orderItem_Id', ParseIntPipe) orderItem_Id: number,
    @Body() data,
  ) {
    try {
      const item = await this.itemsService.readItemDetail(item_id);
      const order = await this.itemsService.readItemsOrder(orderItem_Id);
      const amount = item.amount;
      const orderStatus = order.status;
      if (!data.check) {
        if (amount !== 0) {
          return {
            message: `수량이 ${amount}개 남았습니다. 메뉴를 삭제하시겠습니까?`,
          };
        }
        if (orderStatus !== 'completed') {
          return {
            message: `상품 발주 처리가 완료되지 않았습니다. 메뉴를 삭제하시겠습니까?`,
          };
        }
      }
      await this.itemsService.deleteItemWithQueryRunner(item_id, orderItem_Id);
      return { sucess: true, message: '상품을 삭제했습니다.' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
}
