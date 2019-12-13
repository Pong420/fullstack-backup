import {
  Param$Pagination,
  Response$API,
  Response$PaginationAPI,
  Schema$Timestamp,
  Schema$ResponsiveImage
} from '.';

export interface Param$GetProducts extends Param$Pagination {}

export interface Param$CreateProduct
  extends Omit<Schema$Product, 'id' | 'images' | keyof Schema$Timestamp> {
  images: Array<File | string>;
}

export interface Param$UpdateProduct
  extends Partial<Omit<Param$CreateProduct, 'images'>> {
  id: string;
  images: Array<File | string>;
}

export type Response$Product = Response$API<Schema$Product>;

export type Response$GetProducts = Response$PaginationAPI<Schema$Product>;

export interface Schema$Product extends Schema$Timestamp {
  id: string;
  name: string;
  description: string;
  price: number;
  amount: number;
  type: string;
  images: Schema$ResponsiveImage[];
  tags: string[];
  hidden: boolean;
}
