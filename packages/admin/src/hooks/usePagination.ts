import { useCallback, useEffect } from 'react';
import { useRxAsync, RxAsyncFn } from 'use-rx-hooks';
import { AxiosResponse } from 'axios';
import { PaginateApiResponse, Pagination } from '@fullstack/typings';
import { PaginatePayload } from '@fullstack/common/hooks';
import { PaginationProps } from '../components/Pagination';
import { setSearchParam } from '../utils/setSearchParam';

type Response<I> = I[] | AxiosResponse<PaginateApiResponse<I>>;

export type PaginateAsyncRequst<I> = RxAsyncFn<Response<I>, Pagination>;

export interface UsePaginationOptions<I> {
  pageNo: number;
  total: number;
  pageSize: number;
  hasData?: boolean;
  params: any;
  onSuccess?: (res: PaginatePayload<I>) => void;
  onFailure?: (error: any) => void;
}

export function usePagination<I>(
  asyncFn: PaginateAsyncRequst<I>,
  {
    onSuccess,
    onFailure,
    total,
    pageSize,
    hasData,
    pageNo,
    params
  }: UsePaginationOptions<I>
) {
  const onSuccessCallback = useCallback(
    (res: Response<I>) => {
      const [data, total] = Array.isArray(res)
        ? [res, res.length]
        : [res.data.data.data, res.data.data.total];
      onSuccess && onSuccess({ data, total, pageNo });
    },
    [onSuccess, pageNo]
  );

  const asyncState = useRxAsync(asyncFn, {
    defer: true,
    onFailure,
    onSuccess: onSuccessCallback
  });

  const { run } = asyncState;

  const pagination: PaginationProps | undefined = {
    total,
    pageNo,
    size: pageSize,
    onPageChange: pageNo => setSearchParam(params => ({ ...params, pageNo }))
  };

  useEffect(() => {
    if (!hasData) {
      run({ page: pageNo, size: pageSize, ...params });
    }
  }, [hasData, run, pageNo, pageSize, params]);

  return { ...asyncState, pagination };
}
