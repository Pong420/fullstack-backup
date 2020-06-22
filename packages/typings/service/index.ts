export * from './user';

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

export type MongoSchema<T> = Omit<T, 'id' | keyof Timestamp>;
