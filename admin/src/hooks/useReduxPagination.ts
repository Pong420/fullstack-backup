import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { AxiosPromise } from 'axios';
import { CRUDState, PaginationSelectorReturnType } from '@pong420/redux-crud';
import { useSearchParam } from './useSearchParam';
import {
  Param$Search,
  Param$Pagination,
  Response$PaginationAPI,
  AllowedNames
} from '../typings';
import { RootState, searchParamSelector } from '../store';
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
  K extends AllowedNames<I, PropertyKey>,
  S extends CRUDState<I, K>
> {
  fn: AsyncFn<I>;
  onSuccess: (payload: PaginationPayload<I>) => void;
  onReset: () => void;
  selector: (props: {
    pageNo?: number;
  }) => (state: RootState) => PaginationSelectorReturnType<S>;
}

export function useReduxPagination<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>,
  S extends CRUDState<I, K>
>({ fn, selector, onSuccess, onReset }: ReduxPaginationProps<I, K, S>) {
  const { pageNo, search } = useSelector(searchParamSelector);

  const { data, ids, total, pageSize, defer } = useSelector(
    selector({ pageNo: pageNo || 1 })
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

  useEffect(() => {
    onReset();
  }, [search, onReset]);

  return [{ ids, data, search, loading }, paginationProps] as const;
}
