import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomersOrderDto } from './create-customers-order.dto';

export class UpdateCustomersOrderDto extends PartialType(CreateCustomersOrderDto) {}
