import {
  Param$Search,
  Param$Pagination,
  Schema$Product,
  Response$API,
  Response$PaginationAPI,
  Schema$Timestamp
} from '.';

export interface Param$GetProducts extends Param$Pagination, Param$Search {}

export interface Param$CreateProduct
  extends Omit<Schema$Product, 'id' | 'images' | keyof Schema$Timestamp> {
  images: Array<File | string>;
}

export interface Param$UpdateProduct
  extends Partial<Omit<Param$CreateProduct, 'images'>> {
  id: string;
}

export type Response$Product = Response$API<Schema$Product>;

export type Response$GetProducts = Response$PaginationAPI<Schema$Product>;

export type Response$GetSuggestion = Response$API<
  Array<{ total: number; value: string }>
>;
