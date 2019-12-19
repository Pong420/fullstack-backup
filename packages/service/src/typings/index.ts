import { AxiosResponse, AxiosError } from 'axios';

export * from './auth';
export * from './user';
export * from './product';
export * from './order';

export interface APIError extends Omit<AxiosError, 'response'> {
  response?: AxiosResponse<{
    statusCode: number;
    error: string;
    message: ErrorMessage;
  }>;
}

export type ErrorMessage =
  | string
  | Array<{
      target: Record<string, any>; // eslint-disable-line
      value: null;
      property: string;
      children: any[]; // eslint-disable-line
      constraints: Record<string, string>;
    }>;

export interface Param$Pagination {
  pageNo?: number;
  pageSize?: number;
}

export interface Param$Search {
  search?: string;
}

export interface Response$API<T> {
  statusCode: number;
  data: T;
}

export interface Response$PaginationAPI<T> {
  statusCode: number;
  data: {
    docs: T[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: null;
    nextPage: number;
  };
}

export interface Schema$Timestamp {
  createdAt: string;
  updatedAt: string;
}
export * from './auth';
export * from './product';
export * from './user';
export * from './order';
