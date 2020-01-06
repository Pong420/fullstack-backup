import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { AxiosPromise, AxiosResponse } from 'axios';
import { useSearchParam } from '@fullstack/common/hooks/useSearchParam';
import {
  Param$Search,
  Param$Pagination,
  Response$PaginationAPI,
  AllowedNames
} from '../typings';
import { RootState } from '../store';
import { PaginationSelectorReturnType, CRUDState } from '@pong420/redux-crud';
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
  K extends AllowedNames<I, PropertyKey>,
  S extends CRUDState<I, K>
> {
  fn: AsyncFn<I>;
  onSuccess: (payload: PaginationPayload<I>) => void;
  selector: (state: RootState) => PaginationSelectorReturnType<S>;
}

export function useReduxPagination<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>,
  S extends CRUDState<I, K>
>({ fn, selector, onSuccess }: ReduxPaginationProps<I, K, S>) {
  const { data, ids, total, pageSize, hasData, pageNo, params } = useSelector(
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
    if (!hasData) {
      // timeout prevent unxpected request on history go back
      const timeout = setTimeout(() => run({ pageNo, pageSize, ...params }), 0);
      return () => clearTimeout(timeout);
    }
  }, [hasData, run, pageNo, pageSize, params]);

  return [{ ids, data, params, loading }, paginationProps] as const;
}
