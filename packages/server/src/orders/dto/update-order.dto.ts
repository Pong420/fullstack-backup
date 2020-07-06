import {
  Param$UpdateOrder,
  OrderStatus,
  Schema$Order
} from '@fullstack/typings';
import { IsEnum, IsOptional } from 'class-validator';
import { Transform, Exclude } from 'class-transformer';

type ShoudBeExcluded = {
  [K in Exclude<keyof Schema$Order, keyof Param$UpdateOrder>]?: unknown;
};

class Base implements ShoudBeExcluded {
  @Exclude()
  id?: undefined;

  @Exclude()
  prodcut?: undefined;

  @Exclude()
  user?: undefined;

  @Exclude()
  products?: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;
}

class UpdateOrder extends Base
  implements Partial<Omit<Param$UpdateOrder, keyof Base>> {
  @IsOptional()
  @IsEnum(OrderStatus)
  @Transform(Number)
  status: OrderStatus;
}

export class UpdateOrderDto extends UpdateOrder
  implements Required<Omit<Param$UpdateOrder, keyof UpdateOrder>> {}
