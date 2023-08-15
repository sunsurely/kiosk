import { Transform } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  readonly name: string;

  @IsNumber()
  readonly amount: number;
}
