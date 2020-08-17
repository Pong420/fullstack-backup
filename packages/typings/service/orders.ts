import { ApiResponse, PaginateApiResponse, Timestamp } from './index';
import { Schema$Product } from './products';
import { Schema$User } from './user';

export enum OrderStatus {
  PENDING,
  SHIPPING,
  ARRIVAL,
  CACNELED,
  DONE
}

interface CreateOrder {
  id: string;
  amount: number;
}

export interface Param$CreateOrder {
  products: CreateOrder[];
  address: string;
}

export interface Schema$OrderProduct
  extends Pick<
    Schema$Product,
    'id' | 'name' | 'images' | 'description' | 'price' | 'discount' | 'amount'
  > {}

export interface Schema$OrderUser
  extends Pick<Schema$User, 'id' | 'nickname' | 'username' | 'email'> {}

export interface Schema$Order<User = string | Schema$OrderUser>
  extends Timestamp,
    Omit<Param$CreateOrder, 'products'> {
  id: string;
  products: Schema$OrderProduct[];
  user: User;
  status: OrderStatus;
}

export interface Param$UpdateOrder {
  status?: OrderStatus;
}

export type Response$GetOrders = PaginateApiResponse<Schema$Order>;
export type Response$Order = ApiResponse<Schema$Order>;
