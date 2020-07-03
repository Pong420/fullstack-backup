import { Search, Pagination, Timestamp } from './index';

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
