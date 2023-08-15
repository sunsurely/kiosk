import { IsBoolean, IsNumber } from 'class-validator';

export class CreateOptionDto {
  @IsNumber()
  readonly extra_price: number;

  @IsNumber()
  readonly shot_price: number;

  @IsBoolean()
  readonly hot: boolean;
}
