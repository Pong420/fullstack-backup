export * from './auth';
export * from './user';
export * from './utils';

export interface Param$Pagination {
  pageNo?: number;
  pageSize?: number;
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
