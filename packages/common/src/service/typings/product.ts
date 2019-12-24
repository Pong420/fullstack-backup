import {
  Param$Search,
  Param$Pagination,
  Schema$Timestamp,
  Response$API,
  Response$PaginationAPI
} from './index';

export enum ProductStatus {
  VISIBLE,
  HIDDEN
}

export enum ProductSuggestTypes {
  CATEGORY = 'category',
  TAG = 'tag'
}

export interface Schema$Product extends Schema$Timestamp {
  id: string;

  name: string;

  description: string;

  price: number;

  amount: number;

  freeze: number;

  remain: number;

  category: string;

  images: string[];

  tags: string[];

  discount: number;

  status: ProductStatus;
}

export interface Required$CreateProduct
  extends Pick<Schema$Product, 'name' | 'price' | 'amount'> {}

export interface Required$GetProducts {
  [ProductSuggestTypes.TAG]?: string;
  [ProductSuggestTypes.CATEGORY]?: string;
}

export interface Required$UpdateProduct
  extends Partial<
    Omit<
      Schema$Product,
      'id' | 'images' | 'freeze' | 'remain' | keyof Schema$Timestamp
    >
  > {
  images?: unknown[];
}

export interface Param$GetProducts extends Param$Pagination, Param$Search {}

export interface Param$CreateProduct extends Required$CreateProduct {
  images: Array<File | string>;
}

export interface Param$UpdateProduct extends Required$UpdateProduct {
  id: string;
}

export type Response$Product = Response$API<Schema$Product>;

export type Response$GetProducts = Response$PaginationAPI<Schema$Product>;

export type Response$GetSuggestion = Response$API<
  Array<{ total: number; value: string }>
>;
