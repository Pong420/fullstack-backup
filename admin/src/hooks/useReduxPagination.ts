import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { AxiosPromise } from 'axios';
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
  search?: string;
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

  const request = useCallback(
    () =>
      fn({ pageNo, pageSize, search }).then(res => {
        const { docs, totalDocs } = res.data.data;
        onSuccess({
          pageNo,
          search,
          data: docs,
          total: totalDocs
        });
      }),
    [fn, pageNo, pageSize, search, onSuccess]
  );

  const { loading } = useRxAsync(request, { defer });

  const paginationProps: PaginationProps = {
    total,
    pageNo,
    size: pageSize,
    onPageChange: pageNo => setSearchParam(params => ({ ...params, pageNo }))
  };

  return [{ ids, data, search, loading }, paginationProps] as const;
}
