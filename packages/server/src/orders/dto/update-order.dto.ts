import {
  Param$UpdateOrder,
  OrderStatus,
  Schema$Order,
  DTOExcluded
} from '@fullstack/typings';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';

type Schema = Schema$Order & Param$UpdateOrder;

class Excluded implements DTOExcluded<Schema$Order, Param$UpdateOrder> {
  @Exclude()
  id?: undefined;

  @Exclude()
  user?: undefined;

  @Exclude()
  products?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class UpdateOrder extends Excluded
  implements Partial<Omit<Schema, keyof Excluded | keyof UpdateOrderDto>> {}

export class UpdateOrderDto extends UpdateOrder
  implements Required<Omit<Schema, keyof UpdateOrder>> {
  @IsOptional()
  @IsEnum(OrderStatus)
  @Transform(Number)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  address: string;
}
