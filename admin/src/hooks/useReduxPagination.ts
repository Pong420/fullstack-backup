import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRxAsync } from 'use-rx-hooks';
import { AxiosPromise } from 'axios';
import { useQuery } from './useQuery';
import {
  Param$Search,
  Param$Pagination,
  Response$PaginationAPI,
  AllowedNames
} from '../typings';
import {
  RootState,
  PaginationAndSearchReturnType,
  CRUDStateEx
} from '../store';
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
  S extends CRUDStateEx<I, K>
> {
  fn: AsyncFn<I>;
  onSuccess?: (payload: PaginationPayload<I>) => void;
  selector: (state: RootState) => PaginationAndSearchReturnType<S>;
}

const useQueryTransform = ({
  pageNo,
  search
}: Record<string, string | undefined>) => ({
  pageNo: pageNo ? Number(pageNo) : undefined,
  search
});

export function useReduxPagination<
  I extends Record<PropertyKey, any>,
  K extends AllowedNames<I, PropertyKey>,
  S extends CRUDStateEx<I, K>
>({ fn, selector, onSuccess }: ReduxPaginationProps<I, K, S>) {
  const { data, ids, total, pageNo, defer, pageSize, search } = useSelector(
    selector
  );

  const [, setQuery] = useQuery(useQueryTransform);

  const clearSearch = useCallback(
    () => setQuery({ pageNo: undefined, search: undefined }),
    [setQuery]
  );

  const request = useCallback(
    () =>
      fn({ pageNo, pageSize, search }).then(res => {
        const { docs, totalDocs } = res.data.data;
        onSuccess &&
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
    onPageChange: pageNo => setQuery({ pageNo })
  };

  return [
    { ids, data, search, loading, clearSearch },
    paginationProps
  ] as const;
}
