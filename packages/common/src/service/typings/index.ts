/* eslint-disable @typescript-eslint/no-explicit-any */
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

export type ValidationError = {
  target?: object;
  property: string;
  value?: any;
  constraints?: Record<string, string>;
  children: ValidationError[];
  contexts?: {
    [type: string]: any;
  };
};

export type ErrorMessage = string | Array<ValidationError>;

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
