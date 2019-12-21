import { IsString, IsNumber, IsEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  Required$CreateOrder,
  Schema$Order,
  OrderStatus
} from '@fullstack/common/service/typings';

class Base implements Required$CreateOrder {
  @IsString()
  product!: string;

  @IsNumber()
  @Transform(Number)
  amount!: number;
}

class CreateOrder extends Base
  implements Partial<Omit<Schema$Order | Required$CreateOrder, keyof Base>> {
  @IsEmpty()
  id?: string;

  @IsEmpty()
  user?: string;

  @IsEmpty()
  status?: OrderStatus;
}

export class CreateOrderDto extends CreateOrder
  implements
    Required<Omit<Schema$Order & Required$CreateOrder, keyof CreateOrder>> {}
