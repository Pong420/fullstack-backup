import { IsNumber, IsEmpty, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  Required$UpdateOrder,
  Schema$Order,
  OrderStatus
} from '@fullstack/common/service/typings';

class Base implements Required$UpdateOrder {
  @IsNumber()
  @Transform(Number)
  amount!: number;

  @IsEnum(OrderStatus)
  @Transform(Number)
  status!: OrderStatus;
}

class UpdateOrder extends Base
  implements Partial<Omit<Schema$Order | Required$UpdateOrder, keyof Base>> {
  @IsEmpty()
  id?: string;

  @IsEmpty()
  user?: string;

  @IsEmpty()
  product?: string;
}

export class UpdateOrderDto extends UpdateOrder
  implements
    Required<Omit<Schema$Order & Required$UpdateOrder, keyof UpdateOrder>> {}
