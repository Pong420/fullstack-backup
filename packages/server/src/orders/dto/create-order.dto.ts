import {
  IsEmpty,
  IsObject,
  ValidateNested,
  ArrayNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Required$CreateOrder,
  Schema$Order,
  OrderStatus
} from '@fullstack/common/service/typings';
import { OrderProductDto } from './order-product-dto';

class Base implements Required$CreateOrder {
  @ArrayNotEmpty()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products!: OrderProductDto[];
}

class CreateOrder extends Base
  implements Partial<Omit<Schema$Order | Required$CreateOrder, keyof Base>> {
  @IsEmpty()
  id?: string;

  @IsEmpty()
  user?: string;

  @IsEmpty()
  status?: OrderStatus;

  @IsEmpty()
  createdAt?: undefined;

  @IsEmpty()
  updatedAt?: undefined;
}

export class CreateOrderDto extends CreateOrder
  implements
    Required<Omit<Schema$Order & Required$CreateOrder, keyof CreateOrder>> {}
