import { useCallback, useEffect } from 'react';
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
import { RootState, PaginationAndSearchReturnType } from '../store';

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
  onSuccess?: (payload: PaginationPayload<I>) => void;
  selector: (state: RootState) => PaginationAndSearchReturnType<I, K>;
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
  K extends AllowedNames<I, PropertyKey>
>({ fn, selector, onSuccess }: ReduxPaginationProps<I, K>) {
  const { data, ids, total, pageNo, defer, pageSize, search } = useSelector(
    selector
  );

  const [, setQuery] = useQuery(useQueryTransform);

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

  useEffect(() => {
    setQuery({ pageNo, search });
  }, [pageNo, search, setQuery]);

  return [
    { ids, data, search, loading },
    {
      total,
      pageNo,
      size: pageSize
    }
  ] as const;
}
