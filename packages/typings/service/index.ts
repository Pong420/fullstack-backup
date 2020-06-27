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

export class Param$Pagination {
  page?: number;
  size?: number;
  sort?: string | Record<string, unknown>;
}

export class Param$SearchQuery {
  search?: string;
}
