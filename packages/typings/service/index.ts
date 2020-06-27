export * from './user';
export * from './jwt';
export * from './refreshToken';
export * from './login';

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface PaginateResult<T> {
  data: T[];
  total: number;
  limit: number;
  page?: number;
  totalPages: number;
  nextPage?: number | null;
  prevPage?: number | null;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  meta?: any;
}

export interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

export enum Order {
  ASC,
  DESC
}

export interface Pagination<T = any> {
  page?: number;
  size?: number;
  sort?: string | Record<keyof T, Order>;
}

export interface Search {
  search?: string;
}
