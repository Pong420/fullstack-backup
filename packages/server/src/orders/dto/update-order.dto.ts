import { IsEmpty, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  Required$UpdateOrder,
  Schema$Order,
  OrderStatus
} from '@fullstack/common/service/typings';

class Base implements Required$UpdateOrder {
  // TODO: validation
  products!: Required$UpdateOrder['products'];

  @IsEnum(OrderStatus)
  @IsOptional()
  @Transform(Number)
  status!: OrderStatus;
}

class UpdateOrder extends Base
  implements Partial<Omit<Schema$Order | Required$UpdateOrder, keyof Base>> {
  @IsEmpty()
  id?: undefined;

  @IsEmpty()
  user?: undefined;
}

export class UpdateOrderDto extends UpdateOrder
  implements
    Required<Omit<Schema$Order & Required$UpdateOrder, keyof UpdateOrder>> {}
