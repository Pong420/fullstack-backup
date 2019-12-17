import { Schema$Timestamp } from '.';

export enum ProductStatus {
  VISIBLE,
  HIDDEN
}

export interface Schema$Product extends Schema$Timestamp {
  id: string;

  name: string;

  description: string;

  price: number;

  amount: number;

  // freeze: number;

  // remain: number;

  type: string;

  images: string[];

  tags: string[];

  status: ProductStatus;
}

export interface Required$CreateProduct
  extends Pick<Schema$Product, 'name' | 'price' | 'amount'> {}

export interface Required$UpdateProduct
  extends Partial<
    Omit<Schema$Product, 'id' | 'images' | keyof Schema$Timestamp>
  > {
  images?: unknown[];
}
