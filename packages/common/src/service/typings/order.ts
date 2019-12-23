import { Schema$Product } from './product';
import { Schema$User } from './user';

export enum OrderStatus {
  PENDING,
  CACNELED,
  DONE
}

export interface Schema$Order {
  id: string;

  products: Array<{
    product: Pick<
      Schema$Product,
      'name' | 'images' | 'description' | 'price' | 'remain'
    >;
    amount: number;
  }>;

  user: Pick<Schema$User, 'id' | 'nickname' | 'username' | 'email'>;

  status: OrderStatus;
}

export interface Required$CreateOrder {
  products: Array<{
    product: string;
    amount: number;
  }>;
}

export interface Required$UpdateOrder extends Pick<Schema$Order, 'status'> {
  products: Required$CreateOrder['products'];
}
