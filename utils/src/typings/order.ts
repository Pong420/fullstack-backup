import { Schema$Product } from './product';
import { Schema$User } from './user';

export enum OrderStatus {
  PENDING,
  CACNELED,
  DONE
}

export interface Schema$Order {
  id: string;

  product: Pick<Schema$Product, 'name' | 'images' | 'description' | 'price'>;

  user: Pick<Schema$User, 'id' | 'nickname' | 'username' | 'email'>;

  amount: number;

  status: OrderStatus;
}

export interface Required$CreateOrder extends Pick<Schema$Order, 'amount'> {
  product: string;
}

export interface Required$UpdateOrder
  extends Pick<Schema$Order, 'amount' | 'status'> {}
