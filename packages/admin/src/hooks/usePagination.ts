import { useEffect, useCallback } from 'react';
import { useRxAsync, RxAsyncFn } from 'use-rx-hooks';
import { AxiosResponse } from 'axios';
import { PaginateApiResponse, Pagination } from '@fullstack/typings';
import { useSearchParam } from './useSearchParam';
import { PaginationProps } from '../components/Pagination';

export interface PaginationPayload<T> {
  data: T[];
  total: number;
  pageNo: number;
}

type Response<I> = I[] | AxiosResponse<PaginateApiResponse<I>>;

export interface RequiredUsePaginationProps<I> {
  fn: RxAsyncFn<Response<I>, Pagination>;
  onSuccess: (res: PaginationPayload<I>) => void;
  onFailure?: (error: any) => void;
}

export interface UsePaginationProps<I> extends RequiredUsePaginationProps<I> {
  pageNo: number;
  total: number;
  pageSize: number;
  hasData?: boolean;
  params: any;
}

export function usePagination<I>({
  fn,
  onSuccess,
  onFailure,
  total,
  pageSize,
  hasData,
  pageNo,
  params
}: UsePaginationProps<I>) {
  const { setSearchParam } = useSearchParam();

  const onSuccessCallback = useCallback(
    (res: Response<I>) => {
      const [data, total] = Array.isArray(res)
        ? [res, res.length]
        : [res.data.data.data, res.data.data.total];

      onSuccess({ data, total, pageNo });
    },
    [onSuccess, pageNo]
  );

  const asyncState = useRxAsync(fn, {
    defer: true,
    onFailure,
    onSuccess: onSuccessCallback
  });

  const { run } = asyncState;

  const pagination: PaginationProps = {
    total,
    pageNo,
    size: pageSize,
    onPageChange: pageNo => setSearchParam(params => ({ ...params, pageNo }))
  };

  useEffect(() => {
    if (!hasData) {
      // this prevent mutile request send
      const timeout = setTimeout(
        () => run({ page: pageNo, size: pageSize, ...params }),
        0
      );
      return () => clearTimeout(timeout);
    }
  }, [hasData, run, pageNo, pageSize, params]);

  return { ...asyncState, pagination };
}
