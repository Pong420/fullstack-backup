import {
  Search,
  Pagination,
  Timestamp,
  PaginateApiResponse,
  ApiResponse
} from './index';

export enum ProductSuggestTypes {
  CATEGORY = 'category',
  TAG = 'tag'
}

export interface Schema$Product extends Timestamp {
  id: string;
  name: string;
  description: string;
  price: number;
  amount: number;
  freeze: number;
  remain: number;
  category: string;
  images: (string | null)[];
  tags: string[];
  discount: number;
  hidden: boolean;
}

export interface Param$CreateProduct {
  name: string;
  price: number;
  amount: number;
  category: string;
  description?: string;
  images?: unknown[];
  tags?: string[];
  hidden?: boolean;
  discount?: number;
}

export interface Param$UpdateProduct
  extends Partial<
    Omit<
      Schema$Product,
      'id' | 'freeze' | 'remain' | 'images' | keyof Timestamp
    >
  > {
  images?: unknown[];
}

export interface Param$Product {
  id: string;
}

export interface Param$GetProducts extends Pagination, Timestamp, Search {
  name?: string;
  // price?: number;
  // amount?: number;
  // freeze?: number;
  // remain?: number;
  category?: string;
  // tags?: string;
  // discount?: number;
  hidden?: boolean;
}

export interface Schema$Category {
  category: string;
  total: number;
}

export interface Schema$Tags {
  tag: string;
  total: number;
}

export type Response$Products = PaginateApiResponse<Schema$Product>;
export type Response$Product = ApiResponse<Schema$Product>;
export type Response$Category = ApiResponse<Schema$Category[]>;
export type Response$Tags = ApiResponse<Schema$Tags[]>;
