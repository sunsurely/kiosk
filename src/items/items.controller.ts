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
import { ItemEntity } from './entity/item.entity';
import { OptionEntity } from './entity/option.entity';
import { Type } from './ItemInfo';

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
}
