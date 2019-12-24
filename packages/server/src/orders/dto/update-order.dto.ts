import {
  IsEmpty,
  IsEnum,
  IsObject,
  IsOptional,
  ArrayNotEmpty,
  ValidateNested
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  Required$UpdateOrder,
  Schema$Order,
  OrderStatus
} from '@fullstack/common/service/typings';
import { OrderProductDto } from './order-product-dto';

class Base implements Required$UpdateOrder {
  @ArrayNotEmpty()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products!: OrderProductDto[];

  @IsEnum(OrderStatus)
  @IsOptional()
  @Transform(Number)
  status!: OrderStatus;
}

class UpdateOrder extends Base
  implements Partial<Omit<Schema$Order | Required$UpdateOrder, keyof Base>> {
  @IsEmpty()
  id?: string;

  @IsEmpty()
  user?: undefined;

  @IsEmpty()
  createdAt?: undefined;

  @IsEmpty()
  updatedAt?: undefined;
}

export class UpdateOrderDto extends UpdateOrder
  implements
    Required<Omit<Schema$Order & Required$UpdateOrder, keyof UpdateOrder>> {}
