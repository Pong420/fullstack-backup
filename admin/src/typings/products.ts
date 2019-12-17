import {
  Param$Search,
  Param$Pagination,
  Response$API,
  Response$PaginationAPI
} from '.';
import {
  Schema$Product,
  Required$CreateProduct,
  Required$UpdateProduct
} from '@fullstack/typings';

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
