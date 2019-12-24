import {
  Response$API,
  Response$PaginationAPI,
  Schema$Timestamp
} from './index';
import { Schema$Product } from './product';
import { Schema$User } from './user';

export enum OrderStatus {
  PENDING,
  SHIPPING,
  ARRIVAL,
  CACNELED,
  DONE
}

type Products<T> = Array<{
  product: T;
  amount: number;
}>;

export interface Schema$Order extends Schema$Timestamp {
  id: string;

  products: Products<
    Pick<Schema$Product, 'name' | 'images' | 'description' | 'price' | 'remain'>
  >;

  user?: Pick<Schema$User, 'id' | 'nickname' | 'username' | 'email'>;

  status: OrderStatus;
}

export interface Required$CreateOrder {
  products: Products<string>;
}

export interface Required$UpdateOrder extends Pick<Schema$Order, 'status'> {
  products: Required$CreateOrder['products'];
}

export type Response$CreateOrder = Response$API<Schema$Order>;

export type Response$GetOrders = Response$PaginationAPI<Schema$Order>;

export type Response$UpdateOrders = Response$API<Schema$Order>;
