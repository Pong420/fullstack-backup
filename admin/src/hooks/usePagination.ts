import { useState, useCallback, useEffect } from 'react';
import { AxiosPromise } from 'axios';
import { useRxAsync, RxAsyncOptions } from 'use-rx-hooks';
import { useQuery } from './useQuery';
import { Param$Pagination, Response$PaginationAPI } from '../typings';

export type AsyncFn<T> = (
  params: Param$Pagination
) => AxiosPromise<Response$PaginationAPI<T>>;

interface PaginationPayload<T> {
  data: T[];
  pageNo: number;
  total: number;
}

export interface UsePaginationOptions<T>
  extends Omit<RxAsyncOptions<PaginationPayload<T>>, 'onSuccess'> {
  fn: AsyncFn<T>;
  pageSize?: number;
  pageNo?: number;
  onSuccess?: (payload: PaginationPayload<T>) => void;
}

const useQueryTransform = ({ pageNo }: Record<string, string>) => ({
  pageNo: Number(pageNo)
});

export function usePagination<T>({
  fn,
  pageNo: controledPageNo,
  pageSize = 10,
  onSuccess,
  ...options
}: UsePaginationOptions<T>) {
  const [{ pageNo = 1 }, setQuery] = useQuery(useQueryTransform);
  const [total, setTotal] = useState(0);

  const request = useCallback(
    () =>
      fn({ pageNo, pageSize }).then<PaginationPayload<T>>(res => {
        const { docs, totalDocs } = res.data.data;
        setTotal(totalDocs);
        return {
          pageNo:
            typeof controledPageNo !== 'undefined' ? controledPageNo : pageNo,
          data: docs,
          total: totalDocs
        };
      }),
    [fn, controledPageNo, pageNo, pageSize]
  );

  const state = useRxAsync<PaginationPayload<T>, unknown>(request, {
    onSuccess,
    ...options
  });

  const onPageChange = useCallback((pageNo: number) => setQuery({ pageNo }), [
    setQuery
  ]);

  useEffect(() => {
    controledPageNo && setQuery({ pageNo: controledPageNo });
  }, [setQuery, controledPageNo]);

  return [
    { ...state, setQuery },
    {
      total,
      pageNo,
      onPageChange
    }
  ] as const;
}
