import { IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  readonly name: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly type: string;
}
