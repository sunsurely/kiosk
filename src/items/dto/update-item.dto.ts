import { Transform } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

export class UpdateItemDto {
  @Transform((params) => {
    return params.value.trim();
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  readonly name: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly type: string;
}
