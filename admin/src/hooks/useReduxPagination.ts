import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { AxiosPromise, AxiosResponse } from 'axios';
import { useSearchParam } from './useSearchParam';
import {
  Param$Search,
  Param$Pagination,
  Response$PaginationAPI,
  AllowedNames
} from '../typings';
import { PaginationSelectorReturnTypeEx, RootState } from '../store';
import { PaginationProps } from '../components/Pagination';

export type AsyncFn<T> = (
  params: Param$Pagination & Param$Search
) => AxiosPromise<Response$PaginationAPI<T>>;

interface PaginationPayload<T> {
  data: T[];
  pageNo: number;
  total: number;
}

export interface ReduxPaginationProps<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
> {
  fn: AsyncFn<I>;
  onSuccess: (payload: PaginationPayload<I>) => void;
  selector: (state: RootState) => PaginationSelectorReturnTypeEx<I, K>;
}

export function useReduxPagination<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>
>({ fn, selector, onSuccess }: ReduxPaginationProps<I, K>) {
  const { data, ids, total, pageSize, defer, pageNo, search } = useSelector(
    selector
  );

  const { setSearchParam } = useSearchParam();

  const _onSuccess = useCallback(
    (res: AxiosResponse<Response$PaginationAPI<I>>) => {
      const { docs, totalDocs, page } = res.data.data;
      onSuccess({
        pageNo: page,
        data: docs,
        total: totalDocs
      });
    },
    [onSuccess]
  );

  const { loading, run } = useRxAsync(fn, {
    defer: true,
    onSuccess: _onSuccess
  });

  const paginationProps: PaginationProps = {
    total,
    pageNo,
    size: pageSize,
    onPageChange: pageNo => setSearchParam(params => ({ ...params, pageNo }))
  };

  useEffect(() => {
    !defer && run({ pageNo, pageSize, search });
  }, [defer, run, pageNo, pageSize, search]);

  return [{ ids, data, search, loading }, paginationProps] as const;
}
