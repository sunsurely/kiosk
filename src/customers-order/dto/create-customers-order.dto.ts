import { IsJSON, IsNumber } from 'class-validator';

export class CreateCustomersOrderDto {
  @IsNumber()
  readonly item_id: number;

  @IsNumber()
  readonly amount: number;

  @IsJSON()
  readonly option: JSON;

  @IsNumber()
  readonly price: number;
}
