import { useState, useCallback, useEffect } from 'react';
import { AxiosPromise } from 'axios';
import { useRxAsync, RxAsyncOptions } from 'use-rx-hooks';
import { useSearchParam } from './useSearchParam';
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

const useSearchParamTransform = ({
  pageNo
}: Record<string, string | undefined>) => ({
  pageNo: pageNo ? Number(pageNo) : undefined
});

export function usePagination<T>({
  fn,
  pageNo: controledPageNo,
  pageSize = 10,
  onSuccess,
  ...options
}: UsePaginationOptions<T>) {
  const [{ pageNo = 1 }, setSearchParam] = useSearchParam(
    useSearchParamTransform
  );
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

  const onPageChange = useCallback(
    (pageNo: number) => setSearchParam({ pageNo }),
    [setSearchParam]
  );

  useEffect(() => {
    controledPageNo && setSearchParam({ pageNo: controledPageNo });
  }, [setSearchParam, controledPageNo]);

  return [
    { ...state, setSearchParam },
    {
      total,
      pageNo,
      onPageChange
    }
  ] as const;
}
