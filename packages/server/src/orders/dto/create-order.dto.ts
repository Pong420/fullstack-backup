import { IsEmpty } from 'class-validator';
import {
  Required$CreateOrder,
  Schema$Order,
  OrderStatus
} from '@fullstack/common/service/typings';

// TODO: add validation
class Base implements Required$CreateOrder {
  products!: Required$CreateOrder['products'];
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
